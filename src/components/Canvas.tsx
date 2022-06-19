import React, { useEffect, useState } from "react";
import Renderer from "lib/3d/renderer.babylon";
import { useIsInitialized, useItems } from "store/store";
import {
  Color3, MeshBuilder, StandardMaterial, Texture, Vector3,
} from "@babylonjs/core";

const Canvas = () => {
  const [items] = useItems();
  const [renderer, setRenderer] = useState<Renderer>();
  const [_, setIsInitialized] = useIsInitialized();

  let canvas: HTMLCanvasElement;

  useEffect(() => {
    canvas = document.querySelector("canvas") as HTMLCanvasElement;

    const r = Renderer.shared();
    r.init(canvas);
    r.run();
    setRenderer(r);
  }, []);

  useEffect(() => {
    async function importMeshes() {
      if (items) {
        // renderer?.scene.meshes.map((m) => m.dispose());

        // renderer?.setUpLight();
        // renderer?.setUpCamera();

        await Promise.all(
          items.map(async ({ file: { sharedLink, mimetype } }, i): Promise<void> => {
            if (mimetype.match(/^image\/.+/)) {
              const materialPlane = new StandardMaterial("texturePlane", renderer.scene);
              materialPlane.diffuseTexture = new Texture(sharedLink, renderer.scene);
              materialPlane.specularColor = new Color3(0, 0, 0);

              const plane = MeshBuilder.CreatePlane("plane", { size: 5 }, renderer.scene);
              plane.rotation.y = Math.PI / 2;
              plane.material = materialPlane;

              items[i].node = plane;
            } else {
              const node = await renderer.importMesh(sharedLink);
              items[i].node = node.meshes[0];
            }

            items[i].mimetype = mimetype;
            items[i].node.setEnabled(false);
          }),
        ).then(() => {
          setIsInitialized(true);
        });
      }
    }

    importMeshes();
  }, [items, renderer, setIsInitialized]);

  return (
    <canvas />
  );
};

export default Canvas;
