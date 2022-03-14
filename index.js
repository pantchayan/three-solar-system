import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js";

let sizes = { width: window.innerWidth, height: window.innerHeight };

const canvas = document.querySelector("canvas");

// TEXTURES
const textureLoader = new THREE.TextureLoader();

let milkywayTexture = textureLoader.load("./assets/solar-system/milky-way.jpg");
let sunTexture = textureLoader.load("./assets/solar-system/sun.jpg");
let mercuryTexture = textureLoader.load("./assets/solar-system/mercurymap.jpg");
let mercuryBumpsTexture = textureLoader.load(
  "./assets/solar-system/mercurybump.jpg"
);
let venusTexture = textureLoader.load("./assets/solar-system/venusmap.jpg");
let venusBumpsTexture = textureLoader.load(
  "./assets/solar-system/venusbump.jpg"
);
let earthTexture = textureLoader.load("./assets/solar-system/earthmap1k.jpg");
let earthBumpsTexture = textureLoader.load(
  "./assets/solar-system/earthbump.jpg"
);
let earthCloudTexture = textureLoader.load(
  "./assets/solar-system/earthCloud.png"
);
let moonTexture = textureLoader.load("./assets/solar-system/moonmap1k.jpg");
let moonBumpsTexture = textureLoader.load(
  "./assets/solar-system/moonbump1k.jpg"
);
let marsTexture = textureLoader.load("./assets/solar-system/mars_1k_color.jpg");
let marsBumpsTexture = textureLoader.load(
  "./assets/solar-system/marsbump1k.jpg"
);
let jupiterTexture = textureLoader.load("./assets/solar-system/jupitermap.jpg");
let saturnTexture = textureLoader.load("./assets/solar-system/saturnmap.jpg");
let saturnRingTexture = textureLoader.load(
  "./assets/solar-system/saturnringcolor.jpg"
);
let uranusTexture = textureLoader.load("./assets/solar-system/uranus.jpg");
let neptuneTexture = textureLoader.load("./assets/solar-system/neptune.jpg");
let particlesTexture = textureLoader.load("/assets/particles/star_01.png");

let cubeTextureLoader = new THREE.CubeTextureLoader();
let milkywayCubeMap = cubeTextureLoader.load([
  './assets/solar-system/milkyway-cubemap/px.png',
  './assets/solar-system/milkyway-cubemap/nx.png',
  './assets/solar-system/milkyway-cubemap/py.png',
  './assets/solar-system/milkyway-cubemap/ny.png',
  './assets/solar-system/milkyway-cubemap/pz.png',
  './assets/solar-system/milkyway-cubemap/nz.png',
])


// DATA FOR PLANETS
let planetsData = [
  { name: "Sun", radius: 5, texture: sunTexture },
  {
    name: "Mercury",
    radius: 0.5,
    texture: mercuryTexture,
    bumpTexture: mercuryBumpsTexture,
  },
  {
    name: "Venus",
    radius: 0.5,
    texture: venusTexture,
    bumpTexture: venusBumpsTexture,
  },
  {
    name: "Earth",
    radius: 0.8,
    texture: earthTexture,
    bumpTexture: earthBumpsTexture,
  },
  {
    name: "Mars",
    radius: 0.8,
    texture: marsTexture,

    bumpTexture: marsBumpsTexture,
  },
  {
    name: "Jupiter",
    radius: 1.5,
    texture: jupiterTexture,
  },
  {
    name: "Saturn",
    radius: 1,
    texture: saturnTexture,
  },
  {
    name: "Uranus",
    radius: 1,
    texture: uranusTexture,
  },
  {
    name: "Neptune",
    radius: 1,
    texture: neptuneTexture,
  },
];

// RENDERER
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);

window.addEventListener("resize", () => {
  sizes.height = window.innerHeight;
  sizes.width = window.innerWidth;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);

  renderer.render(scene, camera);
});

// SCENE

let scene = new THREE.Scene();

scene.background = milkywayTexture; // milkywayCubeMap

scene.add(new THREE.GridHelper(100, 100, 0x888888, 0x444444));

// PLANETS AND SUN

