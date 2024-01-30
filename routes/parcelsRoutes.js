import express from 'express';
import * as parcelsController from '../controllers/parcelsController.js';

const router = express.Router();

router.get("/", parcelsController.getParcels);
router.get("/:ownerEthAddress", parcelsController.getParcelsByOwner);
router.put("/:id", parcelsController.updateParcelOwner);

export default router;