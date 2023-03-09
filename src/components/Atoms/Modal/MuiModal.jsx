import "./MuiModal.css";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

export default function MuiModal(props) {
  const {
    isModalOpen,
    closeModalHandler,
    modalTitle = "Modal Title",
    modalHeaderIcon = null,
    modalType,
    modalWidth = "max-content",
    modalHeight = "auto",
  } = props;

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    minWidth: 300,
    width: modalWidth,
    maxWidth: 600,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 3,
    height: modalHeight,
  };

  return (
    <div className="modal">
      <Modal
        open={isModalOpen}
        onClose={() => closeModalHandler(modalType)}
        aria-labelledby="modal-modal-title"
      >
        <Box sx={style}>
          <div className="modal__header">
            <div className="modal__header-icon">{modalHeaderIcon}</div>
            <h1 className="modal__heading" id="modal-modal-title">
              {modalTitle}
            </h1>
          </div>
          <div className="modal__body">{props.children}</div>
        </Box>
      </Modal>
    </div>
  );
}
