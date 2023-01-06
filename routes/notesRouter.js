// Required dependencies
const router = require('express').Router();
const path = require('path');
// Helper method for generating unique ids
const uuid = require('../helpers/uuid');
const notes = require('../db/db.json');
const fs = require('fs');
// Access to get db.json
router.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '../db/db.json'))
  });
// Access to post to notes
  router.post('/api/notes', (req, res) => {
    console.info('request received to add a new note');
    // Creating a new note with a unique id 
    if (req.body) {
      const newNote = {
        ...req.body,
        id: uuid(),
      };
    // Read db.json file
      const readNotes = fs.readFileSync(`./db/db.json`, 'utf8');
    // Parsing readNotes into json format
      const parsedNote = JSON.parse(readNotes);
    // Pushing parsedNote into a new note
      parsedNote.push(newNote);
    // stringify parsedNote into proper json format
      const newNoteString = JSON.stringify(parsedNote, null, 2);
    // Writing newNote to db.json file
      fs.writeFileSync(`./db/db.json`, newNoteString);
      const response = console.info({
        status: 'Successful', 
        body: newNote,
      });
      res.json(response);
    } else {
      res.json('Error in posting new note');
    }
  })
// Process to delete selected note with corresponding id
  router.delete('/api/notes/:id', (req, res) => {
    console.info('request received to delete selected note');
    const readNotes = fs.readFileSync(`./db/db.json`, 'utf8');
        const parsedNotes = JSON.parse(readNotes);
        const updatedNotes = parsedNotes.filter((notes) => notes.id !== req.params.id);
        // Update db.json after selected note has been deleted
        fs.writeFileSync('./db/db.json', JSON.stringify(updatedNotes, null, 2))
        const response = console.info(`Note with id ${req.params.id} has been deleted!`);
        res.json(response);
})

  module.exports = router;