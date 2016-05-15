var app = app || {};

app.bridgeSupportModel = Backbone.Model.extend({
    defaults:{
        geometry: new THREE.Geometry(),
        material: new THREE.LineBasicMaterial({
            color: 0x000000
        })
    }
});