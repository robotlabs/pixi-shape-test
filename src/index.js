import App from "./app";

//** load shapes data */
(() =>
  fetch("data/shapes.json")
    .then((response) => response.json())
    .then((response) => {
      const app = new App(response.shapes);
      app.init();
    }))();
