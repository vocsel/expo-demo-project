import { Box, Button, Popover } from "@mui/material";
import Renderer from "lib/3d/renderer.babylon";
import React, { useEffect, useState } from "react";
import { SketchPicker } from "react-color";
import {
  useActiveItem, useItems, useMode, useVocselApi,
} from "store/store";

const renderer = Renderer.shared();

const BackgroundToggler = () => {
  const [mode] = useMode();
  const [items] = useItems();
  const [vocselApi] = useVocselApi();
  const [activeItem] = useActiveItem();
  const [selectedBackground, setSelectedBackground] = useState("#fff");
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  useEffect(() => {
    setSelectedBackground(items[activeItem]?.background.hex);
  }, [activeItem]);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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

    if (mode === "edit") {
      await doc?.updateOne(
        { id: items[activeItem].id },
        { background },
      );
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        left: "24px",
        bottom: "24px",
        position: "absolute",
        bgcolor: "transparent",
      }}
    >
      {
        mode === "edit" ? (
          <>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                sx={{ color: "#000", border: "1px solid #000", bgcolor: "#fff" }}
                variant="contained"
                onClick={handleClick}
              >
                Background
                {" "}
                <Box
                  sx={{
                    width: "20px",
                    height: "20px",
                    ml: 1,
                    backgroundColor: selectedBackground,
                  }}
                />
              </Button>
            </Box>
            <Popover
              id={id}
              open={open}
              onClose={handleClose}
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              <SketchPicker
                color={selectedBackground}
                onChangeComplete={handleChangeComplete}
              />
            </Popover>
          </>
        ) : null
      }
    </Box>
  );
};

export default BackgroundToggler;
