import { MongoClient } from "mongodb";
import pokemones from "./pkmn.mjs";
import vacunas from "./vac.mjs";
import departamentos from "./dptms.mjs";

const connString = 'mongodb+srv://runi:runi2K22!r@cluster0.ui0ei.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

function getRandomDept() {
    return Math.floor(Math.random() * 22);
}

function getRandomAge() {
    return Math.floor(Math.random() * 69) + 1;
}

function getRandomNDose() {
    return Math.floor(Math.random() * 3) + 1;
}

function getRandomVaccine() {
    return Math.floor(Math.random() * 6);
}



MongoClient.connect(connString, {
    useUnifiedTopology: true
})
    .then(client => {
        console.log('Conectado a BD!');
        const db = client.db('sopes1-data');
        const dataCollection = db.collection('registros');
        const nombres = pokemones.results;
        for(let i = 1; i < nombres.length; i++) {
            let objeto = {
                name: nombres[i].name,
                location: departamentos[getRandomDept()],
                age: getRandomAge(),
                vaccine_type: vacunas[getRandomVaccine()],
                n_dose: getRandomNDose()
            }

            dataCollection.insertOne(objeto)
                .then(result => {
                    console.log(i);
                })
                .catch(err => console.error(err));
        }
    })
    .catch(console.error)





//console.log('hola?');