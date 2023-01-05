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
      const response = {
        status: 'success',
        body: newNote,
      };
  
      console.log(response);
      res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting new note');
    }
  })
// Deleting specified note if red trash can icon is clicked
  router.delete('/api/notes/:id', (req, res) => {
    for (i = 0; i < notes.length; i++) {
      if (notes[i].id == req.params.id) {
        notes.splice(notes[i], 1);
      }
    }
    // Updating new notes after specified note is deleted
    fs.writeFileSync('./db/db.json', JSON.stringify(notes, null, 2))
    res.json(notes);
  });

  module.exports = router;