"use client";
import Image from "next/image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { convertImageToBase64 } from "../../components/utility";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUp() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const [image, setImage] = useState(null);
  const onSubmit = async (data) => {
    try {
      const imageBase64 = image ? { image: await convertImageToBase64(image) } : undefined;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            password: data.password,
            ...imageBase64
          }),
        }
      );

      if (response.ok) {
        //router.push(`${process.env.NEXT_PUBLIC_BASEPATH}/auth/login`);
        router.push('/auth/signin')
      } else {
        console.error("Failed to submit form data:", response);
      }
    } catch (error) {
      console.error("Error submitting form data:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  return (
      <div className="flex flex-col items-center rounded-3xl bg-white opacity-85 p-6 text-xs sm:text-sm md:text-lg lg:text-xl">
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
        />
        <span className="h-[10dvh] flex lg:hidden flex-col text-center font-semibold text-slate-600">
          <p className="text-xl sm:text-2xl">Fire, Smoke and CO2</p>
          <p className="text-xl sm:text-2xl">Detection</p>
        </span>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center xl:px-[5%] w-full gap-8 xl:gap-4 2xl:gap-6"
        >
          <div className="flex flex-col w-full gap-2">
            <label>Name</label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="input input-xs xl:input-sm input-bordered"
              placeholder="Enter your name"
              autoComplete="name"
            />
            {errors.name && (
              <span className="text-red-500">{errors.name.message}</span>
            )}
          </div>
          <div className="flex flex-col w-full gap-2">
            <label>Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="input input-xs xl:input-sm input-bordered"
              placeholder="Enter your email"
              autoComplete="email"
            />
            {errors.email && (
              <span className="text-red-500">{errors.email.message}</span>
            )}
          </div>
          <div className="flex flex-col w-full gap-2">
            <label>Password</label>
            <input
              type="password"
              {...register("password", { 
                required: "Password is required",
                minLength: { value: 8, message: "Password must be at least 8 characters long" }, 
                })
              }
              className="input input-xs xl:input-sm input-bordered"
              placeholder="Enter your password"
              autoComplete="new-password"
            />
            {errors.password && (
              <span className="text-red-500">{errors.password.message}</span>
            )}
          </div>
          <div className="flex flex-col w-full gap-2">
            <label>Confirm Password</label>
            <input
              type="password"
              {...register("confirmPassword", {
                required: "Confirm Password is required",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
                  
              })}
              className="input input-xs xl:input-sm input-bordered"
              placeholder="Confirm your password"
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <span className="text-red-500">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
          <div className="flex flex-col w-full gap-2">
            <label>Upload Image</label>
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="input input-xs xl:input-sm input-bordered"
            />
          </div>
          <button
            type="submit"
            className="text-white btn  btn-accent btn-xs  xl:btn-md"
          >
            Register
          </button>
        </form>
        <div className="text-slate-500 text-xs sm:text-sm  xl:text-lg">
            <Link href="/auth/signin">Already have an account? Sign In.</Link>
        </div>
      </div>
  );
}
