import React from "react";
import "./style.css";
const Button = ({ text, onClick, blue, disabled }) => {
  return (
    <div>
      <button
        className={blue ? "btn btn-blue" : "btn"}
        onClick={onClick}
        disabled={disabled}
      >
        {text}
      </button>
    </div>
  );
};

export default Button;
