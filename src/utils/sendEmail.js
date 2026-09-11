const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");

const escapeHtml = (value) =>
  value.replace(/[&<>'"]/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };
    return entities[character];
  });

const createSendEmailCommand = (toAddress, fromAddress, senderName) => {
  const safeSenderName = escapeHtml(senderName);

  return new SendEmailCommand({
    Destination: {
      ToAddresses: [toAddress],
    },

    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
            <h2>${safeSenderName} sent you a connection request</h2>
            <p>${safeSenderName} is interested in connecting with you on DevTinder.</p>
          `,
        },
        Text: {
          Charset: "UTF-8",
          Data: `${senderName} sent you a connection request on DevTinder.`,
        },
      },

      Subject: {
        Charset: "UTF-8",
        Data: `${senderName} sent you a connection request - DevTinder`,
      },
    },

    Source: fromAddress,
  });
};

const run = async (toAddress, fromAddress, senderName) => {
  if (!toAddress || !fromAddress || !senderName)
    throw new Error("Email recipient, sender, and sender name are required");

  const command = createSendEmailCommand(toAddress, fromAddress, senderName);

  return await sesClient.send(command);
};

module.exports = { run };