import express from 'express'
import AWS from 'aws-sdk';

import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json()); // use it instead of body-parser

AWS.config.update({
    region: 'eu-central-1',
    accessKeyId: process.env.DYNAMODB_ACCESS_KEY_ID,
    secretAccessKey: process.env.DYNAMODB_SECRET_ACCESS_KEY
});

// set default TableName
const tableName = 'users';
const documentClient = new AWS.DynamoDB.DocumentClient({ params: { TableName: tableName } })


app.get('/users/:userName', async (req, res) => {
    let data = await documentClient.get({ Key: { userName: req.params.userName } }).promise();
    res.send(data);
});

app.get('/users', async (req, res) => {
    let data;
    if (req.query.keys) { // multiple key get 
        let keys = req.query.keys.split(',').map(item => ({ userName: item }));
        data = await documentClient.batchGet({ RequestItems: { [tableName]: { Keys: keys } } }).promise();
    }
    else if (req.query.name) { // contains filter
        data = await documentClient.scan({
            FilterExpression: "contains(#fullName, :pramName)",
            ExpressionAttributeNames: { "#fullName": "name" },
            ExpressionAttributeValues: { ":pramName": req.query.name }
        }).promise();
    }
    else // get all
        data = await documentClient.scan().promise();
    res.send(data);
});

app.get('/users-ismale-:male-gt-:age', async (req, res) => {
    let data = await documentClient.scan({
        FilterExpression: "isMale = :pramIsMale and age > :pramAge",
        ExpressionAttributeValues: { ":pramIsMale": (req.params.male.toLowerCase() == "true"), ":pramAge": parseInt(req.params.age) }
    }).promise();
    res.send(data);
});

app.post('/users', async (req, res) => {
    let data;
    if (Array.isArray(req.body)) { // multiple write 
        let items = req.body.map(i => ({ PutRequest: { Item: i } }));
        data = await documentClient.batchWrite({ RequestItems: { [tableName]: items } }).promise();
    } else // single write
        data = await documentClient.put({ Item: req.body }).promise();
    res.send(data);
});

app.put('/users/:userName', async (req, res) => {

    /*    
    #---- kayit guncellerken ----# 
    
    # set = varolan column'larin degerlerini degistirir 
    # --update-expression 'SET age = :pramAge, isMale = :pramIsMale'
    
    # add = hedeflenen kayda yeni column ve belirtilen value'ekler 
    # --update-expression 'ADD height = :pramHeight, culture = :pramCulture'
    
    # remove = hedeflenen kayitta bulunan column'lari siler
    # --update-expression "REMOVE height, culture" 
    */

    let data = await documentClient.update({
        Key: { userName: req.params.userName },
        UpdateExpression: "set age = :pramAge, isMale = :pramIsMale",
        ExpressionAttributeValues: { ":pramAge": req.body.age, ":pramIsMale": req.body.isMale }
    }).promise();
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
