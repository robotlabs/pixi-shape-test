import { Application, Container, Graphics } from "pixi.js";
import { applyTransform } from "./../utils/misc";
import { configColors, configThickness } from "../utils/config";
import gsap from "gsap";

//** pixi scene, logic and shape render */
export default class pixiScene {
  constructor(app) {
    this.app = app;
    this.iterShapes = 0;
    this.shapes = new Map();
  }
  async initPixiApp() {
    this.pixiApp = new Application();
    await this.pixiApp.init({
      background: "#cccccc",
      resizeTo: window,
      antialias: true,
    });
    document.body.appendChild(this.pixiApp.canvas);

    //** init transform values */
    this.scale = 1;
    this.rotation = 0;

    this.iterColorBorder = 0;
    this.iterColorBackground = 0;
    this.iterThickness = 0;

    this.colorBorder = configColors[this.iterColorBorder];
    this.colorBackground = configColors[this.iterColorBackground];
    this.thickness = configThickness[this.iterThickness];

    //** store all shapes init data */
    this.app.shapes.forEach((shapeData) => {
      this.shapes.set(shapeData.name, new Shape(shapeData.points));
    });

    //** shape container */
    this.shapeContainer = new Container();

    //** graphics and container */
    this.graphics = new Graphics();
    this.shapeContainer.addChild(this.graphics);

    //** add container to pixi stage */
    this.pixiApp.stage.addChild(this.shapeContainer);

    //** and let's start */
    this.renderShapes();
  }

  //** keep shape container in the center */
  resize(vw, vh) {
    if (!this.shapeContainer) return;

    this.shapeContainer.x = vw / 2;
    this.shapeContainer.y = vh / 2;
  }

  //** render shapes. only exception for roundedRect, because we can't use a .poly  */
  renderShapes() {
    const shapeData = this.app.shapes[this.iterShapes];
    switch (shapeData.name) {
      case "roundedRect":
        this.drawRoundedRect(shapeData.points);

        this.graphics.rotation = this.rotation;
        this.graphics.scale = this.scale;
        break;
      default:
        this.graphics.rotation = 0;
        this.graphics.scale = 1;
        this.drawPoly(shapeData.points);
    }
  }

  //** loop. not used in this test */
  run() {}

  drawRoundedRect(points) {
    this.graphics.clear();

    // Extract rectangle dimensions from points
    const x = points[0][0];
    const y = points[0][1];
    const width = points[1][0] - points[0][0];
    const height = points[2][1] - points[1][1];
    const radius = width / 2;

    this.graphics.roundRect(x, y, width, height, radius);
    this.graphics.fill(this.colorBackground);
    this.graphics.stroke({
      width: this.thickness / this.scale,
      color: this.colorBorder,
    });

    this.shapeContainer.addChild(this.graphics);
  }

  //** generalist rendered for all the shapes */
  drawPoly() {
    this.graphics.clear();

    //** get shapes and transform it */
    const shape = this.shapes.get(this.app.shapes[this.iterShapes].name);
    const transformedPoints = shape.transform(this.scale, this.rotation);

    this.graphics.poly(transformedPoints);
    this.graphics.stroke({
      width: this.thickness,
      color: this.colorBorder,
      alignment: 0,
    });
    this.graphics.fill(this.colorBackground);
  }

  //** interaction */
  cycleShapes() {
    this.iterShapes++;
    if (this.iterShapes >= this.app.shapes.length) this.iterShapes = 0;
    this.renderShapes();
  }
  cycleBorderColor() {
    this.iterColorBorder++;
    if (this.iterColorBorder >= configColors.length) this.iterColorBorder = 0;

    this.colorBorder = configColors[this.iterColorBorder];
    this.renderShapes();
  }
  cycleBackgroundColor() {
    this.iterColorBackground++;
    if (this.iterColorBackground >= configColors.length)
      this.iterColorBackground = 0;

    this.colorBackground = configColors[this.iterColorBackground];
    this.renderShapes();
  }
  cycleBorderThickness() {
    this.iterThickness++;
    if (this.iterThickness >= configThickness.length) this.iterThickness = 0;

    this.thickness = configThickness[this.iterThickness];
    this.renderShapes();
  }

  //** rotate and zoom */
  rotateLeft() {
    const endRotation = this.rotation - 0.2;
    gsap.to(this, {
      rotation: endRotation,
      duration: 0.5,
      ease: "back.out(1.5)",
      onUpdate: () => this.renderShapes(),
    });
  }
  rotateRight() {
    const endRotation = this.rotation + 0.2;
    gsap.to(this, {
      rotation: endRotation,
      duration: 0.5,
      ease: "back.out(1.5)",
      onUpdate: () => this.renderShapes(),
    });
  }
  zoomIn() {
    let endScale = this.scale + 0.2;
    if (endScale > 4) endScale = 4;
    gsap.to(this, {
      scale: endScale,
      duration: 0.5,
      ease: "power2.out",
      onUpdate: () => this.renderShapes(),
    });
  }
  zoomOut() {
    let endScale = this.scale - 0.2;
    if (endScale < 0.2) endScale = 0.2;
    gsap.to(this, {
      scale: endScale,
      duration: 0.5,
      ease: "power2.out",
      onUpdate: () => this.renderShapes(),
    });
  }

  //** from gui */
  updateScale(value) {
    this.scale = value;
    this.renderShapes();
  }
  updateRotation(value) {
    this.rotation = value;
    this.renderShapes();
  }
  updateThickness(value) {
    this.thickness = value;
    this.renderShapes();
  }
  updateBorderColor(value) {
    this.colorBorder = value;
    this.renderShapes();
  }
  updateBackgroundColor(value) {
    this.colorBackground = value;
    this.renderShapes();
  }
}
//** shape class. so we can keep original points, and start from there for every transformation */
class Shape {
  constructor(points) {
    this.originalPoints = [...points];
  }

  transform(scale, rotation) {
    return applyTransform(this.originalPoints, 0, 0, scale, rotation);
  }
}
