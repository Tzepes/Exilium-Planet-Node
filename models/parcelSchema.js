import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Parcel = new Schema({
    id: String,
    userName: { type: String, default: null }, // Ethereum address of the owner
    ownerEthAddress: { type: String, default: null }, // Ethereum address of the owner
    ethValue: { type: Number, default: 0.05 },
    latitude: Number,
    longitude: Number,
    resources: {
        minerals: { 
            iron: { type: Number, default: 0 },
            aluminum: { type: Number, default: 0 },
            titanium: { type: Number, default: 0 },
            copper: { type: Number, default: 0 },
            silver: { type: Number, default: 0 },
            gold: { type: Number, default: 0 },
        },
        naturalResources: {
            liquidWater: { type: Number, default: 0 },
            ice: { type: Number, default: 0 },
        },
        naturalGas: { type: Number, default: 0 },
    },
    population: { type: Number, default: 0 },
    terraformProgress: { type: Number, default: 0 },
});

const ParcelModel = mongoose.model("Parcel", Parcel);

export default ParcelModel; 