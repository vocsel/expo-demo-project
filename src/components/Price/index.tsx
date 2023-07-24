import { Box, Button } from "@mui/material";
import Text from "components/Text";
import { hasAccessRights } from "lib/helpers";
import React from "react";
import {
  useActiveItem, useItems, useMode, useVocselApi,
} from "store/store";

const Price = ({ price }) => {
  const [mode] = useMode();
  const [items] = useItems();
  const [activeItem] = useActiveItem();
  const [vocselApi] = useVocselApi();

  const edit = () => {
    alert(items[activeItem].priceUSD);
  };

  return (
    <Box
      sx={{
        p: 2,
        right: "24px",
        bottom: "24px",
        width: "300px",
        position: "absolute",
        border: "1px solid #000",
        bgcolor: "#fff",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
        <Text size="mds">
          Price: $
          {price}
        </Text>
      </Box>

      {
       hasAccessRights(vocselApi?.accessRights) && mode === "edit" ? (
         <Button
           variant="contained"
           fullWidth
           size="large"
           color="warning"
           onClick={edit}
         >
           <Text>
             Edit Price
           </Text>
         </Button>
       ) : (
         <Button
           variant="contained"
           fullWidth
           size="large"
           sx={{ bgcolor: "#3ee692", "&:hover": { bgcolor: "#3ee692" } }}
         >
           <Text>
             Purchase
           </Text>
         </Button>
       )
      }
    </Box>
  );
};

export default Price;
