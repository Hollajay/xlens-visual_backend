const express = require("express");
const router = express.Router();


const upload = require("../middleware/multer")






const { getAllFloorPlans,  updateFloorPlan, deleteFloorPlan, createFloorPlan } = require("../controller/projectController/FloorPlansController");
const { getAllInteriorDesigns, createInteriorDesign, updateInteriorDesign, deleteInteriorDesign } = require("../controller/projectController/interiorDesignContoller");
const { getAllMHQProjects, createMHQProject, updateMHQProject, deleteMHQProject } = require("../controller/projectController/projectMHQController");
const { getAllVisualization3Ds, createVisualization3D, updateVisualization3D, deleteVisualization3D } = require("../controller/projectController/visualization3DController");


// FloorPlans routes
router.get("/floorplans", getAllFloorPlans);
router.post("/floorplans", upload,createFloorPlan);
router.put("/floorplans/:id", updateFloorPlan);
router.delete("/floorplans/:id",deleteFloorPlan)


// InteriorDesign routes
router.get("/interiordesigns", getAllInteriorDesigns);
router.post("/interiordesigns",upload, createInteriorDesign);
router.put("/interiordesigns/:id",updateInteriorDesign);
router.delete("/interiordesigns/:id",deleteInteriorDesign)

// ProjectMHQ routes
router.get("/mhqprojects", getAllMHQProjects);
router.post("/mhqprojects",upload, createMHQProject);
router.put("/mhqprojects/:id", updateMHQProject);
router.delete("/mhqprojects/:id",deleteMHQProject)


// Visualization3D routes
router.get("/visualizations", getAllVisualization3Ds);
router.post("/visualizations",upload, createVisualization3D);
router.put("/visualizations/:id", updateVisualization3D);
router.delete("/visualizations/:id",deleteVisualization3D)

module.exports = router;
