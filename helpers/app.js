import { MongoClient } from "mongodb";
import pokemones from "./pkmn.mjs";
import vacunas from "./vac.mjs";
import departamentos from "./dptms.mjs";

const connString = 'mongodb://adming6:mongog6so1py2@34.121.255.243:27017';

function getRandomDept() {
    return Math.floor(Math.random() * 22);
}

function getRandomAge() {
    return Math.floor(Math.random() * 69) + 1;
}

function getRandomNDose() {
    return Math.floor(Math.random() * 3);
}

function getRandomVaccine() {
    return Math.floor(Math.random() * 6);
}

let jsonData = [];
const nombres = pokemones.results;

/*for (let x = 0; x < 7; x ++) {
    for(let i = 0; i < nombres.length; i++) {
        let objeto = {
            name: nombres[i].name,
            location: departamentos[getRandomDept()],
            age: getRandomAge(),
            vaccine_type: vacunas[getRandomVaccine()],
            n_dose: getRandomNDose()
        }
    
        jsonData.push(objeto)
    }
}

console.log(JSON.stringify(jsonData));
*/

MongoClient.connect(connString, {
    useUnifiedTopology: true
})
    .then(client => {
        console.log('Conectado a BD!');
        const db = client.db('sopes1-data');
        const dataCollection = db.collection('registros');
        const nombres = pokemones.results;
        for(let i = 0; i < nombres.length; i++) {
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