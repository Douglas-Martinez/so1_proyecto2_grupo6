import axios from 'axios';

export default axios.create({
    baseURL: "http://35.238.239.244:31211/",
    headers: {
        "Content-type": "application/json"
    }
})
