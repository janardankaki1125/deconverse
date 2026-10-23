(()=>{
const root=document.getElementById('dv2');if(!root)return;
const T=THREE,V=T.Vector3,Q=T.Quaternion,$=s=>root.querySelector(s);
/* ---------- tiny geometry helpers ---------- */
const mat=(c,m=.4,r=.45,o)=>new T.MeshStandardMaterial(Object.assign({color:c,metalness:m,roughness:r},o));
const put=(o,x=0,y=0,z=0)=>(o.position.set(x,y,z),o);
const Bx=(w,h,d,m,x,y,z)=>put(new T.Mesh(new T.BoxGeometry(w,h,d),m),x,y,z);
const Cy=(r,h,m,x,y,z,ax)=>{const o=put(new T.Mesh(new T.CylinderGeometry(r,r,h,36),m),x,y,z);if(ax==='x')o.rotation.z=Math.PI/2;if(ax==='z')o.rotation.x=Math.PI/2;return o};
const Sp=(r,m,x,y,z,sx=1,sy=1,sz=1)=>{const o=put(new T.Mesh(new T.SphereGeometry(r,32,20),m),x,y,z);o.scale.set(sx,sy,sz);return o};
const grp=(...a)=>{const g=new T.Group();a.forEach(o=>g.add(o));return g};
const C=(id,name,cat,obj,off,desc,tech)=>({id,name,cat,obj,off,desc,tech});
const NOSPEC='Not specified. Prototype geometry only; real parts vary by manufacturer and model.';
/* ---------- computer mouse (procedural prototype) ---------- */
const hw=y=>3.1*Math.sqrt(Math.max(0,1-Math.pow((y-.3)/6.2,4)));
const slab=(y0,y1,xl,xr,d,b)=>{const s=new T.Shape(),N=26;
 for(let i=0;i<=N;i++){const y=y0+(y1-y0)*i/N;i?s.lineTo(xr(y),y):s.moveTo(xr(y),y)}
 for(let i=N;i>=0;i--){const y=y0+(y1-y0)*i/N;s.lineTo(xl(y),y)}
 const g=new T.ExtrudeGeometry(s,{depth:d,bevelEnabled:true,bevelThickness:b,bevelSize:b,bevelSegments:4,curveSegments:6});g.rotateX(-Math.PI/2);return g};
const mouse=()=>{
 const shellM=()=>mat(0x1b1f2a,.55,.32),btnM=()=>mat(0x262c3a,.5,.34),gold=()=>mat(0xd9aa62,.8,.3),pcbM=()=>mat(0x0f4a38,.2,.6),dark=()=>mat(0x15171c,.4,.5);
 return[
 C('shell','Top shell','Housing',grp(put(new T.Mesh(slab(-5.9,.7,y=>-hw(y),hw,1.6,.5),shellM()),0,1,0)),[0,10,3],'The rear and palm cover. It gives the mouse its ergonomic shape, protects the electronics and carries the weight of the hand.','Typically moulded plastic. '+NOSPEC),
 C('lbtn','Left button','Input',grp(put(new T.Mesh(slab(2,6.4,y=>-hw(y),y=>-1.05,1.5,.45),btnM()),0,1.05,0)),[-5,7,-2],'Primary click surface. A press travels down onto the microswitch beneath it.','Usually a hinged plastic panel. '+NOSPEC),
 C('rbtn','Right button','Input',grp(put(new T.Mesh(slab(2,6.4,y=>1.05,hw,1.5,.45),btnM()),0,1.05,0)),[5,7,-2],'Secondary click surface, mirrored from the left button and also resting on its own microswitch.','Usually a hinged plastic panel. '+NOSPEC),
 C('wheel','Scroll wheel & encoder','Input',grp(Cy(.75,.6,dark(),0,2.5,-3.4,'x'),Cy(.78,.14,gold(),-.2,2.5,-3.4,'x'),Cy(.78,.14,gold(),.2,2.5,-3.4,'x'),Bx(.9,.8,.6,mat(0x2a2d35),0,1.7,-3.4)),[0,8,-5],'The wheel turns a rotary encoder that reports scrolling. Many wheels also click like a third button.','Rotary (e.g. optical or mechanical) encoder is common. '+NOSPEC),
 C('battery','Battery','Power',grp(Bx(2.4,.5,3.6,mat(0x8fa6c8,.6,.35),0,1.2,3.2),Bx(.8,.12,.3,gold(),0,1.2,5.1)),[0,5,3],'Stores energy for a wireless mouse. Wired mice have no battery and get power through the cable.','Li-ion or AA/AAA cells are common. '+NOSPEC),
 C('switches','Click microswitches','Input',grp(Bx(.9,.5,.7,mat(0x3a3f4a,.4,.5),-2,1.05,-3.6),Bx(.9,.5,.7,mat(0x3a3f4a,.4,.5),2,1.05,-3.6),Cy(.12,.25,gold(),-2,1.45,-3.6),Cy(.12,.25,gold(),2,1.45,-3.6)),[0,2.4,-3],'Small snap-action switches that register a button press and give the click its feel.','Rated life varies widely by model. '+NOSPEC),
 C('pcb','Circuit board','Electronics',grp(Bx(4.2,.12,9,pcbM(),0,.75,0),Bx(1,.16,1,dark(),0,.88,2),Bx(.5,.14,.5,dark(),-1.2,.87,.4),Bx(.5,.14,.7,dark(),1.2,.87,-.6),Bx(.4,.1,.4,gold(),1.4,.86,3.4)),[0,0,0],'The main board. It connects the sensor, switches and wheel encoder to a controller chip that talks to the computer.','Contains a microcontroller and wireless or USB interface. '+NOSPEC),
 C('sensor','Optical sensor','Sensing',grp(Bx(1,.35,1,mat(0x22252c,.3,.5),0,.5,.5),Cy(.24,.12,mat(0x330000,.2,.4,{emissive:0xff2a1a,emissiveIntensity:.9}),0,.3,.5)),[0,-3,0],'Looks at the surface beneath the mouse through a lens and tracks how it moves, which becomes cursor motion.','Optical or laser designs exist. '+NOSPEC),
 C('base','Base plate & glide feet','Housing',grp(put(new T.Mesh(slab(-5.9,6.4,y=>-hw(y),hw,.25,.3),mat(0x0d0f14,.5,.4)),0,0,0),Cy(.5,.1,mat(0xf1efe8,.1,.5),-2,-.1,-4.2),Cy(.5,.1,mat(0xf1efe8,.1,.5),2,-.1,-4.2),Cy(.5,.1,mat(0xf1efe8,.1,.5),-1.6,-.1,4.2),Cy(.5,.1,mat(0xf1efe8,.1,.5),1.6,-.1,4.2)),[0,-6.5,0],'The underside. It seals the housing and carries the low-friction feet that let the mouse glide.','Feet are often PTFE. '+NOSPEC)]};
/* ---------- earbuds + charging case (procedural prototype) ---------- */
const prof=(y0,y1)=>{const p=[];for(let i=0;i<=24;i++){const y=y0+(y1-y0)*i/24,u=Math.min(1,Math.abs(y/2.2));p.push(new T.Vector2(2*Math.pow(Math.max(0,1-Math.pow(u,6)),1/6),y))}return p};
const caseShell=(y0,y1)=>{const m=new T.Mesh(new T.LatheGeometry(prof(y0,y1),56),mat(0xf0f0f3,.08,.28,{side:T.DoubleSide}));m.scale.set(1.35,1,.62);return m};
const buds=()=>{
 const white=()=>mat(0xf4f4f6,.05,.3),gold=()=>mat(0xd9aa62,.8,.3),out=[];
 out.push(
 C('lid','Case lid','Housing',grp(caseShell(.5,2.2)),[0,7,0],'The hinged top of the charging case. It keeps the earbuds protected and closed.','Hinge and magnets are typical. '+NOSPEC),
 C('cbat','Case battery','Power',grp(Bx(3.2,.9,1.2,mat(0x8fa6c8,.6,.35),0,-1.2,0)),[0,-2,0],'A larger battery that recharges the earbuds several times before the case itself needs power.','Li-ion pouch cells are common. '+NOSPEC),
 C('cpcb','Case board & USB-C port','Electronics',grp(Bx(3.4,.1,1.4,mat(0x0f4a38,.2,.6),0,-1.8,0),Bx(.9,.3,.4,gold(),0,-1.8,1.1)),[0,-4.3,0],'Manages charging and the connection to the charging port.','Charging and power-management ICs. '+NOSPEC),
 C('cbase','Case base','Housing',grp(caseShell(-2.2,.5)),[0,-7,0],'The lower half of the charging case, with a cavity that holds each earbud.','Moulded plastic. '+NOSPEC));
 [-1,1].forEach(s=>{const n=s<0?'Left':'Right',k=s<0?'L':'R',x=s*1.1,y=-.3;
 out.push(
 C('h'+k,n+' earbud housing','Housing',grp(Sp(.55,white(),x,y+.9,0,1,1,.9),Cy(.17,1.9,white(),x,y-.3,.15),Sp(.1,mat(0x111111),x+s*.2,y+.95,.42)),[s*4.2,3.5,0],'The outer body. It holds the components, forms the stem and contains the microphone openings.','Stem-type housing in this prototype. '+NOSPEC),
 C('t'+k,n+' ear tip','Fit',grp(Sp(.42,mat(0xe4e4e8,0,.7),x-s*.55,y+.9,.1,.75,1,1)),[s*7.2,3.5,0],'A soft silicone tip that seals comfortably in the ear canal.','Silicone. '+NOSPEC),
 C('d'+k,n+' driver','Audio',grp(Cy(.3,.16,gold(),x-s*.15,y+.9,0,'x'),Cy(.2,.18,mat(0x222,.3,.5),x-s*.1,y+.9,0,'x')),[s*5.2,1.2,0],'The speaker element. A vibrating diaphragm turns the electrical signal into sound.','Dynamic or balanced-armature designs exist. '+NOSPEC),
 C('b'+k,n+' battery','Power',grp(Cy(.14,.4,mat(0x9aa8bf,.7,.35),x,y+.35,.1)),[s*2.8,-2.2,0],'A tiny cell that powers one earbud between charges.','Coin or cylindrical cell. '+NOSPEC),
 C('p'+k,n+' circuit board','Electronics',grp(Bx(.3,.05,.9,mat(0x0f4a38,.2,.6),x,y-.5,.1),Bx(.12,.05,.12,mat(0x111),x,y-.46,.2)),[s*4.8,-5,0],'Carries the wireless chip, microphones and sensors.','Bluetooth and sensor ICs. '+NOSPEC))});
 return out};
const P={mouse:{label:'Computer Mouse',build:mouse,view:[Math.PI+.55,.42]},buds:{label:'AirPods / Earbuds',build:buds,view:[.5,.3]},camera:{label:'Camera',build:null,view:[Math.PI+.2,.12]}};
/* ---------- optional hand gesture controls ---------- */
let handCameraOn=false,handStream=null,handVideo=null,handPreview=null,handModel=null,handRaf=0,handLoading=false;
// Two-hand explode/reassemble gesture state
let handBothStartDistance = null;
let handBothSmoothedDistance = null;
let handBothLastAction = 0;
let handBothMode = 'idle';
let handBothLastCenter = null;

// One-second point selection state
let handPointStartTime = 0;
let handPointStableId = null;

// Separate open-palm rotation tracking
let handPalmLastPoint = null;
let handPalmLastWristAngle = null;
let handPrevPinch=false,handPrevOpen=false,handPrevFist=false,handPrevTwo=false,handLastAction=0,handLastPoint=null,handLockedId=null,handPrevWristAngle=null,handPointCandidate=null,handPointFrames=0;
function mountAssistControls(){
 if($('#dv-handtools'))return;
 const style=document.createElement('style');style.textContent=`
 #dv-handtools{position:absolute;left:14px;bottom:42px;z-index:20;display:flex;gap:7px;align-items:center;flex-wrap:wrap;max-width:calc(100% - 28px);font:11px/1.3 Inter,Segoe UI,Arial,sans-serif}
 #dv-handtools button{background:rgba(5,10,19,.94);color:#efd39a;border:1px solid #785a2e;border-radius:7px;padding:8px 11px;letter-spacing:.06em;cursor:pointer}
 #dv-handtools button:disabled{opacity:.6;cursor:wait}
 #dv-handstatus{color:#d5bd8c;background:rgba(5,10,19,.86);border:1px solid #342a1a;border-radius:7px;padding:8px 10px}
 #dv-handpreview{position:absolute;right:14px;top:14px;z-index:19;width:112px;display:none;background:rgba(5,10,19,.92);border:1px solid #785a2e;border-radius:8px;overflow:hidden}
 #dv-handpreview video{display:block;width:100%;height:auto;transform:scaleX(-1)}
 #dv-handpreview span{display:block;padding:5px 6px;color:#efd39a;font:10px Inter,Segoe UI,Arial,sans-serif}
 `;document.head.appendChild(style);
 const vp=$('#x-vp'),bar=document.createElement('div');bar.id='dv-handtools';
 const btn=document.createElement('button');btn.id='dv-handtoggle';btn.type='button';btn.textContent='Enable hand control';
 const status=document.createElement('span');status.id='dv-handstatus';status.textContent='Camera off · mouse control available';
 bar.append(btn,status);vp.appendChild(bar);
 const preview=document.createElement('div');preview.id='dv-handpreview';
 const video=document.createElement('video');video.autoplay=true;video.muted=true;video.playsInline=true;video.setAttribute('playsinline','');
 const cap=document.createElement('span');cap.id='dv-handcaption';cap.textContent='Hand tracking';preview.append(video,cap);vp.appendChild(preview);
 handVideo=video;handPreview=preview;
 ['pointerdown','pointermove','pointerup','click','wheel'].forEach(t=>bar.addEventListener(t,e=>e.stopPropagation()));
 ['pointerdown','pointermove','pointerup','click','wheel'].forEach(t=>preview.addEventListener(t,e=>e.stopPropagation()));
 btn.addEventListener('click',()=>{if(handCameraOn)stopHandControl();else startHandControl()});
}
function handStatus(message){const el=$('#dv-handstatus');if(el)el.textContent=message;const cap=$('#dv-handcaption');if(cap)cap.textContent=message;}
function loadHandsScript(){return new Promise((resolve,reject)=>{
 if(window.Hands){resolve();return}
 let script=document.querySelector('script[data-dv-mediapipe-hands="1"]');
 if(script){script.addEventListener('load',()=>window.Hands?resolve():reject(new Error('MediaPipe Hands did not initialize.')),{once:true});script.addEventListener('error',()=>reject(new Error('Could not download the hand-tracking library.')),{once:true});return}
 script=document.createElement('script');script.src='https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js';script.crossOrigin='anonymous';script.dataset.dvMediapipeHands='1';script.onload=()=>window.Hands?resolve():reject(new Error('MediaPipe Hands did not initialize.'));script.onerror=()=>reject(new Error('Could not download the hand-tracking library.'));document.head.appendChild(script);
 });}
const handDist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);

function handResults(results) {
  const lm = results.multiHandLandmarks &&
    results.multiHandLandmarks[0];

  if (!lm) {
    handPrevPinch = false;
    handPrevOpen = false;
    handPrevFist = false;
    handPrevTwo = false;
    handLastPoint = null;
    handPrevWristAngle = null;
    handPointCandidate = null;
    handPointFrames = 0;
    handLockedId = null;
    handStatus('No hand detected · improve lighting');
    return;
  }

  // Preserve the original finger-extension detector.
  const tips = [8, 12, 16, 20];
  const pips = [6, 10, 14, 18];
  const extended = tips.map(
    (tip, i) => lm[tip].y < lm[pips[i]].y - 0.012
  );

  const pinch = handDist(lm[4], lm[8]) < 0.055;

  const pointing =
    extended[0] &&
    !extended[1] &&
    !extended[2] &&
    !extended[3] &&
    !pinch;

  const open = extended.every(Boolean) && !pinch;

  // Point cannot be classified as a fist.
  const fist =
    !pointing &&
    extended.every(v => !v) &&
    !pinch;

  const two =
    extended[0] &&
    extended[1] &&
    !extended[2] &&
    !extended[3] &&
    !pinch;
  

  // TWO-HAND CONTROL: separation opens/closes;
  // common movement rotates independently.
  const allHands = results.multiHandLandmarks || [];
  const secondHand = allHands[1];

  if (lm && secondHand) {
    const palmA = lm[9];
    const palmB = secondHand[9];

    const distance = Math.hypot(
      palmA.x - palmB.x,
      palmA.y - palmB.y
    );

    const center = {
      x: (palmA.x + palmB.x) / 2,
      y: (palmA.y + palmB.y) / 2
    };

    handBothSmoothedDistance =
      handBothSmoothedDistance === null
        ? distance
        : handBothSmoothedDistance * 0.8 + distance * 0.2;

    const d = handBothSmoothedDistance;
    const threshold = 0.12;

    if (handBothStartDistance === null) {
      handBothStartDistance = d;
      handBothMode = ex ? 'open' : 'closed';
    }

    // OPEN/CLOSE: compare against a stable reference.
    // Do not keep updating the reference to the widest distance.
    if (handBothMode === 'closed') {
      if (d < handBothStartDistance) {
        handBothStartDistance = d;
      }

      if (d > handBothStartDistance + threshold) {
        setExp(true);
        handBothMode = 'open';
        handBothStartDistance = d;
        handLastAction = performance.now();
        handStatus('Hands apart · device exploded');
      }
    } else {
      if (d < handBothStartDistance - threshold) {
        setExp(false);
        handBothMode = 'closed';
        handBothStartDistance = d;
        handLastAction = performance.now();
        handStatus('Hands together · device reassembled');
      }
    }

    // ROTATION: common movement of both hands.
    // Moving hands together/apart does not rotate the model.
    if (handBothLastCenter) {
      const dx = handBothLastCenter.x - center.x;
      const dy = center.y - handBothLastCenter.y;

      // Ignore tiny tracking jitter.
      if (Math.abs(dx) > 0.002 || Math.abs(dy) > 0.002) {
        if (sel) {
          const c = byId(sel);

          if (c) {
            rotPart3(c, dx * 7, dy * 7, 0);
          }
        } else {
          view.ty += dx * 7;
          view.tp = mk.clamp(
            view.tp + dy * 5,
            -1.5,
            1.5
          );
        }
      }
    }

    handBothLastCenter = center;
  } else {
    handBothLastCenter = null;
    handBothSmoothedDistance = null;
    handBothStartDistance = null;
    handBothMode = ex ? 'open' : 'closed';
  }


  const now = performance.now();
  const cool = now - handLastAction > 850;

  const idx = lm[8];
  const palm = lm[9];
  const wrist = lm[0];

  const rect = R.domElement.getBoundingClientRect();
  const x = rect.left + (1 - idx.x) * rect.width;
  const y = rect.top + idx.y * rect.height;

  const wristAngle = Math.atan2(
    palm.y - wrist.y,
    palm.x - wrist.x
  );
 
  // POINT: highlight a component only.
  if (pointing && !pinch && !open) {
    const candidate = pick({
      clientX: x,
      clientY: y
    });

    if (candidate === handPointCandidate) {
      handPointFrames++;
    } else {
      handPointCandidate = candidate;
      handPointFrames = 1;
    }

    if (
      candidate &&
      handPointFrames >= 5 &&
      candidate !== sel
    ) {
      select(candidate, false);

      handStatus(
        'Point · ' +
        (byId(candidate)?.name || 'component') +
        ' · pinch to inspect'
      );
    }
  } else {
    handPointCandidate = null;
    handPointFrames = 0;
  }


 
  // PINCH: confirm and focus the selected component.
  if (pinch && !handPrevPinch) {
    const candidate =
      sel || pick({ clientX: x, clientY: y });

    if (candidate) {
      handLockedId = candidate;
      handLastPoint = { x: idx.x, y: idx.y };
      handPrevWristAngle = wristAngle;

      if (!ex) setExp(true);

      select(candidate, true);
      handLastAction = now;

      handStatus(
        'Inspecting · ' +
        (byId(candidate)?.name || 'component') +
        ' · rotate wrist to turn part'
      );
    }
  }


  // Releasing pinch stops rotation but keeps the selection.
  if (!pinch && handPrevPinch) {
    handLockedId = null;
    handLastPoint = null;
    handPrevWristAngle = null;

    handStatus('Released · component remains selected');
  }



  // ONE-HAND OPEN-PALM ROTATION.
  // With both hands visible, the two-hand block owns rotation.
  if (open && !secondHand) {
    if (handPrevOpen && handLastPoint) {
      const dx = handLastPoint.x - palm.x;
      const dy = palm.y - handLastPoint.y;

      let d = 0;

      if (handPrevWristAngle !== null) {
        d = wristAngle - handPrevWristAngle;

        while (d > Math.PI) d -= 2 * Math.PI;
        while (d < -Math.PI) d += 2 * Math.PI;
      }

      if (sel) {
        const c = byId(sel);

        if (c) {
          rotPart3(c, dx * 7, dy * 7, d * 2.2);
        }
      } else {
        view.ty += dx * 7;
        view.tp = mk.clamp(
          view.tp + dy * 5,
          -1.5,
          1.5
        );
        view.tr += d * 2.2;
      }
    }

    handLastPoint = { x: palm.x, y: palm.y };
    handPrevWristAngle = wristAngle;
  } else if (!pinch) {
    handLastPoint = null;
    handPrevWristAngle = null;
  }

  handPrevPinch = pinch;
  handPrevOpen = open;
  handPrevFist = fist;
  handPrevTwo = two;
}

async function startHandControl(){
 if(handLoading)return;handLoading=true;const button=$('#dv-handtoggle');if(button){button.disabled=true;button.textContent='Starting camera…'}
 try{
  if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)throw new Error('Camera access is unavailable. Use localhost and allow camera permission.');
  await loadHandsScript();
  handStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:640},height:{ideal:480}},audio:false});
  handVideo.srcObject=handStream;handVideo.muted=true;await handVideo.play();handPreview.style.display='block';
  handModel=new window.Hands({locateFile:file=>`https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`});
  handModel.setOptions({maxNumHands:2,modelComplexity:1,minDetectionConfidence:.62,minTrackingConfidence:.58});
  handModel.onResults(handResults);handCameraOn=true;handPrevPinch=false;handPrevOpen=false;handPrevFist=false;
  if(button){button.disabled=false;button.textContent='Disable hand control'}handStatus('Point = select · open palm = rotate device · two fingers = explode · fist = reassemble · pinch + move = rotate part');
  const tick=async()=>{if(!handCameraOn)return;if(handVideo&&handVideo.readyState>=2){try{await handModel.send({image:handVideo})}catch(e){console.warn('Hand tracking frame failed',e)}}if(handCameraOn)handRaf=requestAnimationFrame(tick)};
  handRaf=requestAnimationFrame(tick);
 }catch(err){console.error(err);stopHandControl();handStatus('Hand control unavailable · mouse/trackpad still works');toast(err.message||'Hand control could not start.');}
 finally{handLoading=false;const b=$('#dv-handtoggle');if(b)b.disabled=false;}
}
function stopHandControl(){
 handCameraOn=false;if(handRaf)cancelAnimationFrame(handRaf);handRaf=0;
 if(handStream)handStream.getTracks().forEach(t=>t.stop());handStream=null;
 if(handModel){try{handModel.close()}catch(e){}handModel=null;}
 if(handVideo){handVideo.pause();handVideo.srcObject=null;}
 if(handPreview)handPreview.style.display='none';handPrevPinch=false;handPrevOpen=false;handPrevFist=false;handLastPoint=null;handLockedId=null;
 const b=$('#dv-handtoggle');if(b){b.disabled=false;b.textContent='Enable hand control'}handStatus('Camera off · mouse control available');
}
/* ---------- renderer / scene ---------- */
let R,scene,cam,rig,stage,comps=[],cur='mouse',ex=false,sel=null,iso=null,active=false,raf=0,init=false;
const view={yaw:0,pitch:0,roll:0,zoom:1,ty:0,tp:0,tr:0,tz:1,base:30},ID=new Q(),mk=T.MathUtils;
let fz=1,saved=null,lastI=0,drag=false,sM=[],stageF=0,fTgt=null,fS=1,card,foc=false,lastC={id:null,t:0};
function setup(){
 const cv=$('#x-cv');R=new T.WebGLRenderer({canvas:cv,antialias:true,alpha:true});R.outputEncoding=T.sRGBEncoding;R.setPixelRatio(Math.min(devicePixelRatio||1,2));
 scene=new T.Scene();cam=new T.PerspectiveCamera(34,1,.1,300);rig=new T.Group();scene.add(rig);
 scene.add(new T.HemisphereLight(0xa8bcff,0x1a1208,.75));
 const k=new T.DirectionalLight(0xffe2b0,1.25);k.position.set(6,12,10);scene.add(k);
 const r=new T.DirectionalLight(0x7fa0ff,.7);r.position.set(-9,5,-8);scene.add(r);
 const f=new T.PointLight(0xe3b66f,.6,60);f.position.set(0,-8,6);scene.add(f);
 stage=new T.Group();stage.add(put(new T.Mesh(new T.CylinderGeometry(9,9.4,.25,64),mat(0x0b0d14,.7,.35)),0,0,0));
 const ring=(r,o)=>{const m=new T.Mesh(new T.TorusGeometry(r,.07,8,96),new T.MeshBasicMaterial({color:0xe7b56a,transparent:true,opacity:o}));m.rotation.x=Math.PI/2;m.position.y=.14;return m};
 stage.add(ring(9,.95),ring(6.6,.45));scene.add(stage);stage.visible=false;
 stage.traverse(o=>{if(o.material){o.material.transparent=true;sM.push([o.material,o.material.opacity])}});
 card=document.createElement('div');card.id='x-card';$('#x-vp').appendChild(card);['pointerdown','wheel'].forEach(t=>card.addEventListener(t,e=>e.stopPropagation()));$('#x-zoom').addEventListener('pointerdown',e=>e.stopPropagation());
  mountAssistControls();
  mountAlexaAssistant();
 const oldViewTools=$('#dv-viewtools');if(oldViewTools)oldViewTools.remove();
 const tabs=$('#x-tabs');
 if(tabs){
  const budsTab=tabs.querySelector('[data-p="buds"]');
  if(budsTab){budsTab.textContent='AIRPODS / EARBUDS';budsTab.setAttribute('aria-label','AirPods / Earbuds');}
  // Only expose the two requested products; remove legacy Console/Camera tabs.
  tabs.querySelectorAll('button[data-p]').forEach(b=>{if(!['mouse','buds'].includes(b.dataset.p))b.remove()});
  tabs.querySelectorAll('button[data-p]').forEach(b=>{b.setAttribute('role','tab');b.setAttribute('aria-selected',b.dataset.p==='mouse'?'true':'false')});
 }
 new ResizeObserver(resize).observe($('#x-vp'));
 const vp=$('#x-vp');vp.addEventListener('wheel',e=>{e.preventDefault();foc?fz=mk.clamp(fz*Math.exp(-e.deltaY*.001),.5,2):view.tz=mk.clamp(view.tz*Math.exp(e.deltaY*.001),.4,1.7)},{passive:false});
 pointers(vp);keys(vp);init=true}
