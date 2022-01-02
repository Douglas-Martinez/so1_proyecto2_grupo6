import axios from 'axios';

export default axios.create({
    baseURL: "http://35.232.36.46:31211/",
    headers: {
        "Content-type": "application/json"
    }
})
