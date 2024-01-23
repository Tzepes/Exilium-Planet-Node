import express from "express";
import ViteExpress from "vite-express";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from 'url';
import mongoose from "mongoose";
import ParcelModel from "./models/parcelSchema.js";
import UserModel from "./models/metamaskAccSchema.js";

mongoose.connect("mongodb://localhost:27017/exiliumParcels")
  .then(() => console.log("Connected to MongoDB from Exilium Planet Node..."))
  .catch((err) => console.log("Error connecting to MongoDB from Exilium Planet Node | " + err));

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());

app.set('views', 'views')

app.use(express.static(path.join(__dirname, "public")));

app.get("/message", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/parcels", async (req, res) => { // Get all parcels
  try {
    const parcels = await ParcelModel.find({});
    res.json(parcels);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.get("/api/parcels/:ownerEthAddress", async (req, res) => { // Get all parcels from a specific owner
  const {ownerEthAddress} = req.params;
  
  try {
    const parcels = await ParcelModel.find({ownerEthAddress: ownerEthAddress});
    
    res.status(200).json(parcels);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.put("/api/parcels/:id", async (req, res) => { // Update parcel owner
  const {id} = req.params;
  const { username, ethereumAddress } = req.body;
  
  try {
    const parcel = await ParcelModel.findById(id);
    const user = await UserModel.findOne({ethAddress: ethereumAddress});

    if(!parcel) {
      res.status(404).json({error: "Parcel not found"});
      return;
    }
    
    parcel.ownerUsername = username;
    parcel.ownerEthAddress = ethereumAddress;
    user.parcelMatrID = parcel.id;
    await parcel.save();
    await user.save();
    
    res.status(200).json(parcel);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.get("/api/users/:ethAddress", async (req, res) => { // Get user by ethereum address
  const {ethAddress} = req.params;

  try {
    const user = await UserModel.findOne({ethAddress: ethAddress});

    if (!user) {
      res.status(404).json({error: "User not found"});
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.put("/api/users/createUser", async (req, res) => { // Create user
  const {username, cntEthAddress} = req.body;

  try {
    const userByAddress = await UserModel.findOne({ethAddress: cntEthAddress});
    const userByUsername = await UserModel.findOne({username: username});

    if (userByAddress) {
      res.status(409).json({error: "User already exists"});
      return;
    }

    if (userByUsername) {
      res.status(409).json({error: "Username already exists"});
      return;
    }

    const newUser = new UserModel({
      username: username,
      ethAddress: cntEthAddress,
    })
    res.status(200).json(newUser);
    await newUser.save();
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));