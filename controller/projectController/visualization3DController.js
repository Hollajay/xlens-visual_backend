const Visualization3D = require("../../Models/projectModel").Visualization3D;

const getAllVisualization3Ds = async (req, res) => {
    try {
        const visualizations = await Visualization3D.find();
        res.status(200).json(visualizations);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching 3D visualizations', error: error.message });
    }
};

const createVisualization3D = async (req, res) => {
    const { designName, location, date, images } = req.body;
    try {
        const newVisualization = await Visualization3D.create({ designName, location, date, images });
        res.status(201).json(newVisualization);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while creating the 3D visualization', error: error.message });
    }
};

const updateVisualization3D = async (req, res) => {
    const { id } = req.params;
    const { designName, location, date, images } = req.body;
    console.log(`Updating 3D visualization with ID: ${id}`);
    try {
        const visualization = await Visualization3D.findById(id);
        if (!visualization) {
            return res.status(404).json({ message: 'Visualization not found' });
        }
        const updatedVisualization = await Visualization3D.findByIdAndUpdate(
            { _id: id },
            { designName, location, date, images },
            { runValidators: true, new: true }
        );
        res.status(200).json(updatedVisualization);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while updating the 3D visualization', error: error.message });
    }
};

const deleteVisualization3D = async (req, res) => {
    const { id } = req.params;
    console.log(`Deleting 3D visualization with ID: ${id}`);
    try {
        const visualization = await Visualization3D.findById(id);
        if (!visualization) {
            return res.status(404).json({ message: 'Visualization not found' });
        }
        await Visualization3D.findByIdAndDelete(id);
        res.status(200).json({ message: '3D visualization deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while deleting the 3D visualization', error: error.message });
    }
};

module.exports = {
    getAllVisualization3Ds,
    createVisualization3D,
    updateVisualization3D,
    deleteVisualization3D,
};
