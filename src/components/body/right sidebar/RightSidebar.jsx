import { useRef, useState } from "react";

import "./RightSidebar.css";

import UsersList from "../../available users/users list/UsersList";

import { MuiAccordion } from "components/MuiComponents/MuiComponents";

function RightSidebar() {
  const [onlineConnectionsExpanded, setOnlineConnectionsExpanded] =
    useState(true);
  const [offlineConnectionsExpanded, setOfflineConnectionsExpanded] =
    useState(true);

  return (
    <aside className="right-sidebar">
      <div className="right-sidebar__online">
        <MuiAccordion
          expanded={onlineConnectionsExpanded}
          handlers={{
            handleAccordionExpansion: () =>
              setOnlineConnectionsExpanded((prev) => !prev),
          }}
          accordionHeading="Online"
          hasCustomSummary
          additionalAccordionProps={{
            className: "right-sidebar__accordion",
          }}
          additionalAccordionSummaryProps={{
            className: "right-sidebar__expandable-header",
          }}
          additionalAccordionDetailsProps={{
            className: "right-sidebar__accordion-details",
          }}
        >
          <UsersList />
        </MuiAccordion>
      </div>

      <div className="right-sidebar__offline">
        <MuiAccordion
          expanded={offlineConnectionsExpanded}
          handlers={{
            handleAccordionExpansion: () =>
              setOfflineConnectionsExpanded((prev) => !prev),
          }}
          accordionHeading="Offline"
          hasCustomSummary
          additionalAccordionProps={{
            className: "right-sidebar__accordion",
          }}
          additionalAccordionSummaryProps={{
            className: "right-sidebar__expandable-header",
          }}
          additionalAccordionDetailsProps={{
            className: "right-sidebar__accordion-details",
          }}
        >
          <UsersList />
        </MuiAccordion>
      </div>
    </aside>
  );
}

export default RightSidebar;
