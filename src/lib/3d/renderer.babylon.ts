import {
  Engine, ArcRotateCamera, Scene, Vector3, HemisphericLight, SceneLoader, Color3,
} from "@babylonjs/core";

class Renderer {
  private canvas: HTMLCanvasElement;

  public scene: Scene;

  private engine: Engine;

  private camera: any;

  public static instance: Renderer;

  public static shared() {
    if (!Renderer.instance) {
      Renderer.instance = new Renderer();
    }

    return Renderer.instance;
  }

  init(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    this.engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });

    this.scene = new Scene(this.engine);

    this.scene.clearColor = new Color3(0.5, 0.5, 0.5);

    // this.setUpScene();

    // this.setUpEvents();

    new HemisphericLight("light", new Vector3(1, 0.5, 0));

    this.setUpCamera();
  }

  setBackground(r: number, g: number, b: number) {
    this.scene.clearColor = new Color3(r, g, b);
  }

  setUpCamera() {
    const camera = new ArcRotateCamera("Camera", -Math.PI, Math.PI / 2.2, 10, Vector3.Zero());

    camera.attachControl(this.canvas, true);

    this.camera = camera;

    this.scene.activeCamera = camera;
  }

  importMesh(path: string) {
    return SceneLoader.ImportMeshAsync("", "", path, this.scene, undefined, ".glb");
  }

  run() {
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });

    window.addEventListener("resize", () => this.engine.resize());
  }
}

export default Renderer;
