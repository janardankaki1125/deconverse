'use strict';

// DeconVerse production server for Render (or any Node hosting provider).
// Serves the Vite build, receives verified Alexa requests, and queues
// commands for the connected DeconVerse browser through /api/commands/next.

const express = require('express');
const path = require('node:path');
const fs = require('node:fs');
const Alexa = require('ask-sdk-core');
const { ExpressAdapter } = require('ask-sdk-express-adapter');

const PORT = Number(process.env.PORT || 10000);
const SKILL_ID = process.env.ALEXA_SKILL_ID;
const DIST_DIR = path.join(__dirname, '..', 'dist');
const INDEX_FILE = path.join(DIST_DIR, 'index.html');
const QUEUE_MAX = 30;
const COMMAND_TTL_MS = 2 * 60 * 1000;
const ALLOWED_ACTIONS = new Set(['explode', 'reassemble', 'reset', 'explainSelected']);

if (!SKILL_ID) {
  throw new Error('Missing ALEXA_SKILL_ID environment variable. Set it in your hosting dashboard.');
}

const commandQueue = [];
let nextCommandId = 1;

function enqueueCommand(action) {
  if (!ALLOWED_ACTIONS.has(action)) throw new Error(`Unsupported command: ${action}`);
  const item = { id: nextCommandId++, action, createdAt: Date.now() };
  commandQueue.push(item);
  while (commandQueue.length > QUEUE_MAX) commandQueue.shift();
  console.log(`Queued DeconVerse action: ${action} (id ${item.id})`);
  return item;
}

function pruneQueue() {
  const cutoff = Date.now() - COMMAND_TTL_MS;
  while (commandQueue.length && commandQueue[0].createdAt < cutoff) commandQueue.shift();
}

const COMMANDS = {
  ExplodeDeviceIntent: { action: 'explode', speech: 'Exploding the device.' },
  ReassembleDeviceIntent: { action: 'reassemble', speech: 'Reassembling the device.' },
  ResetViewIntent: { action: 'reset', speech: 'Resetting the view.' },
  ExplainComponentIntent: { action: 'explainSelected', speech: "I'll explain the selected component." }
};

const LaunchHandler = {
  canHandle(input) {
    return input.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(input) {
    return input.responseBuilder
      .speak('Welcome to DeconVerse. You can ask me to explode the device, reassemble it, reset the view, or explain the selected component.')
      .reprompt('What would you like to do?')
      .getResponse();
  }
};

const CommandHandler = {
  canHandle(input) {
    const request = input.requestEnvelope.request;
    return request.type === 'IntentRequest' && Boolean(COMMANDS[request.intent.name]);
  },
  handle(input) {
    const name = input.requestEnvelope.request.intent.name;
    const command = COMMANDS[name];
    enqueueCommand(command.action);
    return input.responseBuilder
      .speak(command.speech)
      .reprompt('What would you like to do next?')
      .getResponse();
  }
};

const HelpHandler = {
  canHandle(input) {
    const request = input.requestEnvelope.request;
    return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(input) {
    return input.responseBuilder
      .speak('Ask me to explode the device, reassemble it, reset the view, or explain the selected component.')
      .reprompt('Which command would you like?')
      .getResponse();
  }
};

const StopHandler = {
  canHandle(input) {
    const request = input.requestEnvelope.request;
    return request.type === 'IntentRequest' && ['AMAZON.StopIntent', 'AMAZON.CancelIntent'].includes(request.intent.name);
  },
  handle(input) {
    return input.responseBuilder.speak('Goodbye from DeconVerse.').getResponse();
  }
};

const FallbackHandler = {
  canHandle(input) {
    const request = input.requestEnvelope.request;
    return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.FallbackIntent';
  },
  handle(input) {
    return input.responseBuilder
      .speak('I did not understand that. Try saying explode the device, reassemble the device, reset the view, or explain the selected component.')
      .reprompt('What would you like to do?')
      .getResponse();
  }
};

// Avoid an "Unable to find a suitable request handler" failure for built-in
// or future intents not explicitly handled above.
const UnknownIntentHandler = {
  canHandle(input) {
    return input.requestEnvelope.request.type === 'IntentRequest';
  },
  handle(input) {
    return input.responseBuilder
      .speak('I can explode or reassemble the device, reset the view, or explain the selected component.')
      .reprompt('Which command would you like?')
      .getResponse();
  }
};

const ErrorHandler = {
  canHandle() { return true; },
  handle(input, error) {
    const request = input.requestEnvelope && input.requestEnvelope.request;
    console.error('Alexa request error:', error && error.message, 'type:', request && request.type, 'intent:', request && request.intent && request.intent.name);
    return input.responseBuilder.speak('Sorry, DeconVerse encountered an error. Please try again.').getResponse();
  }
};

const skill = Alexa.SkillBuilders.custom()
  .withSkillId(SKILL_ID)
  .addRequestHandlers(LaunchHandler, CommandHandler, HelpHandler, StopHandler, FallbackHandler, UnknownIntentHandler)
  .addErrorHandlers(ErrorHandler)
  .create();
const adapter = new ExpressAdapter(skill, true, true);

const app = express();
app.disable('x-powered-by');

// Mount the Alexa adapter before any body parser so signature validation can
// inspect the original request payload and headers.
app.post('/api/alexa', ...adapter.getRequestHandlers());

app.get('/health', (_req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json({ status: 'ok', service: 'DeconVerse hosted server' });
});

// The browser poller consumes one queued Alexa command at a time.
app.get('/api/commands/next', (_req, res) => {
  pruneQueue();
  res.set({ 'Cache-Control': 'no-store', 'Pragma': 'no-cache' });
  res.json({ command: commandQueue.shift() || null });
});

// Serve static assets from the Vite production build.
if (fs.existsSync(INDEX_FILE)) {
  app.use(express.static(DIST_DIR, { index: 'index.html', maxAge: '1h' }));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'API route not found' });
    res.sendFile(INDEX_FILE, (err) => {
      if (err && !res.headersSent) next(err);
    });
  });
} else {
  app.get('/', (_req, res) => res.status(503).send('DeconVerse is building. Try again after deployment finishes.'));
}

app.use((err, _req, res, _next) => {
  console.error('HTTP server error:', err.message);
  if (!res.headersSent) res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`DeconVerse hosted server listening on 0.0.0.0:${PORT}`);
  console.log(`Serving frontend from ${DIST_DIR}`);
  console.log('Alexa skill endpoint: /api/alexa');
  console.log('Browser command queue: /api/commands/next');
});
