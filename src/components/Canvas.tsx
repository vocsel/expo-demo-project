import React, { useEffect, useState } from "react";
import Renderer from "lib/3d/renderer.babylon";
import { useActiveItem, useItems } from "store/store";

const Canvas = () => {
  const [items] = useItems();
  const [renderer, setRenderer] = useState<Renderer>();

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
      if (items.length && renderer) {
        await Promise.all(
          items.map(async ({ file: { sharedLink } }, i): Promise<void> => {
            const node = await renderer.importMesh(sharedLink);
            items[i].node = node.meshes[0];
            // items[i].node.position.z = 2;

            if (i > 0) {
              items[i].node.setEnabled(false);
            }
          }),
        );

        // renderer.scene.rootNodes.slice(-1)[0].position.z = -5;
        // renderer.scene.rootNodes.slice(-1)[0].isPickable = true;
        // renderer.scene.onPointerDown = function (evt, pickResult) {
        //   if (pickResult.hit) {
        //     meshes[1].meshes.forEach((m) => m.dispose());
        //   }
        // };
      }
    }

    importMeshes();
  }, [items]);

  return (
    <canvas />
  );
};

export default Canvas;
