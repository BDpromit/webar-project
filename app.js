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
        20
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
        ARButton.createButton(renderer, {
            requiredFeatures: ["hit-test"]
        })
    );

    const light = new THREE.HemisphereLight(
        0xffffff,
        0xbbbbff,
        2
    );

    scene.add(light);

    const loader = new GLTFLoader();

    loader.load(
        "assets/model.glb",
        (gltf) => {

            model = gltf.scene;

            model.visible = false;

            scene.add(model);
        }
    );

    renderer.setAnimationLoop(render);

    window.addEventListener(
        "resize",
        onWindowResize
    );
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

    if (model && !model.visible) {

        model.visible = true;

        model.position.set(
            0,
            0,
            -1
        );

        model.scale.set(
            0.25,
            0.25,
            0.25
        );
    }

    renderer.render(
        scene,
        camera
    );
}