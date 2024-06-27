"use client";
import EventSource from "eventsource";
import React, { useEffect, useState } from "react";
import Alert from "../../../app/components/alert";

export default function AlertTrigger({ onEventIdReceived = () => {} }) {
  const [level, setLevel] = useState("");
  const [alartmsg, setAlartmsg] = useState(null);

  useEffect(() => {
    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_SSE_URL}/api/ajax/realtime`,
      { withCredentials: false }
    );

    eventSource.onopen = (event) => {};

    eventSource.onmessage = (event) => {
      if (event && "data" in event) {
        try {
          const messageData = JSON.parse(event.data);
          if ("msg" in messageData && "level" in messageData && "eventId" in messageData) {
            // Set alert message and level
            setAlartmsg(messageData.msg);
            setLevel(messageData.level);
            // Pass eventId to callback function
            onEventIdReceived(messageData.eventId);
          }
        } catch (error) {
          console.error("Error parsing message data:", error);
        }
      }
    };

    eventSource.onerror = () => {};

    // Clean up the EventSource connection when the component unmounts
    return () => {
      eventSource.close();
    };
  }, [onEventIdReceived]);

  return <div>{alartmsg && <Alert level={level} message={alartmsg} />}</div>;
}
