import React, { useCallback, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import { Prompt } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { useAlert } from "react-alert";
import { Oval } from "react-loader-spinner";
import Select from "react-select";
import moment from "moment";

import "./CreateDestination.css";

import {
  Add,
  CalendarToday,
  ChevronLeft,
  Close,
  Edit,
  FmdGood,
} from "@mui/icons-material";
import { Box, Modal, Switch, TextField } from "@mui/material";

import {
  activityGroupKey,
  destinationGroupKey,
  memoryGroupKey,
  UNAUTH_KEY,
  user_contactGroupKey,
} from "assets/constants/Contants";
import { baseURL } from "assets/strings/Strings";

import {
  addBase64File,
  addDestinationItemAPI,
  createDestinationAPI,
  getCountryFlags,
  getDocumentByName,
  retrieveLocationDataAPI,
} from "config/authentication/AuthenticationApi";
import { useStateValue } from "config/context api/StateProvider";

import {
  destinationsSelector,
  setReplacePreviousByPage,
} from "store/reducers/destinations";
import {
  useAddDestinationItemMutation,
  useCreateDestinationMutation,
  useLazyGetDestinationsQuery,
} from "store/endpoints/destinations";

import ButtonAtom from "components/Atoms/Button/Button";
import ThemeModal from "components/Atoms/ThemeModal/ThemeModal";
import Cropper from "components/Cropper/Cropper";
import DestinationMap from "components/OLMap React/DestinationMap";
import Dropdown from "components/React Dropdown/Dropdown";
import DestinationNotes from "components/Destination Screen Components/My Destinations/Create Destination/Destination Notes/DestinationNotes";
import InitialCoordMap from "components/OLMap React/InitialCoordMap";
import ImageUploaderBox from "components/Image Uploader Box/ImageUploaderBox";
import PeopleCards from "components/Connect Screen Components/My Connections/People Section/People cards/PeopleCards";
import MediaGallery from "components/Sidebar Group Buttons/Media Gallery/MediaGallery";
import MiniActivitiesCard from "components/Destination Screen Components/My Activities/Activities for Create Group Screen/Mini Activities Card/MiniActivitiesCard";
import MiniDestinationCard from "components/Destination Screen Components/My Destinations/Mini Destination Card/MiniDestinationCard";
import AddOverlay from "components/Shared/AddOverlay/AddOverlay";
import AddMedia from "components/Shared/AddOverlay/AddMedia/AddMedia";
import AddLinkedDestinations from "components/Shared/AddOverlay/AddLinkedDestinations/AddLinkedDestinations";
import AddActivities from "components/Shared/AddOverlay/AddActivities/AddActivities";
import AddConnections from "components/Shared/AddOverlay/AddConnections/AddConnections";
import GeneralMap from "components/OLMap React/GeneralMap/GeneralMap";
import ChevronAtom from "components/Atoms/Chevron/Chevron";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  height: 600,
  bgcolor: "#f8f8f8",
  border: "none",
  borderRadius: 2,
  boxShadow: 24,
  p: 0,
};

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    borderBottom: "1px dotted black",
    backgroundColor: "white",
    color: "black",
    padding: 20,
  }),
};

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

const label = { inputProps: { "aria-label": "Switch demo" } };