let planetsMesh = [];
let nextCenter = 0;
let gap = 0;
planetsData.map((planet) => {
  let planetGeometry = new THREE.SphereBufferGeometry(planet.radius, 100, 100);

  let planetMaterial =
    planet.name === "Sun"
      ? new THREE.MeshBasicMaterial({
          map: planet.texture,
          side: THREE.DoubleSide,
        })
      : new THREE.MeshStandardMaterial({
          map: planet.texture,
        });

  planetMaterial.bumpMap = planet.bumpTexture;
  planetMaterial.bumpScale = 0.01;
  planetMaterial.roughness = 1;
  planetMaterial.metalness = 0;
  let planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
  let currCenter = nextCenter;
  gap = planet.name !== "Sun" ? planet.radius * 5 : 10;

  planetsMesh.push(planetMesh);
  planetMesh.position.x = currCenter;
  planetMesh.rotation.x = 0.2;
  planetMesh.name = planet.name;

  planetMesh.castShadow = true;
  planetMesh.receiveShadow = true;
  // if (planet.name === "Sun") {
  //   planetMesh.layers.set(1);
  // }
  scene.add(planetMesh);

  nextCenter = currCenter - (1 / 2) * planet.radius - gap;
  if (planet.name === "Mars") nextCenter -= 2;
});

// SATURN RING
let makeSaturnRing = () => {
  const saturnRingGeometry = new THREE.RingBufferGeometry(1.8, 1.3, 64);

  // var pos = saturnRingGeometry.attributes.position;
  // var v3 = new THREE.Vector3();
  // console.log(saturnRingGeometry.attributes)
  // for (let i = 0; i < pos.count; i++){
  //   v3.fromBufferAttribute(pos, i);
  //   saturnRingGeometry.attributes.uv.setXY(i, v3.length() < 4 ? 0 : 1, 1);
  // }

  const saturnRingMaterial = new THREE.MeshStandardMaterial({
    map: saturnRingTexture,
    // color: 0xffffff,
    side: THREE.DoubleSide,
    transparent: true,
    // wireframe:true
  });

  const saturnRing = new THREE.Mesh(saturnRingGeometry, saturnRingMaterial);
  saturnRing.position.set(planetsMesh[6].position.x, 0, 0);
  saturnRing.rotation.x = Math.PI / 2 + 0.5;
  saturnRing.castShadow = true;
  saturnRing.receiveShadow = true;

  return saturnRing;
};

// MOON
let makeMoon = () => {
  let moonGeometry = new THREE.SphereGeometry(0.1, 100, 100);
  let moonMaterial = new THREE.MeshStandardMaterial({
    map: moonTexture,
  });
  moonMaterial.bumpMap = moonBumpsTexture;
  moonMaterial.bumpScale = 0.01;

  let moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
  moonMesh.position.x = planetsMesh[3].position.x - 1;
  moonMesh.position.y = 0.5;
  return moonMesh;
};

// EARTH CLOUD
let makeEarthClouds = () => {
  let earthCloudGeometry = new THREE.SphereBufferGeometry(0.81, 100, 100);
  let earthCloudMaterial = new THREE.MeshStandardMaterial({
    map: earthCloudTexture,
    transparent: true,
  });

  let earthCloudMesh = new THREE.Mesh(earthCloudGeometry, earthCloudMaterial);
  earthCloudMesh.position.x = planetsMesh[3].position.x;
  earthCloudMesh.castShadow = true;
  return earthCloudMesh;
};

// Making Stars
let makeStars = () => {
  // PARTICLES

  let particleGeometry = new THREE.SphereBufferGeometry(70, 32, 63);

  let particleMaterial = new THREE.PointsMaterial();
  particleMaterial.size = 1;
  particleMaterial.sizeAttenuation = true;
  particleMaterial.transparent = true;
  particleMaterial.alphaMap = particlesTexture;
  particleMaterial.depthWrite = false;

  let particles = new THREE.Points(particleGeometry, particleMaterial);

  return particles;
};

let moonMesh = makeMoon();
scene.add(moonMesh);

let saturnRing = makeSaturnRing();
scene.add(saturnRing);

let earthCloudMesh = makeEarthClouds();
scene.add(earthCloudMesh);

