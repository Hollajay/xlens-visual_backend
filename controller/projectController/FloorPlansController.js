const FloorPlans = require("../../Models/projectModel").FloorPlans;

const getAllFloorPlans = async (req, res) => {
    try {
        const floorPlans = await FloorPlans.find();
        res.status(200).json(floorPlans);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching floor plans', error: error.message });
    }
};

const createFloorPlan = async (req, res) => {
    const { designName, location, date, images } = req.body;
    try {
        const newFloorPlan = await FloorPlans.create({ designName, location, date, images });
        res.status(201).json(newFloorPlan);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while creating the floor plan', error: error.message });
    }
};

const updateFloorPlan = async (req, res) => {
    const { id } = req.params;
    const { designName, location, date, images } = req.body;
    console.log(`Updating floor plan with ID: ${id}`);
    try {
        const floorPlan = await FloorPlans.findById(id);
        if (!floorPlan) {
            return res.status(404).json({ message: 'Floor plan not found' });
        }
        const updatedFloorPlan = await FloorPlans.findByIdAndUpdate(
            { _id: id },
            { designName, location, date, images },
            { runValidators: true, new: true }
        );
        res.status(200).json(updatedFloorPlan);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while updating the floor plan', error: error.message });
    }
};

const deleteFloorPlan = async (req, res) => {
    const { id } = req.params;
    console.log(`Deleting floor plan with ID: ${id}`);
    try {
        const floorPlan = await FloorPlans.findById(id);
        if (!floorPlan) {
            return res.status(404).json({ message: 'Floor plan not found' });
        }
        await FloorPlans.findByIdAndDelete(id);
        res.status(200).json({ message: 'Floor plan deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while deleting the floor plan', error: error.message });
    }
};

module.exports = {
    getAllFloorPlans,
    createFloorPlan,
    updateFloorPlan,
    deleteFloorPlan,
};
