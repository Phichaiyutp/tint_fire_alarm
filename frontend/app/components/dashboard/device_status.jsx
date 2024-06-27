"use client";
import React, { useState, useEffect } from "react";
import { HiOutlineBellAlert } from "react-icons/hi2";
import { getCookie } from "cookies-next";

export default function DeviceStatus() {
  const [deviceStatusData, setDeviceStatusData] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async (url) => {
    setIsLoading(true);
    try {
      const key = getCookie('access_token');
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization" : `Bearer ${key}`
        },
      });
      const data = await response.json();
      setDeviceStatusData(data);
    } catch (error) {
      console.error("Error fetching floor plan data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const floorPlanUrl = `${process.env.NEXT_PUBLIC_BACKEND_API}/api/dashboard/devicestatus`;
    fetchData(floorPlanUrl);
  }, []);
  return (
    <div className="mt-4 flex justify-between flex-col xl:flex-row">
      <div className="hidden xl:flex">
        <HiOutlineBellAlert
          color="#15AAC3"
          size={30}
          className="hidden xl:block 2xl:hidden"
        />
        <HiOutlineBellAlert
          color="#15AAC3"
          size={50}
          className="hidden 2xl:block"
        />
      </div>
      <div className="">
        <div className="text-sm md:text-3xl xl:text-base  2xl:text-xl">
          {deviceStatusData.total ?? 0}
        </div>
        <div className="text-sm md:text-2xl xl:text-base">Devices</div>
      </div>
      <div className="hidden xl:block w-[2px] h-[50px] bg-[#ffffff50] "> </div>
      <div className="block xl:hidden w-full h-[2px] my-2 xl:my-0  bg-[#ffffff50] ">
        {" "}
      </div>
      <div className="">
        <div className="text-sm md:text-3xl xl:text-base 2xl:text-xl">
          {deviceStatusData.online ?? 0}
        </div>
        <div className="text-sm md:text-2xl xl:text-base text-accent">
          Online
        </div>
      </div>
      <div className="">
        <div className="text-sm md:text-3xl xl:text-base 2xl:text-xl">
          {deviceStatusData.offline ?? 0}
        </div>
        <div className="text-sm md:text-2xl xl:text-base text-accent">
          Offline
        </div>
      </div>
    </div>
  );
}
