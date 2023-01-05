// Required dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');
// Helper method for generating unique ids
const uuid = require('./helpers/uuid');
const notes = require('./db/db.json');

const PORT = process.env.PORT || 3001;
// Set up for express app
const app = express();
// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));


app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'db/db.json'))
});

app.post('/api/notes', (req, res) => {
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

app.delete('/api/notes/:id', (req, res) => {
  for (i = 0; i < notes.length; i++) {
    if (notes[i].id == req.params.id) {
      notes.splice(notes[i], 1);
    }
  }
  fs.writeFileSync('./db/db.json', JSON.stringify(notes, null, 2))
  res.json(notes);
});

app.listen(PORT, () =>
  console.log(`App listening at ${PORT} 🚀`)
);
