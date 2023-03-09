import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import { Oval } from "react-loader-spinner";
import { useAlert } from "react-alert";

import "./Profile.css";

import {
  baseURL,
  preferActivity,
  preferDestination,
} from "assets/strings/Strings";
import { UNAUTH_KEY } from "assets/constants/Contants";

import {
  addBase64ProfileAvatar,
  getCountryFlags,
  getDocumentByName,
  getProfileValue,
  updateCountryIso,
  userUpdatePersonalProfile,
  userUpdateProfileConfigurations,
} from "config/authentication/AuthenticationApi";
import { useStateValue } from "config/context api/StateProvider";

import { Box, Modal, Switch } from "@mui/material";
import { Close, Edit } from "@mui/icons-material";

import Cropper from "../../components/Cropper/Cropper";
import PreferenceItem from "../../components/auth/preference/PreferenceItem";
import Dropdown from "../../components/React Dropdown/Dropdown";
import ImageUploaderBox from "../../components/Image Uploader Box/ImageUploaderBox";
import ToggleBar from "components/Atoms/Toggler/ToggleBar/ToggleBar";
import ToggleBarElement from "components/Atoms/Toggler/ToggleBar/ToggleBarElement";
import ButtonAtom from "components/Atoms/Button/Button";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

function Profile() {
  const [
    {
      userToken,
      reducerUserDATA,
      reducerUserImage,
      reducerVisitorID,
      reducerMemoryImages,
    },
    dispatch,
  ] = useStateValue();
  const [memoryImagesArray, setMemoryImagesArray] =
    useState(reducerMemoryImages);
  const label = { inputProps: { "aria-label": "Switch demo" } };
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);

  const [loading, isLoading] = useState(true);

  const handleClose = (e) => {
    // console.log(e);
    setOpen(false);
  };
  const [imageOpen, setImageOpen] = useState(false);
  const [mimeType, setMimeType] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [flagValue, setFlagValue] = useState([]);
  var iso2 = "";
  var url = "";
  const [countryFlag, setCountryFlag] = useState(null);
  const [userBio, setUserBio] = useState(reducerUserDATA);
  const [photoUrl, setPhotoUrl] = useState("");
  const [birthdayDate, setBirthdayDate] = useState("");
  const [birthdayInput, setBirthdayInput] = useState(false);
  const [firstNameInput, setFirstNameInput] = useState(false);
  const [lastNameInput, setLastNameInput] = useState(false);
  const [emailInput, setEmailInput] = useState(false);
  const [usernameInput, setUsernameInput] = useState(false);
  const [countrydropdownMenu, setCountrydropdownMenu] = useState(false);
  const history = useHistory();
  const alert = useAlert();
  const inputRef = useRef(null);
  // const [tempImg, setTempImg] = useState(null);
  const [showImageUploader, setShowImageUploader] = useState(false);

  // const [openImageUploader, setOpenImageUploader] = useState(false);
  // const handleImageUploaderOpen = () => setOpenImageUploader(true);
  // const handleImageUploaderClose = (e) => {
  //   setOpenImageUploader(false);
  // };
  const handleImageOpen = () => setImageOpen(true);

  const handleImageClose = (e) => {
    setImageOpen(false);
  };

  // const openImageUploaderBox = (e) => {
  //   setShowImageUploader(true);
  // };

  const openImageUploaderBox = (v) => {
    if (showImageUploader === false) {
      setShowImageUploader(true);
      // console.log("showImageUploader", showImageUploader);
    } else if (showImageUploader === true) {
      setShowImageUploader(false);
      // console.log("showImageUploader", showImageUploader);
    }
  };

  const uploadImageFromPC = (e) => {
    // console.log("uploadImageFromPC", e);
    inputRef.current.click();
  };

  // const handleDoneURLToBase64 = () => {
  //   handleDone(tempImg);
  // };

  // const showImageUploader = () => {
  //   setShowImageUploader(true);
  // };

  const getFlagValues = (e) => {
    // console.log(e);
    iso2 = e.isoTwo;
    url = e.countryFlag;
    // console.log("iso2", iso2);
    setCountryFlag(baseURL + url);

    setUserBio({
      ...userBio,
      countryCode: iso2,
      countrySvg: baseURL + url,
    });
  };

  const handleDone = (e) => {
    // console.log("handleDone val", e);
    // setOpenImageUploader(false);
    const base64result = e.substr(e.indexOf(",") + 1);

    // console.log(e);
    const params = JSON.stringify({
      pk: 0,
      acl: 7429,
      fileName: imageName,
      documentName: "my doc",
      mimeType: mimeType,
      timestampDocument: Date.now(),
      dataBase64: base64result,
      versioning: 0,
      description: "",
    });
    // console.log("Params", params);
    setShowImageUploader(false);

    addBase64ProfileAvatar(userToken, params, reducerVisitorID).then(function (
      val
    ) {
      if (val) {
        // console.log(val.data);
        // console.log(userBio);
        let item = {
          date: Date.now(),
          documentId: val.data.documentId,
          image: e,
          isLoaded: true,
        };
        if (memoryImagesArray === undefined || memoryImagesArray.length === 0) {
          setMemoryImagesArray([item]);

          dispatch({
            type: "SET_MEMORY_IMAGE",
            reducerMemoryImages: [item],
          });
        } else {
          memoryImagesArray.push(item);

          dispatch({
            type: "SET_MEMORY_IMAGE",
            reducerMemoryImages: memoryImagesArray,
          });
        }
        updateProfileConfigurations(userBio.countryCode, val.data.documentID);
      } else if (val.status === UNAUTH_KEY) {
        // console.log("Setting to 0");
        localStorage.setItem("user-info-token", 0);
        dispatch({
          type: "SET_USER_TOKEN",
          reducerUserToken: 0,
        });
      }
    });

    setUserBio({
      ...userBio,
      avatarHTML: e,
    });

    dispatch({
      type: "SET_USER_IMAGE",
      reducerUserImage: e,
    });
    setOpen(false);
  };

  const [destinations, setDestinations] = useState([
    { value: "Coastal", status: false },
    {
      value: "Urban",
      status: false,
    },
    {
      value: "Remote",
      status: false,
    },
    {
      value: "Rural",
      status: false,
    },
    {
      value: "Historical",
      status: false,
    },
    {
      value: "Developing",
      status: false,
    },
    {
      value: "Political",
      status: false,
    },
    {
      value: "Cultural",
      status: false,
    },
  ]);

  const [activities, setActivities] = useState([
    {
      value: "Water-based",
      status: true,
    },
    {
      value: "Outdoor",
      status: false,
    },
    {
      value: "Art",
      status: true,
    },
    {
      value: "Music",
      status: false,
    },
    {
      value: "Technology",
      status: true,
    },
    {
      value: "Social",
      status: false,
    },
    {
      value: "Adventure",
      status: true,
    },
    {
      value: "Gaming",
      status: false,
    },
  ]);

  const changeSearchable = (visibility) => {
    const visibilityTypeToValueMap = {
      private: 0,
      public: 1,
    };

    setUserBio((prev) => ({
      ...prev,
      searchable: visibilityTypeToValueMap[visibility],
    }));
  };

  // const updateUserLocation = () => {
  //   const params = JSON.stringify({
  //     latitude: userBio.latitude,
  //     longitude: userBio.longitude,
  //   });

  //   userUpdatePersonalLocation(params, reducerVisitorID).then(function (val) {
  //     // console.log(val.data);
  //   });
  // };

  const logUserOut = () => {
    // localStorage.removeItem("user-info-token");
    localStorage.setItem("user-info-token", 0);
    alert.show("Logged out succesfully");
    history.push("/authentication/sign");
    window.location.reload(false);
  };

  const updateProfile = () => {
    if (userBio.birthday == null) {
      // console.log("birthday Mising");
    } else {
      //isLoading(true);
      const params = JSON.stringify({
        firstName: userBio.firstName,
        lastName: userBio.lastName,
        // username: userBio.loginName,
        // email: userBio.eMail,
        // nickName: "the pelvis",
        birthday: userBio.birthday,
        searchable: userBio.searchable,
      });

      setFirstNameInput(false);
      setLastNameInput(false);
      setBirthdayInput(false);
      setEmailInput(false);
      setUsernameInput(false);

      dispatch({
        type: "SET_USER_DATA",
        reducerUserDATA: userBio,
      });
      // console.log("Params", params);
      userUpdatePersonalProfile(params, userToken, reducerVisitorID).then(
        function (val) {
          if (val) {
            // console.log(val.data);
            alert.show("Profile Updated");
            isLoading(false);
          } else if (val.status === UNAUTH_KEY) {
            // console.log("Setting to 0");
            localStorage.setItem("user-info-token", 0);
            dispatch({
              type: "SET_USER_TOKEN",
              reducerUserToken: 0,
            });
          }
        }
      );
    }
  };

  const updateProfileConfigurations = (countryCode, dmsKey) => {
    if (dmsKey != null && countryCode) {
      const params = JSON.stringify({
        countryCode: countryCode,
        pictureDocumentID: dmsKey,
      });

      userUpdateProfileConfigurations(params, userToken, reducerVisitorID).then(
        function (val) {
          // console.log(val.data);
          isLoading(false);
        }
      );
    } else {
      // console.log("Value missing");
      isLoading(false);
    }
  };

  const callCountryIsoAPI = () => {
    // updateCountryIso
    // console.log(iso2);

    if (iso2 === "" || iso2 === null) {
      // console.log("Please Select the flag");

      if (userBio.countryCode === "" || userBio.countryCode === null) {
        // console.log("Please Select the flag");
      } else {
        isLoading(true);
        updateCountryIso(userToken, userBio.countryCode, reducerVisitorID).then(
          function (val) {
            // console.log("Country Info", val);
            updateProfileConfigurations(
              userBio.countryCode,
              userBio.avatar_dms_key
            );
          }
        );
      }
    } else {
      isLoading(true);
      updateCountryIso(userToken, iso2, reducerVisitorID).then(function (val) {
        // console.log("Country Info", val);
        if (val) {
          updateProfileConfigurations(iso2, userBio.avatar_dms_key);
        } else if (val.status === UNAUTH_KEY) {
          // console.log("Setting to 0");
          localStorage.setItem("user-info-token", 0);
          dispatch({
            type: "SET_USER_TOKEN",
            reducerUserToken: 0,
          });
        }
      });
    }
  };

  const updateUserProfile = () => {
    updateProfile();
    callCountryIsoAPI();
  };

  const getFlagURL = (data) => {
    getDocumentByName(userToken, data, reducerVisitorID).then(function (val) {
      // console.log("flagURL Info", val.data);
      if (val.data != null) {
        let mimeType = "image/svg+xml";
        let svgValue = `data:${mimeType};base64,${val.data}`;

        // console.log(svgValue);
        setCountryFlag(svgValue);
      } else if (val.status === UNAUTH_KEY) {
        // console.log("Setting to 0");
        localStorage.setItem("user-info-token", 0);
        dispatch({
          type: "SET_USER_TOKEN",
          reducerUserToken: 0,
        });
      }
    });
    // console.log("countryFlag", countryFlag);
  };

  const initProfileValue = () => {
    // console.log("function is called", userToken);

    getProfileValue(userToken, reducerVisitorID).then(function (val) {
      // console.log("Get profile respose >", val.data);
      if (val.data) {
        setUserBio(val.data);
        isLoading(false);
        if (val.data.countryCode != null) {
          iso2 = val.data.countryCode;
        }

        // console.log("Tessst", userBio);
        if (val.data.destinations === null && val.data.activity === null) {
          // console.log("null val");
          history.push("/authentication/preference");
        } else {
          var dataActivity = val.data.activity;

          dataActivity = dataActivity.replace(/\\/g, "");

          dataActivity = JSON.parse(dataActivity);
          // console.log(dataActivity);
          setActivities(dataActivity);

          // console.log("zxc", activities);
          var dataDestination = val.data.destinations;
          dataDestination = dataDestination.replace(/\\/g, "");

          dataDestination = JSON.parse(dataDestination);
          setDestinations(dataDestination);
          // console.log("sdes ?>", destinations);

          // console.log("Testing >>>>", userBio);
          // getUserImage(val.data.avatar_dms_key);

          if (val.data.countryCode !== null || val.data.countryCode !== "") {
            getFlagURL(val.data.countryCode);
          }
        }
        // console.log(new Date(val.data.birthday).toLocaleDateString());
        var birthdayUser = new Date(val.data.birthday).toLocaleDateString();
        setBirthdayDate(birthdayUser);
        if (val.data.searchable === -1) {
          setUserBio({ ...userBio, searchable: 0 });
        }
        // console.log("BirthdayDate", birthdayDate);
      } else if (val.status === UNAUTH_KEY) {
        // console.log("Setting to 0");
        localStorage.setItem("user-info-token", 0);
        dispatch({
          type: "SET_USER_TOKEN",
          reducerUserToken: 0,
        });
      }
    });
  };

  const imageHandleChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setMimeType(event.target.files[0].type);
      setImageName(event.target.files[0].name);
      let reader = new FileReader();
      reader.onload = (e) => {
        setPhotoUrl(e.target.result);

        handleOpen();
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const getImageData = (event) => {
    setMimeType(event.mimeType);
    setImageName(event.imageName);
  };

  const initPage = () => {
    initProfileValue();
  };

  useEffect(() => {
    initPage();
    if (userBio !== null) {
      isLoading(false);
    }
  }, []);

  useEffect(() => {
    // console.log("reducerUserImage", reducerUserImage);
  }, [reducerUserImage]);

  useEffect(() => {
    // console.log("reducerUserDATA", reducerUserDATA);
  }, [reducerUserDATA]);

  const onActivityItemPress = (index, value, status) => {
    // console.log("initial values >", index, value, status);
    // console.log(activities[index].status);

    const activityVal = { value: value, index: index, status: !status };
    // console.log("new Values >", activityVal);
    const newActivtyVal = [...activities];

    newActivtyVal[index] = activityVal;

    setActivities(newActivtyVal);
  };

  const onDestinationItemPress = (index, value, status) => {
    const destinationVal = { value: value, index: index, status: !status };
    // console.log("new Values >", activityVal);
    const newDestinationVal = [...destinations];

    newDestinationVal[index] = destinationVal;

    setDestinations(newDestinationVal);
  };

  const updatePassword = () => {
    history.push("/authentication/updatepassword");
  };

  // Country Flag API Working Here //

  const getFlagsData = () => {
    // console.log("Calling Country Flags API :");
    getCountryFlags(userToken, reducerVisitorID).then(function (val) {
      // console.log("Country Info", val);
      if (val) {
        if (val.data != null) {
          var info = val.data;
          for (var key in info) {
            // console.log(info[key]);
            const flagDataVal = {
              countryName: info[key].country,
              isoTwo: info[key].iso2,
              dmsKey: info[key].dmsKey,
              countryFlag: info[key].url,
            };
            flagValue.push(flagDataVal);
          }

          // console.log("FlagData >", flagValue);
        } else {
          console.log("document is null");
        }
      } else if (val.status === UNAUTH_KEY) {
        // console.log("Setting to 0");
        localStorage.setItem("user-info-token", 0);
        dispatch({
          type: "SET_USER_TOKEN",
          reducerUserToken: 0,
        });
      }
    });
  };

  const CountryDropdown = () => {
    setCountrydropdownMenu(!countrydropdownMenu);
  };

  const setupBirthday = (e) => {
    setUserBio({
      ...userBio,
      birthday: e.target.valueAsNumber,
    });
    setBirthdayDate(e.target.value);
  };

  useEffect(() => {
    getFlagsData();
  }, []);

  const changeFirstNameInput = () => {
    setFirstNameInput((prev) => !prev);
  };
  const changeLastNameInput = () => {
    setLastNameInput((prev) => !prev);
  };
  const changeUsernameInput = () => {
    setUsernameInput((prev) => !prev);
  };
  const changeEmailInput = () => {
    setEmailInput((prev) => !prev);
  };
  const changeDateInput = () => {
    setBirthdayInput((prev) => !prev);
  };

  // Country Flag API Working Here //
  if (loading) {
    return (
      <div className="profileScreenLoader">
        <Oval color="#00BFFF" height={80} width={80} />
      </div>
    );
  }
  return (
    <div className="profile">
      <h1 className="profile__heading">My Profile</h1>

      <div className="profile__main-container">
        <section className="profile__profile-image-container">
          <div className="profile__profile-image-upload">
            <div
              style={{
                display: "flex",
                width: 130,
                height: 130,
                borderWidth: 2,
                borderColor: "#000",
                // backgroundColor: "#ffff00",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                className="selectedGroupImage"
                style={{
                  display: "flex",
                  width: 130,
                  height: 130,
                  borderWidth: 1,
                  borderColor: "#8a8a8a",
                  //backgroundColor: "#ff1100",
                  borderRadius: 130,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {!reducerUserImage ? (
                  <Oval color="#00BFFF" height={80} width={80} />
                ) : (
                  <img
                    //className="selectedGroupImage"
                    style={{
                      width: 130,
                      height: 130,
                      borderRadius: 150,
                      objectFit: "cover",
                    }}
                    alt=""
                    src={
                      !userBio.avatarHTML
                        ? reducerUserImage
                        : userBio.avatarHTML
                    }
                    onClick={handleImageOpen}
                  />
                )}
              </div>
            </div>

            <Modal
              open={imageOpen}
              onClose={handleImageClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                {/* <SimpleDialogBox onItemClick={onItemClick} dataValue={data} / > */}
                <img
                  style={{ borderRadius: "12px" }}
                  alt=""
                  src={
                    !userBio.avatarHTML ? reducerUserImage : userBio.avatarHTML
                  }
                  width="500"
                  height="500"
                  // onClick={handleImageOpen}
                  controls
                />
              </Box>
            </Modal>

            <div class="image-upload">
              {/* <label> */}
              {/* <Edit onClick={handleImageUploaderOpen} /> */}
              <Edit onClick={openImageUploaderBox} />
              <input
                // id="file-input"
                ref={inputRef}
                type="file"
                accept="image/*"
                className="input-file"
                style={{ display: "none" }}
                onChange={imageHandleChange}
              />
              {/* </label> */}
            </div>

            <Modal
              open={open}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Cropper
                  inputImg={photoUrl}
                  // onClose={handleClose}
                  onClose={handleClose}
                  onDone={handleDone}
                  mimeType={mimeType}
                />
              </Box>
            </Modal>
          </div>
        </section>

        <section className="profile__profile-details-container">
          <div className="profile__profile-general-details">
            <Field className="profile__profile-detail-field">
              <Label className="profile__profile-detail-field-label">
                {"Name:"}
              </Label>
              <Value className="profile__profile-detail-field-value">
                {firstNameInput ? (
                  <div className="profile__profile-detail-field-input">
                    <input
                      type="text"
                      value={userBio.firstName}
                      onChange={(e) =>
                        setUserBio({
                          ...userBio,
                          firstName: e.target.value,
                        })
                      }
                    />
                    <Close
                      onClick={changeFirstNameInput}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                ) : (
                  <p
                    className="profile__profile-detail-field-input-value"
                    onClick={changeFirstNameInput}
                  >
                    {userBio.firstName}
                  </p>
                )}

                {lastNameInput ? (
                  <div className="profile__profile-detail-field-input">
                    <input
                      type="text"
                      value={userBio.lastName}
                      onChange={(e) =>
                        setUserBio({
                          ...userBio,
                          lastName: e.target.value,
                        })
                      }
                    />
                    <Close
                      onClick={changeLastNameInput}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                ) : (
                  <p
                    className="profile__profile-detail-field-input-value"
                    onClick={changeLastNameInput}
                  >
                    {userBio.lastName}
                  </p>
                )}
              </Value>
            </Field>

            <Field className="profile__profile-detail-field">
              <Label className="profile__profile-detail-field-label">
                {"Username:"}
              </Label>
              <Value className="profile__profile-detail-field-value">
                {usernameInput ? (
                  <div className="profile__profile-detail-field-input">
                    <input
                      type="text"
                      value={userBio.loginName}
                      onChange={(e) =>
                        setUserBio({
                          ...userBio,
                          loginName: e.target.value,
                        })
                      }
                    />
                    <Close
                      onClick={changeUsernameInput}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                ) : (
                  <p
                    className="profile__profile-detail-field-input-value"
                    onClick={changeUsernameInput}
                  >
                    {userBio.loginName}
                  </p>
                )}
              </Value>
            </Field>

            <Field className="profile__profile-detail-field">
              <Label className="profile__profile-detail-field-label">
                {"Email:"}
              </Label>
              <Value className="profile__profile-detail-field-value">
                {emailInput ? (
                  <div className="profile__profile-detail-field-input">
                    <input
                      type="text"
                      value={userBio.eMail}
                      onChange={(e) =>
                        setUserBio({
                          ...userBio,
                          eMail: e.target.value,
                        })
                      }
                    />
                    <Close
                      onClick={changeEmailInput}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                ) : (
                  <p
                    className="profile__profile-detail-field-input-value"
                    onClick={changeEmailInput}
                  >
                    {userBio.eMail}
                  </p>
                )}
              </Value>
            </Field>

            <Field className="profile__profile-detail-field">
              <Label className="profile__profile-detail-field-label">
                {"Birthday:"}
              </Label>
              <Value className="profile__profile-detail-field-value">
                {birthdayInput ? (
                  <div className="ProfileData__fieldInputs">
                    <input
                      type="date"
                      value={birthdayDate}
                      onChange={(e) => setupBirthday(e)}
                    />
                    <Close
                      onClick={changeDateInput}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                ) : (
                  <p className="birthdayValue" onClick={changeDateInput}>
                    {birthdayDate}
                  </p>
                )}
              </Value>
            </Field>

            <Field className="profile__profile-detail-field">
              <Label className="profile__profile-detail-field-label">
                {"Country:"}
              </Label>
              <Value className="profile__profile-detail-field-value">
                {!userBio.countryCode || countrydropdownMenu ? (
                  <div className="ProfileData__fieldInputs">
                    <Dropdown
                      name="location"
                      title="Select location"
                      searchable={[
                        "Search for location",
                        "No matching location",
                      ]}
                      list={flagValue}
                      // list={locations}
                      onChange={getFlagValues}
                    />
                    <Close
                      onClick={CountryDropdown}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                ) : (
                  <p className="birthdayValue" onClick={CountryDropdown}>
                    {userBio.countryCode}
                    {!countryFlag ? (
                      <Oval color="#00BFFF" height={20} width={20} />
                    ) : (
                      <img
                        className="countryFlagSvg"
                        src={countryFlag}
                        alt=""
                      />
                    )}
                  </p>
                )}
              </Value>
            </Field>
          </div>

          <div className="profile__profile-visibility">
            <ToggleBar activeIndex={userBio.searchable}>
              <ToggleBarElement onClick={() => changeSearchable("private")}>
                PRIVATE
              </ToggleBarElement>
              <ToggleBarElement onClick={() => changeSearchable("public")}>
                PUBLIC
              </ToggleBarElement>
            </ToggleBar>
          </div>
        </section>

        <section className="profile__preferences">
          <div className="profile__preference-destinations">
            <p className="profile__preference-destinations-message">
              {preferDestination}
            </p>

            <div className="preference__destinations-buttons">
              {destinations.map((v, index) => (
                <PreferenceItem
                  key={v + index}
                  value={v.value}
                  index={index}
                  status={v.status}
                  pressHandler={onDestinationItemPress}
                />
              ))}
            </div>
          </div>

          <div className="profile__preference-activities">
            <p className="profile__preference-activities-message">
              {preferActivity}
            </p>

            <div className="preference__activities-buttons">
              {activities.map((v, index) => (
                <PreferenceItem
                  key={v + index}
                  value={v.value}
                  index={index}
                  status={v.status}
                  pressHandler={onActivityItemPress}
                />
              ))}
            </div>
          </div>
        </section>
      </div>

      <footer className="profile__footer">
        <ButtonAtom variant="filled" onClick={updateUserProfile}>
          Update Profile
        </ButtonAtom>
        <ButtonAtom variant="filled" onClick={updatePassword}>
          Change Password
        </ButtonAtom>
        <ButtonAtom variant="logout" onClick={logUserOut}>
          Logout
        </ButtonAtom>
      </footer>
      {/*
      <Dialog
        open={openImageUploader}
        onClose={handleImageUploaderClose}
        aria-labelledby="responsive-dialog-title"
        keepMounted
      >
        <div className="dialogueHeader">
          <h2>Upload Profile Picture</h2>
        </div>

        <DialogContent>
          <Modal
            open={open}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Cropper
                inputImg={tempImg}
                // onClose={handleClose}
                onClose={handleClose}
                onDone={handleDone}
                mimeType={mimeType}
              />
            </Box>
          </Modal>
          <div className="imageUploaderDialogue">
            <div className="imageUploaderDialogue__section">
              <div className="inputDivDetail">
                <input
                  placeholder="www.xjour.com/pic1"
                  type="text"
                  value={urlValue}
                  onChange={(e) => setUrlValue(e.target.value)}
                />
              </div>
              <button
                className="primaryButtonBeta"
                onClick={convertURLToBase64}
                autoFocus
              >
                Paste Picture URL
              </button>
            </div>

            <div className="imageUploaderDialogue__section">
              <button
                className="primaryButtonBeta"
                autoFocus
                onClick={uploadImageFromPC}
              >
                IMPORT FROM PC <MenuOpen />
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog> */}

      {showImageUploader && (
        <ImageUploaderBox
          title="Upload Profile Picture"
          showImageUploader={showImageUploader}
          setShowImageUploader={setShowImageUploader}
          inputRef={inputRef}
          handleDone={handleDone}
          uploadImageFromPC={uploadImageFromPC}
          getImageData={getImageData}
        />
      )}
    </div>
  );
}

function Field(props) {
  const { className, children } = props;

  return <div className={className}>{children}</div>;
}
function Label(props) {
  const { className, children } = props;

  return <p className={className}>{children}</p>;
}
function Value(props) {
  const { className, children } = props;

  return <div className={className}>{children}</div>;
}

export default Profile;
