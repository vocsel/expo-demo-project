import React, { useState, useEffect } from "react";
import {
  AppBar, Box, Button, CssBaseline, Grid, InputAdornment, TextField, Toolbar,
} from "@mui/material";
import { useItems, useMode, useVocselApi } from "store/store";
import { hasAccessRights } from "lib/helpers";
import Text from "components/Text";
import TopMenu from "components/TopMenu";
import StyledTextField from "components/StyledForm/StyledTextField";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { debounce } from "lodash";
import TuneIcon from "@mui/icons-material/Tune";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ItemCard from "./ItemCard";

const Dashboard = () => {
  const [vocselApi] = useVocselApi();
  const [mode] = useMode();
  const [items] = useItems();
  const [itemsToShow, setItemsToShow] = useState([]);
  const [title, setTitle] = useState<string>("...");
  const [searchName, setSearchName] = useState<string>("");

  const updateFilters = ({ name }) => {
    setItemsToShow(items?.filter((item) => item.title.toLowerCase().includes(name.toLowerCase())));
  };

  useEffect(() => {
    async function init() {
      const t = (await vocselApi?.db.dict.get("title") || "Lorem Ipsum");

      setTitle(t);
    }

    if (vocselApi) {
      init();
    }
  }, [vocselApi]);

  useEffect(() => {
    setItemsToShow(items);
  }, [items]);

  return (
    <>
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
      <Box
        component="main"
        sx={{
          height: "100vh",
          overflowY: "auto",
          // bgcolor: "rgb(247, 249, 254)",
          p: { xs: 1, sm: 4 },
          paddingTop: "96px !important",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={2} md={3} />
          <Grid item xs={12} sm={8} md={6}>
            <StyledTextField
              sx={{ width: "100%", bgcolor: "#fff" }}
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              onKeyUp={
                debounce((e) => updateFilters({ name: e.target.value }), 300)
              }
              placeholder="Search..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchName ? (
                  <InputAdornment position="end">
                    <CloseIcon
                      className="clickable anim-pulse-on-hover"
                      onClick={() => {
                        setSearchName("");
                        updateFilters({ name: "" });
                      }}
                    />
                  </InputAdornment>
                ) : null,
              }}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Button
            startIcon={<TuneIcon />}
            endIcon={<ArrowForwardIosIcon />}
            sx={{ height: "100%", mr: 1 }}
          >
            Filter
          </Button>

          <Grid container spacing={4} sx={{ mt: 1 }}>
            {
              itemsToShow?.map((item) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                  <ItemCard item={item} />
                </Grid>
              ))
            }
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default Dashboard;
