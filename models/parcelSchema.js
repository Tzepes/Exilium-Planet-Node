import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Parcel = new Schema({
    id: String,
    owner: String,
    latitude: Number,
    longitude: Number
});

const ParcelModel = mongoose.model("Parcel", Parcel);

export default ParcelModel;