// Here should be all vars

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
var controls;
var webGLRenderer;
var spotLight;
//var constructionLength = 50;

var BridgeLine;
function init() {

    var stats = initStats();
    var config = getConfig();
    initGui();
    // create a scene, that will hold all our elements such as objects, cameras and lights.
    var scene = new THREE.Scene();

    var axisHelper = new THREE.AxisHelper(110);
    scene.add(axisHelper);
    // create a camera, which defines where we're looking at.


    // create a render and set the size
    webGLRenderer = new THREE.WebGLRenderer({antialias: true, devicePixelRatio: 1});
    webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
    webGLRenderer.setSize(window.innerWidth, window.innerHeight);
    webGLRenderer.shadowMapEnabled = true;

    // position and point the camera to the center of the scene
    camera.position.set(85, -82, -10);
    camera.lookAt(scene.position);
    camera.up = new THREE.Vector3(0, 0, 1);

    // add spotlight for the shadows
    spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(0, 50, 30);
    spotLight.intensity = 2;
    scene.add(spotLight);


    // add the output of the renderer to the html element

    document.getElementById("WebGL-output").appendChild(webGLRenderer.domElement);

    controls = new THREE.OrbitControls(camera);
    var pad1, pad2, support, bridge;


    /////////////////////////////////////////////////////////

    // bridge material
    // this tells us the material's color, how light reflects off it, etc.

    var BridgeMaterial = new THREE.MeshPhongMaterial({
        color: 0xaa2929,
        specular: 0x030303,
        wireframeLinewidth: 2,
        //map: clothTexture,
        side: THREE.DoubleSide,
        alphaTest: 0.5,
        wireframe: true
    });

    function plane(length, width) {
        var i = 0;
        return function (v, u) {
            //var arr=drawDeflection(1000000, 5, 100000, config.ForcePos);
            var x = v * length;
            var y = u * width - width / 2; //height/2;
            var z = -drawDeflection(config.force, config.length, config.stiffness, config.ForcePos)[i];
            i++;
            return new THREE.Vector3(x, y, z);

        };

    }

    function restartBridge()
    {
        scene.remove(BridgeLine);

        // recreate cloth geometry
        BridgeGeometry = new THREE.ParametricGeometry(plane(config.length*10, 6), config.length*10, 1);
        BridgeGeometry.dynamic = true;

        // recreate cloth mesh
        BridgeLine = new THREE.Mesh( BridgeGeometry, BridgeMaterial );
        BridgeLine.position.set( 0, 0, 0 );
        BridgeLine.castShadow = true;

        scene.add( BridgeLine ); // adds the cloth to the scene
    }

    // bridge geometry
    // the geometry contains all the points and faces of an object
    var BridgeGeometry = new THREE.ParametricGeometry(plane(config.length*10, 6), config.length*10, 1);
    BridgeGeometry.dynamic = true;
    BridgeGeometry.normalsNeedUpdate = true;
    BridgeGeometry.verticesNeedUpdate = true;
    BridgeGeometry.__dirtyVertices = true;
    //BridgeGeometry.vertices = drawDeflection(1000000, 5, 100000, config.ForcePos);


    // cloth mesh
    // a mesh takes the geometry and applies a material to it
    // so a mesh = geometry + material
    BridgeLine = new THREE.Mesh(BridgeGeometry, BridgeMaterial);
    BridgeLine.position.set(0, 0, 0);
    BridgeLine.castShadow = true;
    // whenever we make something, we need to also add it to the scene
    scene.add(BridgeLine); // add cloth to the scene
    ////////////////////////////////////////////////////////
    // var fnh = new THREE.VertexNormalsHelper(BridgeLine, 5);
    // scene.add(fnh);


    var support1 = new THREE.JSONLoader();
    support1.load('models/bridgeSupport.json', function (geometry) {
        support = new THREE.Mesh(geometry);
        support.position.x = 50 / 2;
        support.scale.z = 4;
        support.scale.y = 2;
        //scene.add(support);
    });
    var bridgePad1 = new THREE.JSONLoader();
    bridgePad1.load('models/bridgePad.json', function (geometry) {
        pad1 = new THREE.Mesh(geometry);
        pad1.position.x = 0;
        pad1.position.y = 0;
        pad1.position.z = 0;
        scene.add(pad1);
    });
    var bridgePad2 = new THREE.JSONLoader();
    bridgePad2.load('models/bridgePad.json', function (geometry) {
        pad2 = new THREE.Mesh(geometry);
        pad2.position.x = config.length*10;
        pad2.rotation.z = Math.PI;
        scene.add(pad2);
    });

    console.log(BridgeLine);
    render();
    function render() {
        stats.update();
        // render using requestAnimationFrame
        requestAnimationFrame(render);
        BridgeGeometry.dynamic = true;
        BridgeGeometry.normalsNeedUpdate = true;
        BridgeGeometry.verticesNeedUpdate = true;
        BridgeGeometry.dynamic = true;
        webGLRenderer.render(scene, camera);

    }

    function initStats() {
        var stats = new Stats();
        stats.setMode(0); // 0: fps, 1: ms
        // Align top-left
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        document.getElementById("Stats-output").appendChild(stats.domElement);
        return stats;
    }

    // function dDefl() {
    //     var force = 1000;
    //     var stiffness = 100000;
    //     var E = 100000;
    //     var width = 20;
    //     var thickness = 0.2;
    //     var I = width * Math.pow(thickness, 3) / 12;
    //     var max = 0;
    //     var length = constructionLength;
    //     var pos = 50;
    //     var arr = [];
    //     var lengthBeforeStressPoint = length * pos / 100;
    //     var lengthAfterStressPoint = length - a;
    //     // Deflection= force*length^3/3*E*I
    //
    // }


    function getConfig() {
        return {
            ForcePos: 50,
            force:1000000,
            length: 5,
            stiffness:1000000
        }
    }


    function initGui() {
        var gui = new DAT.GUI();
        gui.add(config, "ForcePos", 0, 100).step(1).onChange(function (newValue) {
            config.ForcePos = newValue; restartBridge();
            console.log("Value changed to:  ", newValue);
        });
        gui.add(config, "force", 0, 100000).step(1000).onChange(function (newValue) {
            config.force = newValue; restartBridge();
            console.log("Value changed to:  ", newValue);
        });
        gui.add(config, "stiffness", 0, 100000).step(1000).onChange(function (newValue) {
            config.stiffness = newValue; restartBridge();
            console.log("Value changed to:  ", newValue);
        });
        gui.add(config, "length", 0, 100).step(1).onChange(function (newValue) {
            config.length = newValue; restartBridge();
            pad2.position.x=config.length*10;
            console.log("Value changed to:  ", newValue);
        });
    }
}
///deflection
function drawDeflection(force, length, stiffness, pos) {
    var max = 0;
    var numSteps = length * 10; //50
    var arr = [];
    var a = length * pos / 100; //5
    var b = length - a; //5

    for (var i = 0; i < (numSteps * a / length /*50*/); i++) {
        var x = i / 10;
        var last = (force * b * x) * (length * length - (x * x) - b * b) / (6 * length * stiffness);
        arr.push(last);
        if (last > max) {
            max = last;
        }
    }

    for (var i = (numSteps * a / length); i <= numSteps; i++) {
        var x = i / 10;
        var last = (force * b) * ((length / b) * ((x - a) * (x - a) * (x - a)) + (((length * length) - (b * b)) * x) - (x * x * x)) / (6 * length * stiffness);
        arr.push(last);
        if (last > max) {
            max = last;
        }
    }
    //console.log(arr.length);
    console.log(arr);

    return arr.concat(arr);
}
window.onload = init;