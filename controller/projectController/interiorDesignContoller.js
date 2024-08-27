const InteriorDesign = require("../../Models/projectModel").InteriorDesign;

const getAllInteriorDesigns = async (req, res) => {
    try {
        const interiorDesigns = await InteriorDesign.find();
        res.status(200).json(interiorDesigns);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching interior designs', error: error.message });
    }
};

const createInteriorDesign = async (req, res) => {
    const { designName, location, date, images } = req.body;
    try {
        const newInteriorDesign = await InteriorDesign.create({ designName, location, date, images });
        res.status(201).json(newInteriorDesign);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while creating the interior design', error: error.message });
    }
};

const updateInteriorDesign = async (req, res) => {
    const { id } = req.params;
    const { designName, location, date, images } = req.body;
    console.log(`Updating interior design with ID: ${id}`);
    try {
        const interiorDesign = await InteriorDesign.findById(id);
        if (!interiorDesign) {
            return res.status(404).json({ message: 'Interior design not found' });
        }
        const updatedInteriorDesign = await InteriorDesign.findByIdAndUpdate(
            { _id: id },
            { designName, location, date, images },
            { runValidators: true, new: true }
        );
        res.status(200).json(updatedInteriorDesign);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while updating the interior design', error: error.message });
    }
};

const deleteInteriorDesign = async (req, res) => {
    const { id } = req.params;
    console.log(`Deleting interior design with ID: ${id}`);
    try {
        const interiorDesign = await InteriorDesign.findById(id);
        if (!interiorDesign) {
            return res.status(404).json({ message: 'Interior design not found' });
        }
        await InteriorDesign.findByIdAndDelete(id);
        res.status(200).json({ message: 'Interior design deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while deleting the interior design', error: error.message });
    }
};

module.exports = {
    getAllInteriorDesigns,
    createInteriorDesign,
    updateInteriorDesign,
    deleteInteriorDesign,
};
