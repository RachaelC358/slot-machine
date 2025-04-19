import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const db = new DynamoDB.DocumentClient();
const USERS_TABLE = process.env.USERS_TABLE || 'users';

export const handler: APIGatewayProxyHandler = async (event) => {
  const cookie = event.headers.cookie || '';
  const match = cookie.match(/user_id=([^;]+)/);
  const userId = match?.[1];

  if (!userId) {
    return { statusCode: 400, body: 'Missing user_id cookie' };
  }

  const user = await db.get({
    TableName: USERS_TABLE,
    Key: { user_id: userId },
  }).promise();

  if (!user.Item) {
    await db.put({
      TableName: USERS_TABLE,
      Item: {
        user_id: userId,
        currency: 1000,
        created_at: new Date().toISOString(),
      },
    }).promise();
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'User registered or already exists' }),
  };
};
