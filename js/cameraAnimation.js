let autoRotate = true;
const rotationSpeed = 0.3; 
let initialCameraDistance;

function initCameraAnimation() {
    initialCameraDistance = camera.position.length();

    // Stop auto-rotation on user interaction
    controls.addEventListener('start', () => {
        autoRotate = false;
    });
}

function updateCameraAnimation(deltaTime) {
    if (autoRotate) {
        const angle = rotationSpeed * deltaTime;
        camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
        camera.lookAt(scene.position);
    }
} 