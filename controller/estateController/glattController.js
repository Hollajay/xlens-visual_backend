const GlattEstate = require("../../Models/estateModels").Glatt;
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

// Get all Glatt designs
const getAllGlattDesigns = async (req, res) => {
    try {
        const glattDesigns = await GlattEstate.find();
        res.status(200).json(glattDesigns);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching Glatt designs', error: error.message });
    }
};

// Create a new Glatt design
const createGlattDesign = async (req, res) => {
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
                folder: "glattDesign",
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

        // Create a new Glatt design document
        let newGlattDesign = new GlattEstate({
            designName: req.body.designName,
            location: req.body.location,
            date: req.body.date,
            images: uploadResults,
            timeframe: req.body.timeframe,
            pricerange: req.body.pricerange,
        });

        // Save the document to the database
        await newGlattDesign.save();
        res.status(200).json(newGlattDesign);
        console.log(newGlattDesign);

    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        res.status(500).json({ message: 'Failed to upload files to Cloudinary', error: error.message });
    }
};

// Update an existing Glatt design
const updateGlattDesign = async (req, res) => {
    const { id } = req.params;
    const { designName, location, date, timeframe, pricerange } = req.body;

    try {
        console.log(`Updating Glatt Design with ID: ${id}`);
        
        // Find the Glatt design by ID
        const glattDesign = await GlattEstate.findById(id);
        if (!glattDesign) {
            return res.status(404).json({ message: 'Glatt design not found' });
        }

        // If new images are uploaded, process them
        if (req.files && req.files.length > 0) {
            // Delete existing images from Cloudinary
            if (glattDesign.images && glattDesign.images.length > 0) {
                await Promise.all(glattDesign.images.map(async (image) => {
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
                    folder: "glattDesign",
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
            glattDesign.images = uploadResults;
        }

        // Update other fields
        glattDesign.designName = designName || glattDesign.designName;
        glattDesign.location = location || glattDesign.location;
        glattDesign.date = date || glattDesign.date;
        glattDesign.timeframe = timeframe || glattDesign.timeframe;
        glattDesign.pricerange = pricerange || glattDesign.pricerange;

        // Save the updated Glatt design to the database
        const updatedGlattDesign = await glattDesign.save();
        res.status(200).json(updatedGlattDesign);
        console.log("Successfully updated");

    } catch (error) {
        console.error("Error updating the Glatt design:", error);
        res.status(500).json({ message: 'An error occurred while updating the Glatt design', error: error.message });
    }
};

// Delete a Glatt design
const deleteGlattDesign = async (req, res) => {
    const { id } = req.params;
    console.log(`Deleting Glatt Design with ID: ${id}`);
    
    try {
        // Find the Glatt design by ID
        const glattDesign = await GlattEstate.findById(id);
        if (!glattDesign) {
            return res.status(404).json({ message: 'Glatt design not found' });
        }
           
        // Delete existing images from Cloudinary
        if (glattDesign.images && glattDesign.images.length > 0) {
            await Promise.all(glattDesign.images.map(async (image) => {
                await cloudinary.uploader.destroy(image.cloudinary_id);
            }));
        }

        // Delete the Glatt design from the database
        await GlattEstate.findByIdAndDelete(id);

        res.status(200).json({ message: 'Glatt design deleted successfully' });
    } catch (error) {
        console.error("Error while deleting Glatt design:", error);
        res.status(500).json({ message: 'An error occurred while deleting the Glatt design', error: error.message });
    }
};

module.exports = {
    getAllGlattDesigns,
    createGlattDesign,
    updateGlattDesign,
    deleteGlattDesign,
};
