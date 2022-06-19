import { Scene, Vector3 } from "@babylonjs/core";
import { deg } from "lib/helpers";
import Cube from "./Cube";

class House {
  private readonly scene;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  build() {
    const wall1 = new Cube({
      height: 0.5,
      width: 2,
      depth: 0.02,
      scene: this.scene,
    });

    wall1.position = new Vector3(1 - wall1.depth / 2, wall1.height / 2, 0);
    wall1.rotation = new Vector3(0, deg(90), 0);

    const wall2 = new Cube({
      height: 0.5,
      width: 2,
      depth: 0.02,
      scene: this.scene,
    });

    wall2.position = new Vector3(-1, wall2.height / 2, 0);
    wall2.rotation = new Vector3(0, deg(90), 0);

    const wall3 = new Cube({
      height: 0.5,
      width: 2,
      depth: 0.02,
      scene: this.scene,
    });

    wall3.position = new Vector3(0, wall3.height / 2, 1);
  }
}

export default House;
