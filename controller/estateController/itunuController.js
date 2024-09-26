const ItunuDesign = require("../../Models/estateModels").Itunu;
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

// Get all Itunu designs
const getAllItunuDesigns = async (req, res) => {
    try {
        const itunuDesigns = await ItunuDesign.find();
        res.status(200).json(itunuDesigns);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching Itunu designs', error: error.message });
    }
};

// Create a new Itunu design
const createItunuDesign = async (req, res) => {
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
                folder: "itunuDesign",
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

        // Create a new Itunu design document
        let newItunuDesign = new ItunuDesign({
            designName: req.body.designName,
            location: req.body.location,
            date: req.body.date,
            images: uploadResults,
            timeframe: req.body.timeframe,
            pricerange: req.body.pricerange,
        });

        // Save the document to the database
        await newItunuDesign.save();
        res.status(200).json(newItunuDesign);
        console.log(newItunuDesign);

    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        res.status(500).json({ message: 'Failed to upload files to Cloudinary', error: error.message });
    }
};

// Update an existing Itunu design
const updateItunuDesign = async (req, res) => {
    const { id } = req.params;
    const { designName, location, date, timeframe, pricerange } = req.body;

    try {
        console.log(`Updating Itunu Design with ID: ${id}`);
        
        // Find the Itunu design by ID
        const itunuDesign = await ItunuDesign.findById(id);
        if (!itunuDesign) {
            return res.status(404).json({ message: 'Itunu design not found' });
        }

        // If new images are uploaded, process them
        if (req.files && req.files.length > 0) {
            // Delete existing images from Cloudinary
            if (itunuDesign.images && itunuDesign.images.length > 0) {
                await Promise.all(itunuDesign.images.map(async (image) => {
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
                    folder: "itunuDesign",
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
            itunuDesign.images = uploadResults;
        }

        // Update other fields
        itunuDesign.designName = designName || itunuDesign.designName;
        itunuDesign.location = location || itunuDesign.location;
        itunuDesign.date = date || itunuDesign.date;
        itunuDesign.timeframe = timeframe || itunuDesign.timeframe;
        itunuDesign.pricerange = pricerange || itunuDesign.pricerange;

        // Save the updated Itunu design to the database
        const updatedItunuDesign = await itunuDesign.save();
        res.status(200).json(updatedItunuDesign);
        console.log("Successfully updated");

    } catch (error) {
        console.error("Error updating the Itunu design:", error);
        res.status(500).json({ message: 'An error occurred while updating the Itunu design', error: error.message });
    }
};

// Delete an Itunu design
const deleteItunuDesign = async (req, res) => {
    const { id } = req.params;
    console.log(`Deleting Itunu Design with ID: ${id}`);
    
    try {
        // Find the Itunu design by ID
        const itunuDesign = await ItunuDesign.findById(id);
        if (!itunuDesign) {
            return res.status(404).json({ message: 'Itunu design not found' });
        }
           
        // Delete existing images from Cloudinary
        if (itunuDesign.images && itunuDesign.images.length > 0) {
            await Promise.all(itunuDesign.images.map(async (image) => {
                await cloudinary.uploader.destroy(image.cloudinary_id);
            }));
        }

        // Delete the Itunu design from the database
        await ItunuDesign.findByIdAndDelete(id);

        res.status(200).json({ message: 'Itunu design deleted successfully' });
    } catch (error) {
        console.error("Error while deleting Itunu design:", error);
        res.status(500).json({ message: 'An error occurred while deleting the Itunu design', error: error.message });
    }
};

module.exports = {
    getAllItunuDesigns,
    createItunuDesign,
    updateItunuDesign,
    deleteItunuDesign,
};
