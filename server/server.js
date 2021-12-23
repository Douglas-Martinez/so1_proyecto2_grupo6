const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();

const connString = 'mongodb+srv://runi:runi2K22!r@cluster0.ui0ei.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

MongoClient.connect(connString, {
    useUnifiedTopology: true
})
    .then(client => {
        console.log('Conectado a BD!');
        const db = client.db('sopes1-data');
        const dataCollection = db.collection('registros');
    })
    .catch(console.error)

app.use(bodyParser.urlencoded({extended:true}));

app.get('/', (requ, res) => {
    res.send('Hola mundo!');
});

app.listen(10000, () => {
    console.log('Escuchando en el puerto 10000...');
});