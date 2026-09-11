require("dotenv").config();

const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const sesClient = new SESClient({
  region: "ap-south-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

const command = new SendEmailCommand({
  Source: "sivakesav999@gmail.com",

  Destination: {
    ToAddresses: ["sivakesav999@gmail.com"],
  },

  Message: {
    Subject: {
      Data: "DevTinder SES Test",
      Charset: "UTF-8",
    },

    Body: {
      Text: {
        Data: "SES is working from Node.js!",
        Charset: "UTF-8",
      },
    },
  },
});

async function test() {
  try {
    const result = await sesClient.send(command);
    console.log("EMAIL SENT SUCCESSFULLY");
    console.log(result);
  } catch (error) {
    console.error("SES ERROR");
    console.error("Name:", error.name);
    console.error("Message:", error.message);
    console.error("Code:", error.Code);
  }
}

test();