import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "stats";

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color("#547b96");
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	400
);
camera.position.set(-3.2362340612792586, 6.493751930584557, -3.698656502797237);
const controls = new OrbitControls(camera, renderer.domElement);

const backgroundTex = new THREE.CubeTextureLoader()
	.setPath("./public/assets/textures/cubemaps/")
	.load([
		"skybox_6.png",
		"skybox_4.png",
		"skybox_2.png",
		"skybox_1.png",
		"skybox_5.png",
		"skybox_3.png",
	]);
backgroundTex.magFilter = THREE.NearestFilter;
scene.background = backgroundTex;

const stats = Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

const cursor = document.createElement("div");
cursor.id = "custom-cursor";
document.body.appendChild(cursor);

const blocks = {
	GRASS: 1,
	DIRT: 2,
	OAK_LOG: 3,
	OAK_PLANKS: 4,
	OAK_LEAVES: 5,
	GLASS: 6,
	BEDROCK: 7,
	COBBLE: 8,
	STONE: 9,
	SAND: 10,
	GRAVEL: 11,
};

const texLoader = new THREE.TextureLoader();

const BLOCK_TEXTURES = {
	[blocks.GRASS]: {
		sides: texLoader.load(
			"./public/assets/textures/flourish/grass_block_side.png"
		),
		top: texLoader.load(
			"./public/assets/textures/flourish/grass_block_top.png"
		),
		bottom: texLoader.load("./public/assets/textures/flourish/dirt.png"),
	},
	[blocks.DIRT]: {
		sides: texLoader.load("./public/assets/textures/flourish/dirt.png"),
		top: texLoader.load("./public/assets/textures/flourish/dirt.png"),
		bottom: texLoader.load("./public/assets/textures/flourish/dirt.png"),
	},
	[blocks.OAK_LOG]: {
		sides: texLoader.load("./public/assets/textures/flourish/oak_log.png"),
		top: texLoader.load("./public/assets/textures/flourish/oak_log_top.png"),
		bottom: texLoader.load("./public/assets/textures/flourish/oak_log.png"),
	},
	[blocks.OAK_PLANKS]: {
		sides: texLoader.load("./public/assets/textures/flourish/oak_planks.png"),
		top: texLoader.load("./public/assets/textures/flourish/oak_planks.png"),
		bottom: texLoader.load("./public/assets/textures/flourish/oak_planks.png"),
	},
	[blocks.OAK_LEAVES]: {
		sides: texLoader.load("./public/assets/textures/flourish/oak_leaves.png"),
		top: texLoader.load("./public/assets/textures/flourish/oak_leaves.png"),
		bottom: texLoader.load("./public/assets/textures/flourish/oak_leaves.png"),
	},
	[blocks.GLASS]: {
		sides: texLoader.load("./public/assets/textures/flourish/glass.png"),
		top: texLoader.load("./public/assets/textures/flourish/glass.png"),
		bottom: texLoader.load("./public/assets/textures/flourish/glass.png"),
	},
	[blocks.BEDROCK]: {
		sides: texLoader.load("./public/assets/textures/flourish/bedrock.png"),
		top: texLoader.load("./public/assets/textures/flourish/bedrock.png"),
		bottom: texLoader.load("./public/assets/textures/flourish/bedrock.png"),
	},
	[blocks.COBBLE]: {
		sides: texLoader.load("./public/assets/textures/flourish/cobblestone.png"),
		top: texLoader.load("./public/assets/textures/flourish/cobblestone.png"),
		bottom: texLoader.load("./public/assets/textures/flourish/cobblestone.png"),
	},
	[blocks.STONE]: {
		sides: texLoader.load("./public/assets/textures/flourish/stone.png"),
		top: texLoader.load("./public/assets/textures/flourish/stone.png"),
		bottom: texLoader.load("./public/assets/textures/flourish/stone.png"),
	},
	[blocks.SAND]: {
		sides: texLoader.load("./public/assets/textures/flourish/sand.png"),
		top: texLoader.load("./public/assets/textures/flourish/sand.png"),
		bottom: texLoader.load("./public/assets/textures/flourish/sand.png"),
	},
	[blocks.GRAVEL]: {
		sides: texLoader.load("./public/assets/textures/flourish/gravel.png"),
		top: texLoader.load("./public/assets/textures/flourish/gravel.png"),
		bottom: texLoader.load("./public/assets/textures/flourish/gravel.png"),
	},
};
Object.values(BLOCK_TEXTURES).forEach((block) => {
	Object.values(block).forEach((texture) => {
		texture.colorSpace = THREE.SRGBColorSpace;
		texture.magFilter = THREE.NearestFilter;
		texture.minFilter = THREE.NearestFilter;
	});
});

