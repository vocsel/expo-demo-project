import React, { useEffect, useState } from "react";
import CoreModal from "components/CodeModal";
import styled from "@emotion/styled";
import {
  Box, Alert, Button,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Text from "components/Text";

const Input = styled("input")({
  display: "none",
});

const AddObjectModalVisible = ({ open, onClose }) => {
  const [visible, setVisible] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  useEffect(() => {
    setVisible(open);
  }, [open]);

  return (
    <CoreModal title="Upload Item" open={visible} onClose={onClose}>
      <Alert severity="info">
        Supported image formats (
        <b>.pmg</b>
        ,
        {" "}
        <b>.jpeg</b>
        ,
        {" "}
        <b>.bmp</b>
        ) and 3d formats (
        <b>.glTF</b>
        )!
      </Alert>

      <br />

      <form>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <label htmlFor="icon-button-file">
            <Input accept="image/*" id="icon-button-file" type="file" />
            <Button variant="contained" component="span" endIcon={<PhotoCamera />}>
              Click to upload
            </Button>
          </label>
        </Box>

        {
          uploadedFile ? (
            <>
              <hr />

              ads
            </>
          ) : null
        }
      </form>
    </CoreModal>
  );
};

export default AddObjectModalVisible;
