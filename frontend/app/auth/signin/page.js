"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { setCookie } from "cookies-next";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading state

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/auth/signin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );
      console.log(response);

      if (!response.ok) {
        throw new Error("Authentication failed");
      }

      const data = await response.json();

      if (data.accessToken) {
        setCookie("access_token", data.accessToken, {
          sameSite: "strict",
          secure: process.env.NEXT_PUBLIC_NODE_ENV !== "development",
          path: "/",
        });
      }

      if (data.refreshToken) {
        setCookie("refresh_token", data.refreshToken, {
          sameSite: "strict",
          secure: process.env.NEXT_PUBLIC_NODE_ENV !== "development",
          path: "/",
        });
      }

      // Reset form fields and errors
      setEmail("");
      setPassword("");
      setError("");

      // Navigate to dashboard or desired page
      router.push("/dashboard");
    } catch (error) {
      console.error("Error:", error);
      setError("Authentication failed");
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <div className="flex flex-col items-center rounded-3xl bg-white opacity-85 w-full h-full p-6 gap-6">
      <Image
        src={`${process.env.NEXT_PUBLIC_BASEPATH}/PNC_LOGO.png`}
        alt="Picture of the author"
        sizes="100vw"
        style={{
          width: "50%",
          height: "auto",
        }}
        width={354}
        height={154}
        className="mt-[5%]"
      />
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-xl"
          role="alert"
        >
          <strong className="font-bold">{error}</strong>
        </div>
      )}
      <span className="h-[10dvh] flex lg:hidden flex-col text-center font-semibold text-slate-600">
        <p className="text-xl sm:text-3xl">Fire, Smoke and CO2</p>
        <p className="text-xl sm:text-3xl">Detection</p>
      </span>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center mt-[5%] xl:px-[10%] w-full gap-6"
      >
        <div className="flex flex-col gap-4 w-full min-w-max">
          <label htmlFor="email">Email</label>
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
              <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
            </svg>
            <input
              className="grow"
              placeholder="Email"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </label>
        </div>
        <div className="flex flex-col gap-4 w-full min-w-max">
          <label htmlFor="password">Password</label>
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clipRule="evenodd"
              />
            </svg>
            <input
              className="grow"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </label>
        </div>
        <button
          type="submit"
          className={`text-white btn btn-accent btn-sm sm:btn-md md:btn-lg lg:btn-xl ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading} // Disable button during submission
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
      <div className="text-slate-500">
        <Link href="/auth/signin">Forgot Password</Link> |{" "}
        <Link href="/auth/signup">Sign Up</Link>
      </div>
    </div>
  );
}
