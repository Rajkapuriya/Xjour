import React, { useEffect, useState } from 'react'
import { useStateValue } from "config/context api/StateProvider";
import { getPrivateDocument } from 'config/authentication/AuthenticationApi';
import { UNAUTH_KEY } from "assets/constants/Contants";
import './DisplayAnnotationImages.css';
const DisplayAnnotationImages = (props) => {
    const { imageId } = props;
    const [imageDetail, setImageDetail] = useState();
    const [{ userToken, reducerMemoryImages, reducerVisitorID }, dispatch] =
        useStateValue();
    useEffect(() => {
        getPrivateDocument(userToken, parseInt(imageId), reducerVisitorID).then(function (val) {
            if (val) {
                console.log("this is Image val", val);
                if (val.data !== null) {
                    const imageFile = val.data.dataBase64;
                    let srcValue = `data:image/jpg;base64, ${imageFile}`;
                    setImageDetail({
                        imageDetail, pk: val.data.pk,
                        documentName: val.data.documentName,
                        description: val.data.description,
                        img: srcValue,
                        fileName: val.data.fileName,
                        size: val.data.size,
                        versioning: val.data.versioning,
                        timestampRetention: val.data.timestampRetention
                    })
                }
            } else if (val.status === UNAUTH_KEY) {
                console.log("Setting to 0");
                localStorage.setItem("user-info-token", 0);
                dispatch({
                    type: "SET_USER_TOKEN",
                    reducerUserToken: 0,
                });
            }
        });
    }, []);
    return (
        <>
            <img className="annotation_images"
                src={imageDetail?.img}
                alt=""
            />
        </>
    )
}

export default DisplayAnnotationImages