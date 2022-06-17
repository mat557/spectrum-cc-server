const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');



app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pyrpo.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
  try{
    await client.connect();
    const userCollection = client.db('spectrum-collection').collection('users');
    const courseCollection = client.db('spectrum-collection').collection('courses');
    


    app.put('/users/:email',async(req,res)=>{
      const email = req.params.email;
      const user = req.body;
      const filter = {email:email}
      const options = { upsert : true}
      const updateDoc = {
        $set:user,
      }
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });


    app.get('/courses',async(req,res)=>{
      const result = await courseCollection.find().toArray()
      res.send(result);
    });



  }
  finally{}
}

run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('This is from backend of spectrum');
})

app.listen(port, () => {
  console.log(`Spectrum rendering from port : ${port}`)
})