function resize(){if(!R)return;const vp=$('#x-vp'),w=Math.max(1,vp.clientWidth),h=Math.max(1,vp.clientHeight);R.setSize(w,h,false);vp.classList.toggle('nr',w<760);cam.aspect=w/h;cam.updateProjectionMatrix();fitDist()}
let rad=12;function fitDist(){const half=Math.min(mk.degToRad(cam.fov/2),Math.atan(Math.tan(mk.degToRad(cam.fov/2))*cam.aspect));view.base=rad/Math.sin(half)*1.12}
/* ---------- load / dispose ---------- */
function clear(){rig.children.slice().forEach(ch=>{ch.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{if(m.map)m.map.dispose();m.dispose()})});rig.remove(ch)});comps=[];sel=null;iso=null;fz=1;saved=null}
let mouseScenePromise=null;
function getMouseScene(){
 if(!mouseScenePromise){
  mouseScenePromise=new Promise((resolve,reject)=>{
   if(!T.GLTFLoader){reject(new Error('GLTFLoader.js is not loaded'));return}
   new T.GLTFLoader().load('/DeconVerse_Mouse_Working.glb',g=>resolve(g.scene),undefined,reject);
  });
 }
 return mouseScenePromise;
}
function makeMouseDefs(sceneRoot){
 sceneRoot.updateMatrixWorld(true);
 const raw=[];
 const construction=/^(?:MouseBottomPCBHoles|MouseBottomScrewHoles|MouseBottomSensorSlot|MouseTopScrewHoles|NoPrintMouseBottomPCBHoles|NoPrintMouseBottomSensorSlot|NoPrintMouseWheelPlugIdea|NoPrintSideCutout(?:\.\d+)?)$/;
 const knownNodeNames=new Set([
  'MouseBottom','MouseBottomPCBHoles','MouseBottomPlate','MouseBottomPlateBits','MouseBottomScrewHoles','MouseBottomSensorSlot','MouseBottomSlotter',
  'MouseSideButtonA','MouseSideButtonB','MouseTop','MouseTopScrewHoles','MouseTopUnderPieces','MouseWheel','MouseWheelBrace',
  'NoPrintMouseBottomPCBHoles','NoPrintMouseBottomSensorSlot','NoPrintMouseWheelPlugIdea','NoPrintOmron','NoPrintOmron.001','NoPrintOmron.002','NoPrintOmron.003','NoPrintOmron.004','NoPrintOmron.005',
  'NoPrintPMW3360','NoPrintPMW3360Pins','NoPrintScrollEncoder','NoPrintSHAPE_1_IndexedFaceSet','NoPrintSideCutout','NoPrintSideCutout.001'
 ]);
 sceneRoot.traverse(o=>{
  if(!o.isMesh||!o.geometry)return;
  // GLB exporters sometimes put the Blender object name on a parent node and leave the mesh child named Mesh/blank.
  let name=o.name||'';let ancestor=o.parent;
  while(ancestor&&ancestor!==sceneRoot){if(knownNodeNames.has(ancestor.name)){name=ancestor.name;break}ancestor=ancestor.parent}
  if(!name)name='Unnamed mesh';
  if(construction.test(name))return;
  const geo=o.geometry.clone();
  geo.applyMatrix4(o.matrixWorld);
  raw.push({name,geo,material:o.material});
 });
 if(!raw.length)throw new Error('No mesh objects found in DeconVerse_Mouse_Working.glb');
 const bounds=new T.Box3();
 raw.forEach(x=>bounds.expandByObject(new T.Mesh(x.geo)));
 const center=bounds.getCenter(new V()),size=bounds.getSize(new V());
 const largest=Math.max(size.x,size.y,size.z)||1,scale=12/largest;
 const groups=[
  {id:'shell',name:'Top shell',cat:'Housing',names:['MouseTop'],off:[0,6.5,1.5],desc:'The main upper housing of the mouse. The two top click panels are separate selectable components.',tech:'Mapped from MouseTop in the exported Blender scene.'},
  {id:'lbtn',name:'Left-click panel',cat:'Input',names:['MouseLeftClick'],pattern:/^MouseLeftClick(?:\.\d+)?$/,off:[-2.1,5.1,.35],desc:'The left top panel pressed for the primary mouse click.',tech:'Separate Blender object. The underlying switch linkage is illustrative until verified.'},
  {id:'rbtn',name:'Right-click panel',cat:'Input',names:['MouseRightClick'],pattern:/^MouseRightClick(?:\.\d+)?$/,off:[2.1,5.1,.35],desc:'The right top panel pressed for the secondary mouse click.',tech:'Separate Blender object. The underlying switch linkage is illustrative until verified.'},
  {id:'topsupport',name:'Top-shell supports',cat:'Structure',names:['MouseTopUnderPieces'],off:[0,3.5,1],desc:'Internal support pieces beneath the top housing.',tech:'Grouped from the named support meshes in the Blender export.'},
  {id:'sideA',name:'Left side button',cat:'Input',names:['MouseSideButtonA'],off:[-4.5,2.5,0],desc:'A side-mounted input button on the mouse body.',tech:'Mapped from MouseSideButtonA.'},
  {id:'sideB',name:'Right side button',cat:'Input',names:['MouseSideButtonB'],off:[4.5,2.5,0],desc:'A second side-mounted input button on the mouse body.',tech:'Mapped from MouseSideButtonB.'},
  {id:'wheel',name:'Scroll wheel',cat:'Input',names:['MouseWheel'],off:[0,4.2,-1.2],desc:'The textured wheel used for scrolling.',tech:'Mapped from MouseWheel.'},
  {id:'wheelbrace',name:'Scroll-wheel brace',cat:'Structure',names:['MouseWheelBrace'],off:[0,3,-2],desc:'The support structure around the scroll wheel.',tech:'Mapped from MouseWheelBrace.'},
  {id:'encoder',name:'Scroll encoder reference',cat:'Input',names:['NoPrintScrollEncoder'],pattern:/^NoPrintScrollEncoder(?:\.\d+)?$/,off:[0,2,-2.7],desc:'Reference geometry for the wheel rotation sensing mechanism.',tech:'Named NoPrint; presented as reference geometry rather than a verified production part.'},
  {id:'base',name:'Bottom shell',cat:'Housing',names:['MouseBottom'],off:[0,-5.8,0],desc:'The lower housing of the mouse.',tech:'Mapped from MouseBottom.'},
  {id:'plate',name:'Internal bottom plate',cat:'Structure',names:['MouseBottomPlate','MouseBottomPlateBits','MouseBottomSlotter'],off:[0,-3.6,2.5],desc:'Bottom plate and related internal plate geometry.',tech:'Grouped from the named bottom-plate meshes.'},
  {id:'switches',name:'Click-switch references',cat:'Input',names:['NoPrintOmron','NoPrintOmron.001','NoPrintOmron.002','NoPrintOmron.003','NoPrintOmron.004','NoPrintOmron.005'],pattern:/^NoPrintOmron(?:\.\d+)?$/,off:[-2.8,1.4,-2.8],desc:'Switch-shaped reference meshes associated with mouse clicks.',tech:'NoPrint geometry; exact installed switch positions should be verified against the physical assembly.'},
  {id:'sensor',name:'Optical sensor reference',cat:'Sensing',names:['NoPrintPMW3360'],pattern:/^NoPrintPMW3360(?:\.\d+)?$/,off:[0,-3.6,0],desc:'Optical tracking-sensor reference body.',tech:'NoPrint geometry; shown for explanation, not as a verified production sensor module.'},
  {id:'sensorpins',name:'Sensor pin references',cat:'Electronics',names:['NoPrintPMW3360Pins'],pattern:/^NoPrintPMW3360Pins(?:\.\d+)?$/,off:[0,-2.8,-.8],desc:'Thin pin/reference geometry associated with the optical sensor.',tech:'Reference geometry; exact electrical connections are not inferred.'},
  {id:'pcb',name:'PCB / circuit-board geometry',cat:'Electronics',names:['NoPrintSHAPE_1_IndexedFaceSet'],pattern:/^NoPrintSHAPE_1_IndexedFaceSet(?:\.\d+)?$/,off:[0,-1.8,0],desc:'The additional internal board-shaped geometry in the source model.',tech:'Grouped by its source mesh name. Electrical function and completeness have not been verified.'}
 ];
 const assigned=new Set(),out=[];
 const matches=(g,item)=>g.names.includes(item.name)||(g.pattern&&g.pattern.test(item.name));
 const makeDef=(g,items)=>{
  const obj=new T.Group();
  items.forEach(item=>{
   const geo=item.geo.clone();geo.translate(-center.x,-center.y,-center.z);geo.scale(scale,scale,scale);
   const mats=Array.isArray(item.material)?item.material.map(m=>m.clone()):item.material.clone();
   obj.add(new T.Mesh(geo,mats));assigned.add(item);
  });
  return C(g.id,g.name,g.cat,obj,g.off,g.desc,g.tech);
 };
 groups.forEach(g=>{
  const items=raw.filter(item=>matches(g,item)&&!assigned.has(item));
  if(items.length)out.push(makeDef(g,items));
 });
 const remaining=raw.filter(item=>!assigned.has(item));
 if(remaining.length){
  // Keep unmatched named Blender objects separately inspectable rather than merging all into one misleading part.
  const byName=new Map();
  remaining.forEach(item=>{const key=item.name||'Unnamed mesh';if(!byName.has(key))byName.set(key,[]);byName.get(key).push(item)});
  let extraIndex=0;
  byName.forEach((items,sourceName)=>{
   const low=sourceName.toLowerCase();let title=sourceName,desc,tech;
   if(low.includes('omron')){title='Click microswitch reference '+sourceName.replace(/^NoPrintOmron/i,'').replace(/^\./,'');desc='A microswitch-shaped reference mesh associated with registering a mouse click. A physical switch closes an electrical contact when its actuator is pressed.';tech='The source object is named NoPrintOmron; this is reference geometry and does not prove the exact switch model or installed position.'}
   else if(low.includes('pmw3360')){title=low.includes('pins')?'Optical sensor pin reference':'Optical tracking sensor reference';desc=low.includes('pins')?'Pin-shaped reference geometry associated with the optical sensor. Pins provide electrical connections between a sensor package and its circuit board.':'A reference mesh for an optical mouse sensor. Optical sensors image the surface repeatedly and calculate movement for cursor tracking.';tech='The source object name contains NoPrintPMW3360; confirm the physical part and orientation against the assembly before treating it as verified hardware.'}
   else if(low.includes('encoder')){title='Scroll encoder reference';desc='Reference geometry for the mechanism that detects scroll-wheel rotation and converts it into electronic signals.';tech='The source object is named '+sourceName+'; it is marked as reference geometry, not a verified installed component.'}
   else if(low.includes('shape')||low.includes('pcb')||low.includes('board')){title='Circuit-board geometry reference';desc='Board-shaped geometry from the source model. A mouse circuit board carries the controller and connects the sensor, click switches, wheel encoder and power circuitry.';tech='The source object is named '+sourceName+'. Its electrical function and completeness have not been validated from geometry alone.'}
   else if(low.includes('cutout')||low.includes('hole')||low.includes('slot')){title='Housing cutout / alignment reference';desc='A cutout, slot or hole reference used to provide clearance or align internal parts during assembly. It is not a separate electronic component.';tech='Preserved from source mesh '+sourceName+' for inspection; normally this would be grouped with its related housing part rather than presented as functional hardware.'}
   else if(low.includes('wheelplug')){title='Scroll-wheel plug reference';desc='Reference geometry related to the scroll-wheel support or plug area. The wheel assembly lets the user scroll and may also provide a middle-click input.';tech='The source object is named '+sourceName+' and is marked NoPrint; exact production purpose requires Blender/source-model verification.'}
   else {title=sourceName==='Unnamed mesh'?'Unlabelled mesh reference':'Model reference: '+sourceName;desc='This is a separate mesh retained from the supplied Blender export. Its shape alone is not enough to identify its exact function safely; inspect it in Blender alongside its parent housing before assigning a functional name.';tech='Original source mesh name: '+sourceName+'. Function not verified; no manufacturer-specific claim is made.'}
   const id='review_'+(++extraIndex);
   const off=[((extraIndex%3)-1)*1.1, (extraIndex%2?1:-1)*1.6, -2.2-(extraIndex%4)*.35];
   out.push(makeDef({id,name:title,cat:'Reference / verify',off,desc,tech},items));
  });
 }
 if(!out.length)throw new Error('The GLB loaded but no component geometry could be grouped');
 raw.forEach(item=>item.geo.dispose());
 return out;
}
let cameraScenePromise=null;
function getCameraScene(){
 if(!cameraScenePromise){
  cameraScenePromise=new Promise((resolve,reject)=>{
   if(!T.GLTFLoader){reject(new Error('GLTFLoader.js is not loaded'));return}
   new T.GLTFLoader().load('/a7iv.glb',g=>resolve(g.scene),undefined,reject);
  });
 }
 return cameraScenePromise;
}
function makeCameraDefs(sceneRoot){
 sceneRoot.updateMatrixWorld(true);
 const raw=[];
 sceneRoot.traverse(o=>{
  if(!o.isMesh||!o.geometry)return;
  const geo=o.geometry.clone();geo.applyMatrix4(o.matrixWorld);
  raw.push({name:(o.name|| (o.parent&&o.parent.name) || 'Camera mesh').trim(),geo,material:o.material});
 });
 if(!raw.length)throw new Error('No mesh objects found in public/a7iv.glb');
 const bounds=new T.Box3();
 raw.forEach(item=>bounds.expandByObject(new T.Mesh(item.geo)));
 const center=bounds.getCenter(new V()),size=bounds.getSize(new V());
 const scale=12/(Math.max(size.x,size.y,size.z)||1),groups=new Map();
 raw.forEach((item,i)=>{const key=item.name||('Camera mesh '+(i+1));if(!groups.has(key))groups.set(key,[]);groups.get(key).push(item)});
 const out=[];let index=0;
 groups.forEach((items,name)=>{
  const obj=new T.Group();
  items.forEach(item=>{
   const geo=item.geo.clone();geo.translate(-center.x,-center.y,-center.z);geo.scale(scale,scale,scale);
   const source=Array.isArray(item.material)?item.material:item.material?[item.material]:[];
   const mats=source.map(m=>{const clone=m.clone();if(m.map)clone.map=m.map.clone();return clone;});
   obj.add(new T.Mesh(geo,mats.length===1?mats[0]:mats));
  });
  const label=name.replace(/[_\.]+/g,' ').replace(/\s+/g,' ').trim()||('Camera mesh '+(++index));
  const n=++index;
  out.push(C('camera_'+n,label,'Camera model mesh',obj,[((n%3)-1)*2.8,(n%2?1:-1)*2.3,-1.5],
   'Selectable mesh from the supplied Sony A7 IV GLB model. The source model does not verify the internal function of each mesh.',
   'Source mesh name: '+name+'. Component function not verified.'));
 });
 raw.forEach(item=>item.geo.dispose());
 return out;
}
function loadDefs(id,defs){
 clear();cur=id;let minY=0;rad=6;
 comps=defs.map(d=>{const b=new T.Box3().setFromObject(d.obj),c=b.getCenter(new V()),sp=b.getBoundingSphere(new T.Sphere());
  const spin=new T.Group();spin.add(d.obj);d.obj.position.sub(c);const piv=new T.Group();piv.position.copy(c);piv.add(spin);rig.add(piv);
  const meshes=[],mats=[];d.obj.traverse(o=>{if(o.isMesh){o.userData.cid=d.id;meshes.push(o);(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{if(!m.emissive)m.emissive=new T.Color(0);if(!m.userData)m.userData={};m.userData.e=m.emissive.getHex();mats.push(m)})}});
  const exp=c.clone().add(new V(...d.off));rad=Math.max(rad,exp.length()+sp.radius);minY=Math.min(minY,exp.y-sp.radius);
  return Object.assign(d,{piv,spin,meshes,mats,asm:c.clone(),exp,uq:new Q(),p:0,wait:0,vis:true,rad:sp.radius,f:0,fd:1,tr:false})});
 stage.position.y=minY-1.2;ex=false;fitDist();resetView(true);buildList();select(null);setExpUI();
 $('#x-tabs').querySelectorAll('button').forEach(b=>{b.classList.toggle('on',b.dataset.p===id);b.setAttribute('aria-selected',b.dataset.p===id)})
}
function load(id){
 cur=id;
 if(id==='mouse'){
  return getMouseScene().then(sceneRoot=>{
   if(cur!=='mouse')return;
   loadDefs('mouse',makeMouseDefs(sceneRoot));
  });
 }
 if(id==='camera'){
  return getCameraScene().then(sceneRoot=>{
   if(cur!=='camera')return;
   loadDefs('camera',makeCameraDefs(sceneRoot));
  });
 }
 loadDefs(id,P[id].build());
}
/* ---------- state ---------- */
const byId=id=>comps.find(c=>c.id===id);
function resetView(now){view.tz=1;view.ty=P[cur].view[0];view.tp=P[cur].view[1];view.tr=0;if(now){view.yaw=view.ty;view.pitch=view.tp;view.roll=0;view.zoom=1}}

