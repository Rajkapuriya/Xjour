import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Prompt } from "react-router-dom";
import { useHistory, useRouteMatch } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { Oval } from "react-loader-spinner";
import { useAlert } from "react-alert";
import { Buffer } from "buffer";
import { Shimmer } from "react-shimmer";
import { cloneDeep } from "lodash";
import Select from "react-select";
import ReactQuill from "react-quill";
import moment from "moment";

import "./ViewDestination.css";

import {
  activityGroupKey,
  destinationGroupKey,
  memoryGroupKey,
  user_contactGroupKey,
  UNAUTH_KEY,
} from "assets/constants/Contants";
import { baseURL } from "assets/strings/Strings";

import {
  addBase64File,
  addDestinationItemAPI,
  deleteDestinationItemAPI,
  getCountryFlags,
  getDocumentByName,
  getPrivateDocument,
  readSingleActivityAPI,
  readSingleUserAPI,
  retrieveLocationDataAPI,
  retrieveSingleDestinationAPI,
  updateDestinationAPI,
} from "config/authentication/AuthenticationApi";
import { useStateValue } from "config/context api/StateProvider";

import {
  destinationsSelector,
  setMultiple,
  setDestinations as setDestinationsInStore,
  setRecentDestinationsScrollState,
} from "store/reducers/destinations";
import {
  useAddDestinationItemMutation,
  useDeleteDestinationItemMutation,
  useGetSingleDestinationQuery,
  useUpdateDestinationMutation,
} from "store/endpoints/destinations";
import { useGetMyMemberConnectionsQuery } from "store/endpoints/memberManagement";
import { useGetActivitiesQuery } from "store/endpoints/activities";
import { useGetMemoriesQuery } from "store/endpoints/memories";

import {
  Add,
  CalendarToday,
  ChevronLeft,
  Close,
  Edit,
  FmdGood,
} from "@mui/icons-material";
import { Box, Modal, Switch } from "@mui/material";

import ButtonAtom from "components/Atoms/Button/Button";
import PeopleCards from "components/Connect Screen Components/My Connections/People Section/People cards/PeopleCards";
import DestinationMap from "components/OLMap React/DestinationMap";
import Cropper from "components/Cropper/Cropper";
import Dropdown from "components/React Dropdown/Dropdown";
import MediaGallery from "components/Sidebar Group Buttons/Media Gallery/MediaGallery";
import DeleteOrHideDialogue from "components/Delete Or Hide Dialogue/DeleteOrHideDialogue";
import ImageUploaderBox from "components/Image Uploader Box/ImageUploaderBox";
import MiniActivitiesCard from "components/Destination Screen Components/My Activities/Activities for Create Group Screen/Mini Activities Card/MiniActivitiesCard";
import MiniDestinationCard from "components/Destination Screen Components/My Destinations/Mini Destination Card/MiniDestinationCard";
import ThemeModal from "components/Atoms/ThemeModal/ThemeModal";
import AddOverlay from "components/Shared/AddOverlay/AddOverlay";
import AddMedia from "components/Shared/AddOverlay/AddMedia/AddMedia";
import AddLinkedDestinations from "components/Shared/AddOverlay/AddLinkedDestinations/AddLinkedDestinations";
import AddActivities from "components/Shared/AddOverlay/AddActivities/AddActivities";
import AddConnections from "components/Shared/AddOverlay/AddConnections/AddConnections";
import GeneralMap from "components/OLMap React/GeneralMap/GeneralMap";
import ToggleBar from "components/Atoms/Toggler/ToggleBar/ToggleBar";
import ToggleBarElement from "components/Atoms/Toggler/ToggleBar/ToggleBarElement";
import ChevronAtom from "components/Atoms/Chevron/Chevron";
import AnnotationDialog from "components/AnnotationDialog/AnnotationDialog";

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
const Editor = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline"],
      [{ script: "sub" }, { script: "super" }],
      [{ align: [] }],
      ["image", "blockqoute", "code-block"],
      [{ color: [] }, { background: [] }], // dropdown with defaults from theme

      ["clean"], // remove formatting button
    ],
  },
};

const label = { inputProps: { "aria-label": "Switch demo" } };

