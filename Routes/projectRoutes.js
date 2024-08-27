const express = require("express");
const router = express.Router();

const { getAllFloorPlans, createFloorPlan, updateFloorPlan, deleteFloorPlan } = require("../controller/projectController/FloorPlansController");
const { getAllInteriorDesigns, createInteriorDesign, updateInteriorDesign, deleteInteriorDesign } = require("../controller/projectController/interiorDesignContoller");
const { getAllMHQProjects, createMHQProject, updateMHQProject, deleteMHQProject } = require("../controller/projectController/projectMHQController");
const { getAllVisualization3Ds, createVisualization3D, updateVisualization3D, deleteVisualization3D } = require("../controller/projectController/visualization3DController");

// FloorPlans routes
router.get("/floorplans", getAllFloorPlans);
router.post("/floorplans", createFloorPlan);
router.put("/floorplans", updateFloorPlan);
router.delete("/floorplans",deleteFloorPlan)


// InteriorDesign routes
router.get("/interiordesigns", getAllInteriorDesigns);
router.post("/interiordesigns", createInteriorDesign);
router.put("/interiordesigns",updateInteriorDesign);
router.delete("/interiordesigns",deleteInteriorDesign)

// ProjectMHQ routes
router.get("/mhqprojects", getAllMHQProjects);
router.post("/mhqprojects", createMHQProject);
router.put("/mhqprojects", updateMHQProject);
router.delete("/mhqprojects",deleteMHQProject)


// Visualization3D routes
router.get("/visualizations", getAllVisualization3Ds);
router.post("/visualizations", createVisualization3D);
router.put("/visualizations", updateVisualization3D);
router.delete("/visualizations",deleteVisualization3D)

module.exports = router;
