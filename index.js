require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();

const PORT = process.env.PORT;

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:7000"],
    methods: ["POST", "GET"],
    credentials: true
}));

const mongouri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;
const collectionName = process.env.COLLECTION_NAME;

const client = new MongoClient(mongouri);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
    res.status(201).json({ status: 201, message: "Hello from RTO API" });
});

app.post("/rtoDetails", async (req, res) => {
    await client.connect();

    const rtodb = client.db(dbName);

    const rtoDetails = rtodb.collection(collectionName);

    try {
        const query = { reg_no: req.body.vehicleNo };

        const result =await rtoDetails.findOne(query);

        if (result) {
            return res.status(201).json({ status: 201, verified: true, response: result });
        } else {
            return res.status(400).json({ status: 400, verified: false, message: "No Vehicle Found" });
        }
    } catch (error) {
        console.log(error);
    }
});

app.listen(PORT, () => {
    console.log(`listening to port ${PORT}`);
});