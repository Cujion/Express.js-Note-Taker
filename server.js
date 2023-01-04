// Required dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');
// Helper method for generating unique ids
const uuid = require('./helpers/uuid');

const PORT = 3001;
// Set up for express app
const app = express();

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
    console.log('request received to add a new note');
    
    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            noteID: uuid(),
        };
        const readNotes = fs.readFileSync(`./db/db.json`, 'utf8');
        const parsedNote = JSON.parse(readNotes);

        parsedNote.push(newNote);

        const newNoteString = JSON.stringify(parsedNote, null, 2);

        fs.writeFile(`./db/db.json`, newNoteString, (err) =>
        err
          ? console.error(err)
          : console.log(
              `${newNote.title} has been written to JSON file`
            )
      );
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























app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
