"use client";
import React from "react";
import { HiFire } from "react-icons/hi2";
import { HiBellAlert } from "react-icons/hi2";
import { PiThermometerHotFill } from "react-icons/pi";
import { WiSmoke } from "react-icons/wi";
import { GiGasMask } from "react-icons/gi";
import { HiSignalSlash } from "react-icons/hi2";
import useSWR from "swr";
import AlertTrigger from "../../../../app/components/dashboard/alert_trigger";
import { getCookie } from "cookies-next";

export default function Page({ params }) {
  const id = Number(params.id);
  const key = getCookie("access_token");
  const fetcher = (url) => {
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      }
    }).then((res) => res.json());
  };


  const { data, error, isLoading, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/api/dashboard/floorplan/${id}`,
    fetcher
  );

  const handleEventIdReceived = (eventId) => {
    mutate();
  };

  const getAlarmStatus = (item) => {
    if (
      !item.ms_smoke.smoke.temp_alarm_bool &&
      !item.ms_smoke.smoke.temp_high_diff_alarm_bool &&
      !item.ms_smoke.smoke.co_alarm_bool &&
      !item.ms_smoke.smoke.smoke_alarm_bool &&
      !item.ms_smoke.smoke.steam_alarm_bool
    ) {
      return "สถานะปรกติ";
    } else if (item.ms_smoke.smoke.temp_high_diff_alarm_bool) {
      return "ตรวจพบอุณหภูมิสูงขึ้นผิดปกติ";
    } else if (item.ms_smoke.smoke.temp_alarm_bool) {
      return "ตรวจพบอุณหภูมิสูงผิดปกติ";
    } else if (item.ms_smoke.smoke.co_alarm_bool) {
      return "ตรวจพบคาร์บอนไดออกไซด์";
    } else if (item.ms_smoke.smoke.smoke_alarm_bool) {
      return "ตรวจพบควัน";
    } else if (item.ms_smoke.smoke.steam_alarm_bool) {
      return "ตรวจพบไอน้ำ";
    } else {
      return "";
    }
  };
  function renderAlarmIcon(item) {
    if (
      !item.ms_smoke.smoke.temp_alarm_bool &&
      !item.ms_smoke.smoke.temp_high_diff_alarm_bool &&
      !item.ms_smoke.smoke.co_alarm_bool &&
      !item.ms_smoke.smoke.smoke_alarm_bool &&
      !item.ms_smoke.smoke.steam_alarm_bool
    ) {
      return (
        <HiBellAlert
          color="#15AAC3"
          style={{ height: "100%", width: "auto" }}
        />
      );
    } else if (item.ms_smoke.smoke.temp_high_diff_alarm_bool) {
      return (
        <PiThermometerHotFill
          color="#FF6961"
          style={{ height: "100%", width: "auto" }}
        />
      );
    } else if (item.ms_smoke.smoke.temp_alarm_bool) {
      return (
        <HiFire color="#FF6961" style={{ height: "100%", width: "auto" }} />
      );
    } else if (item.ms_smoke.smoke.co_alarm_bool) {
      return (
        <GiGasMask color="#ffd400" style={{ height: "100%", width: "auto" }} />
      );
    } else if (item.ms_smoke.smoke.smoke_alarm_bool) {
      return (
        <WiSmoke color="#aaaaaa" style={{ height: "100%", width: "auto" }} />
      );
    } else if (item.ms_smoke.smoke.steam_alarm_bool) {
      return (
        <img
          src={`${process.env.NEXT_PUBLIC_BASEPATH}/steam.svg`}
          alt="Steam"
          style={{ height: "100%", width: "100%" }}
        />
      );
    } else {
      return <span></span>;
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="hidden">
        <AlertTrigger onEventIdReceived={handleEventIdReceived} />
      </div>
      <div className="flex flex-col lg:flex-row  justify-between items-center ">
        <div className="flex lg:flex-col text-justify  lg:w-full  xl:w-2/6 h-full text-slate-500 sm:text-xl lg:text-xl xl:text-3xl xl2:text-2xl">
          <p>Fire, Smoke and CO</p>
          <p className="ml-1 sm:ml-8">DETECTION</p>
        </div>
        <div className="w-full lg:w-full xl:w-[50%] 2xl:w-[30%] min-h-max  text-center text-sm text-white px-2 xl:pr-4 ">
          <div className="rounded-2xl bg-[#1E3851] px-4">
            <div className="flex lg:py-2 px-4 md:h-20 items-center justify-between">
              <span>
                <p className="text-[#15AAC3] text-xl">Site {id.toString()}</p>
                <p>Site Name {data?.name ?? ""}</p>
                <p>Floor {data?.floor ?? ""}</p>
              </span>
              <div className="mx-2 w-[2px] h-[90%] lg:h-[10dvh] bg-[#ffffff50] "></div>
              <span>
                <p className="text-2xl">
                  {data?.online ?? 0}/{data?.total ?? 0}
                </p>
                <p>Online/Device</p>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="-rotate-90 lg:rotate-0">
        <div dir="ltr" className="flex items-center justify-center ">
          <div className="relative border">
            {isLoading ? (
              <img
                src={`${process.env.NEXT_PUBLIC_BASEPATH}/loading.svg`}
                width="30"
                height="30"
                alt="loading"
                className="block  md:h-[35dvh] md:w-[30lvw]"
              />
            ) : data && data.img ? (
              <img
                src={data.img}
                width={data.width}
                height={data.height}
                alt={data.description}
                className="block h-[40vh] w-auto  md:h-[75dvh] md:w-[60lvw]"
              />
            ) : (
              <img
                src={`${process.env.NEXT_PUBLIC_BASEPATH}/NoImage.svg`}
                width="800"
                height="800"
                alt="NoImage"
                className="block  md:h-[75dvh] md:w-[60lvw]"
              />
            )}
            {data &&
              data.zone &&
              data.zone.map((item, idx) => (
                <div
                  key={idx}
                  className={`absolute z-20 start-[${item.x_axis}%] bottom-[${item.y_axis}%]`}
                >
                  {item.ms_smoke && (
                    <div className="group relative flex flex-col justify-center">
                      <button className="xl:size-12 2xl:size-10 bg-white rounded-full ">
                        <div className="xl:size-8 2xl:size-8 m-auto">
                          {renderAlarmIcon(item)}
                        </div>
                      </button>
                      {!item.ms_smoke.online && (
                        <button className="xl:size-12 2xl:size-10 bg-white rounded-full ">
                          <div className="xl:size-8 2xl:size-8 m-auto">
                            <HiSignalSlash
                              color="#FFBF00"
                              style={{ height: "100%", width: "auto" }}
                            />
                          </div>
                        </button>
                      )}
                      <div className="absolute top-4 lg:top-10 scale-0 rounded-lg bg-primary p-2 text-xs text-white group-hover:scale-100">
                        <div className="flex flex-col items-center justify-around lg:h-32 lg:w-60 lg:text-xl">
                          <p>{getAlarmStatus(item)}</p>
                          <p className="text-accent">ชื่ออุปกรณ์</p>
                          <p>{item.ms_smoke.device_name ?? ""}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
