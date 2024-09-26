const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GlattSchema = new Schema({
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


const BurumSchema = new Schema({
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

const ItunuSchema = new Schema({
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

const Burums = mongoose.model('burums',BurumSchema);
const Itunu = mongoose.model('itunu',ItunuSchema);
const Glatt = mongoose.model('glatt',GlattSchema);

module.exports={
    Burums,
    Itunu,
    Glatt
}