import * as THREE from "three";

import { ARButton } from "https://unpkg.com/three@0.160.0/examples/jsm/webxr/ARButton.js";

import { GLTFLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

console.log("APP LOADED");

let camera;
let scene;
let renderer;
let model;

init();

function init() {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.01,
        100
    );

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.xr.enabled = true;

    document.body.appendChild(renderer.domElement);

    document.body.appendChild(
        ARButton.createButton(renderer)
    );

    // Lights
    const hemiLight = new THREE.HemisphereLight(
        0xffffff,
        0x444444,
        3
    );

    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(
        0xffffff,
        2
    );

    dirLight.position.set(5, 10, 7);

    scene.add(dirLight);

    console.log("Creating GLTF loader");

    const loader = new GLTFLoader();

    console.log("Trying to load model...");

    loader.load(
        "assets/model.glb",

        function (gltf) {

            console.log("MODEL LOADED");

            model = gltf.scene;

            const box = new THREE.Box3()
                .setFromObject(model);

            const size = box.getSize(
                new THREE.Vector3()
            );

            const center = box.getCenter(
                new THREE.Vector3()
            );

            console.log("MODEL SIZE:", size);

            // Center model
            model.position.x -= center.x;
            model.position.y -= center.y;
            model.position.z -= center.z;

            // Put it in front of camera
            model.position.z -= 2;

            // Initial scale
            model.scale.set(
                1,
                1,
                1
            );

            scene.add(model);

            console.log("MODEL ADDED TO SCENE");
        },

        function (xhr) {

            if (xhr.total > 0) {

                console.log(
                    "Loading " +
                    (
                        xhr.loaded /
                        xhr.total *
                        100
                    ).toFixed(1) +
                    "%"
                );

            }

        },

        function (error) {

            console.error(
                "MODEL ERROR:",
                error
            );

        }
    );

    window.addEventListener(
        "resize",
        onWindowResize
    );

    renderer.setAnimationLoop(render);
}

function onWindowResize() {

    camera.aspect =
        window.innerWidth /
        window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
}

function render() {

    if (model) {

        model.rotation.y += 0.005;

    }

    renderer.render(
        scene,
        camera
    );
}
