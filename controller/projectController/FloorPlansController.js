const FloorPlans = require("../../Models/projectModel").FloorPlans;
const cloudinary = require("../../Utils/cloudinary")
 const sharp = require("sharp")
 const { encode } = require("blurhash");


 const generateBlurhash = async (imagePath) => {
    const image = await sharp(imagePath).raw().ensureAlpha().resize(32, 32, {
      fit: 'inside'
    }).toBuffer({ resolveWithObject: true });
  
    const { data, info } = image;
    const blurhash = encode(new Uint8ClampedArray(data), info.width, info.height, 4, 4);
    return blurhash;
  };

  
const getAllFloorPlans = async (req, res) => {
    try {
        const floorPlans = await FloorPlans.find();
        res.status(200).json(floorPlans);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching floor plans', error: error.message });
    }
};

  const createFloorPlan = async (req, res) => {
    try {
      console.log(req.files);
  
      // Compress and upload each file to Cloudinary
      const uploadResults = await Promise.all(req.files.map(async (file) => {
        const compressedImagePath = file.path + "-compressed.jpg";
  
        // Compress the image
        await sharp(file.path)
          .resize({ width: 800 })
          .jpeg({ quality: 70 })
          .toFile(compressedImagePath);
  
        // Generate Blurhash
        const blurhash = await generateBlurhash(file.path);
  
        // Upload the compressed image to Cloudinary
        const result = await cloudinary.uploader.upload(compressedImagePath, {
          folder: "floorplans",
          use_filename: true,
          unique_filename: false,
          timeout: 180000,
        });
  
        return {
          url: result.secure_url,
          cloudinary_id: result.public_id,
          blurhash: blurhash, // Include the blurhash in the result
        };
      }));
  
      // Create a new floor plan document
      let newFloorPlan = new FloorPlans({
        designName: req.body.designName,
        location: req.body.location,
        date: req.body.date,
        images: uploadResults,
        timeframe: req.body.timeframe,
        pricerange: req.body.pricerange,
      });
  
      // Save the document to the database
      await newFloorPlan.save();
      res.status(200).json(newFloorPlan);
      console.log(newFloorPlan);
  
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      res.status(500).json({ message: 'Failed to upload files to Cloudinary', error: error.message });
    }
  };



  const updateFloorPlan = async (req, res) => {
    const { id } = req.params;
    const { designName, location, date, timeframe, pricerange } = req.body;
  
    try {
      console.log(`Updating floor plan with ID: ${id}`);
  
      // Find the floor plan by ID
      const floorPlan = await FloorPlans.findById(id);
      if (!floorPlan) {
        return res.status(404).json({ message: 'Floor plan not found' });
      }
  
      // If new images are uploaded, process them
      if (req.files && req.files.length > 0) {
        // Delete existing images from Cloudinary
        if (floorPlan.images && floorPlan.images.length > 0) {
          await Promise.all(floorPlan.images.map(async (image) => {
            await cloudinary.uploader.destroy(image.cloudinary_id);
          }));
        }
  
        // Compress and upload new images to Cloudinary
        const uploadResults = await Promise.all(req.files.map(async (file) => {
          const compressedImagePath = file.path + "-compressed.jpg";
  
          // Compress the image
          await sharp(file.path)
            .resize({ width: 800 })
            .jpeg({ quality: 70 })
            .toFile(compressedImagePath);
  
          // Generate Blurhash
          const blurhash = await generateBlurhash(file.path);
  
          // Upload the compressed image to Cloudinary
          const result = await cloudinary.uploader.upload(compressedImagePath, {
            folder: "floorplans",
            use_filename: true,
            unique_filename: false,
            timeout: 120000,
          });
  
          return {
            url: result.secure_url,
            cloudinary_id: result.public_id,
            blurhash: blurhash, // Include the blurhash in the result
          };
        }));
  
        // Update the images field with the new upload results
        floorPlan.images = uploadResults;
      }
  
      // Update other fields
      floorPlan.designName = designName || floorPlan.designName;
      floorPlan.location = location || floorPlan.location;
      floorPlan.date = date || floorPlan.date;
      floorPlan.timeframe = timeframe || floorPlan.timeframe;
      floorPlan.pricerange = pricerange || floorPlan.pricerange;
  
      // Save the updated floor plan to the database
      const updatedFloorPlan = await floorPlan.save();
      res.status(200).json(updatedFloorPlan);
      console.log("Successfully updated");
  
    } catch (error) {
      console.error("Error updating the floor plan:", error);
      res.status(500).json({ message: 'An error occurred while updating the floor plan', error: error.message });
    }
  };
  


const deleteFloorPlan = async (req, res) => {
    const { id } = req.params;
    console.log(`Deleting floor plan with ID: ${id}`);
    
    try {
        // Find the floor plan by ID
        const floorPlan = await FloorPlans.findById(id);
        console.log(floorPlan);
        
        if (!floorPlan) {
            return res.status(404).json({ message: 'Floor plan not found' });
        }
           
        // Check if cloudinary_id exists before attempting to delete the image
        if (floorPlan.cloudinary_id) {
            await cloudinary.uploader.destroy(floorPlan.cloudinary_id);
        } else {
            console.warn(`No cloudinary_id found for floor plan with ID: ${id}`);
        }

        // Delete the floor plan from the database
        await FloorPlans.findByIdAndDelete(id);

        res.status(200).json({ message: 'Floor plan deleted successfully' });
    } catch (error) {
        console.error("Error while deleting floor plan:", error);
        res.status(500).json({ message: 'An error occurred while deleting the floor plan', error: error.message });
    }
};



module.exports = {
    getAllFloorPlans,
    createFloorPlan,
    updateFloorPlan,
    deleteFloorPlan,
};
