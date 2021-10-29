const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;


const cors = require('cors');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

//middlewere
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uwk7a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
	try {
		await client.connect();
		console.log('connected to database')
		const database = client.db("chinaTravel");
		const serviceCollection = database.collection("services");
		const serviceOrderItems = database.collection("orderItems");
		const serviceAdvertise = database.collection("advertise");

		// GET API for set data
		app.get('/services', async (req, res) => {
			const cursor = serviceCollection.find();
			const services = await cursor.toArray();
			console.log("this is services", services);
			res.send(services);
		})
		// GET API for ordered data
		app.get('/orderItems', async (req, res) => {
			const cursor = serviceOrderItems.find();
			const orderItems = await cursor.toArray();
			console.log("order items", orderItems);
			res.send(orderItems);
		})



		//GET SUINGLE ITEM
		app.get('/services/:id', async (req, res) => {
			const id = req.params.id;
			console.log("Getiing specific id for emni", id);
			const query = { _id: ObjectId(id) };
			const service = await serviceCollection.findOne(query);
			// console.log("from single item to check json i how", res.json(service))
			res.json(service);
		})
		//GET SUINGLE ITEM for order item
		app.get('/orderItems/:id', async (req, res) => {
			const id = req.params.id;
			console.log("Getiing specific id for delete", id);
			const query = { _id: ObjectId(id) };
			const order = await serviceOrderItems.findOne(query);
			// console.log("from single item to check wether delete", res.json(service))
			console.log("Getiing deleted item show", order);
			res.json(order);
		})

		// POST API
		app.post('/services', async (req, res) => {
			const service = req.body;
			console.log("hit the post api", service);
			const result = await serviceCollection.insertOne(service);
			// console.log(result);
			// res.send('post hitted')
			res.json(result);
		});
		// POST API for order items
		app.post('/orderItems', async (req, res) => {
			const orderItems = req.body;
			console.log("hit the post api of order items", orderItems);
			const result = await serviceOrderItems.insertOne(orderItems);
			// console.log(result);
			// res.send('post hitted')
			res.json(result);
		});






		//DELETE API

		app.delete('/services/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const result = await serviceCollection.deleteOne(query);
			res.json(result);

		})

		//DELETE API for order items

		app.delete('/orderItems/:id', async (req, res) => {
			const id = req.params.id;
			console.log("delete hitted", id)
			const query = { _id: ObjectId(id) };
			const result = await serviceOrderItems.deleteOne(query);
			res.json(result);

		})


	}
	finally {
		// await client.close();
	}

}
run().catch(console.dir);

app.get('/', (req, res) => {
	// console.log(res);
	res.json('running Genius Server')
});
app.get('/hello', (req, res) => {
	// console.log(res);
	res.send('bye bye Genius Server')
});

app.listen(port, () => {
	console.log('Running genius server on port', port);
})