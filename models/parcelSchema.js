import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Parcel = new Schema({
    id: String,
    userName: { type: String, default: null }, // Ethereum address of the owner
    ethereumAddress: { type: String, default: null }, // Ethereum address of the owner
    price: { type: Number, default: 0.05 },
    latitude: Number,
    longitude: Number
});

const ParcelModel = mongoose.model("Parcel", Parcel);

export default ParcelModel;