import ParcelModel from "../models/parcelSchema.js";
import UserModel from "../models/metamaskAccSchema.js";

export const getParcels = async (req, res) => {
    try {
        const parcels = await ParcelModel.find({});
        res.json(parcels);
      } catch (error) {
        res.status(500).json({ error: error });
      }
};

export const getParcelsByOwner = async (req, res) => {
  const {ownerEthAddress} = req.params;
  
  try {
    const parcels = await ParcelModel.find({ownerEthAddress: ownerEthAddress});
    
    res.status(200).json(parcels);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const updateParcelOwner = async (req, res) => {
  const { id } = req.params;
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
    
    res.status(200).json({parcel, user});
  } catch (error) {
    res.status(500).json({ error: error });
  }
};