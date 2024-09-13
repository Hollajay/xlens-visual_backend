const InteriorDesign = require("../../Models/projectModel").InteriorDesign;
const upload = require("../../middleware/multer");
const cloudinary = require("../../Utils/cloudinary");
const sharp = require("sharp");
const { encode } = require("blurhash");

// Function to generate Blurhash
const generateBlurhash = async (imagePath) => {
    const image = await sharp(imagePath).raw().ensureAlpha().resize(32, 32, {
      fit: 'inside'
    }).toBuffer({ resolveWithObject: true });

    const { data, info } = image;
    const blurhash = encode(new Uint8ClampedArray(data), info.width, info.height, 4, 4);
    return blurhash;
};

// Get all interior designs
const getAllInteriorDesigns = async (req, res) => {
    try {
        const interiorDesigns = await InteriorDesign.find();
        res.status(200).json(interiorDesigns);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching interior designs', error: error.message });
    }
};

// Create a new interior design
const createInteriorDesign = async (req, res) => {
    try {
        // Compress and upload each file to Cloudinary
        console.log(req.files);

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
                folder: "interiorDesign",
                use_filename: true,
                unique_filename: false,
                timeout: 180000
            });

            return {
                url: result.secure_url,
                cloudinary_id: result.public_id,
                blurhash: blurhash, // Include the blurhash in the result
            };
        }));

        // Create a new interior design document
        let newInteriorDesign = new InteriorDesign({
            designName: req.body.designName,
            location: req.body.location,
            date: req.body.date,
            images: uploadResults,
            timeframe: req.body.timeframe,
            pricerange: req.body.pricerange,
        });

        // Save the document to the database
        await newInteriorDesign.save();
        res.status(200).json(newInteriorDesign);
        console.log(newInteriorDesign);

    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        res.status(500).json({ message: 'Failed to upload files to Cloudinary', error: error.message });
    }
};

// Update an existing interior design
const updateInteriorDesign = async (req, res) => {
    const { id } = req.params;
    const { designName, location, date , timeframe, pricerange } = req.body;

    try {
        console.log(`Updating Interior Design with ID: ${id}`);
        
        // Find the interior design by ID
        const interiorDesign = await InteriorDesign.findById(id);
        if (!interiorDesign) {
            return res.status(404).json({ message: 'Interior design not found' });
        }

        // If new images are uploaded, process them
        if (req.files && req.files.length > 0) {
            // Delete existing images from Cloudinary
            if (interiorDesign.images && interiorDesign.images.length > 0) {
                await Promise.all(interiorDesign.images.map(async (image) => {
                    await cloudinary.uploader.destroy(image.cloudinary_id);
                }));
            }

            // Compress and upload new images to Cloudinary
            const uploadResults = await Promise.all(req.files.map(async (file) => {
                const compressedImagePath = file.path + "-compressed.jpg";

                // Compress image
                await sharp(file.path)
                    .resize({ width: 800 })
                    .jpeg({ quality: 70 })
                    .toFile(compressedImagePath);

                // Generate Blurhash
                const blurhash = await generateBlurhash(file.path);

                // Upload the compressed image to Cloudinary
                const result = await cloudinary.uploader.upload(compressedImagePath, {
                    folder: "interiorDesign",
                    use_filename: true,
                    unique_filename: false,
                    timeout: 120000
                });

                return {
                    url: result.secure_url,
                    cloudinary_id: result.public_id,
                    blurhash: blurhash, // Include the blurhash in the result
                };
            }));

            // Update the images field with the new upload results
            interiorDesign.images = uploadResults;
        }

        // Update other fields
        interiorDesign.designName = designName || interiorDesign.designName;
        interiorDesign.location = location || interiorDesign.location;
        interiorDesign.date = date || interiorDesign.date;
        interiorDesign.timeframe = timeframe || interiorDesign.timeframe;
        interiorDesign.pricerange = pricerange || interiorDesign.pricerange;

        // Save the updated interior design to the database
        const updatedInteriorDesign = await interiorDesign.save();
        res.status(200).json(updatedInteriorDesign);
        console.log("Successfully updated");

    } catch (error) {
        console.error("Error updating the interior design:", error);
        res.status(500).json({ message: 'An error occurred while updating the interior design', error: error.message });
    }
};

// Delete an interior design
const deleteInteriorDesign = async (req, res) => {
    const { id } = req.params;
    console.log(`Deleting Interior Design with ID: ${id}`);
    
    try {
        // Find the interior design by ID
        const interiorDesign = await InteriorDesign.findById(id);
        if (!interiorDesign) {
            return res.status(404).json({ message: 'Interior design not found' });
        }
           
        // Delete existing images from Cloudinary
        if (interiorDesign.images && interiorDesign.images.length > 0) {
            await Promise.all(interiorDesign.images.map(async (image) => {
                await cloudinary.uploader.destroy(image.cloudinary_id);
            }));
        }

        // Delete the interior design from the database
        await InteriorDesign.findByIdAndDelete(id);

        res.status(200).json({ message: 'Interior design deleted successfully' });
    } catch (error) {
        console.error("Error while deleting interior design:", error);
        res.status(500).json({ message: 'An error occurred while deleting the interior design', error: error.message });
    }
};

module.exports = {
    getAllInteriorDesigns,
    createInteriorDesign,
    updateInteriorDesign,
    deleteInteriorDesign,
};
