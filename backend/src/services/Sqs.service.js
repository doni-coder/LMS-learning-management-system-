import { SQSClient } from "@aws-sdk/client-sqs";
import { sendMessageToUser } from "../utils/socket.utils.js";

const sqs = new SQSClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const queueUrl = process.env.SQS_QUEUE_URL;

export const pollNotification = async () => {
  while (true) {
    try {
      const response = await sqs.send(
        new ReceiveMessageCommand({
          QueueUrl: queueUrl,
          MaxNumberOfMessages: 1,
          WaitTimeSeconds: 10, // long polling
        })
      );

      if (response.Messages) {
        for (const message of response.Messages) {
          const payload = JSON.parse(message.body);

          //websocket will be use here
          sendMessageToUser(payload.clientId, "notify", {
            title: payload.title,
            status: payload.status,
          });

          // Delete message from queue
          await sqs.send(
            new DeleteMessageCommand({
              QueueUrl: queueUrl,
              ReceiptHandle: message.ReceiptHandle,
            })
          );
        }
      }
    } catch (error) {
      console.error("Error in SQS consumer loop:", error);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
};

export const pushNotification = async (messageBody) => {
  try {
    const params = {
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(messageBody), // must be a string
    };

    const result = await sqs.send(new SendMessageCommand(params));
    console.log("Message sent successfully:", result.MessageId);
  } catch (error) {
    console.error("Error sending message:", error);
  }
};
