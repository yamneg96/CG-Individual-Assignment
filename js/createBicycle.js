let bike;

function createBicycle() {
    bike = new THREE.Group();

    // Materials
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.8, roughness: 0.5 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 1, roughness: 0.2 });

    // Wheels
    function createWheel() {
        const group = new THREE.Group();
        const tire = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.07, 24, 100), blackMat);
        tire.name = "Tire";
        group.add(tire);
        const spokes = new THREE.Group();
        spokes.name = "Spokes";
        for (let i = 0; i < 36; i++) {
            const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 1.6, 8), chromeMat);
            spoke.rotation.z = (Math.PI * 2 * i) / 36;
            spokes.add(spoke);
        }
        group.add(spokes);
        const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.1, 24), whiteMat);
        hub.name = "Hub";
        hub.rotation.x = Math.PI / 2;
        group.add(hub);
        return group;
    }
    const wheelY = 0.9;
    const rearWheel = createWheel();
    rearWheel.name = "Rear Wheel";
    rearWheel.position.set(-1.8, wheelY, 0);
    bike.add(rearWheel);
    const frontWheel = createWheel();
    frontWheel.name = "Front Wheel";
    frontWheel.position.set(1.8, wheelY, 0);
    bike.add(frontWheel);

    // Frame
    function addTube(points, radius, mat, name) {
        const curve = new THREE.CatmullRomCurve3(points);
        const geom = new THREE.TubeGeometry(curve, 64, radius, 16, false);
        const mesh = new THREE.Mesh(geom, mat);
        mesh.name = name;
        bike.add(mesh);
        return mesh;
    }
    const pedalHubPos = new THREE.Vector3(0, 0.75, 0);
    const seatTubeTop = new THREE.Vector3(-0.2, 2.1, 0);
    const headTubeTop = new THREE.Vector3(1.6, 2.0, 0);
    const headTubeBottom = new THREE.Vector3(1.5, 1.7, 0);

    const seatTube = addTube([pedalHubPos, seatTubeTop], 0.06, blackMat, "Seat Tube");
    const topTube = addTube([seatTubeTop, headTubeTop], 0.06, blackMat, "Top Tube");
    const downTube = addTube([pedalHubPos, headTubeBottom], 0.07, blackMat, "Down Tube");
    const chainStay = addTube([new THREE.Vector3(-1.8, wheelY, 0), pedalHubPos], 0.04, blackMat, "Chain Stay");
    const seatStay = addTube([new THREE.Vector3(-1.8, wheelY, 0), seatTubeTop], 0.04, blackMat, "Seat Stay");

    // Fork & Handlebars
    const headTube = addTube([headTubeTop, headTubeBottom], 0.07, whiteMat, "Head Tube");
    const fork = addTube([headTubeBottom, new THREE.Vector3(1.8, wheelY, 0)], 0.05, whiteMat, "Fork");
    const handlebarStem = new THREE.Vector3(1.7, 2.15, 0);
    const stem = addTube([headTubeTop, handlebarStem], 0.04, whiteMat, "Stem");
    const handlebars = addTube([new THREE.Vector3(1.7, 2.15, -0.4), new THREE.Vector3(1.7, 2.15, 0.4)], 0.04, whiteMat, "Handlebars");
    const grip1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.15, 16), blackMat);
    grip1.name = "Grip";
    grip1.position.set(1.7, 2.15, 0.4);
    grip1.rotation.x = Math.PI / 2;
    bike.add(grip1);
    const grip2 = grip1.clone();
    grip2.name = "Grip";
    grip2.position.z = -0.4;
    bike.add(grip2);

    // Seat
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.06, 0.2), blackMat);
    seat.name = "Seat";
    seat.position.set(-0.25, 2.2, 0);
    seat.rotation.y = Math.PI / 2;
    bike.add(seat);
    const seatPost = addTube([seatTubeTop, new THREE.Vector3(-0.25, 2.15, 0)], 0.02, chromeMat, "Seat Post");

    // Drivetrain
    const chainRing = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.03, 32), chromeMat);
    chainRing.name = "Chain Ring";
    chainRing.position.copy(pedalHubPos);
    chainRing.rotation.x = Math.PI / 2;
    bike.add(chainRing);
    const cassette = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.05, 24), chromeMat);
    cassette.name = "Cassette";
    cassette.position.set(-1.8, wheelY, -0.05);
    cassette.rotation.x = Math.PI / 2;
    bike.add(cassette);
    const chainPoints = [
        new THREE.Vector3(0, 0.75 + 0.35, -0.01),
        new THREE.Vector3(1, 0.9, -0.01),
        new THREE.Vector3(-1.8, wheelY + 0.2, -0.01),
        new THREE.Vector3(-1.8, wheelY - 0.2, -0.01),
        new THREE.Vector3(-1.2, 0.5, -0.01),
        new THREE.Vector3(0, 0.75 - 0.35, -0.01),
    ];
    const chain = addTube(chainPoints, 0.02, blackMat, "Chain");


    scene.add(bike);
    bike.castShadow = true;
    bike.receiveShadow = true;

    // Store parts for interaction
    bike.userData.parts = {
        rearWheel, frontWheel, seatTube, topTube, downTube, chainStay, seatStay,
        headTube, fork, stem, handlebars, grip1, grip2, seat, seatPost,
        chainRing, cassette, chain
    };
} 