function setExp(v) {
  ex = v;

  if (!v) {
    select(null);
    iso = null;
    foc = false;
    saved = null;
    fz = 1;

    comps.forEach(c => {
      c.wait = 0;

      // Reset rotation and visual state, but let the animation
      // move the part back to its original assembled position.
      // Do NOT reset c.p or copy c.asm into c.piv.position here.
      c.uq.identity();
      c.piv.scale.setScalar(1);
      c.spin.quaternion.identity();

      c.f = 0;
      c.fd = 1;
      c.tr = false;

      c.mats.forEach(m => {
        m.transparent = false;
        m.depthWrite = true;
        m.opacity = 1;
        m.needsUpdate = true;
      });
    });

    applyVis();
    buildList();
  } else {
    comps.forEach((c, i) => {
      c.wait = i * 0.03;
    });
  }

  setExpUI();
}

function setExpUI(){$('#x-exp').textContent=ex?'Reassemble':'Explode';$('#x-hint').textContent=ex?(sel?(foc?'Drag to rotate \u00b7 Scroll to zoom \u00b7 Esc to go back':'Drag the selected part to rotate it \u00b7 Double-click to zoom in'):'Click a part to select it'):'Click the device to take it apart'}
function applyVis(){comps.forEach(c=>c.piv.visible=iso?c.id===iso:c.vis)}
function select(id,f){if(id!==sel)fz=1;if(!id)f=false;if(f&&!foc){saved={ty:view.ty,tp:view.tp,tz:view.tz};view.ty=P[cur].view[0];view.tp=P[cur].view[1];view.tz=1}else if(!f&&foc&&saved){view.ty=saved.ty;view.tp=saved.tp;view.tz=saved.tz;saved=null}foc=!!f;sel=id;comps.forEach(c=>{const on=c.id===id;c.mats.forEach(m=>{m.emissive.setHex(on&&!f?0x6a4812:m.userData.e);m.emissiveIntensity=on?1:(m.userData.e?.9:1)})});
 root.querySelectorAll('#x-list li').forEach(li=>li.classList.toggle('sel',li.dataset.id===id));$('#x-vp').classList.toggle('focus',foc);info();setExpUI()}
