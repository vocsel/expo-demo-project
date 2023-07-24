import {
  Box,
  Button, Card, CardActionArea, CardActions, CardContent, CardMedia,
} from "@mui/material";
import Text from "components/Text";
import React, { useState } from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeleteBadge from "components/DeleteBadge";
import { useItems, useMode, useVocselApi } from "store/store";
import Freezer from "components/Freezer";
import Spinner from "components/Spinner";
import { File } from "vocsel-api/dist/objects/file";

const ItemCard = ({ item }) => {
  const [_, setItems] = useItems();
  const [vocselApi] = useVocselApi();
  const [isDeleting, setIsDeleting] = useState(false);
  const [mode] = useMode();

  const onDelete = () => {
    setIsDeleting(true);

    setTimeout(async () => {
      const doc = await vocselApi?.db.document("item");

      await doc.delete({ id: item.id });

      setIsDeleting(false);

      const items = await doc.findMany();

      setItems(
        items.map((i) => ({
          ...i,
          file: new File(i.file),
        })),
      );
    }, 1000);
  };

  return (
    <Freezer
      message={(
        <Box>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Spinner />
          </Box>

          <br />

          <Text color="#fff" align="center">Deleting items...</Text>
        </Box>
        )}
      show={isDeleting}
    >
      <DeleteBadge onDelete={mode === "edit" ? onDelete : null}>
        <Card>
          <CardActionArea>
            <CardMedia
              component="img"
              height="300"
              image="/assets/images/no-image.svg"
              alt="green iguana"
            />
            <CardContent>
              <Text>
                {item.title}
              </Text>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
              <Button size="small" color="primary" endIcon={<ShoppingCartIcon />}>
                Add
              </Button>

              <Button size="small" color="primary">
                Details
              </Button>
            </Box>
          </CardActions>
        </Card>
      </DeleteBadge>
    </Freezer>
  );
};

export default ItemCard;
