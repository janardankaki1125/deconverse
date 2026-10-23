
import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import './style.css';

const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
}

function recognizeGesture(lm) {
  const wrist = lm[0];
  const palmSize = Math.max(distance(lm[0], lm[9]), 0.001);

  const fingerExtended = (tip, pip, mcp) => {
    const tipDistance = distance(lm[tip], wrist);
    const pipDistance = distance(lm[pip], wrist);
    const mcpDistance = distance(lm[mcp], wrist);

    return (
      tipDistance > pipDistance * 1.08 &&
      tipDistance > mcpDistance * 1.15
    );
  };

  const index = fingerExtended(8, 6, 5);
  const middle = fingerExtended(12, 10, 9);
  const ring = fingerExtended(16, 14, 13);
  const pinky = fingerExtended(20, 18, 17);

  const thumbToIndex = distance(lm[4], lm[8]) / palmSize;
  const thumbToMiddle = distance(lm[4], lm[12]) / palmSize;

  const foldedCount = [index, middle, ring, pinky].filter(
    (extended) => !extended
  ).length;

  if (foldedCount === 4 && thumbToIndex > 0.20) {
    return 'Fist';
  }

  if (
    thumbToIndex < 0.28 &&
    (index || middle) &&
    thumbToMiddle > 0.12
  ) {
    return 'Pinch';
  }

  if (index && middle && ring && pinky) {
    return 'Open palm';
  }

  if (index && !middle && !ring && !pinky) {
    return 'Point';
  }

  return 'Unrecognized';
}

