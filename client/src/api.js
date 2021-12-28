import http from './http-common';

const getRam = () => {
    return http.get('/modulo_ram');
}

const getAllData = () => {
    return http.get('/');
}

const getOneDose = () => {
    return http.get('/one_dose');
}

const getTwoDose = () => {
    return http.get('/two_dose');
}

export default {
    getRam,
    getAllData,
    getOneDose,
    getTwoDose
}