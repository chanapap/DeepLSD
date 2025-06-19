// DRAW ALL PLANE SIDES AND X & Y AXIS
// array([[-0.58744991,  0.06091256, -0.89432341],
//     [-0.59039378, -0.3504971 , -0.89219105]])
// plane = {"0_pos_rot": [[-0.5716618895530701, 0.44756120443344116, -1.5269027948379517],
//     [-78.0041637440927, -89.59539193800651, -167.91977797453944]]}



// Set the plane position and rotation
const planePosition = new THREE.Vector3(-0.5716618895530701, 0.44756120443344116, -1.5269027948379517);
const planeRotationX = THREE.MathUtils.degToRad(-78.0041637440927);
const planeRotationY = THREE.MathUtils.degToRad(-89.59539193800651);
const planeRotationZ = THREE.MathUtils.degToRad(0);

const point1 = new THREE.Vector3( -0.58744991,  0.06091256, -0.89432341);
const point2 = new THREE.Vector3(-0.59039378, -0.3504971 , -0.89219105);


////////////////////////////////////////////////////////////////

// Define plane dimensions
const planeWidth = 4;
const planeHeight = 4;

// Create plane geometry
const planeGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
const planeMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x0000ff, 
    side: THREE.DoubleSide, 
    transparent: true, 
    opacity: 0.5 
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);

planeMesh.position.copy(planePosition);
planeMesh.rotation.set(planeRotationX, planeRotationY, planeRotationZ);
scene.add(planeMesh);

// ✅ Step 1: Define 4 corners of the plane in local space
const halfW = planeWidth / 2;
const halfH = planeHeight / 2;

const corners = [
    new THREE.Vector3(-halfW, -halfH, 0),  // Bottom-left
    new THREE.Vector3( halfW, -halfH, 0),  // Bottom-right
    new THREE.Vector3( halfW,  halfH, 0),  // Top-right
    new THREE.Vector3(-halfW,  halfH, 0)   // Top-left
];

// ✅ Step 2: Convert to world space using the plane’s transform
for (let i = 0; i < corners.length; i++) {
    corners[i].applyEuler(new THREE.Euler(planeRotationX, planeRotationY, planeRotationZ)); // Apply rotation
    corners[i].add(planePosition); // Apply translation
}
console.log(corners);

// ✅ Step 3: Draw lines connecting the 4 corners (edges)
const edgeMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 }); // Yellow edges
const edgePairs = [
    [corners[0], corners[1]], // Bottom edge
    [corners[1], corners[2]], // Right edge
    [corners[2], corners[3]], // Top edge
    [corners[3], corners[0]]  // Left edge
];

for (let [start, end] of edgePairs) {
    const edgeGeometry = new THREE.BufferGeometry().setFromPoints([start, end]);
    const edgeLine = new THREE.Line(edgeGeometry, edgeMaterial);
    scene.add(edgeLine);
}

// ✅ Step 4: Plot Plane Axes
const axisLength = 2; // Length of the X and Y axis

// Local X-axis (red) and Y-axis (green) in plane space
const xAxisLocal = new THREE.Vector3(axisLength, 0, 0); // Right
const yAxisLocal = new THREE.Vector3(0, axisLength, 0); // Up

// Transform axes to world space
xAxisLocal.applyEuler(new THREE.Euler(planeRotationX, planeRotationY, planeRotationZ)).add(planePosition);
yAxisLocal.applyEuler(new THREE.Euler(planeRotationX, planeRotationY, planeRotationZ)).add(planePosition);

// X-axis (Red)
const xAxisMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
const xAxisGeometry = new THREE.BufferGeometry().setFromPoints([planePosition, xAxisLocal]);
const xAxisLine = new THREE.Line(xAxisGeometry, xAxisMaterial);
scene.add(xAxisLine);

// Y-axis (Green)
const yAxisMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
const yAxisGeometry = new THREE.BufferGeometry().setFromPoints([planePosition, yAxisLocal]);
const yAxisLine = new THREE.Line(yAxisGeometry, yAxisMaterial);
scene.add(yAxisLine);

// Log confirmation
console.log("Plane, edges, and axes added to scene!");





////////////////////////////////////////////////////////////////
// DRAW THE LINE AND MOVE THE LINE TO THE CENTER OF THE PLANE //
////////////////////////////////////////////////////////////////

