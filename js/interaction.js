let raycaster, mouse;
let highlightedPart = null;
let infoPanel;
const originalColors = new Map();

function initInteraction() {
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    infoPanel = document.getElementById('info-panel');

    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('click', onMouseClick, false);
}

function findMainPart(object) {
    if (object.name) return object;
    if (object.parent) return findMainPart(object.parent);
    return null;
}

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(bike.children, true);

    if (intersects.length > 0) {
        const mainPart = findMainPart(intersects[0].object);
        if (highlightedPart !== mainPart) {
            resetHighlight();
            if(mainPart) highlightPart(mainPart);
        }
    } else {
        resetHighlight();
    }
}

function onMouseClick(event) {
    if (highlightedPart) {
        const partName = highlightedPart.name || 'Bicycle Part';
        infoPanel.textContent = `${partName}`;
        infoPanel.style.display = 'block';
        infoPanel.style.left = `${event.clientX + 15}px`;
        infoPanel.style.top = `${event.clientY}px`;
        
        // Animate the part
        animatePart(highlightedPart);
    } else {
        infoPanel.style.display = 'none';
    }
}

function highlightPart(part) {
    highlightedPart = part;
    if (part.material) {
        originalColors.set(part, part.material.emissive.getHex());
        part.material.emissive.setHex(0x555555);
    }
}

function resetHighlight() {
    if (highlightedPart && originalColors.has(highlightedPart)) {
        highlightedPart.material.emissive.setHex(originalColors.get(highlightedPart));
        originalColors.delete(highlightedPart);
    }
    highlightedPart = null;
}

function animatePart(part) {
    const originalScale = part.scale.clone();
    const targetScale = originalScale.clone().multiplyScalar(1.1);

    // Using TWEEN.js (must be included in HTML)
    new TWEEN.Tween(part.scale)
        .to(targetScale, 150)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onComplete(() => {
            new TWEEN.Tween(part.scale)
                .to(originalScale, 150)
                .easing(TWEEN.Easing.Quadratic.In)
                .start();
        })
        .start();
} 