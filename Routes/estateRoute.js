const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer")
const { getAllBurumsDesign, createBurumsDesign, deleteBurumEstate, updateBurumEstate } = require("../controller/estateController/burumController");
const { getAllGlattDesigns, createGlattDesign, updateGlattDesign, deleteGlattDesign } = require("../controller/estateController/glattController");
const { getAllItunuDesigns, createItunuDesign, updateItunuDesign, deleteItunuDesign } = require("../controller/estateController/itunuController");



router.get("/burums",getAllBurumsDesign);
router.post("/burums",upload,createBurumsDesign);
router.put("/burums/:id",updateBurumEstate);
router.delete("/burums/:id",deleteBurumEstate);


router.get("/glattEstate", getAllGlattDesigns);
router.post("/glattEstate",upload,createGlattDesign);
router.put("/glattEstate/:id",updateGlattDesign);
router.delete("/glattEstate/:id",deleteGlattDesign);


router.get("/itunuDesign", getAllItunuDesigns);
router.post("/itunuDesign",upload,createItunuDesign);
router.put('/itunuDesign', updateItunuDesign);
router.delete("/itunuDesign",deleteItunuDesign);


module.exports = router