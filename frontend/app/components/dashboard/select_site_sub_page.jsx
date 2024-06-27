"use client";
import React, { useState, useEffect } from "react";
import { getCookie } from "cookies-next";

export default function SelectSite({ onChange, value }) {
  const [floorplans, setFloorplans] = useState([]);
  const handleSelect = (siteNumber) => {
    onChange(siteNumber);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const key = getCookie('access_token');
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/api/dashboard/floorplan/notify`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${key}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setFloorplans(data);
      } catch (error) {
        console.error("Error updating floor plan notify:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-row text-white gap-4">
      {floorplans.map((floor) => (
        <button
          key={floor.id}
          onClick={() => handleSelect(floor.id)}
          className={`flex rounded-full  items-center justify-center size-10 font-bold  ${
            value === floor.id ? "bg-[#15AAC3]" : "bg-[#1E3851]"
          }`}
        >
          {floor.id}
        </button>
      ))}
    </div>
  );
}
