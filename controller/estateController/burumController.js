
const burumEstate = require("../../Models/estateModels").Burums
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
const getAllBurumsDesign = async (req, res) => {
    try {
        const BurumEstate = await burumEstate.find();
        res.status(200).json(BurumEstate);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching burums designs', error: error.message });
    }
};

// Create a new interior design
const createBurumsDesign = async (req, res) => {
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
        let newBurumsDesign = new burumEstate({
            designName: req.body.designName,
            location: req.body.location,
            date: req.body.date,
            images: uploadResults,
            timeframe: req.body.timeframe,
            pricerange: req.body.pricerange,
        });

        // Save the document to the database
        await newBurumsDesign.save();
        res.status(200).json(newBurumsDesign);
        console.log(newBurumsDesign);

    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        res.status(500).json({ message: 'Failed to upload files to Cloudinary', error: error.message });
    }
};

// Update an existing interior design
const updateBurumEstate = async (req, res) => {
    const { id } = req.params;
    const { designName, location, date , timeframe, pricerange } = req.body;

    try {
        console.log(`Updating Interior Design with ID: ${id}`);
        
        // Find the interior design by ID
        const BurumEstate = await burumEstate.findById(id);
        if (!BurumEstate) {
            return res.status(404).json({ message: 'burum design  not found' });
        }

        // If new images are uploaded, process them
        if (req.files && req.files.length > 0) {
            // Delete existing images from Cloudinary
            if (BurumEstate.images && BurumEstate.images.length > 0) {
                await Promise.all(BurumEstate.images.map(async (image) => {
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
                    folder: "burumEstateDesign",
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
            BurumEstate.images = uploadResults;
        }

        // Update other fields
        BurumEstate.designName = designName ||  BurumEstate.designName;
        BurumEstate.location = location ||  BurumEstate.location;
        BurumEstate.date = date ||  BurumEstate.date;
        BurumEstate.timeframe = timeframe || BurumEstate.timeframe;
        BurumEstate.pricerange = pricerange ||  BurumEstate.pricerange;

        // Save the updated interior design to the database
        const updatedBurumEstate = await  BurumEstate.save();
        res.status(200).json(updatedBurumEstate);
        console.log("Successfully updated");

    } catch (error) {
        console.error("Error updating the burums design:", error);
        res.status(500).json({ message: 'An error occurred while updating the burums  design', error: error.message });
    }
};

// Delete an interior design
const deleteBurumEstate = async (req, res) => {
    const { id } = req.params;
    console.log(`Deleting Interior Design with ID: ${id}`);
    
    try {
        // Find the interior design by ID
        const  BurumEstateDesign = await burumEstate.findById(id);
        if (!BurumEstateDesign) {
            return res.status(404).json({ message: 'burums design not found' });
        }
           
        // Delete existing images from Cloudinary
        if ( BurumEstateDesign.images &&  BurumEstateDesign.images.length > 0) {
            await Promise.all( BurumEstateDesign.images.map(async (image) => {
                await cloudinary.uploader.destroy(image.cloudinary_id);
            }));
        }

        // Delete the interior design from the database
        await  burumEstate.findByIdAndDelete(id);

        res.status(200).json({ message: 'burums design deleted successfully' });
    } catch (error) {
        console.error("Error while deleting burums design:", error);
        res.status(500).json({ message: 'An error occurred while deleting the burums design', error: error.message });
    }
};

module.exports = {
   getAllBurumsDesign,
   createBurumsDesign,
   updateBurumEstate,
   deleteBurumEstate
};
