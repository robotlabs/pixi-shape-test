// GuiView.js
import { Pane } from "tweakpane";
import Stats from "stats.js";

export default class GUIView {
  constructor(app) {
    this.app = app;
    this.colorBackground = "0xffff00";
    this.colorBorder = "0xffff00";

    this.params = {
      zoomLevel: 1,
      rotation: 0,
      thickness: 0,
      border: 0,
      background: 0,
    };

    this.initPane();
    // this.initStats();
    this.enable();
  }

  initPane() {
    try {
      this.pane = new Pane();

      this.initPaneHideShow();

      // Add inputs directly to main pane
      this.pane
        .addBinding(this.params, "zoomLevel", {
          min: 0.1,
          max: 5,
          step: 0.1,
        })
        .on("change", (ev) => {
          this.app.updateScale(ev.value);
        });

      this.pane
        .addBinding(this.params, "rotation", {
          min: 0.1,
          max: 15,
          step: 0.1,
        })
        .on("change", (ev) => {
          this.app.updateRotation(ev.value);
        });
      this.pane
        .addBinding(this.params, "thickness", {
          min: 1,
          max: 20,
          step: 1,
        })
        .on("change", (ev) => {
          this.app.updateThickness(ev.value);
        });

      this.pane
        .addBinding(this, "colorBackground")
        .on("change", this.onColorBackgroundChange.bind(this));

      this.pane
        .addBinding(this, "colorBorder")
        .on("change", this.onColorBorderChange.bind(this));
    } catch (error) {
      console.error("Error initializing Tweakpane:", error);
    }
  }

  onColorBackgroundChange(e) {
    this.app.updateBackgroundColor(e.value);
  }
  onColorBorderChange(e) {
    this.app.updateBorderColor(e.value);
  }

  initStats() {
    this.stats = new Stats();
    this.stats.showPanel(0);
    document.body.appendChild(this.stats.dom);
  }

  initPaneHideShow() {
    const showHideBtn = this.pane.addButton({
      title: "Show/Hide GUI",
      label: "toggle",
    });
    showHideBtn.element.style.width = "100%";

    const elements = this.pane.element.querySelectorAll(
      ".tp-fldv, .tp-lblv:not(:first-child)"
    );
    elements.forEach((el) => {
      el.style.display = "none";
    });

    showHideBtn.on("click", () => {
      // Get all folders and inputs except the button itself
      const elements = this.pane.element.querySelectorAll(
        ".tp-fldv, .tp-lblv:not(:first-child)"
      );

      // Toggle visibility
      elements.forEach((el) => {
        el.style.display = el.style.display === "none" ? "" : "none";
      });
    });

    // Trigger initial click to start with everything hidden
    setTimeout(() => {
      showHideBtn.element.click();
      const elements = this.pane.element.querySelectorAll(
        ".tp-fldv, .tp-lblv:not(:first-child)"
      );

      elements.forEach((el) => {
        el.style.display = el.style.display === "none" ? "" : "none";
      });
    }, 1);
  }

  enable() {
    if (this.pane) this.pane.element.style.display = "";
    if (this.stats) this.stats.dom.style.display = "";
  }

  disable() {
    if (this.pane) this.pane.element.style.display = "none";
    if (this.stats) this.stats.dom.style.display = "none";
  }

  toggle() {
    if (this.pane && this.pane.element.style.display !== "none") {
      this.disable();
    } else {
      this.enable();
    }
  }
}
