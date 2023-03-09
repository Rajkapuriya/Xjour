import "./ToggleBarElement.css";

export default function ToggleBarElement(props) {
  const { children, isActive, onClick } = props;

  if (isActive === undefined) {
    throw new Error("ToggleBarElement can only be used inside ToggleBar!");
  }

  return (
    <div
      className={`toggle-bar-element${
        isActive ? " toggle-bar-element--active" : ""
      }`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
