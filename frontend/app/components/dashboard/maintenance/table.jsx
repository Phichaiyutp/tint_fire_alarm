import React from "react";
import { HiOutlineSortAscending, HiOutlineSortDescending } from "react-icons/hi";

const Table = ({ data, handleSorting, sort }) => {
  return (
    <table id="history-table" className="table-auto w-full text-sm">
      <thead>
        <tr className="bg-primary text-white">
          <th>
            <button onClick={() => handleSorting("device_name")}>
              <div className="flex items-center justify-between gap-2">
                <span>Device Name</span>
                {sort.sortName === "device_name" ? (
                  sort.sort === "asc" ? (
                    <HiOutlineSortAscending />
                  ) : (
                    <HiOutlineSortDescending />
                  )
                ) : (
                  ""
                )}
              </div>
            </button>
          </th>
          <th>
            <button onClick={() => handleSorting("status")}>
              <div className="flex items-center justify-between gap-2">
                <span>Status</span>
                {sort.sortName === "status" ? (
                  sort.sort === "asc" ? (
                    <HiOutlineSortAscending />
                  ) : (
                    <HiOutlineSortDescending />
                  )
                ) : (
                  ""
                )}
              </div>
            </button>
          </th>
          <th>
            <button onClick={() => handleSorting("site_name")}>
              <div className="flex items-center justify-between gap-2">
                <span>Site</span>
                {sort.sortName === "site_name" ? (
                  sort.sort === "asc" ? (
                    <HiOutlineSortAscending />
                  ) : (
                    <HiOutlineSortDescending />
                  )
                ) : (
                  ""
                )}
              </div>
            </button>
          </th>
          <th>
            <button onClick={() => handleSorting("battery_level")}>
              <div className="flex items-center justify-between gap-2">
                <span>Battery</span>
                {sort.sortName === "battery_level" ? (
                  sort.sort === "asc" ? (
                    <HiOutlineSortAscending />
                  ) : (
                    <HiOutlineSortDescending />
                  )
                ) : (
                  ""
                )}
              </div>
            </button>
          </th>
          <th>
            <button onClick={() => handleSorting("life_time")}>
              <div className="flex items-center justify-between gap-2">
                <span>Life Time</span>
                {sort.sortName === "life_time" ? (
                  sort.sort === "asc" ? (
                    <HiOutlineSortAscending />
                  ) : (
                    <HiOutlineSortDescending />
                  )
                ) : (
                  ""
                )}
              </div>
            </button>
          </th>
        </tr>
      </thead>
      <tbody className="">
        {Array.isArray(data) &&
          data.length > 0 &&
          data.map((item, index) => (
            <tr
              key={index}
              className="border border-slate-300 text-slate-500 bg-white bg-opacity-70 hover:text-slate-900 hover:bg-slate-300"
            >
              <td>{item.device_name}</td>
              <td>{item.online ? "online" : "offline"}</td>
              <td>{item.site_name}</td>
              <td>{item.battery_level}</td>
              <td>{item.life_time_date}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default Table;
