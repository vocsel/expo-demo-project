import React, { useEffect, useState } from "react";
import CoreModal from "components/CoreModal";
import styled from "@emotion/styled";
import {
  Box, Alert, Button, TextField, FormHelperText, Divider,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { useFormik } from "formik";
import "@babylonjs/loaders/glTF";
import { useItems, useVocselApi } from "store/store";
import * as Yup from "yup";

const Input = styled("input")({
  display: "none",
});

const validationSchema = Yup.object().shape({
  files: Yup.mixed(),
  title: Yup.string().required("Required"),
  description: Yup.string(),
  priceUSD: Yup.number(),
});

const AddObjectModal = ({ open, onClose }) => {
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [vocselApi, _] = useVocselApi();
  const [items, setItems] = useItems();

  const onSubmit = async ({
    title,
    priceUSD,
    description,
    files,
  }) => {
    try {
      const data = new FormData();

      data.append("file", files[0]);

      const insertedFile = await vocselApi.storage.upload({
        data,
      });

      const itemDocument = await vocselApi?.db.document("item");
      await itemDocument?.insert({
        title,
        priceUSD,
        description,
        file: insertedFile,
      });

      onClose();

      itemDocument?.findMany().then(setItems);
    } catch (err) {
      setError(err);
    }
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      priceUSD: "",
      description: "",
      files: [],
    },
    validationSchema,
    onSubmit,
  });

  const onUploadFiles = (e) => {
    formik.setFieldValue("files", e.target.files);

    const files = Array.from(e.target.files);

    setUploadedFile(files[0].name);
  };

  useEffect(() => {
    setVisible(open);
  }, [open]);

  return (
    <CoreModal title="Upload Item" open={visible} onClose={onClose}>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <TextField
            fullWidth
            id="title"
            name="title"
            label="Title of an item..."
            variant="outlined"
            onChange={formik.handleChange}
            autoComplete="off"
          />
          {formik.errors.title ? <FormHelperText error>{formik.errors.title}</FormHelperText> : null}
        </div>

        <br />

        <div>
          <TextField
            fullWidth
            id="priceUSD"
            name="priceUSD"
            label="Price in USD"
            type="number"
            variant="outlined"
            onChange={formik.handleChange}
            autoComplete="off"
          />
          {formik.errors.priceUSD ? <FormHelperText error>{formik.errors.priceUSD}</FormHelperText> : null}
        </div>

        <br />

        <div>
          <TextField
            fullWidth
            multiline
            id="description"
            name="description"
            label="Description of an item"
            variant="outlined"
            onChange={formik.handleChange}
            autoComplete="off"
          />
          {formik.errors.description ? <FormHelperText error>{formik.errors.description}</FormHelperText> : null}
        </div>

        <br />

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
          ,
          {" "}
          <b>.glb</b>
          )!
        </Alert>

        <br />

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <label htmlFor="icon-button-file">
            <Input accept="image/*,.gltf,.glb,.obj,.fbx" id="icon-button-file" type="file" onChange={onUploadFiles} />

            <Button variant="contained" component="span" endIcon={<PhotoCamera />}>
              Click to upload a file
            </Button>
          </label>
        </Box>

        {
          uploadedFile ? (
            <>
              <br />

              <Divider />

              <br />

              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button type="submit">Submit</Button>
              </Box>
            </>
          ) : null
        }

        {error ? (
          <>
            <br />

            <Alert severity="error" className="anim-pulse">
              {error.message}
            </Alert>
          </>
        ) : null}
      </form>
    </CoreModal>
  );
};

export default AddObjectModal;
