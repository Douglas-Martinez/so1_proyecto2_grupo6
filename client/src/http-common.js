import axios from 'axios';

export default axios.create({
    baseURL: "http://35.232.101.199:31563/",
    headers: {
        "Content-type": "application/json"
    }
})
