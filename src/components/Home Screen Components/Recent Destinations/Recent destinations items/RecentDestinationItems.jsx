import { Oval } from "react-loader-spinner";

import "./RecentDestinationItem.css";

import { Close } from "@mui/icons-material";

function RecentDestinationItems({
  data,
  index,
  getDestinationData,
  deleteItem,
}) {
  return (
    <>
      {!data.type && (
        <div className="recentDestinationItem">
          {data?.base64 ? (
            <div
              className="recentDestinationItem__container"
              onClick={() => getDestinationData(data, index)}
              style={{
                backgroundSize: "cover",
                backgroundImage: `url(${data.base64})`,
                backgroundPosition: "center",
              }}
            >
              <div className="titleSec">
                <p className="recentDestinationItem__title">{data?.name}</p>
                {deleteItem && <Close onClick={() => deleteItem(index)} />}
              </div>
            </div>
          ) : (
            <div
              className="recentDestinationItem__container"
              onClick={() => getDestinationData(data, index)}
            >
              <div className="titleSec">
                <p className="recentDestinationItem__title--without-bgImage">
                  {data?.name}
                </p>
                {deleteItem && <Close onClick={() => deleteItem(index)} />}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default RecentDestinationItems;
