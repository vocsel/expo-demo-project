import { Mesh, Scene } from "@babylonjs/core";

export type SceneObjects = Record<string, Mesh>;

export interface ISceneHolder {
  init: (scene: Scene, canvas: HTMLCanvasElement, objects: SceneObjects) => void;
  render: () => void;
}