const globalState = {
	selectedBlock: blocks.GRASS,
	tool: 0,
};

const getMaterialArray = () => {
	const blockTextures =
		BLOCK_TEXTURES[globalState.selectedBlock] || BLOCK_TEXTURES[blocks.GRASS];
	const wireframe = false;
	const materials = [
		new THREE.MeshStandardMaterial({
			map: blockTextures.sides,
			side: THREE.FrontSide,
			wireframe: wireframe,
		}), // Right face
		new THREE.MeshStandardMaterial({
			map: blockTextures.sides,
			side: THREE.FrontSide,
			wireframe: wireframe,
		}), // Left face
		new THREE.MeshStandardMaterial({
			map: blockTextures.top,
			side: THREE.FrontSide,
			wireframe: wireframe,
		}), // Top face
		new THREE.MeshStandardMaterial({
			map: blockTextures.bottom,
			side: THREE.FrontSide,
			wireframe: wireframe,
		}), // Bottom face
		new THREE.MeshStandardMaterial({
			map: blockTextures.sides,
			side: THREE.FrontSide,
			wireframe: wireframe,
		}), // Front face
		new THREE.MeshStandardMaterial({
			map: blockTextures.sides,
			side: THREE.FrontSide,
			wireframe: wireframe,
		}), // Back face
	];
	if (
		globalState.selectedBlock == blocks.GLASS ||
		globalState.selectedBlock == blocks.OAK_LEAVES
	) {
		materials.forEach((material) => {
			material.transparent = true;
			// material.depthWrite = false;
			material.side = THREE.DoubleSide;
		});
	}
	if (globalState.selectedBlock == blocks.GRASS) {
		materials[2].color.set("#00ff00");
	}
	if (globalState.selectedBlock == blocks.OAK_LEAVES) {
		materials.forEach((material) => {
			material.color.set("#00ff00");
		});
	}
	return materials;
};

const createCube = (position) => {
	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const materials = getMaterialArray();
	const cube = new THREE.Mesh(geometry, materials);
	cube.position.set(position.x, position.y, position.z);
	scene.add(cube);
};

const removeObject = (object) => {
	scene.remove(object); // Remove from scene
	object.geometry.dispose(); // Dispose of geometry to free memory
	object.material.forEach((mat) => mat.dispose()); // Dispose of each material
};

const add2Vec3 = (first, second) => {
	return {
		x: first.x + second.x,
		y: first.y + second.y,
		z: first.z + second.z,
	};
};

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

// 10x10 ground plane
for (let x = 0; x < 10; x++) {
	for (let z = 0; z < 10; z++) {
		createCube({ x: x, y: 0, z: z });
	}
}

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

const LEFT_MB = 0;
const MIDDLE_MB = 1;
const RIGHT_MB = 2;

