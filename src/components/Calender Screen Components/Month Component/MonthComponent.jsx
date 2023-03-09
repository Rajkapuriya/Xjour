import React, { useEffect, useState } from "react";

import "./MonthComponent.css";
import { ViewState } from "@devexpress/dx-react-scheduler";

import {
  Scheduler,
  MonthView,
  Toolbar,
  DateNavigator,
  Appointments,
  AppointmentTooltip,
} from "@devexpress/dx-react-scheduler-material-ui";
import { Oval } from "react-loader-spinner";
import { Box, Modal } from "@mui/material";
import ViewEvent from "../View Event/ViewEvent";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  height: "90%",
  bgcolor: "#f8f8f8",
  border: "none",
  borderRadius: 2,
  boxShadow: 24,
  p: 0,
  overflowY: "auto",
};
function MonthComponent({ events }) {
  const [loader, isLoading] = useState(false);
  const [eventData, setEventData] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const test = (e) => {
    // console.log("button pressed", e);
    setEventData(e.data);
  };

  useEffect(() => {
    if (eventData.length !== 0) {
      // console.log("eventData", eventData);
      handleOpen();
    }
  }, [eventData]);

  if (loader) {
    return (
      <div className="screenLoader">
        <Oval color="#00BFFF" height={80} width={80} />
      </div>
    );
  }
  return (
    <div id="calendar">
      <Scheduler data={events}>
        {/* <ViewState />
    <EditingState />
    <IntegratedEditing /> */}
        <ViewState />
        <MonthView />
        <Toolbar />
        <DateNavigator />
        <Appointments />
        <AppointmentTooltip onAppointmentMetaChange={test} visible={false} />
      </Scheduler>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <ViewEvent eventValue={eventData} closeModal={handleClose} />
        </Box>
      </Modal>
    </div>
  );
}

export default MonthComponent;
