import {
  ArcRotateCamera, Engine, FreeCamera, HemisphericLight, KeyboardEventTypes, MeshBuilder, Scene, TransformNode, UniversalCamera, Vector3,
} from "@babylonjs/core";
import House from "./objects/House";
import Player from "./objects/Player";

class MountPoint {
  private readonly canvas: HTMLCanvasElement;

  public scene: Scene;

  private readonly engine: Engine;

  private readonly player: Player;

  private camera: any;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    this.engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });

    this.scene = new Scene(this.engine);

    // this.setUpScene();

    // this.setUpEvents();

    this.setUpCamera();
  }

  setUpCamera() {
    // const camera = new ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 4, 4, Vector3.Zero());

    const camera = new FreeCamera("cam", new Vector3(0, 1, -3), this.scene);
    camera.fov = 0.47350045992678597;
    // camera.lockedTarget = this.player.mesh.position;
    camera.attachControl(this.canvas, true);

    this.camera = camera;

    this.scene.activeCamera = camera;
  }

  setUpScene() {
    const light = new HemisphericLight("light", new Vector3(1, 0.5, 0));

    const ground = MeshBuilder.CreateGround("ground", { height: 5, width: 5, subdivisions: 2 });

    new House(this.scene).build();

    this.player = new Player(this.scene);
  }

  setUpEvents() {
    this.scene.onKeyboardObservable.add((kbInfo) => {
      switch (kbInfo.type) {
        case KeyboardEventTypes.KEYDOWN:
          console.log("KEY DOWN: ", kbInfo.event.key);

          this.player.move(kbInfo.event.key);
          break;
        case KeyboardEventTypes.KEYUP:
          console.log("KEY UP: ", kbInfo.event.code);
          break;
        default: break;
      }

      this.camera.position = new Vector3(this.player.mesh.position.x, 1, this.player.mesh.position.z - 3);
    });
  }

  mount() {
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });

    window.addEventListener("resize", () => this.engine.resize());
  }
}

export default MountPoint;
