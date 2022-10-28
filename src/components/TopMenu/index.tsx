import React, { useState } from "react";
import styled from "@emotion/styled";
import {
  Box,
  Button, ButtonGroup, Grid,
} from "@mui/material";
import AddObjectModal from "components/AddObjectModal";
import Text from "components/Text";
import { useMode, useVocselApi } from "store/store";

const StyledTopMenu = styled.div`
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 50px;
  backdrop-filter: blur(20px) brightness(160%);
`;

const StyledGrid = styled(Grid)`
  height: 50px;
`;

const TopMenu = () => {
  const [mode, setMode] = useMode();
  const [addObjectModalVisible, setAddObjectModalVisible] = useState(false);
  const [vocselApi, _] = useVocselApi();

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
                  <Box sx={{ pr: 1 }}>
                    <Button
                      variant="contained"
                      onClick={() => setAddObjectModalVisible(true)}
                    >
                      Add Item
                    </Button>
                  </Box>

                  <Button
                    variant="contained"
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
            <ButtonGroup aria-label="outlined primary button group">
              <Button
                variant="contained"
                color={mode === "edit" ? "primary" : "info"}
                onClick={() => setMode("edit")}
              >
                <Text size="sm" color="#fff">Edit</Text>
              </Button>
              <Button
                variant="contained"
                color={mode === "preview" ? "primary" : "info"}
                onClick={() => setMode("preview")}
              >
                <Text size="sm" color="#fff">Preview</Text>
              </Button>
            </ButtonGroup>
          </Box>
        </StyledGrid>
      </StyledGrid>
    </StyledTopMenu>
  );
};

export default TopMenu;
