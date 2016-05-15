var app=app || {};


app.bridgePadModel=Backbone.Model.extend({
    defaults:{
        geometry: new THREE.Geometry(),
        material: new THREE.LineBasicMaterial({
            color: 0x000000
        })
    }

});
// var bridgePad1 = new THREE.JSONLoader();
// bridgePad1.load('models/bridgePad.json', function (geometry) {
//     pad1 = new THREE.Mesh(geometry);
//     pad1.position.x = 0;
//     pad1.position.y = 0;
//     pad1.position.z = 0;
//     //pad1.scale.z = 4;
//     //pad1.scale.y = 1.5;
//     scene.add(pad1);
// });