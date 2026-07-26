const express = require('express');
const routes = require('./routes');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/', routes);

// connect to mongoDB
mongoose.connect('mongodb+srv://<username>:<passwort>@cluster0.g3nbd.mongodb.net', { dbName: 'members' });
const db = mongoose.connection;
db.on('error', err => {
  console.log(err);
});
db.once('open', () => {
    console.log('connected to DB');
});

app.listen(PORT, (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log(`Server started and listening on port ${PORT} ... `);
    }
});