// let stars = makeStars();
// scene.add(stars);

// CAMERA
let camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.01,
  100
);
camera.position.x = -18; // -7
camera.position.z = 4;
camera.rotation.order = "YXZ";

// LIGHT

let directionalLight = new THREE.DirectionalLight("#ffffff", 1.1);

directionalLight.position.x = 4;

scene.add(directionalLight);

let ambientLight = new THREE.AmbientLight("#ffffff", 0.3);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(-10, 0, 0);
scene.add(spotLight);

let directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  10
);
scene.add(directionalLightHelper);
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

// DAT GUI
let gui = new dat.GUI({ width: 400 });
const cameraFolder = gui.addFolder("Camera");
const cameraPositionFolder = cameraFolder.addFolder("Camera position");
cameraPositionFolder.add(camera.position, "z", -100, 100);
cameraPositionFolder.add(camera.position, "y", -100, 100);
cameraPositionFolder.add(camera.position, "x", -100, 100);
const cameraRotationFolder = cameraFolder.addFolder("Camera rotation");
cameraRotationFolder.add(camera.rotation, "z", -6.28, 6.28);
cameraRotationFolder.add(camera.rotation, "y", -6.28, 6.28);
cameraRotationFolder.add(camera.rotation, "x", -6.28, 6.28);
cameraFolder.open();

// AXIS HELPER
let axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

renderer.render(scene, camera);

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster();
let currentIntersect = null;
const rayOrigin = new THREE.Vector3(-3, 0, 0);
const rayDirection = new THREE.Vector3(10, 0, 0);
rayDirection.normalize();

/**
 * Mouse
 */
const mouse = new THREE.Vector2();

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -(event.clientY / sizes.height) * 2 + 1;
});

window.addEventListener("click", () => {
  if (currentIntersect) {
    console.log(currentIntersect.object.name);
    gsap.to(currentIntersect.object.scale, {
      delay: 0.1,
      duration: 1,
      x: 0.8,
      y: 0.8,
      z: 0.8,
    });
    gsap.to(currentIntersect.object.rotation, {
      delay: 0.1,
      duration: 1,
      y: currentIntersect.object.rotation.y + 6.28,
    });

    if (currentIntersect.object.name === "Earth") {
      gsap.to(earthCloudMesh.scale, {
        delay: 0.1,
        duration: 1,
        x: 0.8,
        y: 0.8,
        z: 0.8,
      });
      gsap.to(earthCloudMesh.rotation, {
        delay: 0.1,
        duration: 1,
        y: earthCloudMesh.rotation.y + 5,
      });
    }

    if (currentIntersect.object.name === "Saturn") {
      gsap.to(saturnRing.scale, {
        delay: 0.1,
        duration: 1,
        x: 0.8,
        y: 0.8,
        z: 0.8,
      });
      gsap.to(saturnRing.rotation, {
        delay: 0.1,
        duration: 1,
        z: saturnRing.rotation.z + 6.28,
      });
    }
  }
});

// raycaster.set(rayOrigin, rayDirection)

