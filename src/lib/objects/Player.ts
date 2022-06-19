import { Mesh, Scene, Vector3 } from "@babylonjs/core";

class Player {
  private readonly scene;

  public mesh: Mesh;

  constructor(scene: Scene) {
    this.scene = scene;
    this.mesh = Mesh.CreateSphere("sphere", 10, 0.1, this.scene);
    this.mesh.position = new Vector3(0, 0.05, 0);
  }

  move(direction: string) {
    let coords;

    switch (direction) {
      case "w":
        coords = ["z", 0.1];
        break;
      case "s":
        coords = ["z", -0.1];
        break;
      case "a":
        coords = ["x", -0.1];
        break;
      case "d":
        coords = ["x", 0.1];
        break;
      default: break;
    }

    const [axis, speed] = coords;

    this.mesh.position[axis] += speed;
  }
}

export default Player;
