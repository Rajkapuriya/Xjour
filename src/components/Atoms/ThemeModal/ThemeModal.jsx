import "./ThemeModal.css";

import { Box, Modal } from "@mui/material";

import { Close } from "@mui/icons-material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80vw",
  maxWidth: "600px",
  height: "auto",
  bgcolor: "#f8f8f8",
  border: "none",
  borderRadius: 2,
  boxShadow: 24,
  padding: "28px",
};

export default function ThemeModal(props) {
  const { isOpen, onCloseHandler, modalTitle } = props;

  return (
    <Modal open={isOpen} onClose={onCloseHandler}>
      <Box sx={style}>
        <header className="theme-modal__header">
          <h1 className="theme-modal__title">{modalTitle}</h1>

          <Close
            onClick={() => onCloseHandler()}
            className="theme-modal__close-icon"
          />
        </header>
        <main className="theme-modal__main">{props.children}</main>
      </Box>
    </Modal>
  );
}
