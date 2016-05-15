var app = app || {};
var scene=scene || new THREE.Scene();

app.fermView = Backbone.View.extend({
    el: '',
    model: app.fermModel,
    initialize: function() {

        //_.bindAll( this );

        return this.initFermModel();
    },

    initFermModel: function () {
        var support;
        var support1 = new THREE.JSONLoader();
        support1.load('models/bridgeSupport.json', function (geometry) {
            support = new THREE.Mesh(geometry);
            support.position.x = 50 / 2;
            support.scale.z = 4;
            support.scale.y = 2;
            scene.add(support);
            //return support;
        });

    }
});