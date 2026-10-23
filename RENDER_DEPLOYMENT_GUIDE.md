# DeconVerse public deployment (Render)

This bundle runs the website, verified Alexa endpoint, and Alexa command queue in one hosted Node.js service. It does not require VS Code, local Node.js servers, or ngrok after it is deployed.

## Before uploading

- Do not upload `.env`, ngrok authtokens, or any other secret.
- Keep the Git repository in your own account. Use `render.yaml` as the service blueprint.
- The `ALEXA_SKILL_ID` in `render.yaml` is the public skill identifier from the Alexa Developer Console; it is not an access token.

## Upload the project to GitHub

1. Create a new GitHub repository named `deconverse`.
2. Extract this package into a local folder.
3. In PowerShell, `cd` to the extracted project root (the folder containing `package.json`).
4. Run `npm.cmd install` then `npm.cmd run build` to test locally.
5. Commit and push the project root to your GitHub repository. Do not commit `.env` or `node_modules`.

## Deploy on Render

1. Sign in at https://render.com/ and connect your GitHub account.
2. Choose **New + → Blueprint** and select the `deconverse` repository containing `render.yaml`.
3. Review the service and choose Free for demo use, or a paid instance if the service must not sleep.
4. Deploy. Wait for the build and service status to show Live.
5. Open `https://YOUR-SERVICE.onrender.com/health`; it should return `{ "status": "ok", ... }`.
6. Open the root `https://YOUR-SERVICE.onrender.com/` in an Incognito tab and test the viewer.

## Update Alexa Developer Console

After the service is live, change the HTTPS skill endpoint to:
`https://YOUR-SERVICE.onrender.com/api/alexa`

Use the certificate option appropriate to the certificate presented by the actual deployed hostname. For Render's generated HTTPS domain, use the trusted-CA option unless Alexa's console documentation and the live certificate specifically require the wildcard option. Save the endpoint, build the interaction model, and test in Development.

## What this deployment does

- `GET /` and static asset routes serve the Vite-built website.
- `GET /health` is the Render health check.
- `POST /api/alexa` is the ASK SDK adapter with signature and timestamp verification enabled.
- `GET /api/commands/next` consumes commands that arrive from verified Alexa requests.
- The browser poller uses `/api/commands/next` on the hosted domain, but preserves localhost:3001 for local development.

## Important limitations

- On Render's Free web service, the instance can spin down after 15 minutes idle and will wake on a new request. The public URL remains hosted, but the first visit after idle can be slow. Upgrade to a paid plan to avoid free-instance spin-down.
- The command queue is in memory, so queued commands can be lost if the service restarts. It is suitable for the single-session demo and should be replaced with persistent pub/sub or a datastore for a production multi-user version.
- The queue is shared between browsers. For a public multi-user product, add user/session pairing so one user's Alexa command cannot be consumed by another visitor's browser.
- Static GLB assets are served by the same service; later you can move them to object storage/CDN if needed.