function ViewDestination() {
  const history = useHistory();
  const storeDispatch = useDispatch();
  const alert = useAlert();
  const routeMatch = useRouteMatch();
  const groupKey = routeMatch.params.groupKey;

  const [
    {
      userToken,
      reducerSelectedDestination,
      reducerMyDestinations,
      reducerVisitorID,
      reducerMemoryImages,
    },
    dispatch,
  ] = useStateValue();

  const destinationsSlice = useSelector(destinationsSelector);
  console.log(
    "%cdestinationsSlice from store:",
    "background-color:mediumorchid;color:white;",
    destinationsSlice
  );

  const getSingleDestinationQueryState = useGetSingleDestinationQuery({
    groupKey: groupKey,
    userToken,
    reducerVisitorID,
  });
  const [addDestinationItem] = useAddDestinationItemMutation();
  const [triggerUpdateDestination] = useUpdateDestinationMutation();
  const [deleteDestinationItem] = useDeleteDestinationItemMutation();
  console.log(
    "%cgetSingleDestinationQueryState",
    "background-color:dodgerblue",
    getSingleDestinationQueryState
  );

  const [memoryImagesArray, setMemoryImagesArray] =
    useState(reducerMemoryImages);

  const [destinationDetails, setDestinationDetails] = useState([]);
  const [destinationImageData, setDestinationImageData] = useState({
    base64: destinationsSlice.selectedSingleDestination.base64,
    base64DocumentID: null,
  });
  console.log(
    "%cdestinationDetails:",
    "background-color:lightgreen;",
    destinationDetails
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState("");
  const [updatedValue, setUpdatedValue] = useState(null);
  const [locationData, setLocationData] = useState([]);
  const [locationLoader, setLocationLoader] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [mimeType, setMimeType] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [openImageCropper, setOpenImageCropper] = useState(false);
  const [flagValue, setFlagValue] = useState([]);
  const [openImage, setOpenImage] = useState(false);
  const [countrydropdownMenu, setCountrydropdownMenu] = useState(false);
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);
  const [connectPeople, setConnectPeople] = useState([]);

  const [collapsibleButton, setCollapsibleButton] = useState(false);
  const [mediaComponent, setMediaComponent] = useState(false);
  const [quillValue, setQuillValue] = useState("");
  const [groupFlag, setGroupFlag] = useState(
    destinationsSlice.selectedSingleDestination?.countrySvg || null
  );

  const [connections, setConnections] = useState([]);
  const [selectedActivitiesArrayData, setSelectedActivitiesArrayData] =
    useState([]);
  const [destinations, setDestinations] = useState([]);
  const [memoryImagesTwo, setMemoryImagesTwo] = useState([]);

  const zoomRef = useRef(null);
  const [coord, setCoord] = useState([]);
  var iso2 = "";
  var url = "";

  const [connectionUpdatedItem, setConnectionUpdatedItem] = useState([]);
  const [activityUpdatedItem, setActivityUpdatedItem] = useState([]);
  const [destinationUpdatedItem, setDestinationUpdatedItem] = useState([]);
  const [mediaUpdatedItem, setMediaUpdatedItem] = useState([]);
  const [annotationDialog, setAnnotationDialog] = useState({
    isOpen: false
  });
  let [isBlocking, setIsBlocking] = useState(false);
  const [deleteOrHideConfirmation, setDeleteOrHideConfirmation] =
    useState(false);

  // console.log("coordVal", coord);

  const [groupCodes, setGroupCodes] = useState({
    countryCode: "",
    pictureDocumentID: "",
  });
  useEffect(() => {
    if (getSingleDestinationQueryState.isSuccess) {
      const destinationConfigurations = JSON.parse(
        getSingleDestinationQueryState?.data?.configurations
      );

      if (destinationConfigurations) {
        setGroupCodes({
          countryCode: destinationConfigurations?.countryCode || "",
          pictureDocumentID: destinationConfigurations?.pictureDocumentID || "",
        });
      }
    }
  }, [
    getSingleDestinationQueryState?.data?.configurations,
    getSingleDestinationQueryState.isSuccess,
  ]);

  // let defaultDateArrival = new Date(
  //   destinationsSlice.selectedSingleDestination?.arrivalDate
  // );
  let defaultDateArrival = getSingleDestinationQueryState.isSuccess
    ? new Date(getSingleDestinationQueryState.data.creationDateTime)
    : new Date(Date.now());
  defaultDateArrival.setDate(defaultDateArrival.getDate());
  const [dateArrivalDefault, setDateArrivalDefault] =
    useState(defaultDateArrival);

  // let defaultDateDeparture = new Date(
  //   destinationsSlice.selectedSingleDestination?.departureDate
  // );
  let defaultDateDeparture = getSingleDestinationQueryState.isSuccess
    ? new Date(getSingleDestinationQueryState.data.followUpDateTime)
    : new Date(Date.now());
  defaultDateDeparture.setDate(defaultDateDeparture.getDate());
  const [dateDepartureDefault, setDateDepartureDefault] =
    useState(defaultDateDeparture);

  const [showImageUploader, setShowImageUploader] = useState(false);
  const inputRef = useRef(null);

  const [locationSearcher, setLocationSearcher] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);

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

  const onSetDateArrival = (event) => {
    let now = new Date(event.target.value);
    const nextdate = new Date(now.setDate(now.getDate() + 1));
    var nextMilliseconds = nextdate.getTime();
    // console.log("date from event val", nextdate);
    // console.log("date from event val", new Date(event.target.value));

    setIsBlocking(true);
    setDateArrivalDefault(new Date(event.target.value));
    var date = new Date(event.target.value); // some mock date
    var milliseconds = date.getTime();
    setDestinationDetails((prev) => ({
      ...prev,
      arrivalDate: milliseconds,
      departureDate: nextMilliseconds,
    }));
    // setDateDepartureDefault(new Date(event.target.value));
    setDateDepartureDefault(nextdate);
    // console.log("dateArrival Mili", destinationDetails.arrivalDate);
  };
  const onSetDateDeparture = (event) => {
    setIsBlocking(true);
    setDateDepartureDefault(new Date(event.target.value));
    var date = new Date(event.target.value); // some mock date
    var milliseconds = date.getTime();
    setDestinationDetails((prev) => ({
      ...prev,
      departureDate: milliseconds,
    }));
    // console.log("dateDeparture Mili", destinationDetails.dateDeparture);
  };
  // searchable working here //

  const changeSearchable = (visibility) => {
    const visibilityTypeToValueMap = {
      private: 0,
      public: 1,
    };

    setDestinationDetails((prev) => ({
      ...prev,
      searchable: visibilityTypeToValueMap[visibility],
    }));
  };
  // searchable working here //

  // const changeArrivalInput = () => {
  //   setArrivalInputActive(!arrivalInputActive)
  // }
  // const changeDepartureInput = () => {
  //   setDepartureInputActive(!departureInputActive)
  // }

  const changeTitle = (e) => {
    setDestinationDetails((prev) => ({
      ...prev,
      title: e.target.value,
    }));
    setIsBlocking(true);
  };

  const handleOnSearch = (string, results) => {
    // onSearch will have as the first callback parameter
    // the string searched and for the second the results.
    // console.log(string, results);
    const spacesReplaced = string.replaceAll(" ", "+");
    // console.log("spacesReplaced", spacesReplaced);
    setSearchData(spacesReplaced);
  };

  const handleOnHover = (result) => {
    // the item hovered
    // console.log(result);
  };

  const handleOnSelect = (item) => {
    setCoord([]);
    setIsBlocking(true);
    // the item selected
    // console.log(item);
    // console.log("locationData", locationData);

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

  const handleOnFocus = () => {
    // console.log("Focused");
    // console.log(locationData);
  };

  const handleKeyPress = (event) => {
    console.log("Event", event);
  };

  const formatResult = (item) => {
    // console.log("item", item);
    return (
      <>
        <span style={{ display: "block", textAlign: "left" }}>{item.name}</span>
      </>
    );
  };

  const getTrackValue = () => {
    // console.log("searchData", searchData);

    setLocationData([]);

    console.log(
      "🚀 ~ file: ViewDestination.jsx:428 ~ getTrackValue ~ searchData",
      searchData
    );
    if (searchData) {
      setLocationLoader(true);
      retrieveLocationDataAPI(userToken, searchData, reducerVisitorID).then(
        function (val) {
          if (val) {
            setLocationSearcher(false);
            setSearchData(null);
            console.log("retrieving Track Value", JSON.parse(val.data));
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
                label: info[key].display_name,
                key: i,
              };
              // locationData.push(locationArray);

              setLocationData((locationData) => [
                ...locationData,
                locationArray,
              ]);
            }

            setIsLoading(false);
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
    // setDestinationDetails({ ...destinationDetails, base64: e });
    // setOpenImage(false);

    setGroupCodes({ ...groupCodes, base64Result: base64result });
    // setDestinationDetails({ ...destinationDetails, base64: e });
    setDestinationImageData({ ...destinationImageData, base64: e });
    // console.log("handleDone", groupCodes);
    setOpenImage(false);
    setIsBlocking(true);
    setShowImageUploader(false);
  };

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
          // console.log("document is null");
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

  useEffect(() => {
    // console.log("locationData in useEffect", locationData);
  }, [locationData]);

  useEffect(() => {
    getFlagsData();
  }, [flagValue]);

  const getFlagValues = (e) => {
    // console.log(e);
    iso2 = e.isoTwo;
    url = e.countryFlag;
    // console.log("iso2", iso2);
    // setCountryFlag(baseURL + url);
    setGroupFlag(baseURL + url);
    console.log("getFlagValues", groupFlag);

    setGroupCodes({ ...groupCodes, countryCode: e.isoTwo });
    // console.log(groupCodes);
    setIsBlocking(true);
    setCountrydropdownMenu(false);
  };

  const CountryDropdown = () => {
    setCountrydropdownMenu(!countrydropdownMenu);
  };

  const getConnection = (v) => {
    const isConnectionAlreadyInDestination = Boolean(
      destinationsSlice.singleDestinationsData[
        destinationsSlice.selectedSingleDestination.key
      ]?.connectionsData.find((connection) => connection.entKey === v.entKey)
    );
    const isConnectionJustAdded = Boolean(
      connections.find((connection) => connection.entKey === v.entKey)
    );

    if (isConnectionAlreadyInDestination || isConnectionJustAdded) return;

    setConnectionUpdatedItem((prev) => [...prev, v.entKey]);
    setConnections((prev) => [...prev, v]);
  };

  const getActivities = (v) => {
    const isActivityAlreadyInDestination = Boolean(
      destinationsSlice.singleDestinationsData[
        destinationsSlice.selectedSingleDestination.key
      ]?.activitiesData.find((activity) => activity.key === v.key)
    );
    const isActivityJustAdded = Boolean(
      selectedActivitiesArrayData.find((activity) => activity.key === v.key)
    );

    if (isActivityAlreadyInDestination || isActivityJustAdded) return;

    setSelectedActivitiesArrayData((prev) => [...prev, v]);
    setActivityUpdatedItem((prev) => [...prev, v.key]);
  };

  const getDestinationData = (v) => {
    const isDestinationAlreadyInDestination = Boolean(
      destinationsSlice.singleDestinationsData[
        destinationsSlice.selectedSingleDestination.key
      ]?.linkedDestinationsData.find((destination) => destination.key === v.key)
    );
    const isDestinationJustAdded = Boolean(
      destinations.find((destination) => destination.key === v.key)
    );

    if (isDestinationAlreadyInDestination || isDestinationJustAdded) return;

    setDestinationUpdatedItem((prev) => [...prev, v.key]);
    setDestinations((prev) => [...prev, v]);
  };

  const getImage = (v) => {
    const isMemoryAlreadyInDestination = Boolean(
      destinationsSlice.singleDestinationsData[
        destinationsSlice.selectedSingleDestination.key
      ]?.mediaData.find((memory) => memory.docKey === v.documentId)
    );
    const isMemoryJustAdded = Boolean(
      memoryImagesTwo.find((memory) => memory.documentId === v.documentId)
    );

    if (isMemoryAlreadyInDestination || isMemoryJustAdded) return;

    setMediaUpdatedItem((prev) => [...prev, v.documentId]);
    setMemoryImagesTwo((prev) => [...prev, v]);
  };

  const deleteConnectionItem = async (data) => {
    const isConnectionStoredInBackend =
      destinationsSlice.singleDestinationsData[
        destinationsSlice.selectedSingleDestination.key
      ].connectionsData.find((connection) => connection.entKey === data.entKey);
    if (!isConnectionStoredInBackend) {
      setConnections((prev) =>
        prev.filter((connection) => connection.entKey !== data.entKey)
      );
      setConnectionUpdatedItem((prev) =>
        prev.filter((connectionKey) => connectionKey !== data.entKey)
      );
      return;
    }

    try {
      setIsLoading(true);

      await deleteDestinationItem({
        userToken,
        reducerVisitorID,
        documentID: data.groupItemsKey,
      });

      alert.show("Connection deleted successfully!");
    } catch (error) {
      alert.show("Error Deleting Connection");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteActivityItem = async (data) => {
    const isActivityStoredInBackend = destinationsSlice.singleDestinationsData[
      destinationsSlice.selectedSingleDestination.key
    ].activitiesData.find((activity) => activity.key === data.key);
    if (!isActivityStoredInBackend) {
      setSelectedActivitiesArrayData((prev) =>
        prev.filter((activity) => activity.key !== data.key)
      );
      setActivityUpdatedItem((prev) =>
        prev.filter((activityKey) => activityKey !== data.key)
      );
      return;
    }

    try {
      setIsLoading(true);

      await deleteDestinationItem({
        userToken,
        reducerVisitorID,
        documentID: data.groupItemsKey,
      });

      alert.show("Activity deleted successfully!");
    } catch (error) {
      alert.show("Error Deleting Activity");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteLinkedDestinationItem = async (data) => {
    const isDestinationStoredInBackend =
      destinationsSlice.singleDestinationsData[
        destinationsSlice.selectedSingleDestination.key
      ].linkedDestinationsData.find(
        (destination) => destination.key === data.key
      );
    if (!isDestinationStoredInBackend) {
      setDestinations((prev) =>
        prev.filter((destination) => destination.key !== data.key)
      );
      setDestinationUpdatedItem((prev) =>
        prev.filter((destinationKey) => destinationKey !== data.key)
      );
      return;
    }

    try {
      setIsLoading(true);

      await deleteDestinationItem({
        userToken,
        reducerVisitorID,
        documentID: data.groupItemsKey,
      });

      alert.show("Destination deleted successfully!");
    } catch (error) {
      alert.show("Error Deleting Destination");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMediaItem = async (data, index) => {
    const isMediaStoredInBackend = destinationsSlice.singleDestinationsData[
      destinationsSlice.selectedSingleDestination.key
    ].mediaData.find((media) => media.docKey === data.docKey);

    if (!isMediaStoredInBackend) {
      setMemoryImagesTwo((prev) =>
        prev.filter((memoryImage) => memoryImage.documentId !== data.documentId)
      );
      setMediaUpdatedItem((prev) =>
        prev.filter((mediaKey) => mediaKey !== data.documentId)
      );
      return;
    }

    try {
      setIsLoading(true);

      await deleteDestinationItem({
        userToken,
        reducerVisitorID,
        documentID: data.groupItemsKey,
      });

      alert.show("Media deleted successfully!");
    } catch (error) {
      alert.show("Error Deleting Media");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTriggerOpen = () => {
    setCollapsibleButton(true);
  };

  const handleTriggerClose = () => {
    setCollapsibleButton(false);
  };

  const moveToMyDestination = () => {
    history.push("/destinations/my-destinations");
  };

  const mediaComponentActive = (e) => {
    // console.log("button Clicked", e);
    setMediaComponent(!mediaComponent);
    // console.log(mediaComponent);
  };

  const callUpdateDestinationApi = async (documentID) => {
    const config = JSON.stringify({
      countryCode: groupCodes.countryCode,
      pictureDocumentID: documentID,
      DestinationType: "destination",
    });
    const params = JSON.stringify({
      pk: destinationDetails.key,
      name: destinationDetails.title,
      description: destinationDetails.description,
      searchable: destinationDetails.searchable,
      acl: 7429,
      configurations: config,
      memberStatus: 0,
      latitude: destinationDetails.latitude,
      longitude: destinationDetails.longitude,
      displayName: destinationDetails.displayName,
      mapZoom: zoomRef.current || destinationDetails.mapZoom,
      followUpDateTime: destinationDetails.departureDate,
      creationDateTime: destinationDetails.arrivalDate,
    });

    return triggerUpdateDestination({
      userToken,
      reducerVisitorID,
      data: params,
    });
  };

  const updateDestination = async () => {
    // updateMetaGroupAPI;

    let documentId;
    console.log("groupCodes:", groupCodes);
    if (groupCodes.base64Result != null) {
      const params = JSON.stringify({
        pk: 0,
        acl: 7429,
        fileName: imageName,
        documentName: mimeType + "/" + imageName,
        mimeType: mimeType,
        timestampDocument: Date.now(),
        dataBase64: groupCodes.base64Result,
        versioning: 0,
      });

      try {
        const result = await addBase64File(userToken, params, reducerVisitorID);

        console.log(
          "%caddBase64File result:",
          "background-color:red;color:white;",
          result
        );

        if (result && result.data !== null) {
          documentId = result.data.documentID;

          // let item = {
          //   date: Date.now(),
          //   documentId: result.data.documentId,
          //   image: destinationImageData.base64,
          //   isLoaded: true,
          // };
          // if (memoryImagesArray === undefined || memoryImagesArray.length === 0) {
          //   setMemoryImagesArray([item]);

          //   dispatch({
          //     type: "SET_MEMORY_IMAGE",
          //     reducerMemoryImages: [item],
          //   });
          // } else {
          //   memoryImagesArray.push(item);

          //   dispatch({
          //     type: "SET_MEMORY_IMAGE",
          //     reducerMemoryImages: memoryImagesArray,
          //   });
          // }
        } else {
          alert.show("Destination update failed");
          setIsLoading(false);
        }
      } catch (error) {
        console.log(
          "%caddBase64File error:",
          "background-color:red;color:white;",
          error
        );
      }
    } else {
      documentId = groupCodes.pictureDocumentID;
    }

    if (documentId) {
      setIsLoading(true);

      try {
        const res = await callUpdateDestinationApi(documentId);

        console.log(
          "%cupdateDestination response:",
          "background-color:black;color:white;",
          res
        );
        await Promise.allSettled([
          uploadUpdatedConnection(),
          uploadUpdatedActivities(),
          uploadUpdatedDestination(),
          uploadUpdatedMemoryImages(),
        ]);

        setIsLoading(false);
        setIsBlocking(false);
        alert.show("Destination updated successfully");

        const indexOfDestinationToUpdate =
          destinationsSlice.destinations.findIndex(
            (destination) =>
              destination.key ===
              destinationsSlice.selectedSingleDestination.key
          );
        if (indexOfDestinationToUpdate !== -1) {
          const clonedDestinations = cloneDeep(destinationsSlice.destinations);
          const destinationToUpdate =
            clonedDestinations[indexOfDestinationToUpdate];

          destinationToUpdate.name = destinationDetails.title;
          destinationToUpdate.description = destinationDetails.description;
          destinationToUpdate.searchable = destinationDetails.searchable;
          destinationToUpdate.base64 = destinationImageData.base64;
          destinationToUpdate.countrySvg = groupFlag;
          destinationToUpdate.latitude = destinationDetails.latitude;
          destinationToUpdate.longitude = destinationDetails.longitude;
          destinationToUpdate.displayName = destinationDetails.displayName;
          destinationToUpdate.followUpDateTime =
            destinationDetails.departureDate;
          destinationToUpdate.creationDateTime = destinationDetails.arrivalDate;

          storeDispatch(setDestinationsInStore(clonedDestinations));
          storeDispatch(
            setRecentDestinationsScrollState({
              ...destinationsSlice.recentDestinationsScrollState,
              items: clonedDestinations,
            })
          );
          // storeDispatch(
          //   setMultiple({
          //     destinations: clonedDestinations,
          //     recentDestinationsScrollState: {
          //       ...destinationsSlice.recentDestinationsScrollState,
          //       items: clonedDestinations,
          //     },
          //   })
          // );
        }

        moveToMyDestination();

        // setCountrydropdownMenu(false);
      } catch (error) {
        console.log(
          "%cupdateDestination error:",
          "background-color:black;color:white;",
          error
        );
        alert.show("Destination update failed");
        setIsLoading(false);
        setIsBlocking(false);
      }
    }
  };

  const uploadUpdatedConnection = async () => {
    const itemsParams = connectionUpdatedItem.map((connectionItem) => {
      return JSON.stringify({
        ugGroupKey: connectionItem,
        gtGroupType: user_contactGroupKey,
        mtGroupKey: destinationsSlice.selectedSingleDestination.key,
      });
    });

    const addDestinationItemPromises = itemsParams.map((params) => {
      return addDestinationItem({ userToken, reducerVisitorID, data: params });
    });

    return await Promise.allSettled(addDestinationItemPromises);
  };

  const uploadUpdatedActivities = async () => {
    const itemsParams = activityUpdatedItem.map((activityItem) => {
      return JSON.stringify({
        ugGroupKey: activityItem,
        gtGroupType: activityGroupKey,
        mtGroupKey: destinationsSlice.selectedSingleDestination.key,
      });
    });

    const addDestinationItemPromises = itemsParams.map((params) => {
      return addDestinationItem({ userToken, reducerVisitorID, data: params });
    });

    return await Promise.allSettled(addDestinationItemPromises);
  };

  const uploadUpdatedDestination = async () => {
    const itemsParams = destinationUpdatedItem.map((destinationItem) => {
      return JSON.stringify({
        ugGroupKey: destinationItem,
        gtGroupType: destinationGroupKey,
        mtGroupKey: destinationsSlice.selectedSingleDestination.key,
      });
    });

    const addDestinationItemPromises = itemsParams.map((params) => {
      return addDestinationItem({ userToken, reducerVisitorID, data: params });
    });

    return await Promise.allSettled(addDestinationItemPromises);
  };

  const uploadUpdatedMemoryImages = async () => {
    const itemsParams = mediaUpdatedItem.map((mediaItem) => {
      return JSON.stringify({
        ugGroupKey: mediaItem,
        gtGroupType: memoryGroupKey,
        mtGroupKey: destinationsSlice.selectedSingleDestination.key,
      });
    });

    const addDestinationItemPromises = itemsParams.map((params) => {
      return addDestinationItem({ userToken, reducerVisitorID, data: params });
    });

    return await Promise.allSettled(addDestinationItemPromises);
  };

  useEffect(() => {
    if (getSingleDestinationQueryState.isSuccess) {
      if (getSingleDestinationQueryState?.data?.description) {
        const decoder = Buffer.from(
          getSingleDestinationQueryState.data.description,
          "base64"
        ).toString("UTF-8");
        setQuillValue(decoder);
      }
    }
  }, [
    getSingleDestinationQueryState?.data?.description,
    getSingleDestinationQueryState.isSuccess,
  ]);

  const updateQuillValue = () => {
    setIsBlocking(true);
  };

  useEffect(() => {
    // if (setQuillValue != null) {

    setUpdatedValue(Buffer.from(quillValue).toString("base64"));
    // console.log("quillValue", quillValue);
    // console.log("quillValue", updatedValue);
    // }
  }, [quillValue]);
  useEffect(() => {
    if (updatedValue != null) {
      setDestinationDetails((prev) => ({
        ...prev,
        description: updatedValue,
      }));
      // console.log("quillValue", updatedValue);
    }
  }, [updatedValue]);

  // useEffect(() => {
  //   if (destinationsSlice.selectedSingleDestination) {
  //     setDestinationDetails((prev) => ({
  //       ...prev,
  //       displayName: destinationsSlice.selectedSingleDestination.displayName,
  //       latitude: destinationsSlice.selectedSingleDestination.latitude,
  //       longitude: destinationsSlice.selectedSingleDestination.longitude,
  //       mapZoom: destinationsSlice.selectedSingleDestination.mapZoom,
  //       searchable: destinationsSlice.selectedSingleDestination.searchable,
  //       title: destinationsSlice.selectedSingleDestination.name,
  //       description: destinationsSlice.selectedSingleDestination.description,
  //       key: destinationsSlice.selectedSingleDestination.key,
  //       departureDate:
  //         destinationsSlice.selectedSingleDestination.departureDate,
  //       arrivalDate: destinationsSlice.selectedSingleDestination.arrivalDate,
  //     }));
  //   }
  // }, [destinationsSlice.selectedSingleDestination]);
  useEffect(() => {
    if (getSingleDestinationQueryState.isSuccess) {
      const destination = getSingleDestinationQueryState.data;

      setDestinationDetails((prev) => ({
        ...prev,
        displayName: destination.displayName,
        latitude: destination.latitude,
        longitude: destination.longitude,
        mapZoom: destination.mapZoom,
        searchable: destination.searchable,
        title: destination.name,
        description: destination.description,
        key: destination.pk,
        departureDate: destination.followUpDateTime,
        arrivalDate: destination.creationDateTime,
      }));
      setCoord([destination.longitude, destination.latitude]);
    }
  }, [
    getSingleDestinationQueryState.data,
    getSingleDestinationQueryState.isSuccess,
  ]);

  const deleteDestination = (v) => {
    if (deleteOrHideConfirmation === false) {
      setDeleteOrHideConfirmation(true);
      // console.log("deleteOrHideConfirmation", deleteOrHideConfirmation);
    } else if (deleteOrHideConfirmation === true) {
      setDeleteOrHideConfirmation(false);
      // console.log("deleteOrHideConfirmation", deleteOrHideConfirmation);
    }
  };

  // useEffect(() => {
  // console.log("destinationDetails base64", destinationDetails.base64);
  // }, [destinationDetails.base64]);

  const changeMapZoom = useCallback((receivedZoom) => {
    // setDestinationDetails((prev) => ({
    //   ...prev,
    //   mapZoom: zoom,
    // }));

    zoomRef.current = receivedZoom;
  }, []);

  const onSearchLocationSubmit = (event) => {
    event.preventDefault();
    getTrackValue();
  };

  if (loading) {
    return (
      <div className="screenLoader">
        <Oval color="#00BFFF" height={80} width={80} />
      </div>
    );
  }

  return (
    <div className="view-destination">
      <Prompt
        when={isBlocking}
        message={" Are you sure you want to leave this page"}
      />
      {/* /***** First Container Starts Here  *******/}
      <header className="view-destination__header">
        <div className="view-destination__header-left">
          <ChevronAtom onClick={moveToMyDestination} />

          <h1 className="view-destination__heading">View Destination</h1>
        </div>

        <div className="view-destination__header-right">
          {getSingleDestinationQueryState.isLoading && (
            <Shimmer
              width={190}
              height={30}
              className="view-destination__header-right-shimmer"
            />
          )}
          {!getSingleDestinationQueryState.isLoading && (
            <ToggleBar activeIndex={destinationDetails.searchable}>
              <ToggleBarElement onClick={() => changeSearchable("private")}>
                PRIVATE
              </ToggleBarElement>
              <ToggleBarElement onClick={() => changeSearchable("public")}>
                PUBLIC
              </ToggleBarElement>
            </ToggleBar>
          )}
        </div>
      </header>
      {/* /***** First Container Ends Here  *******/}

      {/* /** Second Container Starts Here  ****/}
      <section className="view-destination__destination-details-container">
        <div className="view-destination__destination-details">
          <div className="view-destination__destination-details-card">
            <div className="view-destination__edit-destination-name">
              <FmdGood className="view-destination__edit-destination-location-icon" />
              <div className="view-destination__edit-destination-name-input-container">
                <label
                  htmlFor="view-destination__edit-destination-name-input"
                  className="view-destination__edit-destination-name-label"
                >
                  Destination
                </label>
                <input
                  id="view-destination__edit-destination-name-input"
                  className="view-destination__edit-destination-name-input"
                  type="text"
                  placeholder="Enter Title"
                  value={destinationDetails.title}
                  onChange={changeTitle}
                  disabled={getSingleDestinationQueryState.isLoading}
                />
              </div>
            </div>

            <div className="view-destination__edit-destination-dates">
              <CalendarToday className="view-destination__edit-destination-calender-icon" />

              <div className="view-destination__edit-destination-arrival-date-container">
                <label htmlFor="view-destination__edit-destination-arrival-date">
                  Arrival Date
                </label>
                <input
                  id="view-destination__edit-destination-arrival-date"
                  className="view-destination__edit-destination-arrival-date-input"
                  label="Arrival Date"
                  variant="standard"
                  type="date"
                  value={
                    destinationDetails?.arrivalDate
                      ? new Date(
                        destinationDetails?.arrivalDate
                      ).toLocaleDateString("en-CA")
                      : new Date(Date.now())
                  }
                  // value={dateArrivalDefault.toLocaleDateString("en-CA")}
                  onChange={onSetDateArrival}
                  disabled={getSingleDestinationQueryState.isLoading}
                />
              </div>

              <div className="view-destination__edit-destination-departure-date-container">
                <label htmlFor="view-destination__edit-destination-departure-date">
                  Departure Date
                </label>
                <input
                  id="view-destination__edit-destination-departure-date"
                  className="view-destination__edit-destination-departure-date-input"
                  label="Departure Date"
                  variant="standard"
                  type="date"
                  value={
                    destinationDetails?.departureDate
                      ? new Date(
                        destinationDetails?.departureDate
                      ).toLocaleDateString("en-CA")
                      : new Date(Date.now())
                  }
                  // value={dateDepartureDefault.toLocaleDateString("en-CA")}
                  min={moment(dateArrivalDefault.getTime()).format(
                    "YYYY-MM-DD"
                  )}
                  onChange={onSetDateDeparture}
                  disabled={getSingleDestinationQueryState.isLoading}
                />
              </div>

              <ThemeModal
                isOpen={isFlagModalOpen}
                onCloseHandler={() => setIsFlagModalOpen(false)}
                modalTitle="Edit Country Flag"
              >
                <div className="view-destination__edit-destination-flag-modal">
                  <div className="view-destination__edit-destination-flag-container">
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
                <div className="view-destination__flag-placeholder-container">
                  <Edit
                    className="view-destination__flag-placeholder-edit-icon"
                    onClick={() => setIsFlagModalOpen(true)}
                  />
                </div>
              ) : (
                // countrydropdownMenu || !groupFlag ? (
                //   <div className="view-destination__destination-flag-select-container">
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
                <div className="view-destination__destination-flag-container">
                  {getSingleDestinationQueryState.isLoading && (
                    <Shimmer height={40} width={50} />
                  )}
                  {!getSingleDestinationQueryState.isLoading && (
                    <img
                      className="view-destination__destination-flag"
                      src={groupFlag}
                      onClick={() => setIsFlagModalOpen(true)}
                      alt="Destination Flag"
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="view-destination__image-container">
            {getSingleDestinationQueryState.isLoading && (
              <Shimmer
                width={180}
                height={130}
                className="view-destination__image-container-shimmer"
              />
            )}

            {!getSingleDestinationQueryState.isLoading && (
              <>
                {!destinationImageData.base64 ? (
                  <div className="view-destination__image-placeholder-container">
                    <Edit
                      className="view-destination__image-placeholder-edit-icon"
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
                    src={destinationImageData.base64}
                    onClick={photoUrl ? handleImageOpen : () => { }}
                  />
                )}

                {destinationImageData.base64 && (
                  <div className="uploadImageButton">
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
              </>
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
                src={destinationImageData.base64}
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

      {/* /***** Third Container Starts Here  *******/}
      <section className="view-destination__map-container">
        {destinationDetails.displayName && (
          // <h3 className="cityName">{destinationDetails.displayName.split(",")[0]}</h3>
          <h2 className="view-destination__map-container-heading">
            {getSingleDestinationQueryState.isLoading && "-"}

            {!getSingleDestinationQueryState.isLoading &&
              destinationDetails.displayName}
          </h2>
        )}
        <div className="view-destination__map">
          {getSingleDestinationQueryState.isLoading && (
            <Shimmer
              width={450}
              height={500}
              className="view-destination__map-shimmer"
            />
          )}

          {!getSingleDestinationQueryState.isLoading && (
            <>
              {coord.length >= 1 ? (
                <GeneralMap
                  coord={[coord]}
                  center={coord}
                  zoom={zoomRef?.current || destinationDetails?.mapZoom}
                  zoomChangeHandler={changeMapZoom}
                />
              ) : (
                <GeneralMap
                  zoom={zoomRef?.current || destinationDetails?.mapZoom}
                  zoomChangeHandler={changeMapZoom}
                />
              )}

              <div className="view-destination__search-location">
                <div className="view-destination__search-location-container">
                  <FmdGood className="view-destination__search-location-icon" />

                  <div className="view-destination__search-location-box">
                    {locationData.length === 0 || locationSearcher ? (
                      <form
                        onSubmit={onSearchLocationSubmit}
                        className="view-destination__search-location-form"
                      >
                        <input
                          type="text"
                          value={searchTerm}
                          placeholder="Enter Location"
                          className="view-destination__search-location-input"
                          onChange={(event) => {
                            const string = event.target.value;
                            const spacesReplaced = string.replaceAll(" ", "+");
                            // console.log("spacesReplaced", spacesReplaced);
                            setSearchTerm(string);
                            setSearchData(spacesReplaced);
                          }}
                        />

                        <div className="view-destination__search-location-button-container">
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
                          className="view-destination__location-select-close-button"
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
            </>
          )}
        </div>
      </section>
      {/* /***** Third Container Ends Here  *******/}
      <ButtonAtom
        variant="filled"
        fontSize="medium"
        onClick={() => setAnnotationDialog({ ...annotationDialog, isOpen: true })}
      >
        Annotation
      </ButtonAtom>
      {annotationDialog.isOpen && <AnnotationDialog annotationDialog={annotationDialog} setAnnotationDialog={setAnnotationDialog} />}
      {/* /** Fourth Container Starts Here  ****/}
      <section className="view-destination__notes-container">
        {getSingleDestinationQueryState.isLoading && (
          <Shimmer
            height={110}
            width={450}
            className="view-destination__notes-container-shimmer"
          />
        )}
        {!getSingleDestinationQueryState.isLoading && (
          <ReactQuill
            theme="snow"
            value={quillValue}
            onChange={setQuillValue}
            onFocus={updateQuillValue}
            modules={Editor}
          />
        )}
      </section>

      {/* /** Fourth Container Ends Here  ****/}

      <div className="view-destination__container-items">
        {/* /** FIfth Container Starts Here  ****/}

        <section className="view-destination__connections-container">
          {/* <ConnectionsSection /> */}
          <h2 className="view-destination__connections-heading">Connections</h2>
          {getSingleDestinationQueryState.isFetching ? (
            <div className="view-destination__connections-loading-container">
              {Array.from({ length: 6 }).map((_, i) => {
                return (
                  <Shimmer
                    key={i}
                    width={180}
                    height={130}
                    className="view-destination__connections-shimmer"
                  />
                );
              })}
            </div>
          ) : (
            <div className="view-destination__connections-cards-container">
              {destinationsSlice.singleDestinationsData[
                groupKey
              ]?.connectionsData?.concat(connections)?.length <= 0 ? (
                <p className="view-destination__no-connections-text">
                  Please Add Members{" "}
                </p>
              ) : (
                <div className="view-destination__connections-cards">
                  {destinationsSlice.singleDestinationsData[
                    groupKey
                  ]?.connectionsData
                    ?.concat(connections)
                    ?.map((v, i) => (
                      <PeopleCards
                        key={v + i}
                        index={i}
                        data={v}
                        deleteItem
                        clickFunction={deleteConnectionItem}
                      />
                    ))}
                </div>
              )}
            </div>
          )}
        </section>
        {/* /** Fifth Container Ends Here  ****/}

        {/* /** Sixth Container Starts Here  ****/}
        <section className="view-destination__activities-container">
          {/* <ActivitiesSection /> */}
          <h2 className="view-destination__activities-heading">Activities</h2>
          {getSingleDestinationQueryState.isFetching ? (
            <div className="view-destination__activities-loading-container">
              {Array.from({ length: 8 }).map((_, i) => {
                return (
                  <Shimmer
                    key={i}
                    width={130}
                    height={130}
                    className="view-destination__activities-shimmer"
                  />
                );
              })}
            </div>
          ) : (
            <div className="view-destinations__activities-cards-container">
              {destinationsSlice.singleDestinationsData[
                groupKey
              ]?.activitiesData?.concat(selectedActivitiesArrayData)?.length <=
                0 ? (
                <p className="view-destination__no-activities-text">
                  Please Add Activites{" "}
                </p>
              ) : (
                <div className="view-destination__activities-cards">
                  {destinationsSlice.singleDestinationsData[
                    groupKey
                  ]?.activitiesData
                    ?.concat(selectedActivitiesArrayData)
                    ?.map((v, i) => (
                      <div className="mapMiniActivites" key={v + i}>
                        <MiniActivitiesCard
                          data={v}
                          index={i}
                          clickFunction={deleteActivityItem}
                          deleteItem
                        />
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </section>
        {/* /** Sixth Container Ends Here  ****/}

        {/* /** Seventh Container Starts Here  ****/}
        <section className="view-destination__linked-destinations-container">
          {/* <LinkedDestinations /> */}
          <h2 className="view-destination__linked-destinations-heading">
            Linked Destinations
          </h2>
          {getSingleDestinationQueryState.isFetching ? (
            <div className="view-destination__linked-destinations-loading-container">
              {Array.from({ length: 5 }).map((_, i) => {
                return (
                  <Shimmer
                    key={i}
                    width={230}
                    height={130}
                    className="view-destination__linked-destinations-shimmer"
                  />
                );
              })}
            </div>
          ) : (
            <div className="view-destination__linked-destinations-cards-container">
              {destinationsSlice.singleDestinationsData[
                groupKey
              ]?.linkedDestinationsData?.concat(destinations)?.length <= 0 ? (
                <p className="view-destination__no-linked-destinations-text">
                  Please Add Destinations{" "}
                </p>
              ) : (
                <div className="view-destination__linked-destinations-cards">
                  {destinationsSlice.singleDestinationsData[
                    groupKey
                  ]?.linkedDestinationsData
                    ?.concat(destinations)
                    ?.map((v, i) => (
                      <MiniDestinationCard
                        key={v + i}
                        data={v}
                        index={i}
                        clickFunction={deleteLinkedDestinationItem}
                        deleteItem
                      />
                    ))}
                </div>
              )}
            </div>
          )}
        </section>
        {/* /** Seventh Container Ends Here  ****/}

        {/* /** Eight Container Ends Here  ****/}
        <section className="view-destination__media-container">
          <h2 className="view-destination__media-heading">Media</h2>
          {getSingleDestinationQueryState.isFetching ? (
            <div className="view-destination__media-loading-container">
              {Array.from({ length: 5 }).map((_, i) => {
                return (
                  <Shimmer
                    key={i}
                    width={130}
                    height={130}
                    className="view-destination__media-shimmer"
                  />
                );
              })}
            </div>
          ) : (
            <div className="view-destination__media-cards-container">
              {destinationsSlice.singleDestinationsData[
                groupKey
              ]?.mediaData?.concat(memoryImagesTwo).length <= 0 ? (
                <p className="view-destination__no-media-text">
                  Please Add Gallery{" "}
                </p>
              ) : (
                <div className="view-destination__media-cards">
                  {destinationsSlice.singleDestinationsData[groupKey]?.mediaData
                    ?.concat(memoryImagesTwo)
                    .map((v, i) => (
                      <MediaGallery
                        key={i}
                        data={v}
                        index={i}
                        clickFunction={deleteMediaItem}
                        deleteItem
                      />
                    ))}
                </div>
              )}
            </div>
          )}
        </section>
        {/* /** Eight Container Ends Here  ****/}
      </div>

      <footer className="view-destination__footer">
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
          className="view-destination__footer-add-icon"
        />

        <div>
          {!getSingleDestinationQueryState.isLoading && (
            <ButtonAtom
              variant="filled"
              fontSize="medium"
              onClick={updateDestination}
            >
              Update Destination
            </ButtonAtom>
          )}
        </div>

        <Close
          onClick={() => deleteDestination(destinationDetails.key)}
          className="view-destination__footer-close-icon"
        />
      </footer>

      {deleteOrHideConfirmation && (
        <DeleteOrHideDialogue
          keyValue={destinationDetails.key}
          state="destination"
          deleteOrHideConfirmation={deleteOrHideConfirmation}
          setDeleteOrHideConfirmation={setDeleteOrHideConfirmation}
        />
      )}

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

export default ViewDestination;
