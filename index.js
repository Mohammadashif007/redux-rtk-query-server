const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
    "mongodb+srv://ashif25:318FhXkXJ9J0HYwB@cluster0.u69fsfj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const userCollection = client
            .db("new_userDB")
            .collection("usersCollection");

        app.get("/users", async (req, res) => {
            const result = await userCollection.find().toArray();
            res.send(result);
        });

        app.get("/users/:id", async (req, res) => {
            const id = parseInt(req.params.id); // Convert ID to a number
            const result = await userCollection.findOne({ id: id });

            if (result) {
                res.send(result);
            } else {
                res.status(404).send({ message: "User not found" });
            }
        });

        app.post("/users", async (req, res) => {
            const contact = req.body;
            console.log(contact);
            const result = await userCollection.insertOne(contact);
            res.send(result);
        });

        app.put("/users/:id", async (req, res) => {
            const id = parseInt(req.params.id);
            const contact = req.body;
            const filter = { id: id };
            const updatedDoc = { $set: contact };
            console.log(updatedDoc);
            const result = await userCollection.updateOne(filter, updatedDoc);
            res.send(result);
        });

        app.delete("/users/:id", async(req, res) => {
          const id = parseInt(req.params.id);
          const result = await userCollection.deleteOne(id);
          res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log(
            "Pinged your deployment. You successfully connected to MongoDB!"
        );
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
