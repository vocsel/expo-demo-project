import React, { useEffect } from "react";
import MountPoint from "lib/mount-point";
import { SceneLoader } from "@babylonjs/core";

const Canvas = () => {
  useEffect(() => {
    const canvas = document.querySelector("canvas") as HTMLCanvasElement;

    const mountPoint = new MountPoint(canvas);
    mountPoint.mount();

    // Create a default skybox with an environment.
    // const hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("textures/environment.dds", scene);
    // const currentSkybox = scene.createDefaultSkybox(hdrTexture, true);

    // Append glTF model to scene.
    SceneLoader.ImportMesh("", "assets/meshes/", "yellow_brick_4k.gltf", mountPoint.scene, (scene) => {
      // Create a default arc rotate camera and light.
      // scene.createDefaultCameraOrLight(true, true, true);

      // The default camera looks at the back of the asset.
      // Rotate the camera by 180 degrees to the front of the asset.
      // scene.activeCamera.alpha += Math.PI;
    });
  }, []);

  return (
    <canvas />
  );
};

export default Canvas;
