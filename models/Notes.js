const mongoose = require('mongoose');


const NotesSchema = new mongoose.Schema({
    title : {
        type : String,
        required: true
    },
    content : {
        type : String,
        default : ""
    }
})

const Notes = mongoose.model("notes", NotesSchema);

module.exports = Notes;