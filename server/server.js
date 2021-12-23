const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const app = express();

const connString = 'mongodb+srv://runi:runi2K22!r@cluster0.ui0ei.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());

MongoClient.connect(connString, {
    useUnifiedTopology: true
})
    .then(client => {
        console.log('Conectado a BD!');
        const db = client.db('sopes1-data');
        const dataCollection = db.collection('registros');

        app.get('/', (req, res) => {
            db.collection('registros').find().toArray()
            .then(results => {
              res.json(results);
            })
            .catch(error => console.error(error))
        });

        app.get('/one_dose', (req, res) => {
            db.collection('registros').find({n_dose: 1}).toArray()
            .then(results => {
              res.json(results);
            })
            .catch(error => console.error(error))
        });
    })
    .catch(console.error)

app.listen(10000, () => {
    console.log('Escuchando en el puerto 10000...');
});