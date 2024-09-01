const Visualization3D = require("../../Models/projectModel").Visualization3D;
const upload = require("../../middleware/multer");
const cloudinary = require("../../Utils/cloudinary");
const sharp = require("sharp");

const getAllVisualization3Ds = async (req, res) => {
    try {
        const visualization3Ds = await Visualization3D.find();
        res.status(200).json(visualization3Ds);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching 3D visualizations', error: error.message });
    }
};

const createVisualization3D = async (req, res) => {
    try {
        // Compress and upload each file to Cloudinary
        const uploadResults = await Promise.all(req.files.map(async (file) => {
            const compressedImagePath = file.path + "-compressed.jpg";
            await sharp(file.path)
                .resize({ width: 800 })  // Resize image to 800px width
                .jpeg({ quality: 70 })   // Compress to 70% quality
                .toFile(compressedImagePath);

            const result = await cloudinary.uploader.upload(compressedImagePath, {
                folder: "visualization3Ds",
                use_filename: true,
                unique_filename: false,
                timeout: 180000
            });

            return {
                url: result.secure_url,
                cloudinary_id: result.public_id
            };
        }));

        // Create a new 3D visualization document
        let newVisualization3D = new Visualization3D({
            designName: req.body.designName,
            location: req.body.location,
            date: req.body.date,
            images: uploadResults
        });

        // Save the document to the database
        await newVisualization3D.save();
        res.status(200).json(newVisualization3D);
        console.log(newVisualization3D);

    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        res.status(500).json({ message: 'Failed to upload files to Cloudinary', error: error.message });
    }
};

const updateVisualization3D = async (req, res) => {
    const { id } = req.params;
    const { designName, location, date } = req.body;

    try {
        console.log(`Updating 3D visualization with ID: ${id}`);
        
        // Find the 3D visualization by ID
        const visualization3D = await Visualization3D.findById(id);
        if (!visualization3D) {
            return res.status(404).json({ message: '3D visualization not found' });
        }

        // If new images are uploaded, process them
        if (req.files && req.files.length > 0) {
            // Delete existing images from Cloudinary
            if (visualization3D.images && visualization3D.images.length > 0) {
                await Promise.all(visualization3D.images.map(async (image) => {
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
                    folder: "visualization3Ds",
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
            visualization3D.images = uploadResults;
        }

        // Update other fields
        visualization3D.designName = designName || visualization3D.designName;
        visualization3D.location = location || visualization3D.location;
        visualization3D.date = date || visualization3D.date;

        // Save the updated 3D visualization to the database
        const updatedVisualization3D = await visualization3D.save();
        res.status(200).json(updatedVisualization3D);
        console.log("Successfully updated");

    } catch (error) {
        console.error("Error updating the 3D visualization:", error);
        res.status(500).json({ message: 'An error occurred while updating the 3D visualization', error: error.message });
    }
};

const deleteVisualization3D = async (req, res) => {
    const { id } = req.params;
    console.log(`Deleting 3D visualization with ID: ${id}`);

    try {
        // Find the 3D visualization by ID
        const visualization3D = await Visualization3D.findById(id);
        console.log(visualization3D);

        if (!visualization3D) {
            return res.status(404).json({ message: '3D visualization not found' });
        }

        // Check if cloudinary_id exists before attempting to delete the image
        if (visualization3D.cloudinary_id) {
            await cloudinary.uploader.destroy(visualization3D.cloudinary_id);
        } else {
            console.warn(`No cloudinary_id found for 3D visualization with ID: ${id}`);
        }

        // Delete the 3D visualization from the database
        await Visualization3D.findByIdAndDelete(id);

        res.status(200).json({ message: '3D visualization deleted successfully' });
    } catch (error) {
        console.error("Error while deleting 3D visualization:", error);
        res.status(500).json({ message: 'An error occurred while deleting the 3D visualization', error: error.message });
    }
};

module.exports = {
    getAllVisualization3Ds,
    createVisualization3D,
    updateVisualization3D,
    deleteVisualization3D,
};
