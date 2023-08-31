const {Schema, model} = require("mongoose")

const notesSchema = new Schema ({
    content: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",},
},
{timestamps: true}
)

//Export the Model
module.exports = model("Notes", notesSchema)