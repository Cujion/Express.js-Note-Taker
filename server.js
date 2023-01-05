// Required dependencies
const express = require('express');
const notesRouter = require('./routes/notesRouter');
const routes = require('./routes/index');

const PORT = process.env.PORT || 3001;
// Set up for express app
const app = express();
// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(notesRouter);
app.use(routes);

app.listen(PORT, () =>
  console.log(`App listening at ${PORT} 🚀`)
);
