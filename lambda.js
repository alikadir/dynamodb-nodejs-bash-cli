const AWS = require('aws-sdk');

exports.handler = async event => {
  const docClient = new AWS.DynamoDB.DocumentClient({
    region: 'eu-central-1',
    params: { TableName: process.env.TABLE_NAME }
  });

  let data;

  if (event.get !== undefined) {
    data = await docClient.get({ Key: { userName: event.get.userName } }).promise();
  }

  if (event.put !== undefined) {
    data = await docClient.put({ Item: event.put }).promise();
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify(data)
  };

  return response;
};
