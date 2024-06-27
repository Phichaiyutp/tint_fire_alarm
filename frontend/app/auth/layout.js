import Image from "next/image";

export default function RootLayout({ children }) {
  return (
    <div className="relative">
      <Image
        alt="background"
        src={`${process.env.NEXT_PUBLIC_BASEPATH}/bg_login.png`}
        fill
        sizes="100dvw"
        style={{
          objectFit: "cover",
          zIndex: -1,
        }}
        priority
      />
      <div className="min-h-svh w-screen md:py-[10dvh] md:px-[8vw]  lg:px-[2vw] ">
        <div className="flex flex-col lg:flex-row items-end justify-between">
          <div className="lg:h-full w-full lg:w-[50%] hidden  lg:flex flex-col ">
            <span className="h-full w-full flex flex-col text-center font-semibold text-slate-600">
              <p className="text-xl lg:text-3xl 2xl:text-5xl">
                Fire, Smoke and CO2
              </p>
              <p className="text-xl lg:text-5xl 2xl:text-7xl">DETECTION</p>
            </span>
          </div>
          <div className="h-full w-full lg:w-fit p-4 m-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