document.addEventListener("keydown", (event) => {
	const selection = document.querySelector(".selection");
	const toolSelection = document.querySelector(".toolSelection");
	if (event.key == "q") {
		globalState.tool = 0;
		toolSelection.style.left = 0 * 54 + "px";
		cursor.style.background = "url('./public/assets/cursors/hammer.png')";
		cursor.style.backgroundRepeat = "no-repeat";
		cursor.style.backgroundPosition = "center";
		cursor.style.backgroundSize = "cover";
	} else if (event.key == "e") {
		globalState.tool = 1;
		toolSelection.style.left = 1 * 54 + "px";
		cursor.style.background = "url('./public/assets/cursors/shovel.png')";
		cursor.style.backgroundRepeat = "no-repeat";
		cursor.style.backgroundPosition = "center";
		cursor.style.backgroundSize = "cover";
	} else if (event.key == 1) {
		globalState.selectedBlock = blocks.GRASS;
		selection.style.left = 2 * 54 + "px";
	} else if (event.key == 2) {
		globalState.selectedBlock = blocks.DIRT;
		selection.style.left = 3 * 54 + "px";
	} else if (event.key == 3) {
		globalState.selectedBlock = blocks.OAK_LOG;
		selection.style.left = 4 * 54 + "px";
	} else if (event.key == 4) {
		globalState.selectedBlock = blocks.OAK_PLANKS;
		selection.style.left = 5 * 54 + "px";
	} else if (event.key == 5) {
		globalState.selectedBlock = blocks.OAK_LEAVES;
		selection.style.left = 6 * 54 + "px";
	} else if (event.key == 6) {
		globalState.selectedBlock = blocks.GLASS;
		selection.style.left = 7 * 54 + "px";
	} else if (event.key == 7) {
		globalState.selectedBlock = blocks.BEDROCK;
		selection.style.left = 8 * 54 + "px";
	} else if (event.key == 8) {
		globalState.selectedBlock = blocks.COBBLE;
		selection.style.left = 9 * 54 + "px";
	} else if (event.key == 9) {
		globalState.selectedBlock = blocks.STONE;
		selection.style.left = 10 * 54 + "px";
	} else if (event.key == "[") {
		globalState.selectedBlock = blocks.SAND;
		selection.style.left = 11 * 54 + "px";
	} else if (event.key == "]") {
		globalState.selectedBlock = blocks.GRAVEL;
		selection.style.left = 12 * 54 + "px";
	}
});

document.addEventListener("mousedown", (event) => {
	if (globalState.tool == 0 && event.button == LEFT_MB) {
		// normalize mouse cursor between -1 and 1
		pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
		pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

		raycaster.setFromCamera(pointer, camera);
		const intersects = raycaster.intersectObjects(scene.children);

		if (intersects.length > 0) {
			const newPos = add2Vec3(
				intersects[0].object.position,
				intersects[0].normal
			);
			createCube(newPos);
		}
	} else if (globalState.tool == 1 && event.button == LEFT_MB) {
		// normalize mouse cursor between -1 and 1
		pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
		pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

		raycaster.setFromCamera(pointer, camera);
		const intersects = raycaster.intersectObjects(scene.children);

		if (intersects.length > 0) {
			const selectedObject = intersects[0].object;
			removeObject(selectedObject);
		}
	}
});

document.querySelectorAll(".inventoryItem").forEach((slot) => {
	slot.addEventListener("click", (event) => {
		const selection = document.querySelector(".selection");
		const toolSelection = document.querySelector(".toolSelection");
		const element = event.currentTarget;
		const value = element.getAttribute("data-value");

		if (value == 0 || value == 1) {
			globalState.tool = value;
			toolSelection.style.left = value * 54 + "px";
			if (globalState.tool == 0) {
				cursor.style.background = "url('./public/assets/cursors/hammer.png')";
				cursor.style.backgroundRepeat = "no-repeat";
				cursor.style.backgroundPosition = "center";
				cursor.style.backgroundSize = "cover";
			} else if (globalState.tool == 1) {
				cursor.style.background = "url('./public/assets/cursors/shovel.png')";
				cursor.style.backgroundRepeat = "no-repeat";
				cursor.style.backgroundPosition = "center";
				cursor.style.backgroundSize = "cover";
			}
		} else {
			globalState.selectedBlock = blocks[value];
			selection.style.left = (blocks[value] + 1) * 54 + "px";
		}
	});
});

window.addEventListener("resize", (event) => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
});

document.addEventListener("mousemove", (e) => {
	cursor.style.left = `${e.clientX}px`;
	cursor.style.top = `${e.clientY}px`;
});

const update = () => {
	renderer.setAnimationLoop(update);
	renderer.render(scene, camera);
	stats.update();
};

update();
