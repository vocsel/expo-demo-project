import { Mesh, Scene, Vector3 } from "@babylonjs/core";

interface IProps {
  width: number;
  height: number;
  depth: number;
  scene: Scene;
}

class Cube {
  public width: number;

  public height: number;

  public depth: number;

  public mesh: Mesh;

  constructor(props: IProps) {
    this.width = props.width;
    this.height = props.height;
    this.depth = props.depth;

    const mesh = Mesh.CreateBox(`box${Math.random()}`, 0, props.scene);
    mesh.scaling.x = this.width;
    mesh.scaling.y = this.height;
    mesh.scaling.z = this.depth;

    this.mesh = mesh;
  }

  set position(pos: Vector3) {
    this.mesh.position = pos;
  }

  get position() {
    return this.mesh.position;
  }

  set rotation(pos: Vector3) {
    this.mesh.rotation = pos;
  }

  get rotation() {
    return this.mesh.rotation;
  }
}

export default Cube;
