import { Oval } from "react-loader-spinner";

import "./Button.css";

/**
 * Available props and their values (Default values are the first ones):
 *
 * text -> Text to display on button.
 * Either text or children can be passed.
 * Text will be used in case of both.
 *
 * fontWeight -> 600, 500, 700
 *
 * fontSize -> small, medium, large
 *
 * variant -> outlined, filled, logout
 *
 * isDisabled -> false, true
 *
 * iconBefore -> Icon to place before text
 *
 * iconAfter -> Icon to place after text
 *
 * onClick -> Function to run on click event
 */
export default function Button(props) {
  const {
    text,
    children,
    type = "button",
    fontWeight = "600",
    fontSize = "small",
    variant = "outlined",
    isDisabled = false,
    loading = false,
    iconAfter,
    iconBefore,
    onClick,
  } = props;
  return (
    <button
      type={type}
      className={`button button--${variant} ${
        isDisabled ? `button--${variant}-disabled` : ""
      } button--font-${fontWeight} button--font-${fontSize}`}
      onClick={onClick}
      disabled={isDisabled}
    >
      {iconBefore && (
        <img className="button__icon" src={iconBefore} alt="icon" />
      )}
      {text || children}
      {iconAfter && <img className="button__icon" src={iconAfter} alt="icon" />}
      {loading && <Oval width={15} height={15} color="white" />}
    </button>
  );
}
