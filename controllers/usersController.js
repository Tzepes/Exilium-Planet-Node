import UserModel from "../models/metamaskAccSchema.js";

export const getUserByEthAdress = async (req, res) => {
  const {ethAddress} = req.params;

  try {
    const user = await UserModel.findOne({ethAddress: ethAddress});

    if (!user) {
      res.status(404).json({error: "User not found"});
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

export const createUser = async (req, res) => {
    const {username, cntEthAddress} = req.body;

    try {
      const userByAddress = await UserModel.findOne({ethAddress: cntEthAddress});
      const userByUsername = await UserModel.findOne({username: username});
  
      if (userByAddress) {
        res.status(409).json({error: "User already exists"});
        return;
      }
  
      if (userByUsername) {
        res.status(409).json({error: "Username already exists"});
        return;
      }
  
      const newUser = new UserModel({
        username: username,
        ethAddress: cntEthAddress,
      })
      res.status(200).json(newUser);
      await newUser.save();
    } catch (error) {
      res.status(500).json({ error: error });
    }
}