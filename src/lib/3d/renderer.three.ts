import {
  DirectionalLight,
  DirectionalLightHelper,
  PerspectiveCamera, Scene, WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

class Engine {
  scene: Scene;

  camera: any;

  controls: OrbitControls;

  renderer: WebGLRenderer;

  public static instance: Engine;

  public static shared() {
    if (!Engine.instance) {
      Engine.instance = new Engine();
    }

    return Engine.instance;
  }

  init(canvas: HTMLCanvasElement) {
    this.scene = new Scene();

    this.renderer = new WebGLRenderer({ canvas });
    this.renderer.setClearColor(0xFFFFFF, 1);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    const light = new DirectionalLight(0xffffff, 1);
    light.position.set(3, 0, 5);
    light.target.position.set(0, 0, 0);
    this.scene.add(light);
    this.scene.add(light.target);

    function updateLight() {
      light.target.updateMatrixWorld();
    }
    updateLight();

    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 10;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.update();
  }

  importMesh(path: string) {
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/js/libs/draco/");
    loader.setDRACOLoader(dracoLoader);

    loader.load(path, (gltf) => {
      this.scene.add(gltf.scene);
    }, undefined, (error) => {
      console.error(error);
    });
  }

  run() {
    const animate = () => {
      window.requestAnimationFrame(animate);

      this.controls.update();

      this.renderer.render(this.scene, this.camera);
    };

    animate();
  }
}

export default Engine;
