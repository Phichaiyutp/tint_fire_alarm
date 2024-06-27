"use client";
import React, { useEffect, useState } from "react";
import { GrDocumentCsv } from "react-icons/gr";
import { GrDocumentPdf } from "react-icons/gr";
import SelectSite from "../../../app/components/dashboard/select_site_sub_page";
import Table from "../../../app/components/dashboard/maintenance/table";
import { jsonToCsv } from "../../../app/components/utility";
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { getCookie } from "cookies-next";

export default function Maintenance() {
  const [selectedSite, setSelectedSite] = useState(1);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ sortName: "device_name", sort: "asc" });

  const handleSelect = (siteNumber) => {
    setSelectedSite(siteNumber);
  };

  useEffect(() => {
    const query = new URLSearchParams({
      search,
      sortName: sort.sortName,
      sort: sort.sort,
    }).toString();
    const key = getCookie('access_token');
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/api/dashboard/maintenance/${selectedSite}?${query}`,
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
        setData([]);
        console.error("Error:", error);
      });
  }, [selectedSite, search, sort]);

  const handleSorting = (sortName) => {
    setSort({
      sortName: sortName,
      sort: sort.sort === "asc" ? "desc" : "asc",
    });
  };

  const handleLoadCSV = () => {
    const csv = jsonToCsv(data);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "maintenance_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleLoadPDF = () => {
    const doc = new jsPDF();

    const columns = [
      "Site name",
      "Device id",
      "Device name",
      "Online status",
      "Battery level",
      "Installation date",
      "life_time_date",
    ];

    const rows = data.map((item) => [
      item.site_name,
      item.device_id,
      item.device_name,
      item.online,
      item.battery_level,
      item.installation_date,
      item.life_time_date,
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

    doc.save("maintenance_data.pdf");
  };

  return (
    <div className="flex flex-col items-start gap-4 w-[98%] h-[98%]">
      <div className="flex flex-row  items-center justify-between w-full h-[4%]">
        <p className="text-center text-slate-500 sm:text-xl lg:text-xl 2xl:text-2xl ">
          Maintenance
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
      <div className="flex flex-col lg:flex-row  items-center justify-between w-full gap-4">
        <div className="flex flex-row text-white gap-4 w-full">
          <SelectSite onChange={handleSelect} value={selectedSite} />
        </div>
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
        <Table data={data} handleSorting={handleSorting} sort={sort} />
      </div>
    </div>
  );
}