function CreateDestination() {
  const history = useHistory();
  const alert = useAlert();
  const storeDispatch = useDispatch();

  const [stateValue, dispatch] = useStateValue();
  const {
    userToken,
    reducerMyDestinations,
    reducerDefaultPictures,
    reducerUserDATA,
    reducerVisitorID,
    reducerMemoryImages,
  } = stateValue;

  const destinationsState = useSelector(destinationsSelector);

  const [createDestination, createDestinationQueryState] =
    useCreateDestinationMutation();
  const [addDestinationItem] = useAddDestinationItemMutation();
  const [getDestinations, destinationsQueryState] = useLazyGetDestinationsQuery(
    {
      fixedCacheKey: "destination-pages",
    }
  );

  let [isBlocking, setIsBlocking] = useState(false);
  const [memoryImagesTwo, setMemoryImagesTwo] = useState(reducerMemoryImages);

  const [loading, isLoading] = useState(false);
  const [locationLoader, setLocationLoader] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState("");
  const [quill, setQuill] = useState("");
  const [locationData, setLocationData] = useState([]);
  const [openImage, setOpenImage] = useState(false);
  const [mimeType, setMimeType] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [openImageCropper, setOpenImageCropper] = useState(false);
  const [flagValue, setFlagValue] = useState([]);
  const [groupFlag, setGroupFlag] = useState(reducerUserDATA?.countrySvg);
  const [countrydropdownMenu, setCountrydropdownMenu] = useState(false);
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);

  const [memoryImages, setMemoryImages] = useState([]);
  const [connectPeople, setConnectPeople] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [activities, setActivities] = useState([]);
  const [collapsibleButton, setCollapsibleButton] = useState(false);

  const zoomRef = useRef(null);
  const [coord, setCoord] = useState([]);
  console.log("%ccoord:", "background-color:red;color:white;", coord);

  const [redirectNow, setRedirectNow] = useState(false);
  const [newDestinationsArray, setNewDestinationsArray] = useState(
    reducerMyDestinations
  );
  const [isPictureSelected, setPictureSelected] = useState(false);

  const [mediaUpdatedItem, setMediaUpdateItem] = useState([]);
  const [activityUpdatedItem, setActivityUpdatedItem] = useState([]);
  const [connectionUpdatedItem, setConnectionUpdatedItem] = useState([]);
  const [destinationUpdatedItem, setDestinationUpdatedItem] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [destinationDetails, setDestinationDetails] = useState({
    latitude: "",
    displayName: "",
    longitude: "",
    searchable: 1,
    configuration: "",
    iso2: "",
    countrySvg: "",
    base64: "",
    base64DocumentID: "",
    title: "",
    description: "",
    dateArrival: 0,
    dateDeparture: 0,
    dateArrivalInitial: null,
    dateDepartureInitial: null,
  });
  const [destinationImageDetails, setDestinationImageDetails] = useState({
    base64: null,
    base64DocumentID: null,
  });

  const [locationSearcher, setLocationSearcher] = useState(true);
  const changeLocationSearcher = () => {
    setLocationData([]);
    setLocationSearcher(!locationSearcher);
  };

  const handleSearchChange = (val) => {
    // console.log("handleSearchChange", val);
    setSelectedLocation(val);

    setIsBlocking(true);
    // the item selected
    // console.log(val);
    // console.log("locationData", locationData);

    const coordVal = [];

    if (val) {
      setLocationLoader(true);
      if (val.lon && val.lat) {
        coordVal.push(val.lon);
        coordVal.push(val.lat);

        setCoord(coordVal);
        setDestinationDetails((prev) => ({
          ...prev,
          latitude: val.lat,
          longitude: val.lon,
          displayName: val.name,
        }));

        setLocationLoader(false);
      }
    }
  };

  const [showImageUploader, setShowImageUploader] = useState(false);
  // const [clearAutoSearch, setClearAutoSearch] = useState(false);
  const inputRef = useRef(null);

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

  const changeTitle = (e) => {
    setDestinationDetails((prev) => ({
      ...prev,
      title: e.target.value,
    }));
    setIsBlocking(true);
  };

  const getTrackValue = () => {
    setLocationData([]);
    if (searchData) {
      setLocationLoader(true);
      retrieveLocationDataAPI(userToken, searchData, reducerVisitorID).then(
        function (val) {
          setLocationSearcher(false);
          setSearchData(null);
          // setClearAutoSearch(true);
          if (val) {
            // console.log("retrieving Track Value", JSON.parse(val.data));
            if (val.data) {
              var info = JSON.parse(val.data);
            }
            var i = 0;
            for (var key in info) {
              var i = Object.keys(info).indexOf(key);
              // console.log("Index:" + i);
              const locationArray = {
                lon: parseFloat(info[key].lon),
                lat: parseFloat(info[key].lat),
                name: info[key].display_name,
                value: info[key].display_name,
                label: info[key].display_name,
                key: i,
              };
              // locationData.push(locationArray);

              setLocationData((locationData) => [
                ...locationData,
                locationArray,
              ]);
            }

            isLoading(false);
            setLocationLoader(false);
            alert.show("Location Loaded");
            // console.log("locationData", locationData);
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

  // searchable working here //

  const changeSearchable = () => {
    // console.log(destinationDetails.searchable);
    if (
      destinationDetails.searchable === 0 ||
      destinationDetails.searchable === -1
    ) {
      setDestinationDetails((prev) => ({ ...prev, searchable: 1 }));
      // console.log("setting value to 1");
      setIsBlocking(true);
    } else {
      setDestinationDetails((prev) => ({ ...prev, searchable: 0 }));
      // console.log("setting value to 0");
      setIsBlocking(true);
    }
    // console.log(destinationDetails);
  };
  // searchable working here //
  const handleImageOpen = () => setOpenImage(true);
  const handleImageClose = (e) => {
    // console.log(e);
    setOpenImage(false);
  };

  const handleCropperClose = (e) => {
    // console.log(e);
    setOpenImageCropper(false);
  };

  const handleDone = (e) => {
    const base64result = e.substr(e.indexOf(",") + 1);

    setDestinationImageDetails({ ...destinationImageDetails, base64: e });
    setOpenImage(false);
    setPictureSelected(true);
    setIsBlocking(true);
    setShowImageUploader(false);
  };

  const imageHandleChange = (event) => {
    // console.log("event in cropper", event);
    if (event.target.files && event.target.files[0]) {
      setMimeType(event.target.files[0].type);
      setImageName(event.target.files[0].name);
      let reader = new FileReader();
      reader.onload = (e) => {
        setPhotoUrl(e.target.result);

        setOpenImageCropper(true);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const getImageData = (event) => {
    setMimeType(event.mimeType);
    setImageName(event.imageName);
  };

  const CountryDropdown = () => {
    setCountrydropdownMenu(!countrydropdownMenu);
  };

  const getFlagValues = (e) => {
    const iso2 = e.isoTwo;
    const url = e.countryFlag;

    setGroupFlag(baseURL + url);
    setDestinationDetails((prev) => ({
      ...prev,
      iso2,
      countrySvg: e.countryFlag,
    }));
    setIsBlocking(true);
  };

  const getFlagsData = () => {
    getCountryFlags(userToken, reducerVisitorID).then(function (val) {
      if (val) {
        if (val.data != null) {
          var info = val.data;
          for (var key in info) {
            console.log(info[key]);
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
        console.log("Setting to 0");
        localStorage.setItem("user-info-token", 0);
        dispatch({
          type: "SET_USER_TOKEN",
          reducerUserToken: 0,
        });
      }
    });
  };

  useEffect(() => {
    getFlagsData();
  }, [flagValue]);

  useEffect(() => {
    console.log("Default Pictures`Array :", reducerDefaultPictures);
    if (reducerDefaultPictures) {
      console.log("Default Pictures`Array :", reducerDefaultPictures);
      console.log("Default Pictures Item:", reducerDefaultPictures[3]);

      setDestinationImageDetails({
        ...destinationImageDetails,
        base64: reducerDefaultPictures[3].base64Value,
        base64DocumentID: reducerDefaultPictures[3].documentID,
      });
    }
  }, [reducerDefaultPictures]);

  useEffect(() => {
    if (reducerUserDATA) {
      console.log("Flag: ", reducerUserDATA);

      setDestinationDetails((prev) => ({
        ...prev,
        countrySvg: reducerUserDATA.countrySvg,
        iso2: reducerUserDATA.countryCode,
      }));
    }
  }, [reducerUserDATA]);

  const callCreateDestinationAPI = async (documentID) => {
    const config = JSON.stringify({
      countryCode: destinationDetails.iso2,
      pictureDocumentID: documentID,
      DestinationType: "destination",
    });
    const params = JSON.stringify({
      pk: 0,
      name: destinationDetails.title,
      description: quill,
      searchable: destinationDetails.searchable,
      memberStatus: 0,
      configurations: config,
      latitude: destinationDetails.latitude,
      longitude: destinationDetails.longitude,
      displayName: destinationDetails.displayName,
      mapZoom: zoomRef?.current || destinationDetails.mapZoom,
      followUpDateTime: destinationDetails.dateDeparture,
      creationDateTime: destinationDetails.dateArrival,
    });
    console.log("Params", params);

    try {
      const createDestinationResult = await createDestination({
        data: params,
        userToken,
        reducerVisitorID,
      });

      console.log(
        "%ccreateDestinationResult:",
        "background-color:yellow;",
        createDestinationResult
      );
      const createdDestination = createDestinationResult.data;
      if (createdDestination?.dstKey) {
        await Promise.allSettled([
          uploadUpdatedConnection(createdDestination.dstKey),
          uploadUpdatedActivities(createdDestination.dstKey),
          uploadUpdatedDestination(createdDestination.dstKey),
          uploadUpdatedMemoryImages(createdDestination.dstKey),
        ]);
      }

      alert.show("Destination Created Successfully!");

      moveToMyDestination();
      if (destinationsState.recentDestinationsScrollState.hasMore === false) {
        storeDispatch(setReplacePreviousByPage(true));
        getDestinations({
          token: userToken,
          visitorID: reducerVisitorID,
        });
      }
    } catch (error) {
      console.log(
        "%ccreateDestination error:",
        "background-color:red;color:white;",
        error
      );
      alert.show("Some error occurred while creating destination!");
      isLoading(false);
    }
  };

  const uploadDestinationPicture = async () => {
    const base64result = destinationImageDetails.base64.substr(
      destinationImageDetails.base64.indexOf(",") + 1
    );

    console.log("Calling an API");
    const params = JSON.stringify({
      pk: 0,
      acl: 7429,
      fileName: imageName,
      documentName: mimeType + "/" + imageName,
      mimeType: mimeType,
      timestampDocument: Date.now(),
      dataBase64: base64result,
      versioning: 0,
    });
    console.log("Params", params);

    return addBase64File(userToken, params, reducerVisitorID);
  };

  const callCreateDestinationAPIcall = async () => {
    isLoading(true);

    let documentID;

    if (isPictureSelected) {
      try {
        const uploadPictureResult = await uploadDestinationPicture();

        if (
          uploadPictureResult &&
          uploadPictureResult?.data?.documentID !== null
        ) {
          documentID = uploadPictureResult.data.documentID;
        }
      } catch (error) {
        console.log(
          "%caddBase64File error:",
          "background-color:red;color:white;",
          error
        );
      }
    } else {
      documentID = destinationImageDetails.base64DocumentID;
    }

    callCreateDestinationAPI(documentID);
  };

  const createNewDestination = () => {
    if (destinationDetails.title && selectedLocation) {
      setDestinationDetails((prev) => ({
        ...prev,
        description: quill,
      }));
      console.log("destinationDetails", destinationDetails);
      if (destinationDetails.dateArrival <= destinationDetails.dateDeparture) {
        callCreateDestinationAPIcall();
      } else {
        alert.show("Departure Date Invalid");
      }
    } else {
      alert.show("Please fill the required fields");
    }
  };

  const handleOnSearch = (string, results) => {
    // onSearch will have as the first callback parameter
    // the string searched and for the second the results.
    console.log("handleOnSearch", string, results);
    const spacesReplaced = string.replaceAll(" ", "+");
    console.log("spacesReplaced", spacesReplaced);
    setSearchData(spacesReplaced);
  };

  const handleOnHover = (result) => {
    // the item hovered
    console.log(result);
  };

  const handleOnSelect = (item) => {
    setCoord([]);
    setIsBlocking(true);
    // the item selected
    console.log(item);
    console.log("locationData", locationData);

    const coordVal = [];

    if (item) {
      setLocationLoader(true);
      if (item.lon && item.lat) {
        coordVal.push(item.lon);
        coordVal.push(item.lat);

        setCoord(coordVal);
        setDestinationDetails((prev) => ({
          ...prev,
          latitude: item.lat,
          longitude: item.lon,
          displayName: item.name,
        }));

        setLocationLoader(false);
      }
    }
  };

  useEffect(() => {
    if (quill) {
      setDestinationDetails((prev) => ({
        ...prev,
        description: quill,
      }));
    }
    console.log("quill useEffect Triggered", quill);
  }, [quill]);

  useEffect(() => {
    if (destinationDetails.title !== "") {
      setIsBlocking(true);
    } else if (destinationDetails.title === "") {
      setIsBlocking(false);
    }
    console.log("isBlocking", isBlocking);
  }, [destinationDetails.title]);

  const dateArrivalMilisec = (e) => {
    setIsBlocking(true);

    let now = new Date(e);
    const nextdate = new Date(now.setDate(now.getDate() + 1));
    var nextMilliseconds = nextdate.getTime();

    var date = new Date(e); // some mock date
    var milliseconds = date.getTime();
    // setDateArrival(milliseconds);
    console.log("dateArrivalMilisec", milliseconds);
    console.log("dateArrivalMilisec", nextMilliseconds);
    setDestinationDetails((prev) => ({
      ...prev,
      dateArrival: milliseconds,
      dateDeparture: nextMilliseconds,
      dateArrivalInitial: date.toLocaleDateString("en-CA"),
      dateDepartureInitial: nextdate.toLocaleDateString("en-CA"),
    }));
  };
  const dateDepartureMilisec = (e) => {
    console.log("useEffect triggered in datearrival", e);
    setIsBlocking(true);
    var date = new Date(e); // some mock date
    var milliseconds = date.getTime();
    // setDateDeparture(milliseconds);

    console.log("if triggered in datearrival", milliseconds);
    setDestinationDetails((prev) => ({
      ...prev,
      dateDeparture: milliseconds,
      dateDepartureInitial: e,
    }));
  };

  useEffect(() => {
    console.log("useEffect dateDeparture", destinationDetails.dateDeparture);
  }, [destinationDetails.dateDeparture]);

  const handleOnFocus = () => {
    console.log("Focused");
    console.log(locationData);
  };

  const handleKeyPress = (event) => {
    console.log("Event", event);
  };

  const getImage = (v, i) => {
    console.log("vData", v, i);
    var index = memoryImages.findIndex((x) => x.documentId === v.documentId);
    if (index === -1) {
      memoryImages.push(v);
      mediaUpdatedItem.push(v.documentId);
      setMemoryImages([...memoryImages]);
      console.log("memoryImages", memoryImages);
    }
  };

  const getActivities = (v, i) => {
    console.log("vData", v, i);
    console.log("vData", activities);
    var index = activities.findIndex((x) => x.key === v.key);
    if (index === -1) {
      activities.push(v);
      activityUpdatedItem.push(v.key);
      setActivities([...activities]);
      console.log("newActivities", activities);
    }
  };
  const getConnection = (v, i) => {
    console.log("vData", v, i);
    var index = connectPeople.findIndex((x) => x.entKey === v.entKey);
    if (index === -1) {
      connectPeople.push(v);
      connectionUpdatedItem.push(v.entKey);
      setConnectPeople([...connectPeople]);
      console.log("connectPeople", connectPeople);
    }
  };

  const getDestinationData = (v, i) => {
    console.log("vData", v, i);
    console.log("vData", destinations);
    var index = destinations.findIndex((x) => x.key === v.key);
    if (index === -1) {
      destinations.push(v);
      destinationUpdatedItem.push(v.key);
      setDestinations([...destinations]);
      console.log("Array", destinations);
    }
  };

  const deleteActivityItem = (data, index) => {
    console.log(index);

    activities.splice(index, 1);
    setActivities([...activities]);
    console.log("newActivities", activities);
  };

  const deleteDestinationItem = (data, index) => {
    console.log(index);
    destinations.splice(index, 1);

    var indexDestinationItem = destinations.indexOf(data.docKey);
    destinationUpdatedItem.splice(indexDestinationItem, 1);
    setDestinationUpdatedItem([...destinationUpdatedItem]);

    setDestinations([...destinations]);
  };

  const deleteCardItem = (data, index) => {
    console.log("indexVal", index);

    connectPeople.splice(index, 1);
    setConnectPeople([...connectPeople]);
  };

  const deleteMediaItem = (data, index) => {
    console.log(index);

    memoryImages.splice(index, 1);
    setMemoryImages([...memoryImages]);
  };

  const uploadUpdatedConnection = async (key) => {
    const itemsParams = connectionUpdatedItem.map((connectionItem) => {
      return JSON.stringify({
        ugGroupKey: connectionItem,
        gtGroupType: user_contactGroupKey,
        mtGroupKey: key,
      });
    });

    const addDestinationItemPromises = itemsParams.map((params) => {
      return addDestinationItem({ userToken, reducerVisitorID, data: params });
    });

    return await Promise.allSettled(addDestinationItemPromises);
  };
  const uploadUpdatedActivities = async (key) => {
    const itemsParams = activityUpdatedItem.map((activityItem) => {
      return JSON.stringify({
        ugGroupKey: activityItem,
        gtGroupType: activityGroupKey,
        mtGroupKey: key,
      });
    });

    const addDestinationItemPromises = itemsParams.map((params) => {
      return addDestinationItem({ userToken, reducerVisitorID, data: params });
    });

    return await Promise.allSettled(addDestinationItemPromises);
  };
  const uploadUpdatedDestination = async (key) => {
    const itemsParams = destinationUpdatedItem.map((destinationItem) => {
      return JSON.stringify({
        ugGroupKey: destinationItem,
        gtGroupType: destinationGroupKey,
        mtGroupKey: key,
      });
    });

    const addDestinationItemPromises = itemsParams.map((params) => {
      return addDestinationItem({ userToken, reducerVisitorID, data: params });
    });

    return await Promise.allSettled(addDestinationItemPromises);
  };
  const uploadUpdatedMemoryImages = async (key) => {
    const itemsParams = mediaUpdatedItem.map((mediaItem) => {
      return JSON.stringify({
        ugGroupKey: mediaItem,
        gtGroupType: memoryGroupKey,
        mtGroupKey: key,
      });
    });

    const addDestinationItemPromises = itemsParams.map((params) => {
      return addDestinationItem({ userToken, reducerVisitorID, data: params });
    });

    return await Promise.allSettled(addDestinationItemPromises);
  };

  const handleTriggerOpen = () => {
    setCollapsibleButton(true);
  };

  const handleTriggerClose = () => {
    setCollapsibleButton(false);
  };

  const formatResult = (item) => {
    console.log("item", item);
    return (
      <>
        <span style={{ display: "block", textAlign: "left" }}>{item.name}</span>
      </>
    );
  };

  useEffect(() => {
    console.log("locationData in useEffect", locationData);
  }, [locationData]);

  const moveToMyDestination = () => {
    history.push("/destinations/my-destinations");
  };

  useEffect(() => {
    if (redirectNow) {
      setRedirectNow(false);
      dispatch({
        type: "SET_MY_DESTINATIONS",
        reducerMyDestinations: newDestinationsArray,
      });
      history.push("/destinations/my-destinations");
    }
  }, [redirectNow]);

  const changeMapZoom = useCallback((zoom) => {
    // setDestinationDetails((prev) => ({
    //   ...prev,
    //   mapZoom: zoom,
    // }));

    zoomRef.current = zoom;
  }, []);

  const onSearchLocationSubmit = (event) => {
    event.preventDefault();
    getTrackValue();
  };

  if (loading) {
    return (
      <div className="screenLoader">
        <Oval color="#00BFFF" height={80} width={80} />;
      </div>
    );
  }
  return (
    <div className="create-destination">
      <Prompt
        when={isBlocking}
        message={" Are you sure you want to leave this page"}
      />

      {/* /** First Container Starts Here  ****/}
      <header className="create-destination__header">
        <div className="create-destination__header-left">
          <ChevronAtom onClick={moveToMyDestination} />

          <h1 className="create-destination__heading">Create Destination</h1>
        </div>

        <div className="create-destination__header-right">
          <div className="create-destination__visibility">
            <div
              className={`create-destination__private-visibility create-destination__private-visibility--${
                destinationDetails.searchable === 0 ? "active" : "inactive"
              }`}
              onClick={() => changeSearchable("private")}
            >
              PRIVATE
            </div>
            <div
              className={`create-destination__public-visibility create-destination__public-visibility--${
                destinationDetails.searchable !== 0 ? "active" : "inactive"
              }`}
              onClick={() => changeSearchable("public")}
            >
              PUBLIC
            </div>
          </div>
        </div>
      </header>
      {/* /** First Container Ends Here  ****/}

      {/* /** Second Container Starts Here  ****/}
      <section className="create-destination__destination-details-container">
        <div className="create-destination__destination-details">
          <div className="create-destination__destination-details-card">
            <div className="create-destination__edit-destination-name">
              <FmdGood className="create-destination__edit-destination-location-icon" />
              <div className="create-destination__edit-destination-name-input-container">
                <label
                  htmlFor="create-destination__edit-destination-name-input"
                  className="create-destination__edit-destination-name-label"
                >
                  Destination
                </label>
                <input
                  id="create-destination__edit-destination-name-input"
                  class="create-destination__edit-destination-name-input"
                  type="text"
                  placeholder="Enter Title"
                  value={destinationDetails.title}
                  onChange={changeTitle}
                />
              </div>
            </div>

            <div className="create-destination__edit-destination-dates">
              <CalendarToday className="create-destination__edit-destination-calender-icon" />

              <div className="create-destination__edit-destination-arrival-date-container">
                <label htmlFor="create-destination__edit-destination-arrival-date">
                  Arrival Date
                </label>
                <input
                  id="create-destination__edit-destination-arrival-date"
                  class="create-destination__edit-destination-arrival-date-input"
                  label="Arrival Date"
                  variant="standard"
                  type="date"
                  value={destinationDetails.dateArrivalInitial}
                  onChange={(e) => dateArrivalMilisec(e.target.value)}
                />
              </div>

              <div className="create-destination__edit-destination-departure-date-container">
                <label htmlFor="create-destination__edit-destination-departure-date">
                  Departure Date
                </label>
                <input
                  id="create-destination__edit-destination-departure-date"
                  class="create-destination__edit-destination-departure-date-input"
                  label="Departure Date"
                  variant="standard"
                  type="date"
                  min={moment(destinationDetails.dateArrival).format(
                    "YYYY-MM-DD"
                  )}
                  value={destinationDetails.dateDepartureInitial}
                  onChange={(e) => dateDepartureMilisec(e.target.value)}
                />
              </div>

              <ThemeModal
                isOpen={isFlagModalOpen}
                onCloseHandler={() => setIsFlagModalOpen(false)}
                modalTitle="Add Country Flag"
              >
                <div className="create-destination__edit-destination-flag-modal">
                  <div className="create-destination__edit-destination-flag-container">
                    <Dropdown
                      name="location"
                      title="Select location"
                      searchable={[
                        "Search for location",
                        "No matching location",
                      ]}
                      list={flagValue}
                      onChange={getFlagValues}
                    />

                    <ButtonAtom
                      variant="filled"
                      fontSize="medium"
                      onClick={() => setIsFlagModalOpen(false)}
                    >
                      OK
                    </ButtonAtom>
                  </div>
                </div>
              </ThemeModal>
              {!groupFlag ? (
                <div className="create-destination__flag-placeholder-container">
                  <Edit
                    className="create-destination__flag-placeholder-edit-icon"
                    onClick={() => setIsFlagModalOpen(true)}
                  />
                </div>
              ) : (
                // countrydropdownMenu || !groupFlag ? (
                //   <div className="create-destination__destination-flag-select-container">
                //     <Dropdown
                //       name="location"
                //       title="Select location"
                //       searchable={["Search for location", "No matching location"]}
                //       list={flagValue}
                //       onChange={getFlagValues}
                //     />
                //     {groupFlag && (
                //       <Close
                //         onClick={CountryDropdown}
                //         style={{ cursor: "pointer" }}
                //       />
                //     )}
                //   </div>
                // ) :
                <div className="create-destination__destination-flag-container">
                  <img
                    className="create-destination__destination-flag"
                    src={groupFlag}
                    onClick={() => setIsFlagModalOpen(true)}
                    alt="Destination Flag"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="create-destination__image-container">
            {!destinationImageDetails.base64 ? (
              <div className="create-destination__image-placeholder-container">
                <Edit
                  className="create-destination__image-placeholder-edit-icon"
                  onClick={openImageUploaderBox}
                />
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  className="input-file"
                  style={{ display: "none" }}
                  onChange={imageHandleChange}
                />
              </div>
            ) : (
              <img
                style={{
                  width: 180,
                  height: 130,
                  borderRadius: 10,
                  objectFit: "cover",
                }}
                alt=""
                src={destinationImageDetails.base64}
                onClick={photoUrl && handleImageOpen}
              />
            )}

            {destinationImageDetails.base64 && (
              <div class="uploadImageButton">
                <Edit onClick={openImageUploaderBox} />
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  className="input-file"
                  style={{ display: "none" }}
                  onChange={imageHandleChange}
                />
              </div>
            )}
          </div>

          <Modal
            open={openImage}
            onClose={handleImageClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <img
                style={{ borderRadius: "12px" }}
                src={destinationImageDetails.base64}
                width="500"
                height="500"
                alt=""
                controls
              />
            </Box>
          </Modal>

          <Modal
            className="groupCropperModal"
            open={openImageCropper}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Cropper
              inputImg={photoUrl}
              onClose={handleCropperClose}
              onDone={handleDone}
              mimeType={mimeType}
            />
          </Modal>
        </div>
      </section>
      {/* <SearchDestinationSection getValue={getValue}/> */}
      {/* /** Second Container Ends Here  ****/}

      {/* /** Third Container Starts Here  ****/}
      <section className="create-destination__map-container">
        {destinationDetails.displayName && (
          // <h3 className="cityName">{destinationDetails.displayName.split(",")[0]}</h3>
          <h2 className="create-destination__map-container-heading">
            {destinationDetails.displayName}
          </h2>
        )}
        <div className="create-destination__map">
          {coord.length >= 1 ? (
            <GeneralMap
              coord={[coord]}
              center={coord}
              zoomChangeHandler={changeMapZoom}
            />
          ) : (
            <GeneralMap zoomChangeHandler={changeMapZoom} />
          )}

          <div className="create-destination__search-location">
            <div className="create-destination__search-location-container">
              <FmdGood className="create-destination__search-location-icon" />

              <div className="create-destination__search-location-box">
                {locationData.length === 0 || locationSearcher ? (
                  <form
                    onSubmit={onSearchLocationSubmit}
                    className="create-destination__search-location-form"
                  >
                    <input
                      type="text"
                      value={searchTerm}
                      placeholder="Enter Location"
                      className="create-destination__search-location-input"
                      onChange={(event) => {
                        const string = event.target.value;
                        const spacesReplaced = string.replaceAll(" ", "+");
                        // console.log("spacesReplaced", spacesReplaced);
                        setSearchTerm(string);
                        setSearchData(spacesReplaced);
                      }}
                    />

                    <div className="create-destination__search-location-button-container">
                      {locationLoader && (
                        <Oval color="#00BFFF" height={20} width={20} />
                      )}
                      {!locationLoader && (
                        <ButtonAtom variant="filled" type="submit">
                          SEARCH
                        </ButtonAtom>
                      )}
                    </div>
                  </form>
                ) : (
                  // <ReactSearchAutocomplete
                  //   styling={{
                  //     hoverBackgroundColor: "#22b0ea",
                  //     zIndex: 99,
                  //     backgroundColor: "white",
                  //   }}
                  //   items={locationData}
                  //   autoFocus
                  //   onSearch={handleOnSearch}
                  //   onHover={handleOnHover}
                  //   onSelect={handleOnSelect}
                  //   onFocus={handleOnFocus}
                  //   onKeyPress={handleKeyPress}
                  //   placeholder="Enter Location"
                  //   formatResult={formatResult}
                  // />
                  <>
                    <Select
                      value={selectedLocation}
                      onChange={handleSearchChange}
                      options={locationData}
                      styles={customStyles}
                    />
                    <Close
                      className="create-destination__location-select-close-button"
                      onClick={changeLocationSearcher}
                    />
                  </>
                )}
              </div>

              {/* <div className="view-destination__search-location-button-container">
                          {locationLoader && (
                            <Oval color="#00BFFF" height={20} width={20} />
                          )}
                          {!locationLoader && (
                            <input type="submit" value="SEARCH" />
                          )}
                        </div> */}
            </div>
          </div>
        </div>
      </section>
      {/* /** Third Container Ends Here  ****/}

      {/* /** Fourth Container Starts Here  ****/}
      <section className="create-destination__notes-container">
        <DestinationNotes setQuill={setQuill} />
      </section>
      {/* /** Fourth Container Ends Here  ****/}

      <div className="create-destination__container-items">
        {/* /** FIfth Container Starts Here  ****/}
        <section className="create-destination__connections-container">
          {/* <ConnectionsSection /> */}
          <h2 className="create-destination__connections-heading">
            Connections
          </h2>
          {
            <div className="create-destinations__connections-cards-container">
              {connectPeople?.length <= 0 ? (
                <p className="create-destination__no-connections-text">
                  Please Add Members{" "}
                </p>
              ) : (
                <div className="create-destination__connections-cards">
                  {connectPeople?.map((v, i) => (
                    <PeopleCards
                      key={v + i}
                      index={i}
                      data={v}
                      deleteItem
                      clickFunction={deleteCardItem}
                    />
                  ))}
                </div>
              )}
            </div>
          }
        </section>

        {/* /** Fifth Container Ends Here  ****/}

        {/* /** Sixth Container Starts Here  ****/}
        <section className="create-destination__activities-container">
          {/* <ActivitiesSection /> */}
          <h2 className="create-destination__activities-heading">Activities</h2>
          {
            <div className="create-destinations__activities-cards-container">
              {activities?.length <= 0 ? (
                <p className="create-destination__no-activities-text">
                  Please Add Activites{" "}
                </p>
              ) : (
                <div className="create-destination__activities-cards">
                  {activities?.map((v, i) => (
                    <div className="mapMiniActivites">
                      <MiniActivitiesCard
                        key={v + i}
                        data={v}
                        index={i}
                        deleteItem
                        clickFunction={deleteActivityItem}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          }
        </section>

        {/* /** Sixth Container Ends Here  ****/}

        {/* /** Seventh Container Starts Here  ****/}
        <section className="create-destination__linked-destinations-container">
          {/* <LinkedDestinations /> */}
          <h2 className="create-destination__linked-destinations-heading">
            Linked Destinations
          </h2>
          {
            <div className="create-destination__linked-desintinations-cards-container">
              {destinations?.length <= 0 ? (
                <p className="create-destination__no-linked-destinations-text">
                  Please Add Destinations{" "}
                </p>
              ) : (
                <div className="create-destination__linked-destinations-cards">
                  {destinations?.map((v, i) => (
                    <MiniDestinationCard
                      key={v + i}
                      data={v}
                      index={i}
                      deleteItem
                      clickFunction={deleteDestinationItem}
                    />
                  ))}
                </div>
              )}
            </div>
          }
        </section>

        {/* /** Seventh Container Ends Here  ****/}

        {/* /** Eight Container Ends Here  ****/}
        <section className="create-destination__media-container">
          <h2 className="create-destination__media-heading">Media</h2>
          {
            <div className="create-destinations__media-cards-container">
              {memoryImages?.length <= 0 ? (
                <p className="create-destination__no-media-text">
                  Please Add Gallery{" "}
                </p>
              ) : (
                <div className="create-destination__media-cards">
                  {memoryImages?.map((v, i) => (
                    <MediaGallery
                      key={i}
                      data={v}
                      index={i}
                      deleteItem
                      clickFunction={deleteMediaItem}
                    />
                  ))}
                </div>
              )}
            </div>
          }
        </section>

        {/* /** Eight Container Ends Here  ****/}
      </div>

      <footer className="create-destination__footer">
        <AddOverlay
          isOpen={collapsibleButton}
          closeHandler={handleTriggerClose}
          includeAddMedia
          includeAddConnection
          includeAddDestination
          includeAddActivity
          addMediaContent={<AddMedia setImageToAdd={getImage} />}
          addDestinationContent={
            <AddLinkedDestinations setDestinationToAdd={getDestinationData} />
          }
          addActivityContent={
            <AddActivities setActivityToAdd={getActivities} />
          }
          addConnectionContent={
            <AddConnections setConnectionToAdd={getConnection} />
          }
        />

        <Add
          onClick={handleTriggerOpen}
          className="create-destination__footer-add-icon"
        />

        <ButtonAtom
          variant="filled"
          fontSize="medium"
          onClick={createNewDestination}
        >
          Create Destination
        </ButtonAtom>

        <div></div>
      </footer>

      {showImageUploader && (
        <ImageUploaderBox
          title="Upload Destination Picture"
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

export default CreateDestination;
