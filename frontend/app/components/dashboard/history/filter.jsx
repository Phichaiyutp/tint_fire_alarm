"use client"
import React from "react";
import { HiFire } from "react-icons/hi2";
import { WiSmoke } from "react-icons/wi";
import { GiGasMask } from "react-icons/gi";
import { HiSignalSlash } from "react-icons/hi2";

export default function Filter({ onChange, value }) {
  const handleFilter = (filterValue) => {
    onChange(filterValue);
  };

  return (
    <div className="flex gap-4">
      <div className={`flex items-center justify-center text-white gap-4 size-10 rounded-full ${value === "" ? "bg-accent" : "bg-primary"}`}>
        <button onClick={() => handleFilter("")}><strong>ALL</strong></button>
      </div>
      <div className={`flex items-center justify-center text-white gap-4 size-10 rounded-full ${value === "high_temp" ? "bg-accent" : "bg-primary"}`}>
        <button onClick={() => handleFilter("high_temp")}>
          <HiFire size={30} />
        </button>
      </div>
      <div className={`flex items-center justify-center text-white gap-4 size-10 rounded-full ${value === "smoke" ? "bg-accent" : "bg-primary"}`}>
        <button onClick={() => handleFilter("smoke")}>
          <WiSmoke size={30} />
        </button>
      </div>
      <div className={`flex items-center justify-center text-white gap-4 size-10 rounded-full ${value === "co" ? "bg-accent" : "bg-primary"}`}>
        <button onClick={() => handleFilter("co")}>
          <GiGasMask size={30} />
        </button>
      </div>
      <div className={`flex items-center justify-center text-white gap-4 size-10 rounded-full ${value === "signal_loss" ? "bg-accent" : "bg-primary"}`}>
        <button onClick={() => handleFilter("signal_loss")}>
          <HiSignalSlash size={30} />
        </button>
      </div>
    </div>
  );
}
