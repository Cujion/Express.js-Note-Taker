
const router = require('express').Router();
const path = require('path');
// Helper method for generating unique ids
const uuid = require('../helpers/uuid');
const notes = require('../db/db.json');
const fs = require('fs');

router.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '../db/db.json'))
  });
  
  router.post('/api/notes', (req, res) => {
    console.info('request received to add a new note');
  
    if (req.body) {
      const newNote = {
        ...req.body,
        id: uuid(),
      };
      
      const readNotes = fs.readFileSync(`./db/db.json`, 'utf8');
      const parsedNote = JSON.parse(readNotes);
  
      parsedNote.push(newNote);
  
      const newNoteString = JSON.stringify(parsedNote, null, 2);
  
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
  
  router.delete('/api/notes/:id', (req, res) => {
    for (i = 0; i < notes.length; i++) {
      if (notes[i].id == req.params.id) {
        notes.splice(notes[i], 1);
      }
    }
    fs.writeFileSync('./db/db.json', JSON.stringify(notes, null, 2))
    res.json(notes);
  });

  module.exports = router;