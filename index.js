import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js";

let sizes = { width: window.innerWidth, height: window.innerHeight };

const canvas = document.querySelector("canvas");

// TEXTURES
const textureLoader = new THREE.TextureLoader();

let milkywayTexture = textureLoader.load("./assets/milky-way.jpg");
let sunTexture = textureLoader.load("./assets/sun.jpg");
let mercuryTexture = textureLoader.load("./assets/mercury.jpg");
let venusTexture = textureLoader.load("./assets/venus.jpg");
let earthTexture = textureLoader.load("./assets/earth-day.jpg");
let earthNormal = textureLoader.load("./assets/earth-normal.tif");
let moonTexture = textureLoader.load("./assets/moon.jpg");
let marsTexture = textureLoader.load("./assets/mars.jpg");
let jupiterTexture = textureLoader.load("./assets/jupiter.jpg");
let saturnTexture = textureLoader.load("./assets/saturn.jpg");
let saturnRingTexture = textureLoader.load("./assets/saturn-ring.png");
let uranusTexture = textureLoader.load("./assets/uranus.jpg");
let neptuneTexture = textureLoader.load("./assets/neptune.jpg");

let x = -1.5;
let planetsData = [
  { name: "Sun", radius: 5, x: 6, y: 0, z: 0, texture: sunTexture },
  {
    name: "Mercury",
    radius: 0.5,
    x: -1.5,
    y: 0,
    z: 0,
    texture: mercuryTexture,
  },
  { name: "Venus", radius: 0.5, x: -3, y: 0, z: 0, texture: venusTexture },
  { name: "Earth", radius: 0.8, x: -4.8, y: 0, z: 0, texture: earthTexture },
  { name: "Mars", radius: 0.8, x: -7, y: 0, z: 0, texture: marsTexture },
  {
    name: "Jupiter",
    radius: 1.5,
    x: -10.5,
    y: 0,
    z: 0,
    texture: jupiterTexture,
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

let planetsMesh = [];

planetsData.map((planet) => {
  let planetGeometry = new THREE.SphereGeometry(planet.radius, 100, 100);
  let planetMaterial = new THREE.MeshStandardMaterial({ map: planet.texture });

  let planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);

  planetsMesh.push(planetMesh);
  planetMesh.position.x = planet.x;
  scene.add(planetMesh);
});

// CAMERA
let camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.01,
  100
);
camera.position.x = -10;
camera.position.z = 20;

camera.lookAt(planetsMesh[4]);

// LIGHT

let directionalLight = new THREE.DirectionalLight("#ffffff", 2);

directionalLight.position.x = 6;
scene.add(directionalLight);

let ambientLight = new THREE.AmbientLight("#ffffff", 1);
scene.add(ambientLight);

// DAT GUI
let gui = new dat.GUI({ width: 400 });
const cameraFolder = gui.addFolder("Camera");
cameraFolder.add(camera.position, "z", -100, 100);
cameraFolder.add(camera.position, "y", -100, 100);
cameraFolder.add(camera.position, "x", -100, 100);
cameraFolder.open();

// AXIS HELPER
let axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

renderer.render(scene, camera);

let controls = new OrbitControls(camera, renderer.domElement);

let prevTime = Date.now();
let animate = () => {
  let currTime = Date.now();
  let deltaTime = currTime - prevTime;
  planetsMesh.map((planet) => {
    planet.rotation.y = deltaTime * 0.0001 * Math.PI;
  });
  renderer.render(scene, camera);
  controls.update();
  requestAnimationFrame(animate);
};

animate();
