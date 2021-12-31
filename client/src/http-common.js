import axios from 'axios';

export default axios.create({
    baseURL: "http://servidor:10000/",
    headers: {
        "Content-type": "application/json"
    }
})
