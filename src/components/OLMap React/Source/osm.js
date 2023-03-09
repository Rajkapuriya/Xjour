import * as olSource from "ol/source";
import { mapServer } from "../../../assets/strings/Strings";

function osm() {
	return new olSource.OSM({url: mapServer});
}

export default osm;