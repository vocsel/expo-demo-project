import React, { useEffect, useState } from "react";
import {
  Backdrop, Box, Fade, Modal,
} from "@mui/material";
import Text from "components/Text";
import CloseIcon from "@mui/icons-material/Close";

interface IProps {
  open: boolean;
  children?: React.ReactNode;
  title?: React.ReactNode;
  onClose?: () => void;
}

const style = {
  wrapper: {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "95%", sm: "50%" },
  },
  content: {
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  },
};

const CoreModal = ({
  open, onClose, children, title,
}: IProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(open);
  }, [open]);

  const onCloseModal = () => {
    setVisible(false);

    if (onClose) {
      setTimeout(() => onClose(), 100);
    }
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={visible}
      onClose={onCloseModal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={visible}>
        <Box sx={style.wrapper}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            {title ? <Text color="#fff">{title}</Text> : null}
            <Text color="#fff">
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CloseIcon onClick={onCloseModal} />
              </Box>
            </Text>
          </Box>
          <Box sx={style.content}>
            {children}
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default CoreModal;
