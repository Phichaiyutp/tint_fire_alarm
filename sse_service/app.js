import { SQSClient, GetQueueUrlCommand, ReceiveMessageCommand, DeleteMessageCommand } from "@aws-sdk/client-sqs";
import express from "express";
import cors from "cors";
import DecodeMsg from "./decodeMsg.js";
import axios from "axios";
import { EventEmitter } from "events";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();
// Set max listeners for EventEmitter
EventEmitter.defaultMaxListeners = 15;

// Initialize SQS client with credentials from environment variables
const sqsClient = new SQSClient({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Function to get the URL of the SQS queue
async function getQueueUrl(queueName) {
  try {
    const command = new GetQueueUrlCommand({ QueueName: queueName });
    const response = await sqsClient.send(command);
    return response.QueueUrl;
  } catch (error) {
    console.error("Error getting queue URL:", error);
    throw error;
  }
}

// Old event code to track duplicate events
let OldEventCode = "";

// Function to receive and process messages from SQS queue
async function receiveAndProcessMessages() {
  try {
    const queueName = process.env.QUEUE_NAME;
    const queueUrl = await getQueueUrl(queueName);

    // Receive message from SQS queue
    const receiveParams = {
      QueueUrl: queueUrl,
      AttributeNames: ["SentTimestamp"],
      MaxNumberOfMessages: 1,
      MessageAttributeNames: ["All"],
      VisibilityTimeout: 30,
      WaitTimeSeconds: 20, // Long polling
    };

    const receiveCommand = new ReceiveMessageCommand(receiveParams);
    const response = await sqsClient.send(receiveCommand);
    if (response.Messages && response.Messages.length > 0) {
      for (const message of response.Messages) {
        const receiptHandle = message.ReceiptHandle;
        const bodyStr = message.Body;

        const body = JSON.parse(bodyStr);
        const event = body.event;
        const {
          eventId,
          hubId,
          hubName,
          eventCode,
          sourceObjectType,
          sourceObjectId,
          sourceObjectName,
          sourceRoomId,
          sourceRoomName,
          timestamp,
          additionalData,
        } = body.event;

        const deleteParams = {
          QueueUrl: queueUrl,
          ReceiptHandle: receiptHandle,
        };

        const deleteCommand = new DeleteMessageCommand(deleteParams);
        await sqsClient.send(deleteCommand);

        const { msg, level } = DecodeMsg(
          eventCode,
          hubName,
          sourceObjectName,
          sourceRoomName
        );

        if (eventId != OldEventCode) {
          OldEventCode = eventId;
          // Save event to database using Axios
          await axios
            .post(`${process.env.BACKEND_URL}/api/ajax/eventlog`, {
              eventId: eventId,
              eventCode: eventCode,
              sourceObjectId: sourceObjectId,
              sourceObjectName: sourceObjectName,
              sourceObjectType: sourceObjectType,
              hubId:hubId,
              hubName: hubName,
              sourceRoomName: sourceRoomName,
              timestamp: timestamp,
              msg: msg,
              additionalData: additionalData,
            })
            .then((response) => {
              // Emit the event to SSE endpoint
              const createdEvent = response.data;
              if (createdEvent) {
                const eventStr = JSON.stringify({
                  ...event,
                  msg: msg,
                  level: level,
                });
                eventEmitter.emit("sqsMessage", eventStr);
              }
            })
            .catch((error) => {
              console.error(error);
            });
        }
      }
    }
  } catch (error) {
    console.error("Error receiving and processing messages:", error);
  }
}

// Set up message receiving interval
setInterval(receiveAndProcessMessages, 500);

// Create Express app
const app = express();
const eventEmitter = new EventEmitter(); // Create an EventEmitter instance
app.use(cors());

// SSE endpoint definition
app.get("/api/ajax/realtime", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  // Send initial connection message
  res.write(`data: {"status": "connected"}\n\n`);

  const messageHandler = (eventStr) => {
    res.write(`data: ${eventStr}\n\n`);
  };

  eventEmitter.on("sqsMessage", messageHandler); // Listen for events

  req.on("close", () => {
    eventEmitter.removeListener("sqsMessage", messageHandler); // Clean up the listener
    console.log(`SSE connection closed`);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
const HOSTNAME = process.env.HOSTNAME || "localhost";

app.listen(PORT, HOSTNAME, () => {
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});
