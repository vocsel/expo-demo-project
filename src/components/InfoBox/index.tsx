import React, { useCallback, useEffect, useState } from "react";
import {
  useActiveItem, useItems, useMode, useVocselApi,
} from "store/store";
import { Box, Divider } from "@mui/material";
import styled from "@emotion/styled";
import { File } from "vocsel-api/dist/objects/file";
import Text from "components/Text";
import Renderer from "lib/3d/renderer.babylon";
import { Vector3 } from "@babylonjs/core";

const ControlButtonsPanel = styled(Box)`
  width: 300px;
  margin-top: 20px;
  height: 50px;
  background-color: rgba(255,255,255,1);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: rgba(89, 89, 89, 0.75) 0px 4px 12px -8px;
  display: flex;
  align-items: center;
`;

const ControlButton = styled(Box)`
  height: 50px;
  width: 150px;
  color: #000;
  font-size: 32px;

  &:hover {
    background-color: #f9f9f9;
    cursor: pointer;
  }
`;

const StyledDivider = styled(Divider)`
  background-color: #808080;
  margin: 10px 0px
`;

const renderer = Renderer.shared();

let saveItemPositionInterval;

const InfoBox = () => {
  const [activeItem, setActiveItem] = useActiveItem();
  const [items, setItems] = useItems();
  const [mode] = useMode();
  const [vocselApi] = useVocselApi();
  const [selectedBackground, setSelectedBackground] = useState("#808080");

  const setRendererBackground = (rgb) => {
    if (rgb) {
      const r = rgb.r / 255;
      const g = rgb.g / 255;
      const b = rgb.b / 255;

      renderer.setBackground(r, g, b);
    }
  };

  const setCheckItemPositionInterval = (newActiveItem) => {
    clearInterval(saveItemPositionInterval);

    if (items) {
      saveItemPositionInterval = setInterval(async () => {
        const { x, y, z } = renderer.camera.position;
        items[newActiveItem].position = { x, y, z };

        if (mode === "edit") {
          const doc = await vocselApi?.db.document("item");

          doc?.updateOne(
            { id: items[newActiveItem].id },
            { position: { x, y, z } },
          );
        }
      }, 1000);
    }
  };

  const activateItem = (newActiveItem: any) => {
    setCheckItemPositionInterval(newActiveItem);

    setActiveItem(newActiveItem);
  };

  async function deleteItem() {
    const doc = await vocselApi?.db.document("item");

    await doc?.delete({ id: items[activeItem].id });
    items[activeItem].node.dispose();

    const newItems = await doc.findMany();

    setItems(newItems.map((item) => ({
      ...item,
      file: new File(item.file),
    })));
  }

  const updateItemsPosition = useCallback(() => {
    if (!renderer.camera) {
      return;
    }

    if (items[activeItem] && items[activeItem].background) {
      setRendererBackground(items[activeItem].background?.rgb);

      setSelectedBackground(items[activeItem].background?.hex);
    }

    renderer.setUpCamera();

    items.forEach((item, i) => {
      item.node.setEnabled(i === activeItem);

      if (i === activeItem) {
        if (item.mimetype.match(/^image\/.+/)) {
          renderer.camera.lowerAlphaLimit = Math.PI * 0.9;
          renderer.camera.upperAlphaLimit = Math.PI * 1.1;
          renderer.camera.lowerBetaLimit = Math.PI / 3;
          renderer.camera.upperBetaLimit = Math.PI * 0.6;
          renderer.camera.lowerRadiusLimit = 2;

          renderer.camera.radius = 10;
        } else {
          renderer.camera.radius = 50;
        }

        if (item.position) {
          const { x, y, z } = item.position;
          renderer?.camera.setPosition(new Vector3(x, y, z));
        }
      }
    });
  }, [items, activeItem]);

  useEffect(() => {
    updateItemsPosition();
  }, [updateItemsPosition]);

  useEffect(() => {
    if (activeItem) {
      setCheckItemPositionInterval(activeItem);
    }
  }, []);

  useEffect(() => {
    if (mode === "edit") {
      setCheckItemPositionInterval(activeItem);
    } else {
      clearInterval(saveItemPositionInterval);
    }
  }, [mode]);

  return items.length ? (
    <Box sx={{ p: 2 }}>
      <>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Text size="md">
              {/* {items[activeItem]?.title} */}
            </Text>
          </Box>

          {
            items[activeItem]?.description ? (
              <>
                <Text color="#000">Description:</Text>

                <Box
                  sx={{
                    maxHeight: "60vh",
                    overflowY: "auto",
                    borderLeft: "2px solid #000",
                    p: 1,
                  }}
                >
                  <Text color="#000" size="sm">
                    {items[activeItem]?.description?.split("\n").map((line) => <div>{line}</div>)}
                  </Text>
                </Box>
              </>
            ) : null
          }
        </Box>

        <Box
          sx={{
            position: "absolute",
            bottom: "24px",
            width: "calc(100% - 32px)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <ControlButtonsPanel>
              <ControlButton
                sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                onClick={() => activateItem(activeItem === 0 ? items.length - 1 : activeItem - 1)}
              >
                &larr;
              </ControlButton>

              <ControlButton
                sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                onClick={() => activateItem(activeItem === items.length - 1 ? 0 : activeItem + 1)}
              >
                &rarr;
              </ControlButton>
            </ControlButtonsPanel>
          </Box>
        </Box>
      </>
    </Box>
  ) : null;
};

export default InfoBox;
