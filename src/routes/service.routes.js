import express from "express";
import {
    createService,
    getServices,
    getServiceById,
    updateService,
    deleteService,
    toggleServiceStatus,
} from "../controllers/service.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// Protect all routes
router.use(protect);

// Public routes (still protected by authentication)
router.route("/").get(getServices);

router.route("/:id").get(getServiceById);

// Admin only routes
router.use(authorize("admin", "administrator"));

router.route("/").post(createService);

router.route("/:id").put(updateService).delete(deleteService);

router.route("/:id/toggle").patch(toggleServiceStatus);

export default router;
