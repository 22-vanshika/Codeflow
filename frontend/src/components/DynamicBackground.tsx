import { useEffect, useRef } from 'react';
import { useThemeStore } from '../store/themeStore';
import * as THREE from 'three';

export default function DynamicBackground() {
  const { theme } = useThemeStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // Initialize Scene, Camera, WebGLRenderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);

    // Light Setup (Refractive details)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(10, 15, 10);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(theme === 'light' ? 0x7B74D1 : 0x908AE0, 3, 40);
    pointLight.position.set(-10, -8, 8);
    scene.add(pointLight);

    // Particle nodes configuration (DSA layout)
    const particleCount = 50;
    const positions = new Float32Array(particleCount * 3);
    const velocities: { x: number; y: number; z: number }[] = [];
    const bounds = { x: 36, y: 22, z: 12 };

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * bounds.x;
      positions[i * 3 + 1] = (Math.random() - 0.5) * bounds.y;
      positions[i * 3 + 2] = (Math.random() - 0.5) * bounds.z;

      velocities.push({
        x: (Math.random() - 0.5) * 0.01,
        y: (Math.random() - 0.5) * 0.01,
        z: (Math.random() - 0.5) * 0.005
      });
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Colors mapping to Lavender Theme
    const getColors = (t: 'dark' | 'light') => {
      return t === 'light'
        ? { point: 0x7B74D1, line: 0x8E89D6 }
        : { point: 0x908AE0, line: 0x7B74D1 };
    };

    const colors = getColors(theme);

    const pointMaterial = new THREE.PointsMaterial({
      size: 0.28,
      color: colors.point,
      transparent: true,
      opacity: 0.45,
      sizeAttenuation: true
    });

    const pointCloud = new THREE.Points(geometry, pointMaterial);
    scene.add(pointCloud);

    // Line segments
    const maxConnections = 100;
    const linePositions = new Float32Array(maxConnections * 2 * 3);
    const lineColors = new Float32Array(maxConnections * 2 * 3);

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.2,
      blending: theme === 'light' ? THREE.NormalBlending : THREE.AdditiveBlending
    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // --- 3D Meshes (FrsionOS Inspiration) ---
    const meshes: { mesh: THREE.Mesh; speedX: number; speedY: number; rotSpeed: number }[] = [];

    // Materials
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.08,
      metalness: 0.0,
      transmission: 0.95,
      ior: 1.52,
      thickness: 1.8,
      transparent: true,
      opacity: 0.55,
      depthWrite: false
    });

    const chromeMaterial = new THREE.MeshStandardMaterial({
      color: 0xdfdfdf,
      roughness: 0.08,
      metalness: 0.95
    });

    const clayMaterial = new THREE.MeshStandardMaterial({
      color: theme === 'light' ? 0x8E89D6 : 0x7B74D1,
      roughness: 0.45,
      metalness: 0.1
    });

    // Geometries
    const sphereGeo = new THREE.SphereGeometry(1, 32, 32);
    const torusGeo = new THREE.TorusGeometry(1.6, 0.45, 16, 100);

    // Glass Spheres
    const glassSphere1 = new THREE.Mesh(new THREE.SphereGeometry(2.4, 32, 32), glassMaterial);
    glassSphere1.position.set(-10, 5, 2);
    scene.add(glassSphere1);
    meshes.push({ mesh: glassSphere1, speedX: 0.003, speedY: -0.001, rotSpeed: 0.004 });

    const glassSphere2 = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 32), glassMaterial);
    glassSphere2.position.set(5, -6, 4);
    scene.add(glassSphere2);
    meshes.push({ mesh: glassSphere2, speedX: -0.002, speedY: 0.002, rotSpeed: -0.003 });

    // Metallic Spheres
    const chromeSphere1 = new THREE.Mesh(new THREE.SphereGeometry(2.0, 32, 32), chromeMaterial);
    chromeSphere1.position.set(11, 7, 1);
    scene.add(chromeSphere1);
    meshes.push({ mesh: chromeSphere1, speedX: -0.002, speedY: -0.002, rotSpeed: 0.006 });

    const chromeSphere2 = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), chromeMaterial);
    chromeSphere2.position.set(-4, -9, 3);
    scene.add(chromeSphere2);
    meshes.push({ mesh: chromeSphere2, speedX: 0.002, speedY: 0.001, rotSpeed: 0.008 });

    // Lavender Clay Curves (Torus rings)
    const torus1 = new THREE.Mesh(torusGeo, clayMaterial);
    torus1.position.set(-7, -4, 0);
    scene.add(torus1);
    meshes.push({ mesh: torus1, speedX: 0.002, speedY: 0.002, rotSpeed: 0.007 });

    const torus2 = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.35, 16, 100), clayMaterial);
    torus2.position.set(8, 1, -2);
    scene.add(torus2);
    meshes.push({ mesh: torus2, speedX: 0.001, speedY: -0.002, rotSpeed: -0.01 });

    // Initialize interactive userData properties for scale interpolation & physics
    meshes.forEach(item => {
      item.mesh.userData = {
        type: 'mesh',
        baseScale: item.mesh.scale.clone(),
        targetScale: item.mesh.scale.clone(),
        dragVelocityX: 0,
        dragVelocityY: 0
      };
    });

    // --- Dynamic Code Tokens (Billboards) ---
    const codeTokens = ['{}', '[]', 'if', 'while', 'for', '->', 'node*', '&&', 'ptr', 'val', 'dfs'];
    const tokenSprites: { sprite: THREE.Sprite; speedX: number; speedY: number; driftPhase: number }[] = [];

    // Canvas texture generator for characters
    const getCodeTexture = (text: string, colorHexStr: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, 128, 128);
        ctx.font = 'bold 36px "JetBrains Mono", monospace';
        ctx.fillStyle = colorHexStr;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 64, 64);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const themeTextColor = theme === 'light' ? '#7B74D1' : '#908AE0';

    codeTokens.forEach((token) => {
      const texture = getCodeTexture(token, themeTextColor);
      const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.35,
        blending: theme === 'light' ? THREE.NormalBlending : THREE.AdditiveBlending
      });
      const sprite = new THREE.Sprite(spriteMaterial);
      
      // Spawn at random coordinates
      sprite.position.set(
        (Math.random() - 0.5) * bounds.x,
        (Math.random() - 0.5) * bounds.y,
        (Math.random() - 0.5) * bounds.z
      );

      // Random scale sizing
      const scale = 1.0 + Math.random() * 0.8;
      sprite.scale.set(scale, scale, 1);

      // Initialize interactive userData properties for sprites
      sprite.userData = {
        type: 'sprite',
        token: token,
        baseScale: sprite.scale.clone(),
        targetScale: sprite.scale.clone(),
        dragVelocityX: 0,
        dragVelocityY: 0
      };

      scene.add(sprite);

      tokenSprites.push({
        sprite,
        speedX: (Math.random() - 0.5) * 0.004,
        speedY: (Math.random() - 0.5) * 0.004,
        driftPhase: Math.random() * Math.PI * 2
      });
    });

    // Track mouse coordinates for depth parallax
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.targetX = (event.clientX / window.innerWidth - 0.5) * 4;
      mouse.targetY = -(event.clientY / window.innerHeight - 0.5) * 2.5;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // --- WebGL Background Interactivity & Drag-and-Throw Physics ---
    const raycaster = new THREE.Raycaster();
    const mouseNDC = new THREE.Vector2();
    let selectedObject: THREE.Object3D | null = null;
    let hoveredObject: THREE.Object3D | null = null;
    let isDragging = false;
    
    const dragPlane = new THREE.Plane();
    const planeIntersection = new THREE.Vector3();
    const dragOffset = new THREE.Vector3();
    const lastObjectPosition = new THREE.Vector3();

    const onPointerDown = (event: PointerEvent) => {
      // 1. Avoid hijacking UI interaction from buttons, inputs, links, cards, or editor components
      const target = event.target as HTMLElement;
      if (
        !target ||
        target.closest('button') ||
        target.closest('input') ||
        target.closest('a') ||
        target.closest('textarea') ||
        target.closest('.liquid-glass-card') ||
        target.closest('nav') ||
        target.closest('.monaco-editor') ||
        target.closest('footer')
      ) {
        return;
      }

      // 2. Map screen coordinates to Normalized Device Coordinates (-1 to +1)
      mouseNDC.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseNDC.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // 3. Raycast against shapes and sprites
      raycaster.setFromCamera(mouseNDC, camera);
      const interactables = [...meshes.map(m => m.mesh), ...tokenSprites.map(s => s.sprite)];
      const intersects = raycaster.intersectObjects(interactables);

      if (intersects.length > 0) {
        selectedObject = intersects[0].object;
        isDragging = true;

        // Visual feedback: scale up object on click/drag
        if (selectedObject.userData.targetScale) {
          selectedObject.userData.targetScale.copy(selectedObject.userData.baseScale).multiplyScalar(1.65);
        }

        // Easter Egg: Cycle code sprite text on click!
        if (selectedObject.userData.type === 'sprite') {
          const currentToken = selectedObject.userData.token;
          const nextIndex = (codeTokens.indexOf(currentToken) + 1) % codeTokens.length;
          const nextToken = codeTokens[nextIndex];
          selectedObject.userData.token = nextToken;

          const newTexture = getCodeTexture(nextToken, themeTextColor);
          const oldMap = (selectedObject as THREE.Sprite).material.map;
          (selectedObject as THREE.Sprite).material.map = newTexture;
          if (oldMap) oldMap.dispose();
          (selectedObject as THREE.Sprite).material.needsUpdate = true;
        }

        // Setup dragging plane parallel to camera at the selected object's position
        const cameraDir = new THREE.Vector3();
        camera.getWorldDirection(cameraDir);
        cameraDir.negate();
        dragPlane.setFromNormalAndCoplanarPoint(cameraDir, selectedObject.position);

        // Compute drag offset
        raycaster.ray.intersectPlane(dragPlane, planeIntersection);
        dragOffset.copy(selectedObject.position).sub(planeIntersection);
        lastObjectPosition.copy(selectedObject.position);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      mouseNDC.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseNDC.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Update parallax target
      mouse.targetX = mouseNDC.x * 4;
      mouse.targetY = mouseNDC.y * 2.5;

      if (isDragging && selectedObject) {
        // Drag selected object on the camera plane
        raycaster.setFromCamera(mouseNDC, camera);
        if (raycaster.ray.intersectPlane(dragPlane, planeIntersection)) {
          selectedObject.position.copy(planeIntersection).add(dragOffset);

          // Calculate delta for throw kinematics
          selectedObject.userData.dragVelocityX = selectedObject.position.x - lastObjectPosition.x;
          selectedObject.userData.dragVelocityY = selectedObject.position.y - lastObjectPosition.y;

          lastObjectPosition.copy(selectedObject.position);
        }
      } else {
        // Hover scaling logic
        raycaster.setFromCamera(mouseNDC, camera);
        const interactables = [...meshes.map(m => m.mesh), ...tokenSprites.map(s => s.sprite)];
        const intersects = raycaster.intersectObjects(interactables);

        if (intersects.length > 0) {
          const hitObj = intersects[0].object;
          if (hoveredObject !== hitObj) {
            if (hoveredObject && hoveredObject.userData.targetScale) {
              hoveredObject.userData.targetScale.copy(hoveredObject.userData.baseScale);
            }
            hoveredObject = hitObj;
            if (hoveredObject && hoveredObject.userData.targetScale) {
              hoveredObject.userData.targetScale.copy(hoveredObject.userData.baseScale).multiplyScalar(1.35);
            }
          }
        } else {
          if (hoveredObject) {
            if (hoveredObject.userData.targetScale) {
              hoveredObject.userData.targetScale.copy(hoveredObject.userData.baseScale);
            }
            hoveredObject = null;
          }
        }
      }
    };

    const onPointerUp = () => {
      if (isDragging && selectedObject) {
        // Restore normal base scale
        if (selectedObject.userData.targetScale) {
          selectedObject.userData.targetScale.copy(selectedObject.userData.baseScale);
        }

        // Apply throw physics velocities
        const throwX = selectedObject.userData.dragVelocityX || 0;
        const throwY = selectedObject.userData.dragVelocityY || 0;

        const meshItem = meshes.find(m => m.mesh === selectedObject);
        if (meshItem) {
          meshItem.speedX = Math.max(-0.15, Math.min(0.15, throwX * 0.8));
          meshItem.speedY = Math.max(-0.15, Math.min(0.15, throwY * 0.8));
          // Restore default random tiny float velocity if thrown completely still
          if (Math.abs(meshItem.speedX) < 0.001) meshItem.speedX = (Math.random() - 0.5) * 0.004;
          if (Math.abs(meshItem.speedY) < 0.001) meshItem.speedY = (Math.random() - 0.5) * 0.004;
        } else {
          const spriteItem = tokenSprites.find(s => s.sprite === selectedObject);
          if (spriteItem) {
            spriteItem.speedX = Math.max(-0.15, Math.min(0.15, throwX * 0.8));
            spriteItem.speedY = Math.max(-0.15, Math.min(0.15, throwY * 0.8));
            if (Math.abs(spriteItem.speedX) < 0.001) spriteItem.speedX = (Math.random() - 0.5) * 0.004;
            if (Math.abs(spriteItem.speedY) < 0.001) spriteItem.speedY = (Math.random() - 0.5) * 0.004;
          }
        }

        selectedObject = null;
        isDragging = false;
      }
    };

    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    const handleResize = () => {
      if (!canvasRef.current) return;
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Animation frames
    let animationId: number;
    const connectionThreshold = 6.0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Smooth camera slide
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      camera.position.x += (mouse.x - camera.position.x) * 0.05;
      camera.position.y += (mouse.y - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      // Slowly float and rotate 3D meshes
      meshes.forEach(item => {
        // If being dragged, do not apply automatic floating movement
        if (selectedObject !== item.mesh) {
          item.mesh.position.x += item.speedX;
          item.mesh.position.y += item.speedY;

          // Bounce bounds
          if (Math.abs(item.mesh.position.x) > 16) item.speedX *= -1;
          if (Math.abs(item.mesh.position.y) > 10) item.speedY *= -1;

          item.mesh.rotation.x += item.rotSpeed;
          item.mesh.rotation.y += item.rotSpeed * 0.5;
        }

        // Interpolate scale dynamically (hover and drag effects)
        if (item.mesh.userData.targetScale) {
          item.mesh.scale.lerp(item.mesh.userData.targetScale, 0.12);
        }
      });

      // Float and pulse Code Sprites
      tokenSprites.forEach(item => {
        // If being dragged, do not apply automatic floating movement
        if (selectedObject !== item.sprite) {
          item.sprite.position.x += item.speedX;
          item.sprite.position.y += item.speedY;

          if (Math.abs(item.sprite.position.x) > bounds.x / 2 + 1) item.speedX *= -1;
          if (Math.abs(item.sprite.position.y) > bounds.y / 2 + 1) item.speedY *= -1;
        }

        // Opacity pulsing
        item.driftPhase += 0.008;
        item.sprite.material.opacity = (theme === 'light' ? 0.22 : 0.35) + Math.sin(item.driftPhase) * 0.12;

        // Interpolate scale dynamically
        if (item.sprite.userData.targetScale) {
          item.sprite.scale.lerp(item.sprite.userData.targetScale, 0.12);
        }
      });

      const posArr = geometry.attributes.position.array as Float32Array;

      // Update particle positions
      for (let i = 0; i < particleCount; i++) {
        posArr[i * 3] += velocities[i].x;
        posArr[i * 3 + 1] += velocities[i].y;
        posArr[i * 3 + 2] += velocities[i].z;

        // Rebound boundaries
        if (Math.abs(posArr[i * 3]) > bounds.x / 2) velocities[i].x *= -1;
        if (Math.abs(posArr[i * 3 + 1]) > bounds.y / 2) velocities[i].y *= -1;
        if (Math.abs(posArr[i * 3 + 2]) > bounds.z / 2) velocities[i].z *= -1;
      }
      geometry.attributes.position.needsUpdate = true;

      // Recompute connected lines
      let lineIndex = 0;
      const themeColors = getColors(theme);
      const color1 = new THREE.Color(themeColors.point);
      const color2 = new THREE.Color(themeColors.line);

      for (let i = 0; i < particleCount; i++) {
        const x1 = posArr[i * 3];
        const y1 = posArr[i * 3 + 1];
        const z1 = posArr[i * 3 + 2];

        for (let j = i + 1; j < particleCount; j++) {
          const x2 = posArr[j * 3];
          const y2 = posArr[j * 3 + 1];
          const z2 = posArr[j * 3 + 2];

          const dx = x1 - x2;
          const dy = y1 - y2;
          const dz = z1 - z2;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < connectionThreshold && lineIndex < maxConnections) {
            const alpha = (1.0 - dist / connectionThreshold) * 0.7;

            const idx = lineIndex * 6;
            linePositions[idx] = x1;
            linePositions[idx + 1] = y1;
            linePositions[idx + 2] = z1;
            linePositions[idx + 3] = x2;
            linePositions[idx + 4] = y2;
            linePositions[idx + 5] = z2;

            lineColors[idx] = color1.r * alpha;
            lineColors[idx + 1] = color1.g * alpha;
            lineColors[idx + 2] = color1.b * alpha;
            lineColors[idx + 3] = color2.r * alpha;
            lineColors[idx + 4] = color2.g * alpha;
            lineColors[idx + 5] = color2.b * alpha;

            lineIndex++;
          }
        }
      }

      // Fill remaining vertices with zeros
      for (let i = lineIndex; i < maxConnections; i++) {
        const idx = i * 6;
        linePositions[idx] = 0;
        linePositions[idx + 1] = 0;
        linePositions[idx + 2] = 0;
        linePositions[idx + 3] = 0;
        linePositions[idx + 4] = 0;
        linePositions[idx + 5] = 0;

        lineColors[idx] = 0;
        lineColors[idx + 1] = 0;
        lineColors[idx + 2] = 0;
        lineColors[idx + 3] = 0;
        lineColors[idx + 4] = 0;
        lineColors[idx + 5] = 0;
      }

      lineGeometry.attributes.position.needsUpdate = true;
      lineGeometry.attributes.color.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      geometry.dispose();
      pointMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      
      // Dispose meshes
      meshes.forEach(item => {
        item.mesh.geometry.dispose();
      });
      sphereGeo.dispose();
      torusGeo.dispose();
      glassMaterial.dispose();
      chromeMaterial.dispose();
      clayMaterial.dispose();

      // Dispose code sprites
      tokenSprites.forEach(item => {
        item.sprite.material.map?.dispose();
        item.sprite.material.dispose();
      });
      
      renderer.dispose();
    };
  }, [theme]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-bg-main transition-colors duration-300">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
      
      {/* Background Radial Glow overlays */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] mix-blend-screen pointer-events-none transition-colors duration-300" />
      <div className="absolute top-[20%] right-[-5%] w-[40%] h-[60%] bg-secondary/5 rounded-full blur-[100px] mix-blend-screen pointer-events-none transition-colors duration-300" />
      <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] bg-accent-cyan/5 rounded-full blur-[110px] mix-blend-screen pointer-events-none transition-colors duration-300" />

      {/* Moving background grid */}
      <div 
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.04] transition-opacity duration-300" 
        style={{ 
          backgroundImage: `linear-gradient(var(--border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)`,
          backgroundSize: '70px 70px'
        }} 
      />
    </div>
  );
}
