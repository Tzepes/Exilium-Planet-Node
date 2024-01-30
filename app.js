import express from "express";
import ViteExpress from "vite-express";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from 'url';
import mongoose from "mongoose";
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

app.use("/api/parcels", parcelRoutes);
app.use("/api/users", userRoutes);

ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));