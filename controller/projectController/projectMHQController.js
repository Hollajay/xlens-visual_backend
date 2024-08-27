const ProjectMHQ = require("../../Models/projectModel").ProjectMHQ;

const getAllMHQProjects = async (req, res) => {
    try {
        const mhqProjects = await ProjectMHQ.find();
        res.status(200).json(mhqProjects);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching MHQ projects', error: error.message });
    }
};

const createMHQProject = async (req, res) => {
    const { designName, location, date, images } = req.body;
    try {
        const newMHQProject = await ProjectMHQ.create({ designName, location, date, images });
        res.status(201).json(newMHQProject);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while creating the MHQ project', error: error.message });
    }
};

const updateMHQProject = async (req, res) => {
    const { id } = req.params;
    const { designName, location, date, images } = req.body;
    console.log(`Updating MHQ project with ID: ${id}`);
    try {
        const mhqProject = await ProjectMHQ.findById(id);
        if (!mhqProject) {
            return res.status(404).json({ message: 'MHQ project not found' });
        }
        const updatedMHQProject = await ProjectMHQ.findByIdAndUpdate(
            { _id: id },
            { designName, location, date, images },
            { runValidators: true, new: true }
        );
        res.status(200).json(updatedMHQProject);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while updating the MHQ project', error: error.message });
    }
};

const deleteMHQProject = async (req, res) => {
    const { id } = req.params;
    console.log(`Deleting MHQ project with ID: ${id}`);
    try {
        const mhqProject = await ProjectMHQ.findById(id);
        if (!mhqProject) {
            return res.status(404).json({ message: 'MHQ project not found' });
        }
        await ProjectMHQ.findByIdAndDelete(id);
        res.status(200).json({ message: 'MHQ project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while deleting the MHQ project', error: error.message });
    }
};

module.exports = {
    getAllMHQProjects,
    createMHQProject,
    updateMHQProject,
    deleteMHQProject,
};