function info(){const c=sel&&byId(sel),el=$('#x-info');
 if(!c){card.classList.remove('on');el.innerHTML='<p class="k">Details</p><p>Select a component from the list or click it in the viewport.</p>';return}
 const i=comps.indexOf(c),n=comps.length;
 if(!foc){card.classList.remove('on');el.innerHTML=`<h3>${c.name}</h3><span class="cat">${c.cat}</span><p class="k">Purpose</p><p>${c.desc}</p><p class="k">Technical information</p><p>${c.tech}</p><p class="k">State</p><p>Selected · ${c.vis?'Visible':'Hidden'} · ${iso===c.id?'Isolated':'In assembly'}</p><div class="row"><button class="gb" id="i-iso">${iso===c.id?'Return to assembly':'Isolate'}</button><button class="gb" id="i-rot">Reset rotation</button></div><p class="k">Tip</p><p>Double-click the part to zoom in.</p>`;$('#i-iso').onclick=()=>toggleIso(c.id);$('#i-rot').onclick=()=>{c.uq.copy(ID)};return}
 card.classList.remove('on');
 card.innerHTML=`<button class="cb" data-a="back">← All parts</button><div class="cat">${c.cat}</div><h3>${c.name}</h3><p>${c.desc} ${c.tech}</p><div class="nv"><button class="cb" data-a="p" aria-label="Previous part">‹</button><span>${i+1} / ${n}</span><button class="cb" data-a="n" aria-label="Next part">›</button></div>`;
 void card.offsetWidth;card.classList.add('on');
 card.onclick=e=>{const a=e.target.closest('[data-a]');if(!a)return;const k=a.dataset.a;if(k==='back')select(null);else{const d=comps[(i+(k==='n'?1:n-1))%n];iso=null;d.vis=true;applyVis();buildList();select(d.id,true)}};
 el.innerHTML=`<p class="k">State</p><p>Selected · ${c.vis?'Visible':'Hidden'} · ${iso===c.id?'Isolated':'In assembly'}</p><div class="row"><button class="gb" id="i-iso">${iso===c.id?'Return to assembly':'Isolate'}</button><button class="gb" id="i-rot">Reset rotation</button></div>`;
 $('#i-iso').onclick=()=>toggleIso(c.id);$('#i-rot').onclick=()=>{c.uq.copy(ID)};
}
function toggleIso(id){if(iso===id){iso=null;const c=byId(id);c.uq.copy(ID)}else{iso=id;const c=byId(id);c.vis=true;if(!ex)setExp(true)}applyVis();buildList();select(id,foc)}
function buildList(){const ul=$('#x-list');ul.innerHTML='';comps.forEach(c=>{const li=document.createElement('li');li.dataset.id=c.id;li.className=(c.vis?'':'off')+(sel===c.id?' sel':'');
 li.innerHTML=`<button class="nm">${c.name}</button><button class="mini" data-a="v" aria-label="${c.vis?'Hide':'Show'} ${c.name}">${c.vis?'Hide':'Show'}</button><button class="mini" data-a="i" aria-label="Isolate ${c.name}">${iso===c.id?'Return':'Isolate'}</button>`;
 li.querySelector('.nm').onclick=()=>{if(!c.vis||(iso&&iso!==c.id)){iso=null;c.vis=true;applyVis();buildList()}select(c.id,foc);if(!ex)setExp(true)};
 li.querySelector('[data-a=v]').onclick=()=>{c.vis=!c.vis;applyVis();buildList();info()};
 li.querySelector('[data-a=i]').onclick=()=>toggleIso(c.id);ul.appendChild(li)})}
