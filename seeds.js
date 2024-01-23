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
let createdParcels = 0;

for (let i = 0; i < parcelsPerSide; i++) {
    for (let j = 0; j < parcelsPerSide; j++) {

        let inclination = (i / (parcelsPerSide - 1)) * Math.PI; // Range from 0 to PI
        let azimuth = (j / (parcelsPerSide - 1)) * 2 * Math.PI; // Range from 0 to 2PI
        // Convert the inclination and azimuth to latitude and longitude
        let lat = 90 - (inclination * 180 / Math.PI); // Convert from radians to degrees and shift range from 0-180 to 90--90
        let lon = azimuth * 180 / Math.PI - 180; // Convert from radians to degrees and shift range from 0-360 to -180-180
        
        let maxH2O = Math.floor(Math.random() * 20);
        let ice = Math.floor(Math.random() * maxH2O);
        let liquidWater = Math.floor(Math.random() * (maxH2O/3));

        let newParcel = new ParcelModel({
            id: `${i}-${j}`, // matrix location
            ownerUsername: null,
            ethereumAddress: null,
            ethValue: 0.05,
            latitude: lat,
            longitude: lon,
            resources: {
                minerals: { 
                    iron: Math.floor(Math.random() * 60) + 1,
                    aluminum: Math.floor(Math.random() * 70) + 1,
                    titanium: Math.floor(Math.random() * 20) + 1,
                    copper: Math.floor(Math.random() * 60) + 1,
                    silver: Math.floor(Math.random() * 30) + 1,
                    gold: Math.floor(Math.random() * 10) + 1,
                },
                naturalResources: {
                    liquidWater: Math.floor(Math.random() * (maxH2O/3)),
                    ice: Math.floor(Math.random() * maxH2O),
                },
                naturalGas: Math.floor(Math.random() * 40) + 1,
            },
        });
        await newParcel.save();
        
        createdParcels++;
        process.stdout.write(`Creating parcel ${createdParcels} of ${totalParcels}\r`);

        parcelMatrix.push(newParcel);
    }
}