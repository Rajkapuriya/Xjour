import { AddAlert } from "@mui/icons-material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import "./ReactCalendar.css";

function ReactCalendar({ events }) {
  const [calendar, setCalendar] = useState([]);
  const [value, setValue] = useState(moment());
  const [valEvent, setValEvent] = useState(moment());

  const startDay = value.clone().startOf("month").startOf("week");
  const endDay = value.clone().endOf("month").endOf("week");

  const startEvent = events[0].start;
  const endEvent = events[0].end;

  // console.log("this is start date >>> ", startEvent);
  // console.log("this is end date >>> ", endEvent);
  // const startEventDate = new Date(startEvent);
  // const endEventDate = new Date(endEvent);

  useEffect(() => {
    const day = startDay.clone().subtract(1, "day");
    const a = [];

    while (day.isBefore(endDay, "day")) {
      a.push(
        Array(7)
          .fill(0)
          .map(() => day.add(1, "day").clone())
      );
    }
    setCalendar(a);
  }, [value]);

  useEffect(() => {
    // const day = startEvent.clone().subtract(1, "day");
    const e = [];

    // while (day.isBefore(endEvent, "day")) {
    //   e.push(
    //     Array(7)
    //       .fill(0)
    //       .map(() => day.add(1, "day").clone())
    //   );
    // }
    setValEvent(e);
  }, []);

  return (
    <div className="reactCalendar">
      {calendar.map((week) => (
        <div className="reactCalendar__tab">
          {week.map((day) => (
            <div className="calendarDay" onClick={() => setValue(day)}>
              <div className={value.isSame(day, "day") ? "selected" : ""}>
                {day.format("D").toString()}
                {valEvent && (
                  <div className={value.isSame(day, "day") && "eventDate"}>
                    {(startEvent.isSame(day, "day") && <AddAlert />) ||
                      (endEvent.isSame(day, "day") && <AddAlert />)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default ReactCalendar;
