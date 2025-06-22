// js/main.js

let clock;

function init() {
    initScene();
    addLighting();
    createBicycle();
    initInteraction();
    initCameraAnimation();
    
    clock = new THREE.Clock();
    
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    
    const deltaTime = clock.getDelta();
    
    controls.update();
    updateCameraAnimation(deltaTime);
    TWEEN.update();
    
    renderer.render(scene, camera);
}

window.addEventListener('load', init); 