const scene = editor.scene;

// ✅ Step 2: Compute the midpoint of the line
const lineMidpoint = new THREE.Vector3().addVectors(point1, point2).multiplyScalar(0.5);

// ✅ Step 4: Compute translation needed to move the line to the plane's center
const translation = new THREE.Vector3().subVectors(planePosition, lineMidpoint);
const movedPoint1 = new THREE.Vector3().addVectors(point1, translation);
const movedPoint2 = new THREE.Vector3().addVectors(point2, translation);

// ✅ Step 5: Create and add the updated line (centered on the plane)
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 }); // Green
const lineGeometry = new THREE.BufferGeometry().setFromPoints([movedPoint1, movedPoint2]);
const line = new THREE.Line(lineGeometry, lineMaterial);
scene.add(line);

// ✅ Step 6: Calculate angle of the line with the plane's X-axis
const lineDirection = new THREE.Vector3().subVectors(movedPoint2, movedPoint1).normalize();
const planeXAxis = new THREE.Vector3(1, 0, 0); // Plane X-axis in local space

// Rotate the X-axis to align with the plane’s orientation
planeXAxis.applyEuler(new THREE.Euler(planeRotationX, planeRotationY, planeRotationZ)).normalize();

// Compute the angle using the dot product
const angleRad = Math.acos(lineDirection.dot(planeXAxis));
const angleDeg = THREE.MathUtils.radToDeg(angleRad);

console.log(`Angle between the line and plane's X-axis: ${angleDeg.toFixed(2)} degrees`);

// ✅ Step 7: Create and add points at the new line locations
const pointMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red
const sphereGeometry = new THREE.SphereGeometry(0.1, 1, 1);

const pointMesh1 = new THREE.Mesh(sphereGeometry, pointMaterial);
pointMesh1.position.copy(movedPoint1);
scene.add(pointMesh1);

const pointMesh2 = new THREE.Mesh(sphereGeometry, pointMaterial);
pointMesh2.position.copy(movedPoint2);
scene.add(pointMesh2);

console.log("Line moved to plane center and angle calculated!");




////////////////////////////////////////////////////
// Rotate the plane so it is parallel to the line //
////////////////////////////////////////////////////


// ✅ Step 1: Compute the initial angle between the line and the plane's X-axis
const angleRad = Math.acos(lineDirection.dot(planeXAxis));
const angleDeg = THREE.MathUtils.radToDeg(angleRad);

// ✅ Step 2: Test both possible rotations
function getFinalAngle(testRotationZ) {
    const testPlaneXAxis = new THREE.Vector3(1, 0, 0);
    testPlaneXAxis.applyEuler(new THREE.Euler(planeRotationX, planeRotationY, testRotationZ)).normalize();
    
    const newAngleRad = Math.acos(lineDirection.dot(testPlaneXAxis));
    return THREE.MathUtils.radToDeg(newAngleRad);
}

// ✅ Step 3: Compute both clockwise and counterclockwise rotations
const clockwiseRotationZ = planeRotationZ + THREE.MathUtils.degToRad(-angleDeg);
const counterClockwiseRotationZ = planeRotationZ + THREE.MathUtils.degToRad(angleDeg);

// ✅ Step 4: Compute final angles for both rotations
const finalAngleClockwise = getFinalAngle(clockwiseRotationZ);
const finalAngleCounterClockwise = getFinalAngle(counterClockwiseRotationZ);

// ✅ Step 5: Select the rotation that minimizes the absolute angle
let bestRotationZ;
if (Math.abs(finalAngleClockwise) < Math.abs(finalAngleCounterClockwise)) {
    bestRotationZ = clockwiseRotationZ;
} else {
    bestRotationZ = counterClockwiseRotationZ;
}

// ✅ Step 6: Log the selected rotation and new angle before applying
console.log(`Best rotation Z: ${THREE.MathUtils.radToDeg(bestRotationZ).toFixed(2)} degrees`);
console.log(`New minimized angle after rotation: ${Math.min(Math.abs(finalAngleClockwise), Math.abs(finalAngleCounterClockwise)).toFixed(2)} degrees`);

// ✅ Step 7: Apply the best rotation to the plane (Only apply after confirming)
const planeRotationZ = bestRotationZ;
planeMesh.rotation.set(planeRotationX, planeRotationY, planeRotationZ);
scene.add(planeMesh);







