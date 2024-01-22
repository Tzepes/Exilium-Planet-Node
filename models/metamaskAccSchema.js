import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Account = new Schema({
    userName: { type: String, default: null },
    ethAddress: { type: String, default: null },
    parcelMatrID: { type: String, default: null },
});

const AccountModel = mongoose.model("Account", Account);

export default AccountModel;