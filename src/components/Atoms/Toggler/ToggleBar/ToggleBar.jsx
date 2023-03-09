import React from "react";
import "./TogglerBar.css";

export default function ToggleBar(props) {
  const { activeIndex, children } = props;

  if (React.Children.count(children) !== 2) {
    throw new Error("ToggleBar should have exactly two children!");
  }

  const allChildren = React.Children.map(children, (child, index) => {
    const clone = React.cloneElement(child, {
      isActive: activeIndex === index,
    });

    return clone;
  });

  return <div className={`toggle-bar`}>{allChildren}</div>;
}