/* ---------- pointer / keyboard ---------- */
const rc=new T.Raycaster(),v2=new T.Vector2();
function pick(e){const r=R.domElement.getBoundingClientRect();v2.set((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height)*2+1);rc.setFromCamera(v2,cam);
 const fc=foc&&byId(sel),h=rc.intersectObjects((fc?[fc]:comps.filter(c=>c.piv.visible)).flatMap(c=>c.meshes),false);return h.length?h[0].object.userData.cid:null}
function rotPart(c,dx,dy){rotPart3(c,dx,dy,0)}
function rotPart3(c,dx,dy,dz){const inv=rig.quaternion.clone().invert(),ax=new V(1,0,0).applyQuaternion(inv),ay=new V(0,1,0).applyQuaternion(inv),az=new V(0,0,1).applyQuaternion(inv);
 c.uq.premultiply(new Q().setFromAxisAngle(ay,dx)).premultiply(new Q().setFromAxisAngle(ax,dy)).premultiply(new Q().setFromAxisAngle(az,dz)).normalize()}
function pointers(vp){const ptr=new Map();let st=null,pinch=0;
 vp.addEventListener('pointerdown',e=>{e.preventDefault();vp.focus({preventScroll:true});vp.setPointerCapture(e.pointerId);ptr.set(e.pointerId,e);
  if(ptr.size===2){const [a,b]=[...ptr.values()];pinch=Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);st=null;return}
  const id=pick(e);drag=true;st={x:e.clientX,y:e.clientY,moved:0,id,mode:(ex&&sel&&(foc||id===sel))?'part':'rig'}});
 vp.addEventListener('pointermove',e=>{if(st&&e.pointerType==='mouse'&&!(e.buttons&1)){st=null;drag=false;ptr.clear();pinch=0}ptr.set(e.pointerId,e);
  if(ptr.size===2){const [a,b]=[...ptr.values()],d=Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);if(pinch)view.tz=mk.clamp(view.tz*pinch/d,.4,1.7);pinch=d;return}
  if(!st){vp.style.cursor=pick(e)?'pointer':'grab';return}
  const dx=e.clientX-st.x,dy=e.clientY-st.y;st.x=e.clientX;st.y=e.clientY;st.moved+=Math.abs(dx)+Math.abs(dy);
  if(st.mode==='part'){rotPart(byId(sel),dx*.012,dy*.012);lastI=performance.now()}else{view.ty+=dx*.012;view.tp=mk.clamp(view.tp+dy*.012,-1.45,1.45)}});
 const end=e=>{drag=false;ptr.delete(e.pointerId);if(ptr.size<2)pinch=0;if(!st||e.type==='pointercancel'){st=null;return}
  if(st.moved<6){if(st.id){const n=performance.now(),dc=lastC.id===st.id&&n-lastC.t<380;lastC={id:st.id,t:n};select(st.id,dc||(foc&&st.id===sel));if(!ex)setExp(true)}else if(ex&&sel)select(null)}st=null};
 vp.addEventListener('pointerup',end);vp.addEventListener('pointercancel',end);vp.addEventListener('lostpointercapture',e=>{st=null;drag=false;ptr.delete(e.pointerId)});addEventListener('blur',()=>{st=null;drag=false;ptr.clear()});vp.addEventListener('contextmenu',e=>e.preventDefault())}
