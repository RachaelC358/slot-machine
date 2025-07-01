import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const db = new DynamoDB.DocumentClient();
const USERS_TABLE = process.env.USERS_TABLE || 'users';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const cookie = event.headers.cookie || '';
  const match = cookie.match(/user_id=([^;]+)/);
  const userId = match?.[1];

  if (!userId) {
    return {
      statusCode: 400,
      body: 'Missing user_id cookie',
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (err) {
    return {
      statusCode: 400,
      body: 'Invalid JSON body',
    };
  }

  const { color } = body;

  if (!/^#[0-9A-Fa-f]{6}$/.test(color)) {
    return {
      statusCode: 400,
      body: 'Invalid color format. Must be a hex code like "#ff0033".',
    };
  }

  try {
    await db.update({
      TableName: USERS_TABLE,
      Key: { user_id: userId },
      UpdateExpression: 'SET color = :color',
      ExpressionAttributeValues: {
        ':color': color,
      },
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Color updated successfully' }),
    };
  } catch (err) {
    console.error('DynamoDB error:', err);
    return {
      statusCode: 500,
      body: 'Internal server error',
    };
  }
};
