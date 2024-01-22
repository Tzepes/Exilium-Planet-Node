import express from "express";
import ViteExpress from "vite-express";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from 'url';
import mongoose from "mongoose";
import ParcelModel from "./models/parcelSchema.js";

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

app.get("/api/parcels", async (req, res) => {
  try {
    const parcels = await ParcelModel.find({});
    res.json(parcels);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.get("/api/parcels/:ownerEthAddress", async (req, res) => {
  const {ownerEthAddress} = req.params;
  
  try {
    const parcels = await ParcelModel.find({ownerEthAddress: ownerEthAddress});
    
    res.status(200).json(parcels);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.put("/api/parcels/:id", async (req, res) => {
  const {id} = req.params;
  const {ethereumAddress} = req.body;
  
  try {
    const parcel = await ParcelModel.findById(id);
    
    if(!parcel) {
      res.status(404).json({error: "Parcel not found"});
      return;
    }
    
    parcel.ownerEthAddress = ethereumAddress;
    await parcel.save();
    
    res.status(200).json(parcel);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));