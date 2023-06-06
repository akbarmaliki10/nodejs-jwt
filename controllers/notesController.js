const User = require("../models/User");
const Notes = require("../models/Notes");
const jwt = require("jsonwebtoken");

async function verifyUser(tokenJWT) {
    try {
        const decodeToken = jwt.verify(tokenJWT, "akbar secret");
        const user = User.findById(decodeToken.id);
        return user;
    } catch (err) {
        throw "User not authenticated";
    }
}

function errorHandler(err) {
    if (err.message == null) {
        return err;
    }

    if (err.message == "notes validation failed: title: Path `title` is required.") {
        return "Please fill the title"
    }

    if (err.message == "Cannot read properties of null (reading 'id')"){
        return "Please fill the id"
    }
    

    return err.message;
}

module.exports.notes_create = async (req,res) => {
    const { title, content } = req.body;

    
    try {
        const user = await verifyUser(req.cookies.jwt);
        
        const notes = await Notes.create({title, content});
        await user.updateOne({$push : {notes : notes._id}});
        res.status(200).json({status : 200,notes: notes._id});
    } catch (err) {
        const errorMessage = errorHandler(err);
        res.status(400).json({error : errorMessage});
    }
}

module.exports.notes_get_list = async (req,res) => {
    try {
        const user = await verifyUser(req.cookies.jwt);
        const result = await Notes.find({"_id": {$in : user.notes}})

        if(result.length == 0) {
            throw "You have 0 notes";
        }

        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({error : err});
    }

}

module.exports.notes_update = async(req,res) => {
    try {
        const { id, title, content } = req.body;
    
        const user = await verifyUser(req.cookies.jwt);
    
        const notes = await Notes.findByIdAndUpdate(id, {title: title, content: content});

        res.status(200).json({status : `Berhasil mengupdate notes dengan ID: ${notes.id}`});

    } catch (err){
        const errorMessage = errorHandler(err);
        res.status(400).json({error : errorMessage});
    }
}


module.exports.notes_delete = async(req,res) => {
    try {
        const { id } = req.body;
        const notes = await Notes.findByIdAndDelete(id);
    
        const user = await verifyUser(req.cookies.jwt);
    
        res.status(200).json({status: `Berhasil menghapus notes dengan ID: ${notes.id}`});
    } catch (err) {
        const errorMessage = errorHandler(err);
        res.status(400).json({error : errorMessage});
    }
}