//** utils to generate correct star points */
export const generateStarPoints = (
  centerX,
  centerY,
  outerRadius,
  innerRadius,
  numPoints = 5
) => {
  const points = [];
  const angleStep = Math.PI / numPoints;

  for (let i = 0; i < numPoints * 2; i++) {
    const angle = i * angleStep - Math.PI / 2 - Math.PI;
    const radius = i % 2 === 0 ? outerRadius : innerRadius;

    points.push(
      centerX + radius * Math.cos(angle),
      centerY + radius * Math.sin(angle)
    );
  }

  return roundPoints(points);
};

//** utils to generate correct trapezium points */
export const generateTrapeziumPoints = (
  centerX,
  centerY,
  topWidth,
  bottomWidth,
  height
) => {
  const halfTop = topWidth / 2;
  const halfBottom = bottomWidth / 2;

  const points = [
    centerX - halfBottom,
    centerY - height / 2,
    centerX + halfBottom,
    centerY - height / 2,
    centerX + halfTop,
    centerY + height / 2,
    centerX - halfTop,
    centerY + height / 2,
  ];

  return roundPoints(points);
};

const roundPoints = (points, decimals = 2) => {
  return points.map((coord) => Number(coord.toFixed(decimals)));
};
