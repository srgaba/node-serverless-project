import { v4 as uuid } from "uuid";
import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddeware";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
  try {
    const { title } = event.body;

    const auction = {
      id: uuid(),
      title,
      status: "OPEN",
      createdAt: new Date().toISOString(),
    };
    await dynamodb
      .put({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Item: auction,
      })
      .promise();
    return {
      statusCode: 200,
      body: JSON.stringify(auction),
    };
  } catch (err) {
    console.error(err);
    throw new createError.InternalServerError();
  }
}

export const handler = commonMiddleware(createAuction);
