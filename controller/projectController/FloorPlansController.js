const FloorPlans = require("../../Models/projectModel").FloorPlans;
const upload = require("../../middleware/multer");
const cloudinary = require("../../Utils/cloudinary")
 const sharp = require("sharp")


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
            await sharp(file.path)
                .resize({ width: 800 })  // Resize image to 800px width
                .jpeg({ quality: 70 })   // Compress to 70% quality
                .toFile(compressedImagePath);

            const result = await cloudinary.uploader.upload(compressedImagePath, {
                folder: "floorplans",
                use_filename: true,
                unique_filename: false,
                timeout: 180000
            });

            return {
                url: result.secure_url,
                cloudinary_id: result.public_id
            };
        }));

        // Create a new floor plan document
        let newFloorPlan = new FloorPlans({
            designName: req.body.designName,
            location: req.body.location,
            date: req.body.date,
            images: uploadResults
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
    const { designName, location, date } = req.body;

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

                // Compress image
                await sharp(file.path)
                    .resize({ width: 800 })  // Resize image to 800px width
                    .jpeg({ quality: 70 })   // Compress to 70% quality
                    .toFile(compressedImagePath);

                // Upload compressed image to Cloudinary
                const result = await cloudinary.uploader.upload(compressedImagePath, {
                    folder: "floorplans",
                    use_filename: true,
                    unique_filename: false,
                    timeout: 120000
                });

                return {
                    url: result.secure_url,
                    cloudinary_id: result.public_id
                };
            }));

            // Update the images field with the new upload results
            floorPlan.images = uploadResults;
        }

        // Update other fields
        floorPlan.designName = designName || floorPlan.designName;
        floorPlan.location = location || floorPlan.location;
        floorPlan.date = date || floorPlan.date;

        // Save the updated floor plan to the database
        const updatedFloorPlan = await floorPlan.save();
        res.status(200).json(updatedFloorPlan);
     console.log("successfully updated");
     
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
