//** apply scale and rotation to flat points array */
export const applyTransform = (points, centerX, centerY, scale, rotation) => {
  let scaledPoints = scalePoints(points, centerX, centerY, scale);
  let rotatedPoints = rotatePoints(scaledPoints, centerX, centerY, rotation);
  return toFlatArray(rotatedPoints);
};

//** scale points. called by applyTransform*/
const scalePoints = (points, centerX, centerY, scaleFactor) => {
  return points.map(([x, y]) => [
    centerX + (x - centerX) * scaleFactor,
    centerY + (y - centerY) * scaleFactor,
  ]);
};
//** rotation. called by applyTransform */
const rotatePoints = (points, centerX, centerY, angle) => {
  const cosTheta = Math.cos(angle);
  const sinTheta = Math.sin(angle);
  return points.map(([x, y]) => [
    cosTheta * (x - centerX) - sinTheta * (y - centerY) + centerX,
    sinTheta * (x - centerX) + cosTheta * (y - centerY) + centerY,
  ]);
};
const toFlatArray = (nestedArray) => {
  return nestedArray.flat();
};

//** utils to extract rect data from a flat points array */
export const extractRectData = (points) => {
  const flatArray = points.flat();
  console.log("flatArray", flatArray);
  if (flatArray.length !== 8) {
    console.error("Invalid input array, expected 8 values for a rectangle.");
    return null;
  }

  const x1 = flatArray[0],
    y1 = flatArray[1];
  const x2 = flatArray[2],
    y2 = flatArray[3];
  const x3 = flatArray[4],
    y3 = flatArray[5];
  const x4 = flatArray[6],
    y4 = flatArray[7];

  const width = x2 - x1;
  const height = y3 - y2;

  return { x: x1, y: y1, width, height };
};