function keys(vp){vp.addEventListener('keydown',e=>{const s=.12,c=sel&&byId(sel),k=e.key;let used=true;
 if(k.startsWith('Arrow')){const dx=k==='ArrowLeft'?-s:k==='ArrowRight'?s:0,dy=k==='ArrowUp'?-s:k==='ArrowDown'?s:0;if(c&&ex&&(foc||e.shiftKey))rotPart(c,dx,dy);else{view.ty+=dx;view.tp=mk.clamp(view.tp+dy,-1.3,1.3)}}
 else if(k==='+'||k==='='){foc?fz=Math.min(2,fz*1.15):view.tz=Math.max(.4,view.tz/1.15)}else if(k==='-'){foc?fz=Math.max(.5,fz/1.15):view.tz=Math.min(1.7,view.tz*1.15)}
 else if(k==='e'||k==='E'||k==='Enter'){if(ex)select(null);setExp(!ex)}else if(k==='r'||k==='R')resetView();else if(k==='Escape')select(null);else used=false;if(used)e.preventDefault()})}
/* ---------- selection label: dot + line to a name tag placed in free space ---------- */
const lead=$('#x-lead'),pl=$('#x-pl'),dot=$('#x-dot'),halo=$('#x-halo'),tag=$('#x-tag'),vpEl=$('#x-vp'),bb=new T.Box3(),cv3=new V();
const DIRS=[[1,-1],[1,0],[1,1],[-1,-1],[-1,0],[-1,1],[0,-1],[0,1]],DISTS=[60,100,150,210,290];
let leadFor=null,leadKey=-1;
function sRect(c,W,H){bb.setFromObject(c.piv);const mn=bb.min,mx=bb.max;let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
 for(let i=0;i<8;i++){cv3.set(i&1?mx.x:mn.x,i&2?mx.y:mn.y,i&4?mx.z:mn.z).project(cam);const x=(cv3.x*.5+.5)*W,y=(-cv3.y*.5+.5)*H;x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y)}return{x0:x0-4,y0:y0-4,x1:x1+4,y1:y1+4}}
const ovl=(a,b)=>Math.max(0,Math.min(a.x1,b.x1)-Math.max(a.x0,b.x0))*Math.max(0,Math.min(a.y1,b.y1)-Math.max(a.y0,b.y0));
function updateLead(){const c=sel&&byId(sel);
 if(!c||!c.piv.visible){lead.classList.remove('on');tag.classList.remove('on');leadFor=null;return}
 rig.updateMatrixWorld(true);
 const W=vpEl.clientWidth,Hh=vpEl.clientHeight;
 bb.setFromObject(c.piv);bb.getCenter(cv3).project(cam);const x=(cv3.x*.5+.5)*W,y=(-cv3.y*.5+.5)*Hh;
 if(tag.textContent!==c.name)tag.textContent=c.name;
 const tw=(tag.offsetWidth||150)+2,th=(tag.offsetHeight||28)+2,rects=comps.filter(o=>o.piv.visible).map(o=>({r:sRect(o,W,Hh),w:o===c?1:1}));
 const cand=(k)=>{const d=DISTS[(k/DIRS.length)|0],dr=DIRS[k%DIRS.length];
  const lx=dr[0]>0?x+d:dr[0]<0?x-d-tw:x-tw/2,ly=dr[1]>0?y+d*.7:dr[1]<0?y-d*.7-th:y-th/2,r={x0:lx,y0:ly,x1:lx+tw,y1:ly+th};
  let pen=0;rects.forEach(o=>pen+=ovl(r,o.r));
  if(lx<8||lx+tw>W-8||ly<8||ly+th>Hh-8)pen+=1e6;
  return{r,pen,cost:pen+d*.5}};
 if(leadFor!==c.id){leadFor=c.id;leadKey=-1}
 let best=null,bk=-1;
 if(leadKey>=0){const p=cand(leadKey);if(p.pen===0){best=p;bk=leadKey}}
 if(!best){for(let k=0;k<DIRS.length*DISTS.length;k++){const p=cand(k);if(!best||p.cost<best.cost){best=p;bk=k}}}
 leadKey=bk;const r=best.r,qx=Math.min(Math.max(x,r.x0),r.x1),qy=Math.min(Math.max(y,r.y0),r.y1);
 pl.setAttribute('x1',x);pl.setAttribute('y1',y);pl.setAttribute('x2',qx);pl.setAttribute('y2',qy);
 [dot,halo].forEach(e=>{e.setAttribute('cx',x);e.setAttribute('cy',y)});
 tag.style.transform='translate('+(r.x0+1)+'px,'+(r.y0+1)+'px)';
 lead.classList.add('on');tag.classList.add('on')}
/* ---------- focus mode: selected part zooms in, the rest fade ---------- */
function focusStep(dt){const W=vpEl.clientWidth||1,dist=view.base*view.zoom,th=Math.tan(mk.degToRad(cam.fov/2))*dist,tw=th*cam.aspect;let x=0,y=0,r;
 if(W<760){y=th*.34;r=Math.min(tw,th*.52)*.8}else{const Lw=W-(mk.clamp(W*.36,280,380)+52);x=(Lw/W-1)*tw;r=Math.min(Lw/W*tw,th)*.78}
 fTgt=new V(x,y,0).applyQuaternion(rig.quaternion.clone().invert());fS=r*fz;
 stageF+=((foc?1:0)-stageF)*(1-Math.pow(.002,dt));sM.forEach(([m,o])=>m.opacity=o*(1-.75*stageF))}
function focusC(c,dt){const on=c.id===sel,t=on&&foc?1:0;c.f+=Math.sign(t-c.f)*Math.min(Math.abs(t-c.f),dt/.9);const e=1-Math.pow(1-c.f,3);
 if(e>0&&fTgt){c.piv.position.lerp(fTgt,e);c.piv.scale.setScalar(1+(mk.clamp(fS/c.rad,1,7)-1)*e)}else c.piv.scale.setScalar(1);
 c.fd+=((foc&&!on?.06:1)-c.fd)*(1-Math.pow(.003,dt));const f=c.fd<.99;
 if(f!==c.tr){c.tr=f;c.mats.forEach(m=>{m.transparent=f;m.depthWrite=!f;m.needsUpdate=true})}
 if(f)c.mats.forEach(m=>m.opacity=c.fd);else if(c.fd!==1){c.fd=1;c.mats.forEach(m=>m.opacity=1)}}
/* ---------- loop ---------- */
let last=0;
function frame(t){if(!active){raf=0;return}raf=requestAnimationFrame(frame);const dt=Math.min((t-last)/1000||.016,.05);last=t;
 const a=1-Math.pow(.0005,dt);view.yaw+=(view.ty-view.yaw)*a;view.pitch+=(view.tp-view.pitch)*a;view.roll+=(view.tr-view.roll)*a;view.zoom+=(view.tz-view.zoom)*a;
 rig.rotation.set(view.pitch,view.yaw,view.roll,'YXZ');cam.position.set(0,0,view.base*view.zoom);cam.lookAt(0,0,0);focusStep(dt);
 comps.forEach(c=>{if(c.wait>0)c.wait-=dt;else{const d=(ex?1:0)-c.p;c.p+=Math.sign(d)*Math.min(Math.abs(d),dt/1.1)}
  const e=c.p*c.p*(3-2*c.p);c.piv.position.lerpVectors(c.asm,c.exp,e);focusC(c,dt);
  if(!ex||c.id!==sel)c.uq.slerp(ID,1-Math.pow(.001,dt));;c.spin.quaternion.copy(c.uq)});
 if(foc){lead.classList.remove('on');tag.classList.remove('on');leadFor=null}else updateLead();R.render(scene,cam)}
/* ---------- enter / leave ---------- */
const webgl=()=>{try{const c=document.createElement('canvas');return!!(c.getContext('webgl2')||c.getContext('webgl'))}catch(e){return false}};
const toast=m=>{let t=document.getElementById('x-toast');if(!t){t=document.createElement('div');t.id='x-toast';document.body.appendChild(t)}t.textContent=m;t.style.display='block';clearTimeout(t._h);t._h=setTimeout(()=>t.style.display='none',3600)};
function enter(){
 if(!webgl()||typeof THREE==='undefined'){toast('The 3D explorer needs WebGL, which is unavailable here.');return}
 root.style.display='flex';
 try{if(!init)setup();$('#x-load').classList.add('on');requestAnimationFrame(()=>requestAnimationFrame(()=>{Promise.resolve(load(cur)).then(()=>{$('#x-err').hidden=true;$('#x-err').classList.remove('on')}).catch(err=>{console.error(err);const e=$('#x-err');e.textContent='The selected model could not be loaded. Check the model file and GLTFLoader.js in public.';e.hidden=false;e.classList.add('on')}).finally(()=>{$('#x-load').classList.remove('on');resize();if(pendingAlexaActions.length)setTimeout(flushPendingAlexaActions,700)})}))}
 catch(err){console.error(err);root.style.display='none';toast('The 3D explorer could not start on this device.');return}
 requestAnimationFrame(()=>{root.classList.add('on')});
 setTimeout(()=>{window.__paused=true;const s=document.getElementById('stage');if(s)s.style.visibility='hidden';active=true;last=performance.now();if(!raf)raf=requestAnimationFrame(frame);$('#x-vp').focus({preventScroll:true})},620)}
