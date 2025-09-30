import * as THREE from 'three';

/**
 * This class represents a book composed of a cover and pages
 */
class MyBook extends THREE.Object3D {
    /**
     * 
     * @param {number} width Book width
     * @param {number} height Book height
     * @param {string|number} color Book color (hex or string)
     */
    constructor(length = 0.4, width = 0.3, thickness = 0.1,  color = "#2b00ff") {
        super();

        const coverMaterial = new THREE.MeshPhongMaterial({ color});

        // Book cover side
        const bodyGeometry = new THREE.CylinderGeometry(thickness / 2, thickness / 2, length, 32 ,1,true, Math.PI, Math.PI); 
        const bookSide= new THREE.Mesh(bodyGeometry, coverMaterial);
        bookSide.position.y = length / 2;
        this.add(bookSide);
        
        //texture to use in the front cover
        const texture = new THREE.TextureLoader().load("./textures/text_to_mirror.jpg");
        texture.wrapS = THREE.MirroredRepeatWrapping;
        texture.wrapT = THREE.MirroredRepeatWrapping;
        texture.repeat.set(2, 2);
        const textureMaterial = new THREE.MeshPhongMaterial({map: texture})
        
        //book top cover
        const topGeometry = new THREE.PlaneGeometry(width, length) ;
        const topCover = new THREE.Mesh(topGeometry, textureMaterial);
        topCover.position.set(width / 2, length / 2, thickness / 2);
        this.add(topCover); 

        //book back cover
        const backCover = new THREE.Mesh(topGeometry, coverMaterial);
        backCover.rotateY(Math.PI);
        backCover.position.set(width / 2, length / 2, - thickness / 2);
        this.add(backCover);

        //book pages
        const pagesGeometry = new THREE.BoxGeometry(width, length, thickness * 0.9);
        const pagesMaterial = new THREE.MeshPhongMaterial({color: "#ffffff"});
        const pages = new THREE.Mesh(pagesGeometry, pagesMaterial);
        pages.position.set(width / 2, length / 2, 0);
        this.add(pages);

        const pagesBackGeometry = new THREE.CylinderGeometry(thickness / 2 * 0.9, thickness / 2 * 0.9,length, 32, 1, false, Math.PI, Math.PI);
        const pagesBack = new THREE.Mesh(pagesBackGeometry, pagesMaterial);
        pagesBack.position.set(0, length / 2, 0);
        this.add(pagesBack);

        //cover edges side
        const edgesSideGeometry = new THREE.CylinderGeometry(0.01, 0.01, length, 32 ,1,false, 0, Math.PI); 
        const edgesSide = new THREE.Mesh(edgesSideGeometry,coverMaterial);
        edgesSide.position.set(width,length/2, thickness / 2 - 0.01)
        this.add(edgesSide);
        
        const edgesSide2 = new THREE.Mesh(edgesSideGeometry,coverMaterial);
        edgesSide2.position.set(width,length/2, -thickness / 2 + 0.01)
        this.add(edgesSide2);

        //cover edges top
        const edgesTopGeometry = new THREE.CylinderGeometry(0.01, 0.01, width, 32 ,1,false, 0, Math.PI); 
        const edgesTop = new THREE.Mesh(edgesTopGeometry,coverMaterial);
        edgesTop.rotateZ(Math.PI / 2);
        edgesTop.position.set(width / 2,length, thickness / 2 - 0.01)
        this.add(edgesTop);
        
        const edgesTop2 = new THREE.Mesh(edgesTopGeometry,coverMaterial);
        edgesTop2.rotateZ(Math.PI / 2);
        edgesTop2.position.set(width / 2,length, -thickness / 2 + 0.01);
        this.add(edgesTop2);

        //cover edges bottom
        const edgesBottom = new THREE.Mesh(edgesTopGeometry,coverMaterial);
        edgesBottom.rotateZ(-Math.PI / 2);
        edgesBottom.position.set(width / 2,0, thickness / 2 - 0.01)
        this.add(edgesBottom);
        
        const edgesBottom2 = new THREE.Mesh(edgesTopGeometry,coverMaterial);
        edgesBottom2.rotateZ(-Math.PI / 2);
        edgesBottom2.position.set(width / 2,0, -thickness / 2 + 0.01);
        this.add(edgesBottom2);

        //side top edge --------
        const r = thickness / 2 - 0.01;
        const k = 0.5523 * r; 
        // First quarter arc 
        let curve1 = new THREE.CubicBezierCurve3(
            new THREE.Vector3(0, length, r),          
            new THREE.Vector3(-k, length, r),         
            new THREE.Vector3(-r, length, k),         
            new THREE.Vector3(-r, length, 0)          
        );

        // Second quarter arc 
        let curve2 = new THREE.CubicBezierCurve3(
            new THREE.Vector3(-r, length, 0),         
            new THREE.Vector3(-r, length, -k),        
            new THREE.Vector3(-k, length, -r),        
            new THREE.Vector3(0, length, -r)          
        );

        // Combine into a path
        let edgePath = new THREE.CurvePath();
        edgePath.add(curve1);
        edgePath.add(curve2);

        const sideTopEdgeGeometry = new THREE.TubeGeometry(edgePath, 50, 0.01, 8, false);
        const sideTopEdge = new THREE.Mesh(sideTopEdgeGeometry, coverMaterial);
        this.add(sideTopEdge);

        //side bottom edge ---------
        // First quarter arc 
        curve1 = new THREE.CubicBezierCurve3(
            new THREE.Vector3(0, 0, r),          
            new THREE.Vector3(-k, 0, r),         
            new THREE.Vector3(-r, 0, k),         
            new THREE.Vector3(-r, 0, 0)          
        );

        // Second quarter arc 
        curve2 = new THREE.CubicBezierCurve3(
            new THREE.Vector3(-r, 0, 0),         
            new THREE.Vector3(-r, 0, -k),        
            new THREE.Vector3(-k, 0, -r),        
            new THREE.Vector3(0, 0, -r)          
        );

        // Combine into a path
        edgePath = new THREE.CurvePath();
        edgePath.add(curve1);
        edgePath.add(curve2);

        const sideBottomEdgeGeometry = new THREE.TubeGeometry(edgePath, 50, 0.01, 8, false);
        const sideBottomEdge = new THREE.Mesh(sideBottomEdgeGeometry, coverMaterial);
        this.add(sideBottomEdge);
            
    }
}

export { MyBook };