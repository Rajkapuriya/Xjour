import { Search } from "@mui/icons-material";

import "./SearchBar.css";

export default function SearchBar(props) {
  const { placeholder = "Search...", onChangeHandler } = props;
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder={placeholder}
        onChange={(event) => onChangeHandler(event)}
        className="search-bar__input"
      />
      <Search className="search-bar__icon" />
    </div>
  );
}
