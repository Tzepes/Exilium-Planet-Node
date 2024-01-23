import mongoose from "mongoose";
const Schema = mongoose.Schema;

const User = new Schema({
    username: { type: String, default: null },
    ethAddress: { type: String, default: null },
    parcelMatrID: { type: String, default: null },
});

const UserModel = mongoose.model("User", User);

export default UserModel;