"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { HiBellAlert } from "react-icons/hi2";
import { usePathname } from "next/navigation";
import AlertTrigger from "../../../app/components/dashboard/alert_trigger";
import { getCookie } from "cookies-next";

export default function SelectSite() {
  const [eventId, setEventId] = useState("");
  const [floorplans, setFloorplans] = useState([]);
  const [notify, setNotify] = useState([]);

  const [selectedSite, setSelectedSite] = useState(1);
  const pathname = usePathname();
  const key = getCookie('access_token');
  const handleEventIdReceived = (eventId) => {
    setEventId(eventId);
  };

  useEffect(() => {
    if (!pathname.startsWith("/dashboard/site/")) {
      setSelectedSite(0);
    }
  }, [pathname]);

  useEffect(() => {
    const fetchData = async () => {
      try {
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
  }, [eventId, notify]);

  const handleClick = async (siteNumber) => {
    setSelectedSite(siteNumber);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/dashboard/floorplan/notify/${siteNumber}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${key}`,
          },
        }
      );
      const data = await response.json();
      setNotify((prevNotify) => [
        ...prevNotify,
        { id: siteNumber, notify: data.notify },
      ]);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Error updating floor plan notify:", error);
    }
  };

  return (
    <>
      <div className="hidden">
        <AlertTrigger onEventIdReceived={handleEventIdReceived} />
      </div>
      <nav className="mt-4 grid grid-cols-3 xl:flex gap-2 justify-between text-center h-fit xl:h-6">
        {floorplans.map((floor) => (
          <Link
            key={floor.id}
            href={`/dashboard/site/${floor.id}`}
            className="relative"
          >
            <div className="relative inline-block">
              <button
                onClick={() => handleClick(floor.id)}
                className={`relative z-10 rounded-xl w-6 md:w-10 cursor-pointer text-white bg-[#ffffff50] ${
                  selectedSite === floor.id ? "opacity-100" : "opacity-50"
                }`}
              >
                {floor.id}
              </button>
              {floor.notify && (
                <div className="absolute -top-2.5 left-2.5 w-full h-full flex items-center justify-center">
                  <HiBellAlert color="#15AAC3" size={14} />
                </div>
              )}
            </div>
          </Link>
        ))}
      </nav>
    </>
  );
}
