import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Canvas from "components/Canvas";
import InfoBox from "components/InfoBox";
import {
  useActiveItem, useIsInitialized, useItems, useMode, useVocselApi,
} from "store/store";
import Text from "components/Text";
import TopMenu from "components/TopMenu";
import Freezer from "components/Freezer";
import Spinner from "components/Spinner";
import { TextField } from "@mui/material";
import Price from "components/Price";
import { hasAccessRights } from "lib/helpers";
import BackgroundToggler from "components/BackgroundToggler";

const drawerWidth = 400;

export default function ClippedDrawer() {
  const [isInitialized] = useIsInitialized();
  const [vocselApi] = useVocselApi();
  const [mode] = useMode();
  const [title, setTitle] = useState<string>("...");
  const [activeItem] = useActiveItem();
  const [items] = useItems();

  useEffect(() => {
    async function init() {
      const t = (await vocselApi?.db.dict.get("title") || "Lorem Ipsum");

      setTitle(t);
    }

    if (vocselApi) {
      init();
    }
  }, [vocselApi]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "#fff",
          boxShadow: "0px 4px 12px -8px rgba(89,89,89,0.75)",
        }}
      >
        <Toolbar>
          {
            hasAccessRights(vocselApi?.accessRights) && mode === "edit"
              ? (
                <TextField
                  fullWidth
                  id="title"
                  name="title"
                  variant="outlined"
                  sx={{ width: "200px" }}
                  size="small"
                  placeholder="Title (optional)"
                  value={title}
                  onChange={(e) => {
                    vocselApi?.db.dict.set("title", e.target.value);

                    setTitle(e.target.value);
                  }}
                  autoComplete="off"
                  className="anim-pulse"
                />
              )
              : (
                <Text
                  size="mds"
                  sx={{ width: "200px" }}
                  className="anim-pulse"
                >
                  {title}
                </Text>
              )
          }
          { hasAccessRights(vocselApi?.accessRights) ? <TopMenu /> : null }
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          { isInitialized ? <InfoBox /> : null }
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          position: "relative",
          bgcolor: isInitialized ? items[activeItem]?.background?.rgb : "#fff",
        }}
      >
        <Freezer
          message={(
            <Box>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Spinner />
              </Box>

              <br />

              <Text color="#fff" align="center">Loading data...</Text>
            </Box>
        )}
          show={!isInitialized}
        >
          <Canvas />

          {
            isInitialized ? (
              items[activeItem]?.priceUSD
                ? <Price price={items[activeItem]?.priceUSD} /> : null
            ) : null
          }

          {
            isInitialized ? (
              <BackgroundToggler />
            ) : null
          }
        </Freezer>
      </Box>
    </Box>
  );
}
