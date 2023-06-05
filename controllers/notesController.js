const User = require("../models/User");
const Notes = require("../models/Notes");
const jwt = require("jsonwebtoken");

async function verifyUser(tokenJWT) {
    try {
        const decodeToken = jwt.verify(tokenJWT, "akbar secret");
        const user = User.findById(decodeToken.id);
        return user;
    } catch (err) {
        console.log(err.message);
        return false;
    }
}

module.exports.notes_create = async (req,res) => {
    const { title, content } = req.body;

    const user = await verifyUser(req.cookies.jwt);

    try {
        const notes = await Notes.create({title, content});
        await user.updateOne({$push : {notes : notes._id}});
        res.status(200).json({status : 200,notes: notes._id});
    } catch (err) {
        res.status(400).json(err.message);
    }
}

module.exports.notes_get_list = async (req,res) => {
    const user = await verifyUser(req.cookies.jwt);

    const result = await Notes.find({"_id": {$in : user.notes}})
    res.status(200).json(result);
}

module.exports.notes_update = async(req,res) => {
    const { id, title, content } = req.body;

    const user = await verifyUser(req.cookies.jwt);

    const notes = await Notes.findByIdAndUpdate(id, {title: title, content: content});
    res.status(200).json(notes);
}


module.exports.notes_delete = async(req,res) => {
    const { id } = req.body;
    await Notes.findByIdAndDelete(id);

    const user = await verifyUser(req.cookies.jwt);

    res.status(200).json({status: `Berhasil menghapus notes dengan ID: ${id}`});
}