function leave(){active=false;stopHandControl();if('speechSynthesis' in window)window.speechSynthesis.cancel();window.__paused=false;const s=document.getElementById('stage');if(s)s.style.visibility='visible';root.classList.remove('on');setTimeout(()=>{if(!root.classList.contains('on'))root.style.display='none'},620)}
$('#x-home').onclick=leave;$('#x-exp').onclick=()=>{if(ex)select(null);setExp(!ex)};$('#x-reset').onclick=()=>resetView();
$('#x-zi').onclick=()=>foc?fz=Math.min(2,fz*1.2):view.tz=Math.max(.4,view.tz/1.2);$('#x-zo').onclick=()=>foc?fz=Math.max(.5,fz/1.2):view.tz=Math.min(1.7,view.tz*1.2);
$('#x-tabs').addEventListener('click',e=>{const b=e.target.closest('button');if(!b||b.dataset.p===cur||!init)return;$('#x-load').classList.add('on');setTimeout(()=>{Promise.resolve(load(b.dataset.p)).then(()=>{$('#x-err').hidden=true;$('#x-err').classList.remove('on')}).catch(err=>{console.error(err);const x=$('#x-err');x.textContent='The selected model could not be loaded. Check that its GLB file and GLTFLoader.js are in public.';x.hidden=false;x.classList.add('on')}).finally(()=>$('#x-load').classList.remove('on'))},30)});
const b=document.getElementById('btn');if(b)b.addEventListener('click',enter);
// ----- DeconVerse web assistant + Alexa skill browser bridge -----
let alexaPanel=null, alexaLauncher=null, alexaLog=null, alexaInput=null, alexaStatus=null;
let alexaSpeakReplies=true, alexaRecognition=null, alexaListening=false;
let lastAlexaReply='Ready. Try “explode the device”.';
let pendingAlexaActions=[];
let alexaOpeningExplorer=false;
let alexaPollBusy=false;
let alexaPollTimer=null;

const ALEXA_ACTIONS = new Set(['explode','reassemble','reset','explainSelected']);
const ALEXA_ACTION_LABELS = {
  explode: 'Explode device',
  reassemble: 'Reassemble device',
  reset: 'Reset view',
  explainSelected: 'Explain selected component'
};

function mountAlexaAssistant(){
  if($('#dv-alexa-launcher')) return;
  const style=document.createElement('style');
  style.id='dv-alexa-style';
  style.textContent=`
  #dv-alexa-launcher{position:absolute;right:376px;bottom:20px;z-index:90;display:flex;align-items:center;gap:10px;padding:10px 16px 10px 10px;border:1px solid rgba(94,210,255,.62);border-radius:999px;background:linear-gradient(110deg,rgba(8,20,42,.97),rgba(20,14,43,.97));box-shadow:0 8px 28px rgba(0,0,0,.42),0 0 20px rgba(88,190,255,.12);color:#f4f7ff;cursor:pointer;font:600 12px/1.2 system-ui,Segoe UI,sans-serif;letter-spacing:.12em}
  #dv-alexa-launcher:hover{border-color:#83e1ff;box-shadow:0 10px 32px rgba(0,0,0,.5),0 0 24px rgba(88,190,255,.22)}
  #dv-alexa-orb{display:grid;place-items:center;flex:0 0 28px;width:28px;height:28px;border-radius:50%;background:radial-gradient(circle at 32% 25%,#f6ffff 0,#80eaff 18%,#28a5ff 46%,#6758e8 75%,#151a42 100%);box-shadow:0 0 14px rgba(77,193,255,.42);color:#fff;font-size:15px}
  #dv-alexa-panel{position:absolute;right:376px;bottom:74px;z-index:91;width:min(344px,calc(100vw - 28px));max-height:min(470px,calc(100vh - 120px));display:none;flex-direction:column;overflow:hidden;border:1px solid rgba(104,206,255,.35);border-radius:18px;background:linear-gradient(145deg,rgba(6,13,28,.98),rgba(15,11,33,.98));box-shadow:0 20px 55px rgba(0,0,0,.58),0 0 30px rgba(67,154,255,.12);color:#edf3ff;font:13px/1.45 system-ui,Segoe UI,sans-serif;backdrop-filter:blur(18px)}
  #dv-alexa-panel.open{display:flex}
  #dv-alexa-panel *{box-sizing:border-box}
  #dv-alexa-head{display:flex;align-items:center;gap:10px;padding:13px 14px;border-bottom:1px solid rgba(130,174,255,.16)}
  #dv-alexa-head .mark{width:34px;height:34px;flex:0 0 34px;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle at 30% 25%,#eaffff,#62d7ff 29%,#2587f4 62%,#7655e9);box-shadow:0 0 18px rgba(66,173,255,.25);font-size:18px}
  #dv-alexa-head strong{display:block;font-size:13px;letter-spacing:.16em;color:#f4f7ff}
  #dv-alexa-head small{display:block;font-size:10px;color:#91b5d8;letter-spacing:.05em}
  #dv-alexa-close{margin-left:auto;border:0;background:transparent;color:#a8bad6;font-size:20px;cursor:pointer;padding:3px 5px}
  #dv-alexa-log{min-height:72px;max-height:210px;overflow:auto;display:flex;flex-direction:column;gap:8px;padding:13px}
  .dv-alexa-msg{align-self:flex-start;max-width:96%;padding:9px 11px;border-radius:12px 12px 12px 3px;background:rgba(63,105,166,.2);border:1px solid rgba(122,172,243,.14);color:#e7efff;white-space:pre-wrap;overflow-wrap:anywhere}
  .dv-alexa-msg.user{align-self:flex-end;border-radius:12px 12px 3px 12px;background:rgba(53,132,235,.22);border-color:rgba(93,174,255,.24)}
  #dv-alexa-form{display:flex;gap:6px;padding:0 12px 10px}
  #dv-alexa-input{flex:1;min-width:0;background:rgba(3,8,18,.75);border:1px solid rgba(125,163,222,.28);border-radius:9px;padding:10px;color:#f0f5ff;font:12px system-ui,Segoe UI,sans-serif;outline:none}
  #dv-alexa-input:focus{border-color:#61d5ff}
  .dv-alexa-act{border:1px solid rgba(101,204,255,.42);border-radius:9px;padding:8px 10px;background:rgba(30,104,174,.28);color:#eaf7ff;font:600 11px system-ui,Segoe UI,sans-serif;cursor:pointer}
  .dv-alexa-act:hover{background:rgba(45,137,215,.4)}
  #dv-alexa-mic{width:39px;font-size:15px}
  #dv-alexa-quick{display:flex;flex-wrap:wrap;gap:6px;padding:0 12px 11px}
  #dv-alexa-quick button{border:1px solid rgba(115,160,220,.25);border-radius:999px;padding:6px 9px;background:rgba(255,255,255,.035);color:#bcd5f7;font:10px system-ui,Segoe UI,sans-serif;cursor:pointer}
  #dv-alexa-quick button:hover{border-color:rgba(102,211,255,.6);color:#fff}
  #dv-alexa-quick button[data-alexa-stop-voice]{border-color:rgba(255,125,125,.5);color:#ffd2d2;background:rgba(110,24,35,.28)}
  #dv-alexa-quick button[data-alexa-stop-voice]:hover{border-color:#ff8f9c;background:rgba(145,35,48,.45)}
  #dv-alexa-footer{padding:9px 13px;border-top:1px solid rgba(130,174,255,.14);color:#8499b9;font-size:9.5px}
  #dv-alexa-footer label{display:flex;align-items:center;gap:6px;margin-bottom:5px;color:#a8c3e7;cursor:pointer}
  #dv-alexa-status{color:#8edfff}
  @media(max-width:900px){#dv-alexa-launcher{right:12px;bottom:18px}#dv-alexa-panel{right:12px;bottom:70px;width:min(344px,calc(100vw - 24px))}}
  `;
  document.head.appendChild(style);
  alexaLauncher=document.createElement('button');
  alexaLauncher.id='dv-alexa-launcher';alexaLauncher.type='button';alexaLauncher.setAttribute('aria-expanded','false');
  alexaLauncher.innerHTML='<span id="dv-alexa-orb" aria-hidden="true">✦</span><span>ALEXA&nbsp; <span style="color:#7fdcff">VOICE CONTROL</span></span>';
  alexaPanel=document.createElement('section');
  alexaPanel.id='dv-alexa-panel';alexaPanel.setAttribute('aria-label','DeconVerse Alexa voice control');
  alexaPanel.innerHTML=`
    <div id="dv-alexa-head"><div class="mark" aria-hidden="true">✦</div><div><strong>ALEXA</strong><small>DeconVerse voice control</small></div><button id="dv-alexa-close" type="button" aria-label="Close assistant">×</button></div>
    <div id="dv-alexa-log" aria-live="polite" aria-relevant="additions"></div>
    <form id="dv-alexa-form"><input id="dv-alexa-input" autocomplete="off" placeholder="Try “explode the device”…" aria-label="Type a DeconVerse command"><button class="dv-alexa-act" id="dv-alexa-send" type="submit">Send</button><button class="dv-alexa-act" id="dv-alexa-mic" type="button" aria-label="Start voice command" title="Use your browser microphone">🎙</button></form>
    <div id="dv-alexa-quick"><button type="button" data-alexa-action="explode">Explode</button><button type="button" data-alexa-action="reassemble">Reassemble</button><button type="button" data-alexa-action="reset">Reset view</button><button type="button" data-alexa-action="explainSelected">Explain selected</button><button type="button" data-alexa-stop-voice aria-label="Stop voice playback and microphone">■ Stop voice</button></div>
    <div id="dv-alexa-footer"><label><input id="dv-alexa-speak" type="checkbox" checked> Read replies aloud (browser voice)</label><div id="dv-alexa-status">Ready · Type or tap the mic to start.</div><div style="margin-top:4px">Web microphone uses browser speech recognition. Your Amazon Alexa skill remains available in Alexa Simulator/device.</div></div>`;
  root.appendChild(alexaLauncher);root.appendChild(alexaPanel);
  alexaLog=alexaPanel.querySelector('#dv-alexa-log');
  alexaInput=alexaPanel.querySelector('#dv-alexa-input');
  alexaStatus=alexaPanel.querySelector('#dv-alexa-status');
  alexaSpeakReplies=alexaPanel.querySelector('#dv-alexa-speak').checked;
  alexaLauncher.addEventListener('click',()=>{
    const open=!alexaPanel.classList.contains('open');alexaPanel.classList.toggle('open',open);alexaLauncher.setAttribute('aria-expanded',String(open));
    if(open)alexaInput.focus({preventScroll:true});
  });
  alexaPanel.querySelector('#dv-alexa-close').addEventListener('click',()=>{alexaPanel.classList.remove('open');alexaLauncher.setAttribute('aria-expanded','false')});
  alexaPanel.querySelector('#dv-alexa-speak').addEventListener('change',e=>{alexaSpeakReplies=!!e.target.checked;setAlexaStatus(alexaSpeakReplies?'Browser voice replies enabled':'Browser voice replies muted')});
  alexaPanel.querySelector('#dv-alexa-form').addEventListener('submit',e=>{e.preventDefault();const value=alexaInput.value.trim();if(!value)return;addAlexaMessage(value,'user');alexaInput.value='';handleAlexaTextCommand(value,'website')});
  alexaPanel.querySelector('#dv-alexa-quick').addEventListener('click',e=>{const stop=e.target.closest('[data-alexa-stop-voice]');if(stop){stopAlexaVoice();return}const b=e.target.closest('[data-alexa-action]');if(!b)return;const action=b.dataset.alexaAction;addAlexaMessage(ALEXA_ACTION_LABELS[action]||action,'user');dispatchAlexaAction(action,'website')});
  alexaPanel.querySelector('#dv-alexa-mic').addEventListener('click',startAlexaRecognition);
  addAlexaMessage(lastAlexaReply,'assistant');
  ['pointerdown','pointermove','pointerup','click','wheel'].forEach(type=>{alexaPanel.addEventListener(type,e=>e.stopPropagation());alexaLauncher.addEventListener(type,e=>e.stopPropagation())});
}

