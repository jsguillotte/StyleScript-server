// Data Models
// We use Mongoose to help us create MONGO DB documents
// Those will be blueprints to future documents of a future collection
// The Schema of a Mongoose model will define the skeleton of a MongoDB document

const {Schema, model} = require("mongoose")

const clothingSchema = new Schema ({
    title: {type: String, required: true},
    img: {type: String},
    brand: { type: String },
    size: { type: String },
    description: { type: String },
    careInstructions: {type: string},
    season: {type: string},
    laundry: [ { type: String } ],
    notes: [ { 
        type: Schema.Types.ObjectId, 
        ref:'Notes' } ]
},
{timestamps: true}
)

//Export the Model
module.exports = model("Clothing", clothingSchema)