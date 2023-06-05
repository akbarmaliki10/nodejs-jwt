const { Router } = require("express");
const notesController = require("../controllers/notesController.js");

const router = Router(); 

router.post('/notes', notesController.notes_create);
router.get("/notes", notesController.notes_get_list);
router.put("/notes", notesController.notes_update);
router.delete("/notes", notesController.notes_delete);

module.exports = router;