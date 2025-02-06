import "../scss/style.scss";

import GUIView from "./gui/guiView";
import PixiScene from "./pixi/pixiScene";

export default class App {
  constructor(shapes) {
    //** init params */
    this.shapes = shapes;
    this.el = document.querySelector("#app");
  }

  init() {
    //** init gui to control params without keyboard */
    this.initGUI();
    //** resize and keys */
    this.addListeners();

    //** lets init pixi scene, logic, shape renderer! */
    this.initPixi();
  }

  async initPixi() {
    this.pixiScene = new PixiScene(this);

    await this.pixiScene.initPixiApp();

    //** pixi scene has started, lets center it */
    this.resize();
  }

  initGUI() {
    this.gui = new GUIView(this);
  }

  addListeners() {
    window.addEventListener("resize", this.resize.bind(this));
    window.addEventListener("keyup", this.keyup.bind(this));
  }

  resize() {
    const vw = this.el?.offsetWidth || window.innerWidth;
    const vh = this.el?.offsetHeight || window.innerHeight;

    if (this.pixiScene) this.pixiScene.resize(vw, vh);
  }

  //** from gui */
  updateScale(value) {
    if (this.pixiScene) this.pixiScene.updateScale(value);
  }
  updateRotation(value) {
    if (this.pixiScene) this.pixiScene.updateRotation(value);
  }
  updateThickness(value) {
    if (this.pixiScene) this.pixiScene.updateThickness(value);
  }
  updateBorderColor(value) {
    if (this.pixiScene) this.pixiScene.updateBorderColor(value);
  }
  updateBackgroundColor(value) {
    if (this.pixiScene) this.pixiScene.updateBackgroundColor(value);
  }

  //** keybpard stuff */
  keyup(e) {
    console.log("e.keyCode", e.keyCode);
    //** cycle through the shapes */
    if (e.keyCode == 83) {
      if (this.pixiScene) this.pixiScene.cycleShapes();
    }
    //** cycle through border colours */
    if (e.keyCode == 69) {
      if (this.pixiScene) this.pixiScene.cycleBorderColor();
    }
    //** cycle through background colours */
    if (e.keyCode == 66) {
      if (this.pixiScene) this.pixiScene.cycleBackgroundColor();
    }
    //** cycle through border thickness */
    if (e.keyCode == 84) {
      if (this.pixiScene) this.pixiScene.cycleBorderThickness();
    }

    //** rotation */
    if (e.keyCode == 37) {
      if (this.pixiScene) this.pixiScene.rotateLeft();
    }
    if (e.keyCode == 39) {
      if (this.pixiScene) this.pixiScene.rotateRight();
    }

    //** zoom */
    if (e.keyCode == 38) {
      if (this.pixiScene) this.pixiScene.zoomIn();
    }
    if (e.keyCode == 40) {
      if (this.pixiScene) this.pixiScene.zoomOut();
    }
    // g or p
    if (e.keyCode == 71 || e.keyCode == 80) {
      if (this.gui) this.gui.toggle();
    }
  }
}
