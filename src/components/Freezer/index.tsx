import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";

interface IProps {
  message?: any;
  show?: boolean;
  children: React.ReactNode;
}

const Freezer = ({ message = null, show = false, children }: IProps) => {
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsShow(show);
    }, 300);
  }, [show]);

  return (
    <Box sx={{ position: "relative" }}>
      {
      isShow ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            zIndex: 1,
            backdropFilter: "blur(20px) brightness(100%)",
            width: "100%",
            height: "100%",
          }}
          className={`anim-fade-${show ? "in" : "out"}`}
        >
          {message}
        </Box>
      ) : null
    }
      {children}
    </Box>
  );
};

export default Freezer;
