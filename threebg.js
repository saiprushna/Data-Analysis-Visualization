/* Three.js neon floating bubbles background */
(() => {
  const container = document.createElement('div');
  container.id = 'three-bg';
  container.style.position = 'fixed';
  container.style.inset = '0';
  container.style.zIndex = '0';
  container.style.pointerEvents = 'none';
  document.body.prepend(container);

  const script = document.createElement('script');
  script.src = 'https://unpkg.com/three@0.160.1/build/three.min.js';
  script.onload = init;
  document.head.appendChild(script);

  let scene, camera, renderer, animId, clock;
  let bgGroup; // container for current background (bubbles only)

  function init() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0f1020, 0.015);
    camera = new THREE.PerspectiveCamera(60, width/height, 0.1, 1000);
    camera.position.set(0, 0, 65);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights for subtle specular highlights
    const ambient = new THREE.AmbientLight(0x88aaff, 0.35);
    const key = new THREE.PointLight(0x7cf0ff, 0.7, 200);
    key.position.set(30, 40, 40);
    const rim = new THREE.PointLight(0xa78bfa, 0.6, 200);
    rim.position.set(-30, -20, -10);
    scene.add(ambient, key, rim);

    bgGroup = new THREE.Group();
    scene.add(bgGroup);
    buildBubbles();

    clock = new THREE.Clock();

    window.addEventListener('resize', onResize);
    animate();
  }

  function onResize() {
    if (!renderer || !camera) return;
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h);
    camera.aspect = w/h; camera.updateProjectionMatrix();
  }

  function animate() {
    const t = clock.getElapsedTime();
    for (const b of bgGroup.children) {
      const u = b.userData;
      b.position.y += u.speed;
      b.position.x += Math.sin(t*0.6 + u.phase) * u.swayX * 0.04;
      b.position.z += Math.cos(t*0.5 + u.phase*1.3) * u.swayZ * 0.04;
      if (b.position.y > 60) {
        b.position.y = -60;
        b.position.x = (Math.random()-0.5)*120;
        b.position.z = (Math.random()-0.5)*100;
      }
      b.rotation.y += 0.002;
    }
    renderer.render(scene, camera);
    animId = requestAnimationFrame(animate);
  }

  function clearGroup() {
    while (bgGroup.children.length) {
      const obj = bgGroup.children[0];
      obj.geometry?.dispose?.();
      obj.material?.dispose?.();
      bgGroup.remove(obj);
    }
  }

  function buildBubbles() {
    clearGroup();
    const bubbleCount = 80;
    const geom = new THREE.SphereGeometry(1, 24, 24);
    for (let i=0; i<bubbleCount; i++) {
      const color = new THREE.Color().setHSL(0.55 + Math.random()*0.15, 0.9, 0.6);
      const mat = new THREE.MeshPhysicalMaterial({
        color,
        transparent: true,
        opacity: 0.22,
        metalness: 0.2,
        roughness: 0.2,
        transmission: 0.65,
        thickness: 0.6,
        emissive: color.clone().multiplyScalar(0.08),
        emissiveIntensity: 1.0,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const mesh = new THREE.Mesh(geom, mat);
      const scale = 0.6 + Math.random()*2.2;
      mesh.scale.setScalar(scale);
      mesh.position.set((Math.random()-0.5)*120, (Math.random()-0.5)*70, (Math.random()-0.5)*100);
      mesh.userData = {
        speed: 0.05 + Math.random()*0.18,
        swayX: Math.random()*0.6 + 0.2,
        swayZ: Math.random()*0.6 + 0.2,
        phase: Math.random()*Math.PI*2
      };
      bgGroup.add(mesh);
    }
  }

  // Remove grid-related API; only bubbles remain

  // Cleanup on navigate away
  window.addEventListener('beforeunload', () => cancelAnimationFrame(animId));
})();


