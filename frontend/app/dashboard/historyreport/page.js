"use client";
import React, { useEffect, useState } from "react";
import { jsonToCsv } from "../../../app/components/utility";
import jsPDF from 'jspdf'
import { GrDocumentCsv } from "react-icons/gr";
import { GrDocumentPdf } from "react-icons/gr";
import { HiOutlineSortAscending } from "react-icons/hi";
import { HiOutlineSortDescending } from "react-icons/hi";
import AlertTrigger from "../../../app/components/dashboard/alert_trigger";
import Filter from "../../../app/components/dashboard/history/filter";
import { getCookie } from "cookies-next";

export default function Home() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("desc");
  const [message, setMessage] = useState({});

  useEffect(() => {
    const query = new URLSearchParams({ filter, search, sort }).toString();
    const key = getCookie('access_token');
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/api/dashboard/history?${query}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [filter, search, sort, message]);

  const handleFilterChange = (newValue) => {
    setFilter(newValue);
  };
  const handleEventIdReceived = (eventId) => {
    setMessage(eventId)
  };

  const handleLoadCSV = () => {
    const csv = jsonToCsv(data);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "history_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleLoadPDF = () => {
    const doc = new jsPDF();
    const columns = ["Datetime", "Description", "Site", "Device Name"];

    const rows = data.map((item) => [
      item.datetime,
      item.description,
      item.zone_name,
      item.device_name,
    ]);

    doc.autoTable({
      head: [columns],
      body: rows,
      theme: "grid",
      startY: 10,
      didDrawPage: function (data) {
        if (data.pageNumber > 1) {
          doc.deletePage(data.pageNumber);
        }
      },
    });

    doc.save("history_data.pdf");
  };

  return (
    <div className="flex flex-col items-start gap-4 w-[98%] h-[98%]">
      <div className="hidden"><AlertTrigger onEventIdReceived={handleEventIdReceived} /></div>
      <div className="flex flex-row  items-center justify-between w-full h-[4%]">
        <p className="text-center text-slate-500 sm:text-xl lg:text-xl 2xl:text-2xl ">
          History and Report
        </p>
        <div className="flex flex-row items-center gap-4">
          <button onClick={handleLoadCSV}>
            <GrDocumentCsv color="#1E3851" size={30} />
          </button>
          <button onClick={handleLoadPDF}>
            <GrDocumentPdf color="#1E3851" size={30} />
          </button>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row  items-center justify-between w-full gap-4 h-[8%] lg:h-[5%]">
        <Filter onChange={handleFilterChange} value={filter} />
        <div className="flex flex-row items-center justify-center gap-4">
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
        </div>
      </div>
      <div className="w-full h-[92%] overflow-auto">
        <table id="history-table" className="table-auto w-full text-sm">
          <thead>
            <tr className="bg-primary text-white">
              <th className="flex items-center">
                <span className="flex-grow">Datetime</span>
                <button
                  className={`${sort === "desc" ? "block" : "hidden"} `}
                  onClick={() => setSort("asc")}
                >
                  <HiOutlineSortAscending />
                </button>
                <button
                  className={`${sort === "asc" ? "block" : "hidden"} `}
                  onClick={() => setSort("desc")}
                >
                  <HiOutlineSortDescending />
                </button>
              </th>
              <th>Description</th>
              <th>Site</th>
              <th>Device Name</th>
            </tr>
          </thead>
          <tbody className="">
            {data.map((item) => (
              <tr
                key={item.id}
                className="border border-slate-300 text-slate-500 bg-white bg-opacity-70 hover:text-slate-900 hover:bg-slate-300"
              >
                <td>{item.datetime}</td>
                <td>{item.description}</td>
                <td>{item.zone_name}</td>
                <td>{item.device_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
