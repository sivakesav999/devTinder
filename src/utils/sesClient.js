const { SESClient } = require("@aws-sdk/client-ses");
// Set the AWS Region.
const REGION = "ap-south-2";
const sesClient = new SESClient({ region: REGION, credentials : {
    accessKeyId : process.env.AWS_ACCESS_KEY,
    secretAccessKey : process.env.AWS_SECRET_KEY,
} });

module.exports = {sesClient};