function GestureLab() {
  // Existing hand-tracking refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const landmarkerRef = useRef(null);
  const rafRef = useRef(0);
  const lastVideoTimeRef = useRef(-1);

  // Sony 3D camera viewer refs
  const modelMountRef = useRef(null);
  const modelRootRef = useRef(null);
  const selectedMeshRef = useRef(null);

  // Existing hand-tracking state
  const [cameraOn, setCameraOn] = useState(false);
  const [gesture, setGesture] = useState('Waiting for hand');
  const [status, setStatus] = useState('Camera stopped');
  const [handVisible, setHandVisible] = useState(false);
  const [error, setError] = useState('');

  // 3D viewer state
  const [modelStatus, setModelStatus] = useState('Loading Sony camera...');
  const [selectedPart, setSelectedPart] = useState('None');

  // Start the webcam and MediaPipe hand tracker
  const startCamera = async () => {
    setError('');
    setStatus('Requesting camera permission…');

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(
          'Camera access is unavailable. Open this page on localhost or HTTPS.'
        );
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: 'user', width: 640, height: 480 },
      });

      streamRef.current = stream;

      const video = videoRef.current;
      if (!video) throw new Error('Camera preview is unavailable.');

      video.srcObject = stream;
      await video.play();

      setStatus('Loading hand-tracking model…');

      if (!landmarkerRef.current) {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );

        try {
          landmarkerRef.current = await HandLandmarker.createFromOptions(
            vision,
            {
              baseOptions: {
                modelAssetPath: MODEL_URL,
                delegate: 'GPU',
              },
              runningMode: 'VIDEO',
              numHands: 1,
            }
          );
        } catch (gpuError) {
          console.warn('GPU delegate failed; trying CPU:', gpuError);

          landmarkerRef.current = await HandLandmarker.createFromOptions(
            vision,
            {
              baseOptions: {
                modelAssetPath: MODEL_URL,
                delegate: 'CPU',
              },
              runningMode: 'VIDEO',
              numHands: 1,
            }
          );
        }
      }

      setCameraOn(true);
      setStatus('Show one hand to the camera');

      const draw = () => {
        if (
          !videoRef.current ||
          !canvasRef.current ||
          !landmarkerRef.current ||
          !streamRef.current
        ) {
          return;
        }

        const currentVideo = videoRef.current;
        const canvas = canvasRef.current;

        if (
          currentVideo.readyState >= 2 &&
          currentVideo.currentTime !== lastVideoTimeRef.current
        ) {
          lastVideoTimeRef.current = currentVideo.currentTime;

          try {
            const result = landmarkerRef.current.detectForVideo(
              currentVideo,
              performance.now()
            );

            const ctx = canvas.getContext('2d');

            if (
              canvas.width !== currentVideo.videoWidth ||
              canvas.height !== currentVideo.videoHeight
            ) {
              canvas.width = currentVideo.videoWidth;
              canvas.height = currentVideo.videoHeight;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const landmarks = result.landmarks?.[0];

            if (landmarks) {
              setHandVisible(true);
              setGesture(recognizeGesture(landmarks));
              setStatus('Hand detected');

              ctx.fillStyle = '#e8bd78';
              ctx.strokeStyle = '#e8bd78';
              ctx.lineWidth = 3;

              for (const point of landmarks) {
                ctx.beginPath();
                ctx.arc(
                  point.x * canvas.width,
                  point.y * canvas.height,
                  4,
                  0,
                  Math.PI * 2
                );
                ctx.fill();
              }

              for (const [a, b] of [
                [0, 1], [1, 2], [2, 3], [3, 4],
                [0, 5], [5, 6], [6, 7], [7, 8],
                [5, 9], [9, 10], [10, 11], [11, 12],
                [9, 13], [13, 14], [14, 15], [15, 16],
                [13, 17], [17, 18], [18, 19], [19, 20],
                [0, 17],
              ]) {
                ctx.beginPath();
                ctx.moveTo(
                  landmarks[a].x * canvas.width,
                  landmarks[a].y * canvas.height
                );
                ctx.lineTo(
                  landmarks[b].x * canvas.width,
                  landmarks[b].y * canvas.height
                );
                ctx.stroke();
              }
            } else {
              setHandVisible(false);
              setGesture('No hand detected');
              setStatus('Show one hand to the camera');
            }
          } catch (detectionError) {
            console.error('Hand detection failed:', detectionError);
            setStatus('Detection error — check console');
          }
        }

        rafRef.current = requestAnimationFrame(draw);
      };

      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(draw);
    } catch (cameraError) {
      console.error('Could not start hand tracking:', cameraError);

      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;

      if (videoRef.current) videoRef.current.srcObject = null;

      setCameraOn(false);
      setHandVisible(false);
      setError(
        cameraError.message ||
          'Unable to start camera or load the hand-tracking model.'
      );
      setStatus('Could not start');
    }
  };

  // Stop webcam while keeping the 3D viewer running
  const stopCamera = () => {
    cancelAnimationFrame(rafRef.current);

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    lastVideoTimeRef.current = -1;
    setCameraOn(false);
    setHandVisible(false);
    setGesture('Waiting for hand');
    setStatus('Camera stopped');
  };

  // Initialize Three.js and load the Sony A7 IV GLB
  useEffect(() => {
    const mount = modelMountRef.current;
    if (!mount) return undefined;

    let renderer;
    let controls;
    let animationFrame = 0;
    let resizeObserver;
    let disposed = false;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#080a0f');

    const camera = new THREE.PerspectiveCamera(
      45,
      mount.clientWidth / Math.max(mount.clientHeight, 1),
      0.01,
      1000
    );
    camera.position.set(3, 2, 5);

    try {
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      mount.appendChild(renderer.domElement);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.target.set(0, 0, 0);
      controls.update();

      scene.add(new THREE.HemisphereLight(0xffffff, 0x303040, 2));

      const keyLight = new THREE.DirectionalLight(0xffffff, 3);
      keyLight.position.set(4, 6, 5);
      scene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(0xd8b16e, 1.5);
      fillLight.position.set(-4, 2, -3);
      scene.add(fillLight);

      const rimLight = new THREE.DirectionalLight(0xffffff, 1.2);
      rimLight.position.set(0, 3, -5);
      scene.add(rimLight);
    } catch (viewerError) {
      console.error('3D viewer initialization failed:', viewerError);
      setModelStatus('WebGL initialization failed');
      return undefined;
    }

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const handleModelClick = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();

      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);

      const model = modelRootRef.current;
      if (!model) return;

      const hits = raycaster.intersectObject(model, true);
      if (!hits.length) return;

      const mesh = hits[0].object;

      if (selectedMeshRef.current?.material) {
        const previous = selectedMeshRef.current;
        if (previous.userData.originalMaterial) {
          previous.material = previous.userData.originalMaterial;
        }
      }

      selectedMeshRef.current = mesh;

      const meshName =
        mesh.name ||
        mesh.parent?.name ||
        'Camera mesh';

      setSelectedPart(meshName);

      // Subtle highlight when the mesh has a single material.
      if (mesh.material && !Array.isArray(mesh.material)) {
        if (!mesh.userData.originalMaterial) {
          mesh.userData.originalMaterial = mesh.material;
        }

        const highlighted = mesh.material.clone();

        if (highlighted.color) {
          highlighted.color.lerp(new THREE.Color('#d8b16e'), 0.22);
        }

        mesh.material = highlighted;
      }
    };

    renderer.domElement.addEventListener('click', handleModelClick);

    setModelStatus('Loading Sony camera...');

    const loader = new GLTFLoader();

    loader.load(
      '/a7iv.glb',
      (gltf) => {
        if (disposed) {
          gltf.scene.traverse((object) => {
            if (object.isMesh) {
              object.geometry?.dispose();
            }
          });
          return;
        }

        const model = gltf.scene;

        const initialBox = new THREE.Box3().setFromObject(model);
        const initialSize = initialBox.getSize(new THREE.Vector3());
        const center = initialBox.getCenter(new THREE.Vector3());

        model.position.sub(center);

        const maxDimension = Math.max(
          initialSize.x,
          initialSize.y,
          initialSize.z
        );

        if (maxDimension > 0) {
          model.scale.setScalar(3 / maxDimension);
        }

        model.traverse((object) => {
          if (object.isMesh) {
            object.userData.originalName = object.name || 'Camera mesh';
            object.castShadow = true;
            object.receiveShadow = true;
          }
        });

        scene.add(model);
        modelRootRef.current = model;

        // Fit the view to the loaded model.
        const fittedBox = new THREE.Box3().setFromObject(model);
        const fittedSize = fittedBox.getSize(new THREE.Vector3());
        const fittedCenter = fittedBox.getCenter(new THREE.Vector3());
        const largest = Math.max(fittedSize.x, fittedSize.y, fittedSize.z);
        const distanceToModel =
          (largest / (2 * Math.tan((camera.fov * Math.PI) / 360))) * 1.6;

        camera.position.set(
          fittedCenter.x + distanceToModel * 0.7,
          fittedCenter.y + distanceToModel * 0.4,
          fittedCenter.z + distanceToModel * 1.5
        );
        camera.near = Math.max(distanceToModel / 1000, 0.001);
        camera.far = Math.max(distanceToModel * 100, 100);
        camera.updateProjectionMatrix();

        controls.target.copy(fittedCenter);
        controls.minDistance = Math.max(largest * 0.6, 0.1);
        controls.maxDistance = Math.max(largest * 8, 10);
        controls.update();

        setModelStatus('Sony camera loaded');
      },
      undefined,
      (loadError) => {
        console.error('Camera GLB loading failed:', loadError);
        if (!disposed) {
          setModelStatus('Could not load camera — check Console');
        }
      }
    );

    resizeObserver = new ResizeObserver(() => {
      if (
        disposed ||
        !mount.clientWidth ||
        !mount.clientHeight
      ) {
        return;
      }

      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    });

    resizeObserver.observe(mount);

    const animate = () => {
      if (disposed) return;

      controls.update();
      renderer.render(scene, camera);
      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrame);
      resizeObserver?.disconnect();

      renderer.domElement.removeEventListener('click', handleModelClick);
      controls.dispose();

      if (modelRootRef.current) {
        modelRootRef.current.traverse((object) => {
          if (object.isMesh) {
            object.geometry?.dispose();

            const materials = Array.isArray(object.material)
              ? object.material
              : [object.material];

            materials.forEach((material) => material?.dispose());
          }
        });

        modelRootRef.current = null;
      }

      selectedMeshRef.current = null;
      renderer.dispose();
      renderer.domElement.remove();
      scene.clear();
    };
  }, []);

  // Clean up the webcam and hand tracker when the component unmounts
  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      landmarkerRef.current?.close();
    };
  }, []);

  return (
    <main className="lab">
      <header className="lab-header">
        <div className="eyebrow">DECONVERSE / INTERACTION SYSTEMS</div>
        <h1>
          Gesture Lab<span>.</span>
        </h1>
        <p>
          Test real-time hand tracking and explore the Sony camera in 3D.
        </p>
      </header>

      <section className="status-card">
        <div className={`status-dot ${handVisible ? 'active' : ''}`} />
        <div>
          <strong>{status}</strong>
          <p>
            Detected gesture: <b>{gesture}</b>
          </p>
        </div>
        <span className="status-label">LIVE TRACKING</span>
      </section>

      {error && <div className="error-box">{error}</div>}

      <section className="feature-grid">
        <article className="panel">
          <span className="panel-number">01 / CAMERA INPUT</span>
          <h2>Hand tracking</h2>
          <p>
            Allow camera access, hold your hand in view, and watch the
            detected landmarks.
          </p>

          <div className="camera-preview">
            <video ref={videoRef} autoPlay playsInline muted />
            <canvas ref={canvasRef} />
            {!cameraOn && (
              <div className="camera-overlay">
                Camera preview will appear here
              </div>
            )}
          </div>

          <div className="button-row">
            <button
              type="button"
              onClick={startCamera}
              disabled={cameraOn}
            >
              Start camera
            </button>
            <button
              type="button"
              onClick={stopCamera}
              disabled={!cameraOn}
            >
              Stop camera
            </button>
          </div>
        </article>

        <article className="panel">
          <span className="panel-number">02 / GESTURE STATUS</span>
          <h2>Recognized input</h2>
          <div className="gesture-result">{gesture}</div>

          <div className="gesture-chips">
            <span>Open palm</span>
            <span>Point</span>
            <span>Pinch</span>
            <span>Fist</span>
          </div>

          <p className="note">
            Hand tracking recognizes these gestures, but gestures are not
            connected to camera controls yet.
          </p>
        </article>

        <article className="panel camera-model-panel">
          <span className="panel-number">03 / 3D EXPLORER</span>
          <h2>Sony Camera</h2>
          <p>
            Drag to rotate. Scroll to zoom. Click a visible mesh to inspect
            its name when available.
          </p>

          <div
            ref={modelMountRef}
            className="model-viewer"
            aria-label="Interactive 3D Sony camera viewer"
          />

          <div className="model-info">
            <span>MODEL STATUS</span>
            <strong>{modelStatus}</strong>

            <span>SELECTED COMPONENT</span>
            <strong>{selectedPart}</strong>
          </div>

          <p className="note">
            Selection depends on the mesh structure and names included in
            the GLB. This viewer does not yet provide an exploded view.
          </p>
        </article>
      </section>

      <footer>DECONVERSE · GESTURE LAB · DEVELOPMENT BUILD</footer>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<GestureLab />);
