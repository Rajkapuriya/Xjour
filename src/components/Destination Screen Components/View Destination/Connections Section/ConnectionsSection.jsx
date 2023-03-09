import React from "react";
import PeopleCards from "../../../Connect Screen Components/My Connections/People Section/People cards/PeopleCards";
import "./ConnectionsSection.css";

function ConnectionsSection() {
  const data = [
    {
      id: "01",
      occupation: "Designer",
      currentLocation: "Berlin, Germany",
      image:
        "https://mooreks.co.uk/wp-content/uploads/2015/01/Dinah-Regan-1513-1.jpg",
      name: "Eve Gardner",
      flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Flag_of_Finland.svg/2560px-Flag_of_Finland.svg.png",
    },
    {
      id: "02",
      occupation: "Advisor",
      currentLocation: "Frankfurt, Germany",
      image: "https://i.stack.imgur.com/xldLK.jpg?s=192&g=1",
      name: "Frank Sampson",
      flag: "https://cdn.britannica.com/79/4479-050-6EF87027/flag-Stars-and-Stripes-May-1-1795.jpg",
    },
    {
      id: "03",
      occupation: "Tour Guider",
      currentLocation: "Paris, France",
      image:
        "https://www.thelocal.se/wp-content/uploads/2018/12/6d67730d16af04f3f956389d4cc244af808b8381c23b1e3d218ecd792de14fa8.jpg",
      name: "Steven Chong",
      flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Flag_of_Finland.svg/2560px-Flag_of_Finland.svg.png",
    },
  ];
  return (
    <div className="connectionsSection">
      <h3>Connections</h3>
      <div className="connectionsCards">
        {data.map((v, i) => (
          <PeopleCards
            name={v.name}
            flag={v.flag}
            occupation={v.occupation}
            currentLocation={v.currentLocation}
            image={v.image}
          />
        ))}
      </div>
    </div>
  );
}

export default ConnectionsSection;
