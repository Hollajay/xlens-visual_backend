const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FloorPlanSchema = new Schema({
    designName: {
        type: String,
        required: [true, 'Design name must be filled'],
        trim: true
    },
    location: {
        type: String,
        required: [true, 'Location must be filled'],
        trim: true
    },
    date: {
        type: Date,
       
    },
    images: {
        type: Object, 
        
    }
}, {
    timestamps: true 
});




const InteriorDesignSchema = new Schema({
    designName: {
        type: String,
        required: [true, 'Design name must be filled'],
        trim: true
    },
    location: {
        type: String,
        required: [true, 'Location must be filled'],
        trim: true
    },
    date: {
        type: Date,
       
    },
    images: {
        type: Object, 
        
    }
}, {
    timestamps: true 
});



const ProjectMHQSchema = new Schema({
    designName: {
        type: String,
        required: [true, 'Design name must be filled'],
        trim: true
    },
    location: {
        type: String,
        required: [true, 'Location must be filled'],
        trim: true
    },
    date: {
        type: Date,
       
    },
    images: {
        type: Object, 
        
    }
}, {
    timestamps: true 
});




const visualization3DSchema = new Schema({
    designName: {
        type: String,
        required: [true, 'Design name must be filled'],
        trim: true
    },
    location: {
        type: String,
        required: [true, 'Location must be filled'],
        trim: true
    },
    date: {
        type: Date,
       
    },
    images: {
        type: Object, 
        
    }
}, {
    timestamps: true 
});

const floorPlans = mongoose.model('floorPlans', FloorPlanSchema);
const InteriorDesign = mongoose.model('interiorDesign', InteriorDesignSchema);
const ProjectMHQ = mongoose.model('MHQ', ProjectMHQSchema);
const visualization3D = mongoose.model('Project', visualization3DSchema);

module.exports = {
   floorPlans ,
   InteriorDesign,
   ProjectMHQ,
   visualization3D,

}
