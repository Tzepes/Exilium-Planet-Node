import express from 'express';
import * as usersController from '../controllers/usersController.js';

const router = express.Router();

router.get("/:ethAddress", usersController.getUserByEthAdress);
router.put("/createUser", usersController.createUser);

export default router;