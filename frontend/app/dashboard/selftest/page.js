"use client";
import React, { useState, useEffect } from "react";
import { HiBellAlert } from "react-icons/hi2";
import SelectSite from "../../../app/components/dashboard/select_site_sub_page";
import Modal from "../../../app/components/dashboard/selftest/modal";
import Table from "../../../app/components/dashboard/selftest/table";
import { getCookie } from "cookies-next";

export default function Page() {
  const [selectedSite, setSelectedSite] = useState(0);
  const [modalDeviceId, setModalDeviceId] = useState(null);
  const [modalDeviceName, setModalDeviceName] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ sortName: "device_name", sort: "asc" });
  const [floorPlanData, setFloorPlanData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [showFloorPlan, setShowFloorPlan] = useState(true);
  const [testingStatus, setTestingStatus] = useState(true);

  const key = getCookie("access_token");

  const fetchData = async (url) => {
    setIsLoading(true);
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
      });
      const data = await response.json();
      setFloorPlanData(data);
    } catch (error) {
      console.error("Error fetching floor plan data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTableData = async (url) => {
    setIsLoadingTable(true);
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
      });
      const data = await response.json();
      setTableData(data);
    } catch (error) {
      console.error("Error fetching table data:", error);
      setTableData([]);
    } finally {
      setIsLoadingTable(false);
    }
  };

  useEffect(() => {
    if (selectedSite != 0) {
      if (showFloorPlan) {
        const floorPlanUrl = `${process.env.NEXT_PUBLIC_BACKEND_API}/api/dashboard/floorplan/${selectedSite}`;
        fetchData(floorPlanUrl);
      } else {
        const query = new URLSearchParams({
          search,
          sortName: sort.sortName,
          sort: sort.sort,
        }).toString();
        const tableUrl = `${process.env.NEXT_PUBLIC_BACKEND_API}/api/dashboard/selftest/${selectedSite}?${query}`;
        fetchTableData(tableUrl);
      }
    }
  }, [showFloorPlan, selectedSite, sort, search]);

  const handleSelect = (siteNumber) => {
    setSelectedSite(siteNumber);
  };

  const selfTest = async (deviceId) => {
    setModalDeviceId(deviceId);
    setTestingStatus(false);
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/api/ajax/selftest/${deviceId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
      }
    )
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setTestingStatus(true);
      });
  };

  const closeModal = () => {
    setModalDeviceId(null);
  };

  const handleSorting = (sortName) => {
    setSort({
      sortName: sortName,
      sort: sort.sort === "asc" ? "desc" : "asc",
    });
  };

  return (
    <div className="flex flex-col gap-4 w-[98%] h-[98%]">
      <p className="text-start text-slate-500 sm:text-xl lg:text-xl 2xl:text-2xl ">
        Self-Test
      </p>
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        <SelectSite onChange={handleSelect} value={selectedSite} />
        <div className="flex flex-col  md:flex-row  items-center gap-4">
          {!showFloorPlan && (
            <label className="input input-bordered input-xs sm:input-sm 2xl:input-md w-full max-w-xs flex items-center gap-2">
              <input
                type="text"
                className="grow "
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </label>
          )}
          <select
            className="select select-bordered select-sm w-fit max-w-xs text-white bg-[#1E3851] hover:bg-[#1E3851] hover:opacity-80"
            onChange={(e) => {
              const value = e.target.value;
              if (value === "floorPlan") {
                setShowFloorPlan(true);
              } else if (value === "table") {
                setShowFloorPlan(false);
              }
            }}
          >
            <option value="floorPlan">Floor plan</option>
            <option value="table">Table</option>
          </select>
        </div>
      </div>
      <div dir="ltr" className="flex items-center justify-center">
        {showFloorPlan && (
          <div className="relative border">
            {isLoading ? (
              <img
                src={`${process.env.NEXT_PUBLIC_BASEPATH}/loading.svg`}
                width="30"
                height="30"
                alt="loading"
                className="block md:h-[35dvh] md:w-[30lvw]"
              />
            ) : floorPlanData && floorPlanData.img ? (
              <img
                src={floorPlanData.img}
                width={floorPlanData.width}
                height={floorPlanData.height}
                alt={floorPlanData.description}
                className="block md:h-[75dvh] md:w-[60lvw]"
              />
            ) : (
              <img
                src={`${process.env.NEXT_PUBLIC_BASEPATH}/NoImage.svg`}
                width="800"
                height="800"
                alt="NoImage"
                className="block md:h-[75dvh] md:w-[60lvw]"
              />
            )}
            {floorPlanData &&
              floorPlanData.zone &&
              floorPlanData.zone.map((item, idx) => (
                <div
                  key={idx}
                  className={`absolute z-20 start-[${item.x_axis}%] bottom-[${item.y_axis}%]`}
                >
                  {item.ms_smoke && (
                    <div className="group relative flex justify-center">
                      <button
                        className="xl:h-7 2x:h-10"
                        onClick={() => {
                          setModalDeviceId(item.ms_smoke.device_id);
                          setModalDeviceName(item.ms_smoke.device_name);
                        }}
                      >
                        <HiBellAlert
                          color="#15AAC3"
                          style={{ height: "100%", width: "auto" }}
                        />
                      </button>
                      <span className="absolute top-10 scale-0 rounded bg-primary p-2 text-xs text-white group-hover:scale-100">
                        <p>{item.ms_smoke.device_name ?? ""}</p>
                      </span>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
        {modalDeviceId && (
          <Modal
            deviceId={modalDeviceId}
            deviceName={modalDeviceName}
            selfTest={selfTest}
            closeModal={closeModal}
            testingStatus={testingStatus}
          />
        )}
        {!showFloorPlan && (
          <Table
            data={tableData}
            handleSorting={handleSorting}
            sort={sort}
            setDeviceId={setModalDeviceId}
            setDeviceName={setModalDeviceName}
          />
        )}
      </div>
    </div>
  );
}
