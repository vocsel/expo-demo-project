import React, { useCallback, useEffect, useState } from "react";
import {
  useActiveItem, useItems, useMode, useVocselApi,
} from "store/store";
import { Box, Button, Divider } from "@mui/material";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import MinimizeIcon from "@mui/icons-material/Minimize";
import styled from "@emotion/styled";
import { File } from "vocsel-api/dist/objects/file";
import Text from "components/Text";
import { SliderPicker } from "react-color";
import Renderer from "lib/3d/renderer.babylon";

interface IPanelProps {
  expanded: boolean;
  minimized?: boolean;
}

const Panel = styled.div<IPanelProps>`
  position: absolute;
  z-index: 1;
  bottom: 25px;
  right: 25px;
  width: ${({ expanded }) => (expanded ? "calc(100vw - 50px)" : "300px")};
`;

const PanelBody = styled.div<IPanelProps>`
  height: ${({ expanded, minimized }) => (minimized ? "auto" : expanded ? "calc(100vh - 175px)" : "50vh")};
  max-height: calc(100vh - 175px);
  background-color: #252525;
  color: #fff;
  font-size: 14px;
  padding: 10px;
  border-radius: 20px;
  overflow-y: auto;
  &>div {
    padding: 5px;    
  }
`;

const ControlButtonsPanel = styled.div<IPanelProps>`
  width: 300px;
  margin-top: 20px;
  height: 50px;
  background-color: #252525;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  justify-content: center;
`;

const ControlButton = styled(Box)`
  height: 50px;
  width: 150px;
  color: #fff;
  font-size: 32px;

  &:hover {
    background-color: rgba(0,0,0,0.6);
    cursor: pointer;
  }
`;

const StyledDivider = styled(Divider)`
  background-color: #808080;
  margin: 10px 0px
`;

const DescriptionBox = styled.div<IPanelProps>`
  ${({ expanded }) => (expanded ? "" : `
    max-height: 200px;
    overflow-y: auto;
  `)};
`;

const renderer = Renderer.shared();

const InfoBox = () => {
  const [activeItem, setActiveItem] = useActiveItem();
  const [items, setItems] = useItems();
  const [mode, __] = useMode();
  const [vocselApi, ___] = useVocselApi();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState("#808080");

  const setRendererBackground = (rgb) => {
    if (rgb) {
      const r = rgb.r / 255;
      const g = rgb.g / 255;
      const b = rgb.b / 255;

      renderer.setBackground(r, g, b);
    }
  };

  const handleChangeComplete = async (color) => {
    setRendererBackground(color.rgb);

    const doc = await vocselApi?.db.document("item");

    const background = { rgb: color.rgb, hex: color.hex };

    items[activeItem].background = background;
    setSelectedBackground(color.hex);

    await doc?.updateOne(
      { id: items[activeItem].id },
      { background },
    );
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
    if (items[activeItem] && items[activeItem].background) {
      setRendererBackground(items[activeItem].background?.rgb);

      setSelectedBackground(items[activeItem].background?.hex);
    }

    items.forEach((item, i) => {
      const rootNode = item?.node;

      if (rootNode) {
        rootNode.setEnabled(i === activeItem);
      }
    });
  }, [items, activeItem]);

  useEffect(() => {
    updateItemsPosition();
  }, []);

  useEffect(() => {
    updateItemsPosition();
  }, [updateItemsPosition]);

  return items.length ? (
    <Panel expanded={isExpanded}>
      {
        isMinimized ? (
          <PanelBody expanded={isExpanded} minimized={isMinimized}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              {items[activeItem]?.title}
              <Box>
                <AspectRatioIcon onClick={() => { setIsMinimized(false); setIsExpanded(!isExpanded); }} />
                <MinimizeIcon onClick={() => { setIsMinimized(!isMinimized); setIsExpanded(false); }} />
              </Box>
            </Box>
          </PanelBody>
        ) : (
          <>
            <PanelBody expanded={isExpanded}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                {items[activeItem]?.title}
                <Box>
                  <AspectRatioIcon onClick={() => { setIsMinimized(false); setIsExpanded(!isExpanded); }} />
                  <MinimizeIcon onClick={() => { setIsMinimized(!isMinimized); setIsExpanded(false); }} />
                </Box>
              </Box>

              <StyledDivider />

              <Text color="#fff">Background:</Text>

              <SliderPicker
                color={selectedBackground}
                onChangeComplete={handleChangeComplete}
              />

              {
                items[activeItem]?.priceUSD ? (
                  <Text color="#fff">
                    Price: $
                    {items[activeItem]?.priceUSD}
                  </Text>
                ) : null
              }

              {
                items[activeItem]?.description ? (
                  <DescriptionBox expanded={isExpanded}>
                    <Text color="#fff">Description:</Text>
                    <Text color="#fff" size="xs">
                      {items[activeItem]?.description?.split("\n").map((line) => <div>{line}</div>)}
                    </Text>
                  </DescriptionBox>
                ) : null
              }

              <br />

              {
                items[activeItem]?.priceUSD
                  ? mode === "preview" || process.env.NODE_ENV !== "production"
                    ? <Button variant="contained" fullWidth>Purchase</Button>
                    : <Button variant="contained" color="error" fullWidth onClick={deleteItem}>Delete item</Button>
                  : null
              }
            </PanelBody>

            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <ControlButtonsPanel expanded={isExpanded}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <ControlButton
                    sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                    onClick={() => setActiveItem(activeItem === 0 ? items.length - 1 : activeItem - 1)}
                  >
                    &larr;
                  </ControlButton>

                  <ControlButton
                    sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                    onClick={() => setActiveItem(activeItem === items.length - 1 ? 0 : activeItem + 1)}
                  >
                    &rarr;
                  </ControlButton>
                </Box>
              </ControlButtonsPanel>
            </Box>
          </>
        )
      }
    </Panel>
  ) : null;
};

export default InfoBox;
