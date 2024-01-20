import mongoose from 'mongoose';
import ParcelModel from './models/parcelSchema.js';

mongoose.connect("mongodb://localhost:27017/exiliumParcels")
  .then(() => console.log("Connected to MongoDB from Exilium Planet Node..."))
  .catch((err) => console.log("Error connecting to MongoDB from Exilium Planet Node | " + err));

  //Land Parcels Matrix

const totalParcels = 99856;
const parcelsPerSide = Math.sqrt(totalParcels);

const latRange = 180; // from -90 to 90
const lonRange = 360; // from -180 to 180

const latStep = latRange / parcelsPerSide;
const lonStep = lonRange / parcelsPerSide;

let parcelMatrix = [];

for (let i = 0; i < parcelsPerSide; i++) {
    for (let j = 0; j < parcelsPerSide; j++) {

        let inclination = (i / (parcelsPerSide - 1)) * Math.PI; // Range from 0 to PI
        let azimuth = (j / (parcelsPerSide - 1)) * 2 * Math.PI; // Range from 0 to 2PI
        // Convert the inclination and azimuth to latitude and longitude
        let lat = 90 - (inclination * 180 / Math.PI); // Convert from radians to degrees and shift range from 0-180 to 90--90
        let lon = azimuth * 180 / Math.PI - 180; // Convert from radians to degrees and shift range from 0-360 to -180-180
        
        let newParcel = new ParcelModel({
            id: `${i}-${j}`,
            userName: null,
            ethereumAddress: null,
            price: 0.05,
            latitude: lat,
            longitude: lon
        });
        await newParcel.save();
        // Assign the latitude and longitude to the parcel
        parcelMatrix.push(newParcel);
    }
}