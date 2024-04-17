require('dotenv').config();
const express = require('express');
const path=require('path');
const { MongoClient } = require('mongodb');

const app = express();

const PORT = process.env.PORT;
const mongouri = process.env.MONGODB_URI;
const dbName = "test";
const collectionName = "rtodetails";

const client = new MongoClient(mongouri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.get("/", (req, res) => {
    res.send("hello from home api");
});

app.get("/formdetails",async (req,res)=>{
    res.render("form",{title:"ejs"});
});

app.post("/rtoDetails", async (req, res) => {
    await client.connect();

    const rtodb = client.db(dbName);

    const rtoDetails = rtodb.collection(collectionName);

    try {
        const query={owner_name:req.body.ownerName,mobile_no:req.body.ownerPhone,reg_no:req.body.vehicleNo,engine_no:req.body.engineNo,state_code:req.body.state,chassis_no:req.body.chasisNo,reg_upto:req.body.registrationUpto,tax_upto:req.body.taxpaidUpto,insurance_upto:req.body.insurancepaidUpto,pucc_upto:req.body.pollutionUpto};

        const findData=rtoDetails.find(query);

        if(findData){
            return res.json({verified:true});
        }else{
            return res.json({verified:false});
        }
    } catch (error) {
        console.log(error);
    }
});

app.listen(PORT, () => {
    console.log(`listening to port ${PORT}`);
});