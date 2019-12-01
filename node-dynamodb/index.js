const AWS = require('aws-sdk');
const express = require('express');

require('dotenv').config();

const app = express();
app.use(express.json()); // use it instead of body-parser

AWS.config.update({
    region: 'eu-central-1',
    accessKeyId: process.env.DYNAMODB_ACCESS_KEY_ID,
    secretAccessKey: process.env.DYNAMODB_SECRET_ACCESS_KEY
});
// set default TableName
const documentClient = new AWS.DynamoDB.DocumentClient({ params: { TableName: 'users' } })



app.get('/users/:userName', async (req, res) => {
    let data = await documentClient.get({ Key: { userName: req.params.userName } }).promise();
    res.send(data);
});
app.get('/users', async (req, res) => {
    let data = await documentClient.scan().promise();
    res.send(data);
});

app.post('/users', async (req, res) => {
    let data = await documentClient.put({ Item: req.body }).promise();
    res.send(data);
});

app.delete('/users/:userName', async (req, res) => {
    let data = documentClient.delete({ Key: { userName: req.params.userName } }).promise();
    res.send(data);
})


// override TableName
app.get('/deneme', async (req, res) => {
    let data = await documentClient.scan({ TableName: 'denemeTbl' }).promise();
    res.send(data);
});


app.listen(1453, () => {
    console.log(`Server running at http://localhost:1453`);
});
