import express from "express";
import ViteExpress from "vite-express";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from 'url';
import mongoose from "mongoose";
import ParcelModel from "./models/parcelSchema.js";
import UserModel from "./models/metamaskAccSchema.js";
import * as parcelsController from "./controllers/parcelsController.js";
import * as usersController from "./controllers/usersController.js";
import parcelRoutes from "./routes/parcelsRoutes.js";
import userRoutes from "./routes/usersRoutes.js";

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

// app.get("/api/parcels", parcelsController.getParcels);

// app.get("/api/parcels/:ownerEthAddress", parcelsController.getParcelsByOwner);

// app.put("/api/parcels/:id", parcelsController.updateParcelOwner);

app.use("/api/parcels", parcelRoutes);
app.use("/api/users", userRoutes);

// app.get("/api/users/:ethAddress", usersController.getUserByEthAdress);

// app.put("/api/users/createUser", usersController.createUser);

//TODO: create routes for parcels and users, implement controllers to them(will have app.use() for them)

ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));