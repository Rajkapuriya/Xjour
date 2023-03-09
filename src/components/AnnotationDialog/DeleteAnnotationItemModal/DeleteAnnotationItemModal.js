import { useState } from "react";
import { useAlert } from "react-alert";
import { useStateValue } from "config/context api/StateProvider";
import CircularProgress from "@mui/material/CircularProgress";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "components/Atoms/Button/Button";
import MuiModal from "components/Atoms/MuiModal/MuiModal";
import { deleteAnnotationItem } from "config/authentication/AuthenticationApi";
import { UNAUTH_KEY } from "assets/constants/Contants";
import './DeleteAnnotationItemModal.css';
export default function DeleteAnnotationItemModal(props) {
    const {
        isOpen,
        handleModalToggle,
        annotationItemToDelete,
    } = props;
    const [isDeleting, setIsDeleting] = useState(false);
    const [{ userToken, reducerVisitorID }, dispatch] =
        useStateValue();
    const customAlert = useAlert();
    const handleDeleteAnnotationItem = (event) => {
        event.preventDefault();
        setIsDeleting(true);
        deleteAnnotationItem(annotationItemToDelete.pk, userToken, reducerVisitorID).then(function (val) {
            setIsDeleting(false);
            handleModalToggle();
            if (val.status === UNAUTH_KEY) {
                // console.log("Setting to 0");
                localStorage.setItem("user-info-token", 0);
                dispatch({
                    type: "SET_USER_TOKEN",
                    reducerUserToken: 0,
                });
            }
        });
    }
    return (
        <MuiModal
            isModalOpen={isOpen}
            closeModalHandler={!isDeleting ? () => handleModalToggle() : null}
            modalTitle="Delete Annotation Item"
            modalHeaderIcon={<DeleteIcon />}
            modalWidth="80%"
        >
            <div className="delete-annotation-item-modal">
                <p className="delete-annotation-item-modal__confirmation-text">
                    Delete this Annotation item? <b>{annotationItemToDelete.type}:{annotationItemToDelete?.textValue}</b>
                </p>

                {isDeleting && (
                    <div className="delete-annotation-item-modal__loader">
                        <CircularProgress />
                    </div>
                )}

                <div className="delete-annotation-item-modal__action-buttons">
                    <Button
                        text="Delete"
                        variant="filled"
                        fontSize="medium"
                        isDisabled={isDeleting}
                        onClick={(event) => handleDeleteAnnotationItem(event)}
                    />
                    <Button
                        text="Cancel"
                        fontSize="medium"
                        isDisabled={isDeleting}
                        onClick={() => handleModalToggle()}
                    />
                </div>
            </div>
        </MuiModal>
    );
}
