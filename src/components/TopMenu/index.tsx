import React, { useState } from "react";
import styled from "@emotion/styled";
import {
  Box,
  Button, Grid, Switch,
} from "@mui/material";
import AddObjectModal from "components/AddObjectModal";
import Text from "components/Text";
import {
  useItems, useMode, useVocselApi, useActiveItem,
} from "store/store";

const StyledTopMenu = styled.div`
  width: 100%;
  height: 50px;
  // backdrop-filter: blur(20px) brightness(160%);
`;

const StyledGrid = styled(Grid)`
  height: 50px;
`;

const TopMenu = () => {
  const [mode, setMode] = useMode();
  const [addObjectModalVisible, setAddObjectModalVisible] = useState(false);
  const [vocselApi, _] = useVocselApi();
  const [items] = useItems();
  const [activeItem] = useActiveItem();

  return (
    <StyledTopMenu>
      <AddObjectModal
        open={addObjectModalVisible}
        onClose={() => setAddObjectModalVisible(false)}
      />

      <StyledGrid container spacing={2}>
        <StyledGrid item xs={12} sm={6}>
          {
            mode === "edit"
              ? (
                <Box sx={{
                  display: "flex",
                  alignItems: "center",
                  height: "50px",
                  pl: 1,
                }}
                >
                  <Button
                    sx={{ mr: 1 }}
                    variant="contained"
                    onClick={() => setAddObjectModalVisible(true)}
                  >
                    Add Item
                  </Button>

                  <Button
                    sx={{ mr: 1 }}
                    variant="outlined"
                    color="error"
                    onClick={async () => {
                      (await vocselApi?.db.document("item"))?.delete({ id: items[activeItem].id }).then(() => window.location.reload());
                    }}
                  >
                    Delete Item
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    onClick={async () => {
                      (await vocselApi?.db.document("item"))?.flush().then(() => window.location.reload());
                    }}
                  >
                    Clear All
                  </Button>
                </Box>
              ) : null
          }
        </StyledGrid>
        <StyledGrid item xs={12} sm={6}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              height: "50px",
              pr: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Text size="sm" family={`Poppins-${mode === "preview" ? "Bold" : "Regular"}`}>Preview</Text>
              <Switch
                checked={mode === "edit"}
                onClick={() => setMode(mode === "edit" ? "preview" : "edit")}
              />
              <Text size="sm" family={`Poppins-${mode === "edit" ? "Bold" : "Regular"}`}>Edit</Text>
            </Box>
          </Box>
        </StyledGrid>
      </StyledGrid>
    </StyledTopMenu>
  );
};

export default TopMenu;
