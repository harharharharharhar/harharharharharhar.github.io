var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000000);
camera.position.set(87,40,96);
camera.lookAt(scene.position);

var ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

var sun=new THREE.Mesh(new THREE.BoxGeometry(20,20,20,3,3,3) , new THREE.MeshBasicMaterial({color: 0xffff00}));
sun.position.set(0,0,0);
var earth=new THREE.Mesh(new THREE.BoxGeometry(10,10,10,3,3,3) , new THREE.MeshBasicMaterial({color: 0x00ff00}));
earth.position.set(50,0,0);
var moon=new THREE.Mesh(new THREE.BoxGeometry(4,4,4,3,3,3) , new THREE.MeshBasicMaterial({color: 0x00ffff}));
moon.position.set(20,0,0);

scene.add(sun);
sun.add(earth);
earth.add(moon);


var renderer = new THREE.WebGLRenderer({antialias: true,alpha: true});
renderer.setClearColor(0x0c0c0c,0);
renderer.setSize(window.innerWidth,window.innerHeight);

var orbitControls = new THREE.OrbitControls(camera);
orbitControls.enabled = true;

function animate(){
	sun.rotation.y+=0.05;
	earth.rotation.y+=0.1;
	orbitControls.update();
	renderer.render(scene,camera);
	requestAnimationFrame(animate);
}

window.onload = function(){
	document.getElementById('container').appendChild(renderer.domElement);
	animate();
};

