// let controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;
// controls.dampingFactor = 0.5;
// ANIMATION
let prevTime = Date.now();
let animate = () => {
  let currTime = Date.now();
  let deltaTime = currTime - prevTime;
  planetsMesh.map((planet, idx) => {
    if (planetsData[idx].name !== "Sun")
      if (
        currentIntersect === null ||
        currentIntersect.object.name !== planetsData[idx].name
      )
        planet.rotation.y = deltaTime * 0.0001 * Math.PI;
  });

  if (currentIntersect === null || currentIntersect.object.name !== "Earth") {
    earthCloudMesh.rotation.y = deltaTime * 0.00007 * Math.PI;
  }
  moonMesh.rotation.y = deltaTime * 0.0001 * Math.PI;
  saturnRing.rotation.z = deltaTime * 0.0001 * Math.PI;

  // Cast a fixed ray
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(planetsMesh);

  if (intersects.length) {
    if (!currentIntersect) {
      document.getElementById(
        "hover-name"
      ).innerHTML = `<h1>${intersects[0].object.name}</h1>`;
      // console.log(document.getElementById("hover-name"));
      // console.log("mouse enter @ ", intersects[0]);
      if (intersects[0].object.name !== "Sun") {
        gsap.to(intersects[0].object.scale, {
          duration: 0.7,
          x: 1.25,
          y: 1.25,
          z: 1.25,
        });
        // intersects[0].object.scale.set(1.25, 1.25, 1.25);
      }
      if (intersects[0].object.name === "Saturn") {
        gsap.to(saturnRing.scale, {
          duration: 0.7,
          x: 1.25,
          y: 1.25,
          z: 1.25,
        });
        // console.log("HERE");
      }

      if (intersects[0].object.name === "Earth")
        gsap.to(earthCloudMesh.scale, {
          duration: 0.7,
          x: 1.25,
          y: 1.25,
          z: 1.25,
        });
    }

    currentIntersect = intersects[0];
  } else {
    if (currentIntersect) {
      // console.log("mouse leave");

      gsap.to(currentIntersect.object.scale, {
        duration: 0.5,
        x: 1,
        y: 1,
        z: 1,
      });

      if (currentIntersect.object.name === "Saturn")
        gsap.to(saturnRing.scale, {
          duration: 0.5,
          x: 1,
          y: 1,
          z: 1,
        });

      if (currentIntersect.object.name === "Earth")
        gsap.to(earthCloudMesh.scale, {
          duration: 0.5,
          x: 1,
          y: 1,
          z: 1,
        });
    }

    document.getElementById("hover-name").innerHTML = `<h1></h1>`;
    currentIntersect = null;
  }

  renderer.render(scene, camera);
  // controls.update();
  requestAnimationFrame(animate);
};

animate();

document.addEventListener("mousewheel", (e) => {
  camera.position.x -= e.deltaY * 0.004;
  // prevent scrolling beyond a min/max value
  camera.position.clampScalar(mode == 1 ? -50 : -70, 10);
});

document.addEventListener("touchmove", (e) => {
  console.log("touched");
  document.dispatchEvent("mousewheel");
});

/**
 * Fullscreen
 */
window.addEventListener("dblclick", () => {
  const fullscreenElement =
    document.fullscreenElement || document.webkitFullscreenElement;

  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
});

let mode = 1;
document.getElementById("switch").addEventListener("click", () => {
  if (mode == 0) {
    // camera.lookAt(planetsMesh[0].position);
    gsap.to(camera.position, {
      duration: 1,
      x: -7,
    });
    gsap.to(camera.position, {
      delay: 1,
      duration: 1,
      y: 0,
      z: 4,
    });
    gsap.to(camera.rotation, {
      delay: 1,
      duration: 1,
      x: 0,
      y: 0,
      z: 0,
    });
    mode = (mode + 1) % 4;
  } else if (mode == 1) {
    // camera.lookAt(planetsMesh[0].position);
    gsap.to(camera.rotation, {
      duration: 1,
      x: 0,
      y: -80 * 0.0174,
      z: 0,
    });
    gsap.to(camera.position, {
      delay: 1,
      duration: 1,
      x: -60,
      y: 0,
      z: 4,
    });
    mode = (mode + 1) % 4;
  } else if (mode == 2) {
    // camera.lookAt(planetsMesh[0].position);
    gsap.to(camera.rotation, {
      duration: 1,
      x: 0,
      y: (-1 * Math.PI) / 2,
      z: 0,
    });
    gsap.to(camera.position, {
      duration: 1,
      x: -60,
      y: 4,
      z: 0,
    });
    gsap.to(camera.rotation, {
      delay: 1,
      duration: 1,
      x: -0.35,
    });

    mode = (mode + 1) % 4;
  } else if (mode == 3) {
    // camera.lookAt(planetsMesh[0].position);
    gsap.to(camera.position, {
      duration: 1,
      x: -7,
    });
    gsap.to(camera.position, {
      delay: 1,
      duration: 1,
      y: 3,
    });
    gsap.to(camera.rotation, {
      delay: 1,
      duration: 1,
      y: Math.PI / 2,
    });
    mode = (mode + 1) % 4;
  }
  console.log("Clicked");
});
