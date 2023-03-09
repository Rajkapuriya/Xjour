import { useState, useEffect } from "react";
import { Route } from "react-router";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Shimmer } from "react-shimmer";
import InfiniteScroll from "react-infinite-scroll-component";

import "./Destinations.css";

import { useStateValue } from "config/context api/StateProvider";

import {
  destinationsSelector,
  setDestinationsPageNumber,
  setSelectedSingleDestination,
} from "store/reducers/destinations";
import { notesSelector, setNotesPageNumber } from "store/reducers/notes";

import Discover from "components/Destination Screen Components/Discover/Discover";
import MyActivities from "components/Destination Screen Components/My Activities/MyActivities";
import ViewActivities from "components/Destination Screen Components/My Activities/View Activities/ViewActivities";
import CreateDestination from "components/Destination Screen Components/My Destinations/Create Destination/CreateDestination";
import MyDestinations from "components/Destination Screen Components/My Destinations/MyDestinations";
import MyJourneys from "components/Destination Screen Components/My Journeys/MyJourneys";
import NewJourney from "components/Destination Screen Components/New Journey/NewJourney";
import CreateNotes from "components/Destination Screen Components/Notes/Create Notes/CreateNotes";
import Notes from "components/Destination Screen Components/Notes/Notes";
import SelectedNotes from "components/Destination Screen Components/Notes/Selected Notes/SelectedNotes";
import ViewDestination from "components/Destination Screen Components/View Destination/ViewDestination";
import Test from "components/Test/Test";
import CreateJourney from "components/Destination Screen Components/My Journeys/Create Journey/CreateJourney";
import ViewJourney from "components/Destination Screen Components/My Journeys/View Journey/ViewJourney";
import CustomMap from "components/OLMap React/CustomMap";
import DestinationEmergency from "components/Destination Screen Components/Destinations Emergency/DestinationEmergency";
import TodoGroups from "components/Destination Screen Components/TodoGroups/TodoGroups";
import DestinationAmenities from "components/Destination Screen Components/Destination Amenities/DestinationAmenities";

let renderCount = 0;

function Destinations() {
  const history = useHistory();
  const storeDispatch = useDispatch();

  const [{ userToken }, dispatch] = useStateValue();

  const destinationsState = useSelector(destinationsSelector);
  const notesState = useSelector(notesSelector);
  console.log(
    "%cdestinationsState:",
    "background-color:red;",
    destinationsState
  );

  const [selectedDestination, setSelectedDestination] = useState([]);

  const getDestinationData = (v, i) => {
    // console.log("vData", v);
    const selectedSingleDestinationData = {
      configurations: v.configurations,
      base64: v.base64,
      countrySvg: v.countrySvg,
      description: v.description,
      key: v.key,
      name: v.name,
      departureDate: v.followUpDateTime,
      arrivalDate: v.creationDateTime,
      displayName: v.displayName,
      latitude: v.latitude,
      longitude: v.longitude,
      mapZoom: v.mapZoom,
      searchable: v.searchable,
      index: i,
    };

    storeDispatch(setSelectedSingleDestination(selectedSingleDestinationData));

    setSelectedDestination(selectedSingleDestinationData);

    dispatch({
      type: "SET_SELECTED_DESTINATION",
      reducerSelectedDestination: selectedDestination,
    });
    history.push(`/destinations/view-destination/${v.key}`);
  };

  return (
    <div className="destinations-page">
      <Route path="/destinations/customMap">
        <CustomMap />
      </Route>

      <Route path="/destinations/amenities">
        <DestinationAmenities />
      </Route>

      <Route path="/destinations/emergency">
        <DestinationEmergency />
      </Route>

      <Route path="/destinations/todo-groups">
        <TodoGroups />
      </Route>

      <Route path="/destinations/notes">
        <InfiniteScroll
          dataLength={notesState.recentNotesScrollState.items.length}
          hasMore={notesState.recentNotesScrollState.hasMore}
          next={() =>
            storeDispatch(setNotesPageNumber(notesState.notesPageNumber + 1))
          }
          loader={
            <div className="notes__scroll-more-loader-container">
              <Shimmer width={575} height={180} className="notes__shimmer" />
            </div>
          }
          className="destinations__infinite-scroll"
          height={"calc(100vh - 45px)"}
          scrollThreshold={0.8}
        >
          <Notes />
        </InfiniteScroll>
      </Route>

      <Route path="/destinations/create-destination">
        <CreateDestination />
      </Route>

      <Route path="/destinations/view-destination/:groupKey">
        <ViewDestination />
      </Route>

      <Route path="/destinations/selected-notes/:groupKey">
        <SelectedNotes />
      </Route>

      <Route path="/destinations/create-note">
        <CreateNotes />
      </Route>

      <Route path="/destinations/discover">
        <Discover />
      </Route>

      <Route path="/destinations/view-journey">
        <ViewJourney />
      </Route>

      <Route path="/destinations/my-journeys">
        <MyJourneys />
      </Route>

      <Route path="/destinations/create-journey">
        <CreateJourney />
      </Route>

      <Route path="/destinations/my-activities">
        <MyActivities />
      </Route>

      <Route path="/destinations/view-activities">
        <ViewActivities />
      </Route>

      <Route path="/destinations/new-journey">
        <NewJourney />
      </Route>

      <Route path="/destinations/test">
        <Test />
      </Route>

      <Route path="/destinations/my-destinations">
        <InfiniteScroll
          dataLength={
            destinationsState.recentDestinationsScrollState.items.length
          }
          hasMore={destinationsState.recentDestinationsScrollState.hasMore}
          next={() =>
            storeDispatch(
              setDestinationsPageNumber(
                destinationsState.destinationsPageNumber + 1
              )
            )
          }
          loader={
            <div className="my-destinations__scroll-more-loader-container">
              <Shimmer
                width={575}
                height={180}
                className="my-destinations__shimmer"
              />
            </div>
          }
          className="destinations__infinite-scroll"
          height={"calc(100vh - 45px)"}
          scrollThreshold={0.8}
        >
          <MyDestinations getDestinationData={getDestinationData} />
        </InfiniteScroll>
      </Route>
    </div>
  );
}

export default Destinations;
