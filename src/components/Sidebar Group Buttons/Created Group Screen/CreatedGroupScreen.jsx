// import React, { useState } from "react";
// import "./CreatedGroupScreen.css";
// import Box from "@mui/material/Box";
// import Button from "@mui/material/Button";
// import Typography from "@mui/material/Typography";
// import Modal from "@mui/material/Modal";
// import { Oval } from "react-loader-spinner";
// // import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 500,
//   height: 500,
//   bgcolor: "transparent",
//   border: "none",
//   // borderRadius: 2,
//   // boxShadow: 24,
//   p: 0,
// };

// function CreatedGroupScreen({ groupDetails }) {
//   const [createdGroupOpen, setCreatedGroupOpen] = useState(true);
//   const handleOpenCreatedGroup = () => setCreatedGroupOpen(true);
//   const handleCloseCreatedGroup = () => setCreatedGroupOpen(false);

//   return (
//     <div className="createdGroupScreen">
//       {/* <Button onClick={handleOpen}>Open modal</Button> */}
//       <Modal
//         open={createdGroupOpen}
//         onClose={handleCloseCreatedGroup}
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//       >
//         <Box sx={style}>
//           <div className="ScreenLoader">
//             <Oval color="#000000" height={200} width={200} />
//           </div>

//           {/* <div className="createdGroupScreen__details">
//             <div className="nameDiv">
//               <h5 className="heading">Group Name:</h5>
//               <h2 className="headingValue">{groupDetails.groupName}</h2>
//             </div>

//             <div className="nameDiv">
//               <h5 className="heading">Group Picture:</h5>
//               <div className="groupPicture">
//                 <img
//                   className="groupImage"
//                   src={groupDetails.groupBase64}
//                   //   onClick={handleImageOpen}
//                 />
//               </div>
//             </div>

//             <div className="nameDiv">
//               <h5 className="heading">Group Description:</h5>
//               <h2 className="headingValue">{groupDetails.groupDescription}</h2>
//             </div>
//             <div className="nameDiv">
//               <h5 className="heading">Country Code:</h5>
//               <h2 className="headingValue">{groupDetails.iso2}</h2>
//             </div>
//             <div className="nameDiv">
//               <h5 className="heading">Searchable:</h5>
//               {groupDetails.searchable == "0" ? (
//                 <h2 className="headingValue">Hidden</h2>
//               ) : (
//                 <h2 className="headingValue">Visible</h2>
//               )}
//             </div>
//           </div> */}
//         </Box>
//       </Modal>
//     </div>
//   );
// }

// export default CreatedGroupScreen;
