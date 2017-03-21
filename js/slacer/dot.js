var SLAcer = SLAcer || {};

// -----------------------------------------------------------------------------
// Below is a method to generate every vertices of file you loaded to a sphere, which used "mesh".
// Thiis method is very slow in for-loop, so it would be drop by this project.
// -----------------------------------------------------------------------------


;(function() {

    // Constructor
    function Mesh(geometry, material) {
        // normalize geometry
        if (geometry instanceof THREE.BufferGeometry) {
            geometry = new THREE.Geometry().fromBufferGeometry(geometry);

            // var box = new THREE.BoxGeometry(1, 1, 1);
            // var sphere = new THREE.SphereGeometry(.65, 32, 32);
            // var singleGeometry = new THREE.Geometry();

            // var boxMesh = new THREE.Mesh(box);
            // var sphereMesh = new THREE.Mesh(sphere);
            //
            // boxMesh.updateMatrix(); // as needed
            // singleGeometry.merge(boxMesh.geometry, boxMesh.matrix);
            // sphereMesh.updateMatrix(); // as needed
            // singleGeometry.merge(sphereMesh.geometry, sphereMesh.matrix);

            var geometry2=new THREE.SphereGeometry( 1, 1, 1 );
            var singleGeometry = new THREE.Geometry();

            var material_dot = new THREE.MeshBasicMaterial( { color: 0xFFCC00 });

            var tmp_mesh;
            var tmpMatrix;
            for(let i in geometry.vertices){
                // tmp_mesh= new THREE.Mesh( geometry2, material_dot );
                // tmp_mesh.position.set(geometry.vertices[i].x,geometry.vertices[i].y,geometry.vertices[i].z);
                // tmp_mesh.updateMatrix();

                tmpMatrix = new THREE.Matrix4();
                tmpMatrix.setPosition(new THREE.Vector3(geometry.vertices[i].x,geometry.vertices[i].y,geometry.vertices[i].z));
                singleGeometry.merge(geometry2, tmpMatrix);
            }
            geometry=singleGeometry;
        }

        // bounding box min coords
        //var min = geometry.boundingBox.min;

        // set geometry origin to [0, 0]
        //geometry.translate(-min.x, -min.y, -min.z);

        // call parent constructor


        // get geometry volume
        // this.getVolume();



        // center geometry
        geometry.center();
        THREE.Mesh.call(this, geometry, material || new THREE.MeshNormalMaterial());



    }

    // extends
    Mesh.prototype = Object.create(THREE.Mesh.prototype);
    Mesh.prototype.constructor = Mesh;

    // -------------------------------------------------------------------------

    Mesh.prototype.getSize = function() {
        return this.geometry.boundingBox.size();
    };

    // http://stackoverflow.com/questions/23279521
    Mesh.prototype.getVolume = function(update) {
        if (! update && this.userData.volume !== undefined) {
            return this.userData.volume;
        }

        var volume   = 0;
        var faces    = this.geometry.faces;
        var vertices = this.geometry.vertices;

        var face, v1, v2, v3;

        for (var i = 0; i < faces.length; i++) {
            face = faces[i];

            v1 = vertices[face.a];
            v2 = vertices[face.b];
            v3 = vertices[face.c];

            volume += (
                    -(v3.x * v2.y * v1.z)
                    +(v2.x * v3.y * v1.z)
                    +(v3.x * v1.y * v2.z)
                    -(v1.x * v3.y * v2.z)
                    -(v2.x * v1.y * v3.z)
                    +(v1.x * v2.y * v3.z)
                ) / 6;
        }

        return (this.userData.volume = volume);
    };

    // -------------------------------------------------------------------------

    // export module
    SLAcer.Dot_transform = Mesh;

})();
