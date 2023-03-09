import React from "react";
import "./TransportBar.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Avatar } from "@mui/material";

function TransportBar({ number, place, arrive, depart }) {
  function createData(name, carbs, protein) {
    return { name, carbs, protein };
  }

  const rows = [
    createData("Home base", "12/1/2021", "15/1/2021"),
    createData("Home base", "12/1/2021", "15/1/2021"),
    createData("Home base", "12/1/2021", "15/1/2021"),
    createData("Home base", "12/1/2021", "15/1/2021"),
    createData("Home base", "12/1/2021", "15/1/2021"),
  ];
  return (
    <>
      {/* <TableRow>
        <TableCell align="right"></TableCell>
        <TableCell align="right"></TableCell>
        <TableCell align="right">Arrive</TableCell>
        <TableCell align="right">Depart</TableCell>
      </TableRow> */}
      <div className="transportBarHeader">
        <div className="transportBarHeader__firstHalf">
 
        </div>
        <div className="transportBarHeader__secondHalf">
          <div className="transportBarHeader__arrivalSection">
            <h5>ARRIVE</h5>
          </div>
          <div className="transportBarHeader__departureSection">
            <h5>DEPART</h5>
          </div>
        </div>
      </div>
      {rows.map((row, i) => (
        <div className="transportBar">
          <div className="transportBar__firstHalf">
            <div className="transportBar__number">
              {" "}
              {i > 0 ? (
                <h5 className="indexNumber">{i}</h5>
              ) : (
                <h5 className="indexNumber"> </h5>
              )}{" "}
            </div>
            <div className="transportBar__place">
              <h5>{row.name}</h5>
            </div>
          </div>
          <div className="transportBar__secondHalf">
            <div className="transportBar__arrivalSection">
              <h5>{row.carbs}</h5>
            </div>
            <div className="transportBar__departureSection">
              <h5>{row.protein}</h5>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default TransportBar;

// <TableContainer component={Paper}>
//   <Table size="small" aria-label="a dense table">
//     <TableHead>
//       <TableRow>
//         <TableCell align="right"></TableCell>
//         <TableCell align="right"></TableCell>
//         <TableCell align="right">Arrive</TableCell>
//         <TableCell align="right">Depart</TableCell>
//       </TableRow>
//     </TableHead>
//     <TableBody>
//       {rows.map((row, i) => (
//         <TableRow
//           key={row.name}
//           sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
//         >
//           {i > 0 ? <h5 className="indexNumber">{i}</h5> : <h5  className="indexNumber">{" "}</h5>}
//           <TableCell component="th" scope="row">
//             {row.name}
//           </TableCell>
//           <TableCell align="right">{row.carbs}</TableCell>
//           <TableCell align="right">{row.protein}</TableCell>
//         </TableRow>
//       ))}
//     </TableBody>
//         </Table>

// </TableContainer>
