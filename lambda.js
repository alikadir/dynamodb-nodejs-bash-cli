const AWS = require("aws-sdk");

exports.handler = async event => {
  const documentClient = new AWS.DynamoDB.DocumentClient();
  let data;

  if (event.get !== undefined) {
    const params = {
      TableName:  process.env.TABLE_NAME,
      Key: {
        userName: event.get.userName
      }
    };
    data = await documentClient.get(params).promise();
  }

  if (event.put !== undefined) {
    const params = {
      TableName: process.env.TABLE_NAME,
      Item: event.put
    };
    data = await documentClient.put(params).promise();
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify(data)
  };

  return response;
};
