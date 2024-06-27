"use client"
import React, { useState, useEffect } from "react";
import { IoAlertCircleOutline } from "react-icons/io5";
import { FiAlertTriangle } from "react-icons/fi";
import { IoIosCloseCircleOutline } from "react-icons/io";

export default function Alert({ level, message }) {
  const [visible, setVisible] = useState(false);

  let icon;

  switch (level) {
    case "info":
      icon = <IoAlertCircleOutline color="#40a6ce" className="w-6 h-6 mr-2" />;
      break;
    case "warning":
      icon = <FiAlertTriangle color="#f9e154" className="w-6 h-6 mr-2" />;
      break;
    case "error":
      icon = <IoIosCloseCircleOutline color="#f02c2c" className="w-6 h-6 mr-2" />;
      break;
    default:
      icon = null;
      break;
  }

  useEffect(() => {
    // Show the alert after 1 second
    const showTimeout = setTimeout(() => {
      setVisible(true);
    }, 1000);

    // Hide the alert after 5 seconds
    const hideTimeout = setTimeout(() => {
      setVisible(false);
    }, 5000);

    // Clean up timeouts on unmount or when the dependency changes
    return () => {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

  return (
    <>
      {visible && (
        <div
          role="alert"
          className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white bg-opacity-75 px-4 py-2 rounded-md shadow-md flex items-center"
        >
          {icon}
          <span className="text-sm">{message}</span>
        </div>
      )}
    </>
  );
}
