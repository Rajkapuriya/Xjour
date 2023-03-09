import "./Chevron.css";

import { ChevronLeft, ChevronRight } from "@mui/icons-material";

/**
 * Customized Chevron Icon. Props are following: -
 *
 * position = left | right
 *
 * onClick = callback function
 */
export default function Chevron(props) {
  const { position = "left", onClick = () => {} } = props;

  return (
    <div className="chevron">
      {position === "left" && <ChevronLeft onClick={onClick} />}
      {position === "right" && <ChevronRight onClick={onClick} />}
    </div>
  );
}
