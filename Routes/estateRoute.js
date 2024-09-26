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


router.get("glattEstate", getAllGlattDesigns);
router.post("/glatttEstate",upload,createGlattDesign);
router.put("/glattEstate/:id",updateGlattDesign);
router.delete("/glattEstate/:id",deleteGlattDesign);


router.get("/glattEstate", getAllItunuDesigns);
router.post("/glattEstate",upload,createItunuDesign);
router.put('/glattEstate', updateItunuDesign);
router.delete("glattEstate",deleteItunuDesign);


module.exports = router