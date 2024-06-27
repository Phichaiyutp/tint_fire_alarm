import Image from "next/image";
import { HiClipboardList } from "react-icons/hi";
import { TbReport } from "react-icons/tb";
import { FaTools } from "react-icons/fa";
import Link from "next/link";
import { Profile } from "../../app/components/dashboard/auth";
import SelectSite from "../../app/components/dashboard/select_site_page";
import DeviceStatus from "../../app/components/dashboard/device_status";
import AlertTrigger from "../../app/components/dashboard/alert_trigger";

export default async function RootLayout({ children }) {
  return (
    <div className="relative">
      <Image
        alt="background"
        src={`${process.env.NEXT_PUBLIC_BASEPATH}/bg_main.png`}
        fill
        sizes="100vw"
        priority
        style={{
          objectFit: "cover",
          zIndex: -1,
        }}
      />
      <div className="flex flex-row text-center min-h-svh pt-[2dvh] pb-4 ml-[2vw] gap-4">
        <div className="rounded-2xl w-[25vw] bg-primary min-h-fit">
          <div className="flex flex-col  py-4 mx-auto w-[80%] text-white gap-2">
            <div className="w-full flex ">
              <Link href="/dashboard/site/1">
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASEPATH}/PNC_LOGO.png`}
                  width={354}
                  height={154}
                  alt="Logo"
                />
              </Link>
            </div>
            <div className="flex items-center justify-center">
              <Profile />
            </div>
            <p className="md:text-lg text-left">Site</p>
            <SelectSite />
            <div className="mt-4 bg-[#ffffff50] h-[2px]"></div>
            <DeviceStatus />
            <div className="mt-4 bg-[#ffffff50] h-[2px]"></div>
            <div className="mt-4 bg-[#ffffff50] rounded-xl px-[10%]">
              <Link href="/dashboard/historyreport">
                <div className="flex flex-col xl:flex-row items-center justify-center xl:justify-between h-[10dvh] xl:h-[15dvh]">
                  <TbReport
                    color="#15AAC3"
                    style={{
                      width: "auto",
                      height: "50%",
                    }}
                  />
                  <p className="hidden xl:block">History & Report</p>
                </div>
              </Link>
            </div>
            <div className="flex flex-col xl:flex-row justify-between mt-2 xl:mt-4 ">
              <div className="bg-[#ffffff50] w-full xl:w-[48%] rounded-xl">
                <Link href="/dashboard/selftest">
                  <div className="flex flex-col justify-center h-[10dvh] xl:h-[15dvh] items-center">
                    <HiClipboardList
                      color="#15AAC3"
                      style={{
                        width: "auto",
                        height: "50%",
                      }}
                    />
                    <p className=" hidden xl:block">Self-Test</p>
                  </div>
                </Link>
              </div>
              <div className="bg-[#ffffff50] w-full xl:w-[48%]  mt-2 xl:mt-0 rounded-xl">
                <Link href="/dashboard/maintenance">
                  <div className="flex flex-col justify-center h-[10dvh] xl:h-[15dvh] items-center">
                    <FaTools
                      color="#15AAC3"
                      style={{
                        width: "auto",
                        height: "40%",
                      }}
                    />
                    <p className="text-center hidden xl:block">Maintenance</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="h-[98dvh] w-[75vw] sm:max-w-[440px] md:max-w-[550px] lg:max-w-[720px] xl:max-w-full">
          <AlertTrigger />
          {children}
        </div>
      </div>
    </div>
  );
}
