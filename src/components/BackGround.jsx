import React from "react";
import background from "../assets/background.jpg";

export default function BackGround() {
  return (
    <div className="fixed inset-0">
      <img
        src={background}
        alt="background"
        className="h-full w-full object-cover"
      />
    </div>
  );
}
