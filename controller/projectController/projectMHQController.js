const ProjectMHQ = require("../../Models/projectModel").ProjectMHQ;
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

// Get all MHQ projects
const getAllMHQProjects = async (req, res) => {
    try {
        const mhqProjects = await ProjectMHQ.find();
        res.status(200).json(mhqProjects);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching MHQ projects', error: error.message });
    }
};

// Create a new MHQ project
const createMHQProject = async (req, res) => {
    console.log("Received request body:", req.body);
    try {
        // Compress and upload each file to Cloudinary
        const uploadResults = await Promise.all(req.files.map(async (file) => {
            const compressedImagePath = file.path + "-compressed.jpg";
            await sharp(file.path)
                .resize({ width: 800 })  // Resize image to 800px width
                .jpeg({ quality: 70 })   // Compress to 70% quality
                .toFile(compressedImagePath);

            // Generate Blurhash
            const blurhash = await generateBlurhash(file.path);

            const result = await cloudinary.uploader.upload(compressedImagePath, {
                folder: "mhqProjects",
                use_filename: true,
                unique_filename: false,
                timeout: 180000
            });

            return {
                url: result.secure_url,
                cloudinary_id: result.public_id,
                blurhash: blurhash // Include blurhash in the result
            };
        }));

        // Create a new MHQ project document
        let newMHQProject = new ProjectMHQ({
            designName: req.body.designName,
            location: req.body.location,
            date: req.body.date,
            images: uploadResults,
            timeframe: req.body.timeframe,
            pricerange: req.body.pricerange,
        });

        // Save the document to the database
        await newMHQProject.save();
        res.status(200).json(newMHQProject);
        console.log(newMHQProject);

    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        res.status(500).json({ message: 'Failed to upload files to Cloudinary', error: error.message });
    }
};

// Update an existing MHQ project
const updateMHQProject = async (req, res) => {
    const { id } = req.params;
    const { designName, location, date , timeframe, pricerange} = req.body;

    try {
        console.log(`Updating MHQ project with ID: ${id}`);
        
        // Find the MHQ project by ID
        const mhqProject = await ProjectMHQ.findById(id);
        if (!mhqProject) {
            return res.status(404).json({ message: 'MHQ project not found' });
        }

        // If new images are uploaded, process them
        if (req.files && req.files.length > 0) {
            // Delete existing images from Cloudinary
            if (mhqProject.images && mhqProject.images.length > 0) {
                await Promise.all(mhqProject.images.map(async (image) => {
                    await cloudinary.uploader.destroy(image.cloudinary_id);
                }));
            }

            // Compress and upload new images to Cloudinary
            const uploadResults = await Promise.all(req.files.map(async (file) => {
                const compressedImagePath = file.path + "-compressed.jpg";

                await sharp(file.path)
                    .resize({ width: 800 })  // Resize image to 800px width
                    .jpeg({ quality: 70 })   // Compress to 70% quality
                    .toFile(compressedImagePath);

                // Generate Blurhash
                const blurhash = await generateBlurhash(file.path);

                const result = await cloudinary.uploader.upload(compressedImagePath, {
                    folder: "mhqProjects",
                    use_filename: true,
                    unique_filename: false,
                    timeout: 120000
                });

                return {
                    url: result.secure_url,
                    cloudinary_id: result.public_id,
                    blurhash: blurhash // Include blurhash in the result
                };
            }));

            // Update the images field with the new upload results
            mhqProject.images = uploadResults;
        }

        // Update other fields
        mhqProject.designName = designName || mhqProject.designName;
        mhqProject.location = location || mhqProject.location;
        mhqProject.date = date || mhqProject.date;
        mhqProject.timeframe = timeframe || mhqProject.timeframe;
        mhqProject.pricerange = pricerange || mhqProject.pricerange;

        // Save the updated MHQ project to the database
        const updatedMHQProject = await mhqProject.save();
        res.status(200).json(updatedMHQProject);
        console.log("Successfully updated");
     
    } catch (error) {
        console.error("Error updating the MHQ project:", error);
        res.status(500).json({ message: 'An error occurred while updating the MHQ project', error: error.message });
    }
};

// Delete an MHQ project
const deleteMHQProject = async (req, res) => {
    const { id } = req.params;
    console.log(`Deleting MHQ project with ID: ${id}`);
    
    try {
        // Find the MHQ project by ID
        const mhqProject = await ProjectMHQ.findById(id);
        console.log(mhqProject);
        
        if (!mhqProject) {
            return res.status(404).json({ message: 'MHQ project not found' });
        }
           
        // Delete existing images from Cloudinary
        if (mhqProject.images && mhqProject.images.length > 0) {
            await Promise.all(mhqProject.images.map(async (image) => {
                await cloudinary.uploader.destroy(image.cloudinary_id);
            }));
        }

        // Delete the MHQ project from the database
        await ProjectMHQ.findByIdAndDelete(id);

        res.status(200).json({ message: 'MHQ project deleted successfully' });
    } catch (error) {
        console.error("Error while deleting MHQ project:", error);
        res.status(500).json({ message: 'An error occurred while deleting the MHQ project', error: error.message });
    }
};

module.exports = {
    getAllMHQProjects,
    createMHQProject,
    updateMHQProject,
    deleteMHQProject,
};