function setAlexaStatus(message){if(alexaStatus)alexaStatus.textContent=message}
function stopAlexaVoice(){
  let stopped=false;
  if('speechSynthesis' in window){window.speechSynthesis.cancel();stopped=true;}
  if(alexaRecognition&&alexaListening){try{if(typeof alexaRecognition.abort==='function')alexaRecognition.abort();else alexaRecognition.stop();}catch(_error){}stopped=true;}
  alexaListening=false;
  const mic=alexaPanel&&alexaPanel.querySelector('#dv-alexa-mic');if(mic)mic.textContent='🎙';
  setAlexaStatus(stopped?'Voice stopped':'No voice playback or listening is active');
}
function getFemaleEnglishVoice(){
  if(!('speechSynthesis' in window))return null;
  const voices=window.speechSynthesis.getVoices()||[];
  const english=voices.filter(v=>/^en([_-]|$)/i.test(v.lang||''));
  const preferredNames=[
    /microsoft zira/i,
    /microsoft aria/i,
    /microsoft jenny/i,
    /google us english female/i,
    /samantha/i,
    /ava/i,
    /aria/i,
    /jenny/i,
    /karen/i,
    /moira/i,
    /tessa/i,
    /victoria/i,
    /female/i
  ];
  for(const pattern of preferredNames){
    const match=english.find(v=>pattern.test(v.name||''));
    if(match)return match;
  }
  // If the platform has no clearly named female voice, prefer an English
  // voice that is not commonly labelled as a male voice; speech voices vary by OS.
  return english.find(v=>!/(david|mark|guy|christopher|eric|male|ravi|daniel)/i.test(v.name||''))||english[0]||null;
}
function addAlexaMessage(message,who='assistant'){
  lastAlexaReply=String(message||'');
  if(!alexaLog)return;
  const item=document.createElement('div');item.className='dv-alexa-msg'+(who==='user'?' user':'');item.textContent=lastAlexaReply;alexaLog.appendChild(item);
  while(alexaLog.children.length>8)alexaLog.removeChild(alexaLog.firstChild);
  alexaLog.scrollTop=alexaLog.scrollHeight;
  if(who==='assistant'&&alexaSpeakReplies&&'speechSynthesis' in window&&typeof SpeechSynthesisUtterance!=='undefined'){
    window.speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(lastAlexaReply);
    const femaleVoice=getFemaleEnglishVoice();
    if(femaleVoice){u.voice=femaleVoice;u.lang=femaleVoice.lang||'en-US';}
    else{u.lang='en-US';}
    u.rate=.96;u.pitch=1.08;
    window.speechSynthesis.speak(u);
  }
}
function startAlexaRecognition(){
  const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!Recognition){setAlexaStatus('Speech recognition is not available in this browser. Type a command instead.');return}
  if(alexaListening&&alexaRecognition){alexaRecognition.stop();return}
  try{
    alexaRecognition=new Recognition();alexaRecognition.lang='en-US';alexaRecognition.continuous=false;alexaRecognition.interimResults=false;alexaRecognition.maxAlternatives=1;
    alexaRecognition.onstart=()=>{alexaListening=true;setAlexaStatus('Listening… speak a DeconVerse command');const b=alexaPanel&&alexaPanel.querySelector('#dv-alexa-mic');if(b)b.textContent='■'};
    alexaRecognition.onresult=e=>{const text=e.results&&e.results[0]&&e.results[0][0]?e.results[0][0].transcript:'';if(text){if(alexaInput)alexaInput.value=text;addAlexaMessage(text,'user');handleAlexaTextCommand(text,'website microphone')}};
    alexaRecognition.onerror=e=>setAlexaStatus('Microphone: '+(e.error||'error')+'. You can type a command instead.');
    alexaRecognition.onend=()=>{alexaListening=false;const b=alexaPanel&&alexaPanel.querySelector('#dv-alexa-mic');if(b)b.textContent='🎙';if(alexaStatus&&alexaStatus.textContent==='Listening… speak a DeconVerse command')setAlexaStatus('Ready')};
    alexaRecognition.start();
  }catch(error){alexaListening=false;setAlexaStatus('Could not start microphone. Check browser microphone permission.')}
}
function handleAlexaTextCommand(text,source){
  const s=String(text||'').toLowerCase().replace(/\balexa\b/g,' ').replace(/[.,!?]/g,' ').replace(/\s+/g,' ').trim();
  let action=null;
  if(/\b(reassemble|assemble|put .* back together|restore .* assembled|close .* exploded view)\b/.test(s))action='reassemble';
  else if(/\b(explode|disassemble|separate the components|take .* apart|show .* internals|show the internal components)\b/.test(s))action='explode';
  else if(/\b(reset|default view|original position|start over)\b/.test(s))action='reset';
  else if(/\b(explain|describe|what is|tell me about)\b/.test(s))action='explainSelected';
  if(!action){addAlexaMessage('I can explode or reassemble the device, reset the view, or explain the selected component.','assistant');setAlexaStatus('Command not recognized');return}
  dispatchAlexaAction(action,source);
}
function describeSelectedComponent(){
  const c=sel?byId(sel):null;
  if(!c)return 'Select a component in the Components list or click a part in the 3D view first.';
  return `${c.name}. Category: ${c.cat}. Purpose: ${c.desc} Technical information: ${c.tech}`;
}
function executeAlexaAction(action,source='website'){
  switch(action){
    case 'explode': setExp(true);return 'Exploding the device.';
    case 'reassemble': setExp(false);return 'Reassembling the device.';
    case 'reset': resetView(true);return 'Resetting the view to its default position.';
    case 'explainSelected': return describeSelectedComponent();
    default:return 'That DeconVerse action is not supported.';
  }
}
function dispatchAlexaAction(action,source='website'){
  if(!ALEXA_ACTIONS.has(action)){addAlexaMessage('Unsupported command.','assistant');return}
  if(!active||!comps.length){
    pendingAlexaActions.push({action,source});
    setAlexaStatus('Opening the 3D explorer…');
    if(!alexaOpeningExplorer){alexaOpeningExplorer=true;enter()}
    return;
  }
  const response=executeAlexaAction(action,source);
  addAlexaMessage(response,'assistant');
  setAlexaStatus(source==='Alexa skill'?'Received command from your Amazon Alexa skill':'Command complete');
}
function flushPendingAlexaActions(){
  alexaOpeningExplorer=false;
  if(!comps.length){setAlexaStatus('The 3D model is not loaded yet. Open the explorer and retry.');return}
  const pending=pendingAlexaActions.splice(0);
  pending.forEach(({action,source})=>{const response=executeAlexaAction(action,source);addAlexaMessage(response,'assistant');setAlexaStatus(source==='Alexa skill'?'Received command from your Amazon Alexa skill':'Command complete')});
}
function startAlexaQueuePoller(){
  if(alexaPollTimer)return;
  // Local Vite preview continues to use the separately running development
  // command backend. A hosted deployment uses its same-origin API route.
  const isLocalHost=['localhost','127.0.0.1'].includes(location.hostname);
  const commandEndpoint=isLocalHost
    ? 'http://localhost:3001/api/commands/next'
    : '/api/commands/next';
  const poll=async()=>{
    if(alexaPollBusy)return;alexaPollBusy=true;
    try{
      const response=await fetch(commandEndpoint,{cache:'no-store'});
      if(!response.ok)return;
      const data=await response.json();const command=data&&data.command;
      if(command&&ALEXA_ACTIONS.has(command.action))dispatchAlexaAction(command.action,'Alexa skill');
    }catch(_error){/* service may be waking or restarting; retry on next poll */}
    finally{alexaPollBusy=false}
  };
  poll();alexaPollTimer=setInterval(poll,1200);
}

window.DV2={
  enter,leave,
  explode:()=>dispatchAlexaAction('explode','Alexa skill'),
  reassemble:()=>dispatchAlexaAction('reassemble','Alexa skill'),
  reset:()=>dispatchAlexaAction('reset','Alexa skill'),
  explainSelected:()=>dispatchAlexaAction('explainSelected','Alexa skill'),
  dispatchCommand:(action)=>dispatchAlexaAction(action,'external')
};
startAlexaQueuePoller();
})();
