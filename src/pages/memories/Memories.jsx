import React from "react";
import { Route } from "react-router-dom";
import MemoriesDestination from "../../components/Memories Screen Components/Memories Destination/MemoriesDestination";
import SelectedMemoryDestination from "../../components/Memories Screen Components/Memories Destination/Selected Memory Destintaion/SelectedMemoryDestination";
import DocViewer from "../../components/Memories Screen Components/Memories Documents/Doc Viewer/DocViewer";
import MemoriesDocuments from "../../components/Memories Screen Components/Memories Documents/MemoriesDocuments";
import MemoriesImages from "../../components/Memories Screen Components/Memories Imags/MemoriesImages";
import MemoriesPostcards from "../../components/Memories Screen Components/Memories Postcards/MemoriesPostcards";
import MemoriesVideos from "../../components/Memories Screen Components/Memories Videos/MemoriesVideos";
import "./Memories.css";

function Memories() {
  return (
    <div className="memories">
      <Route exact path="/memories/destination/:tracID">
        <SelectedMemoryDestination />
      </Route>

      <Route path="/memories/videos">
        <MemoriesVideos />
      </Route>

      <Route path="/memories/postcards">
        <MemoriesPostcards />
      </Route>
      <Route exact path="/memories/destination">
        <MemoriesDestination />
      </Route>

      <Route path="/memories/documents/doc-viewer">
        <DocViewer />
      </Route>

      <Route exact path="/memories/documents">
        <MemoriesDocuments />
      </Route>

      <Route path="/memories/images">
        <MemoriesImages />
      </Route>
    </div>
  );
}

export default Memories;
