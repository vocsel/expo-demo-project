import React, { useEffect, useState } from "react";
import CoreModal from "components/CoreModal";
import styled from "@emotion/styled";
import {
  Box, Alert, Button, TextField, FormHelperText, Divider, Switch, Grid,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { useFormik } from "formik";
import "@babylonjs/loaders/glTF";
import {
  useActiveItem, useIsInitialized, useItems, useVocselApi,
} from "store/store";
import * as Yup from "yup";
import Text from "components/Text";

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
  const [enablePrice, setEnablePrice] = useState(false);
  const [vocselApi] = useVocselApi();

  const onSubmit = async ({
    title,
    priceUSD,
    description,
    files,
  }) => {
    try {
      const data = new FormData();

      data.append("file", files[0]);

      const insertedFile = await vocselApi?.storage.upload({
        fileName: files[0].name,
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

      // setIsInitialized(false);

      // itemDocument?.findMany().then(setItems);

      window.location.reload();
    } catch (err) {
      console.log(">>>", err);
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
    <CoreModal title="Upload Item" open={visible} onClose={onClose} sizes={{ lg: "80%" }}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={8} md={5}>
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

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Text size="sm">Include price</Text>
              <Switch
                checked={enablePrice}
                onClick={() => setEnablePrice(!enablePrice)}
              />
            </Box>

            <br />

            {
              enablePrice ? (
                <>
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
                </>
              ) : null
            }

            <div>
              <TextField
                fullWidth
                multiline
                rows={5}
                id="description"
                name="description"
                label="Description of an item (Optional)"
                variant="outlined"
                onChange={formik.handleChange}
                autoComplete="off"
              />
              {formik.errors.description ? <FormHelperText error>{formik.errors.description}</FormHelperText> : null}
            </div>
          </Grid>
          <Grid item xs={12} sm={8} md={7}>
            <Text>Upload an Object's wallpaper</Text>
            <Box sx={{ border: "1px dashed rgb(1, 67, 97)", borderRadius: "10px", p: 1 }}>
              <Alert severity="info">
                Supported image formats (
                <b>.pmg</b>
                ,
                {" "}
                <b>.jpeg</b>
                ,
                {" "}
                <b>.bmp</b>
                )!
              </Alert>

              <br />

              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <label htmlFor="icon-button-file">
                  <Input accept="image/*" id="icon-button-file" type="file" onChange={onUploadFiles} />

                  <Button component="span" endIcon={<PhotoCamera />}>
                    Click to upload a wallpaper
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
            </Box>

            <br />

            <Text>Upload an Object to represent</Text>
            <Box sx={{ border: "1px dashed rgb(1, 67, 97)", borderRadius: "10px", p: 1 }}>
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

                  <Button component="span" endIcon={<PhotoCamera />}>
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
            </Box>
          </Grid>
        </Grid>

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
