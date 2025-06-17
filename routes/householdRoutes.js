import { Router } from "express";
import multer from "multer";
import {
  getAllHouseholds,
  getHouseholdById,
  createHousehold,
  updateHousehold,
  deleteHousehold,
  addNoteToHousehold,
  deleteNoteFromHousehold,
} from "../controllers/householdController.js";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", getAllHouseholds);
router.get("/:id", getHouseholdById);
router.post("/", createHousehold);
router.put("/:id", updateHousehold);
router.delete("/:id", deleteHousehold);

router.post("/:id/notes", upload.array("files", 10), addNoteToHousehold);
router.delete("/:id/notes/:noteId", deleteNoteFromHousehold);

export default router;
