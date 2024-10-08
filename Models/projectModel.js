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
        
    },
    timeframe:{
        type: String,
        trim: true
    },
    pricerange:{
        type: String,
        trim: true
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
        
    },
    timeframe:{
        type: String,
        trim: true
    },
    pricerange:{
        type: String,
        trim: true
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
        
    },
    timeframe:{
        type: String,
        trim: true
    },
    pricerange:{
        type: String,
        trim: true
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
        
    },
    timeframe:{
        type: String,
        trim: true
    },
    pricerange:{
        type: String,
        trim: true
    }
}, {
    timestamps: true 
});

const FloorPlans = mongoose.model('floorPlans', FloorPlanSchema);
const InteriorDesign = mongoose.model('interiorDesign', InteriorDesignSchema);
const ProjectMHQ = mongoose.model('MHQproject', ProjectMHQSchema);
const Visualization3D = mongoose.model('visualization', visualization3DSchema);

module.exports = {
   FloorPlans ,
   InteriorDesign,
   ProjectMHQ,
   Visualization3D,

}
