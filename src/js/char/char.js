import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import {
    GUI
} from 'three/examples/jsm/libs/dat.gui.module.js';
import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js';

export default function char() {

    var container, stats, clock, gui, mixer, actions, activeAction, previousAction;
    var camera, controls, scene, renderer, model, face;
    var idle;

    var api = {
        state: 'Walking'
    };

    init();
    animate();

    function init() {

        container = document.getElementById('char');

        camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.set(4, 5, 18);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        controls = new OrbitControls(camera, container);

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xe0e0e0);
        scene.fog = new THREE.Fog(0xe0e0e0, 20, 100);

        clock = new THREE.Clock();


        // Add hemisphere light to scene
        let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
        hemiLight.position.set(0, 50, 0);
        scene.add(hemiLight);

        // Add directional Light to scene
        let d = 8.25;
        let dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
        dirLight.position.set(-8, 12, 8);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
        dirLight.shadow.camera.near = 0.1;
        dirLight.shadow.camera.far = 1500;
        dirLight.shadow.camera.left = d * -1;
        dirLight.shadow.camera.right = d;
        dirLight.shadow.camera.top = d;
        dirLight.shadow.camera.bottom = d * -1;
        scene.add(dirLight);

        // model
        var loader = new GLTFLoader();
        loader.load('img/char/phasma/scene3.gltf', function (gltf) {
        // loader.load('img/char/stacy.glb', function (gltf) {

            model = gltf.scene;
            model.scale.set(1.5, 1.5, 1.5);
            // model.position.y = -2.5;
            model.position.y = -6.5;
            // model.position.z = 11;

            model.traverse(o => {
                if (o.isCollection) {
                    console.log(o.name);
                }
                if (o.isMesh) {
                    o.castShadow = true;
                    o.receiveShadow = true;
                }
            });


            scene.add(model);

            // mixer = new THREE.AnimationMixer(model);


            // let fileAnimations = gltf.animations;
            // let idleAnim = THREE.AnimationClip.findByName(fileAnimations, 'city_idle');

            // idle = mixer.clipAction(idleAnim);
            // idle.play();

            createGUI(model, gltf.animations);



        }, undefined, function (e) {
            throw e;
        });

        renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.outputEncoding = THREE.sRGBEncoding;
        container.appendChild(renderer.domElement);

        window.addEventListener('resize', onWindowResize, false);

        // stats
        stats = new Stats();
        container.appendChild(stats.dom);


    }

    function createGUI(model, animations) {



        var states = ['city_action', 'city_idle'];
        // var emotes = ['Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp'];

        gui = new GUI();

        mixer = new THREE.AnimationMixer(model);

        actions = {};

        for (var i = 0; i < animations.length; i++) {

            var clip = animations[i];
            var action = mixer.clipAction(clip);
            actions[clip.name] = action;

            // if (emotes.indexOf(clip.name) >= 0 || states.indexOf(clip.name) >= 4) {

            //     action.clampWhenFinished = true;
            //     action.loop = THREE.LoopOnce;

            // }

        }

        // states

        var statesFolder = gui.addFolder('States');

        var clipCtrl = statesFolder.add(api, 'state').options(states);

        clipCtrl.onChange(function () {

            fadeToAction(api.state, 0.5);

        });

        statesFolder.open();

        // emotes

        // var emoteFolder = gui.addFolder('Emotes');

        // function createEmoteCallback(name) {

        //     api[name] = function() {

        //         fadeToAction(name, 0.2);

        //         mixer.addEventListener('finished', restoreState);

        //     };

        //     emoteFolder.add(api, name);

        // }

        function restoreState() {

            mixer.removeEventListener('finished', restoreState);

            fadeToAction(api.state, 0.2);

        }

        // for (var i = 0; i < emotes.length; i++) {

        //     createEmoteCallback(emotes[i]);

        // }

        // emoteFolder.open();

        // expressions

        // face = model.getObjectByName('Head_2');

        // var expressions = Object.keys(face.morphTargetDictionary);
        // var expressionFolder = gui.addFolder('Expressions');

        // for (var i = 0; i < expressions.length; i++) {

        //     expressionFolder.add(face.morphTargetInfluences, i, 0, 1, 0.01).name(expressions[i]);

        // }

        // activeAction = actions['city_idle'];
        // activeAction.play();

        // expressionFolder.open();

        const guiModel = gui.addFolder(`Model params`);
        guiModel.add(model.position, 'x', -100, 100).step(0.1).name('position x');
        guiModel.add(model.position, 'y', -100, 100).step(0.1).name('position y');
        guiModel.add(model.position, 'z', -100, 100).step(0.1).name('position z');
        guiModel.add(model.scale, 'x', 0.01, 10).step(0.01).name('scale z').onChange(function (val) {
            model.scale.set(val, val, val)
        });
        guiModel.open();

        const guiCameraCfg = gui.addFolder(`Camera params`);
        guiCameraCfg.add(camera.position, 'x', -100, 100).step(0.1).name('position x');
        guiCameraCfg.add(camera.position, 'y', -100, 100).step(0.1).name('position y');
        guiCameraCfg.add(camera.position, 'z', -100, 100).step(0.1).name('position z');
        guiCameraCfg.open();

    }

    function fadeToAction(name, duration) {

        previousAction = activeAction;
        activeAction = actions[name];

        if (previousAction !== activeAction) {

            previousAction.fadeOut(duration);

        }

        activeAction
            .reset()
            .setEffectiveTimeScale(1)
            .setEffectiveWeight(1)
            .fadeIn(duration)
            .play();

    }

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

    }

    //

    function animate() {

        var dt = clock.getDelta();

        if (mixer) mixer.update(dt);

        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);

        stats.update();

    }
}
