import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ----------------------------------------------------
// Scene
// ----------------------------------------------------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

// ----------------------------------------------------
// Camera
// ----------------------------------------------------
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(20, 15, 20);

// ----------------------------------------------------
// Renderer
// ----------------------------------------------------
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);

// ----------------------------------------------------
// Orbit Controls
// Allows Zoom, Pan, Orbit (Tilt/Rotate)
// ----------------------------------------------------
const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.enableDamping = true;
controls.dampingFactor = 0.05;

// ----------------------------------------------------
// Ground Plane
// ----------------------------------------------------
const groundGeometry = new THREE.PlaneGeometry(100, 100);

const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x66aa66
});

const ground = new THREE.Mesh(
    groundGeometry,
    groundMaterial
);

ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;

scene.add(ground);

// ----------------------------------------------------
// Texture
// ----------------------------------------------------

const loader = new THREE.TextureLoader();
/* function loadTiledTexture(url, repeatX, repeatY) {
    const tex = loader.load(url);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeatX, repeatY);
    return tex;
}
*/
const wallAO = loader.load("https://dl.polyhaven.org/file/ph-assets/Textures/png/4k/plastered_wall_04/plastered_wall_04_ao_4k.png");
const wallColor = loader.load("https://dl.polyhaven.org/file/ph-assets/Textures/png/4k/plastered_wall_04/plastered_wall_04_diff_4k.png");
const wallNormal = loader.load("https://dl.polyhaven.org/file/ph-assets/Textures/png/4k/plastered_wall_04/plastered_wall_04_nor_gl_4k.png");
const wallRough = loader.load("https://dl.polyhaven.org/file/ph-assets/Textures/png/4k/plastered_wall_04/plastered_wall_04_rough_4k.png");
wallColor.colorSpace = THREE.SRGBColorSpace;

const floorAO = loader.load("https://dl.polyhaven.org/file/ph-assets/Textures/png/4k/plank_flooring/plank_flooring_ao_4k.png");
const floorColor = loader.load("https://dl.polyhaven.org/file/ph-assets/Textures/png/4k/plank_flooring/plank_flooring_diff_4k.png");
const floorRough = loader.load("https://dl.polyhaven.org/file/ph-assets/Textures/png/4k/plank_flooring/plank_flooring_rough_4k.png");
floorColor.colorSpace = THREE.SRGBColorSpace;

// ----------------------------------------------------
// Geometry
// ----------------------------------------------------

// Walls
function createWall(x, y, z, w, h, d) {

    const wallMaterial = new THREE.MeshStandardMaterial({
        aoMap: wallAO,
        map: wallColor,
        normalMap: wallNormal,
        roughnessMap: wallRough
    });

    const geometry = new THREE.BoxGeometry(w, h, d);
    geometry.setAttribute('uv2', geometry.attributes.uv);

	const wall = new THREE.Mesh(geometry, wallMaterial);


	wall.position.set(x, y, z);
	wall.receiveShadow = true;

	scene.add(wall);
}
    createWall(-9.5, 4, -12, 5, 8, 0.5);
    createWall(9.5, 4, -12, 5, 8, 0.5);
    createWall(0, 2.25, -12, 14, 4.5, 0.5);
    createWall(0, 7.45, -12, 14, 1.1, 0.5);
    createWall(-12, 4, 0, 0.5, 8, 24);
    createWall(12, 4, 0, 0.5, 8, 24);

//Floor
    const floorGeometry = new THREE.PlaneGeometry(24, 24);
    floorGeometry.setAttribute('uv2', floorGeometry.attributes.uv);

    const floor = new THREE.Mesh(
        floorGeometry,
        new THREE.MeshStandardMaterial({
		    aoMap: floorAO,
		    map: floorColor,
            roughnessMap: floorRough
	    })
    );

    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0.01;
    floor.receiveShadow = true;

    scene.add(floor);

//Window


// ----------------------------------------------------
// Ambient Light
// ----------------------------------------------------
const ambientLight = new THREE.AmbientLight(
    0xffffff,
    1
);

scene.add(ambientLight);

// ----------------------------------------------------
// Directional Light
// ----------------------------------------------------
const directionalLight = new THREE.DirectionalLight(
    0xffffff,
    2
);

directionalLight.position.set(20, 30, 10);
directionalLight.castShadow = true;

scene.add(directionalLight);

// ----------------------------------------------------
// Toggle Lights
// ----------------------------------------------------
let lightsOn = true;

document
    .getElementById("toggleButton")
    .addEventListener("click", () => {

        lightsOn = !lightsOn;

        ambientLight.visible = lightsOn;
        directionalLight.visible = lightsOn;
    });

// ----------------------------------------------------
// Window Resize
// ----------------------------------------------------
window.addEventListener("resize", () => {

    camera.aspect =
        window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
});
// ----------------------------------------------------
// Animate
// ----------------------------------------------------

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();