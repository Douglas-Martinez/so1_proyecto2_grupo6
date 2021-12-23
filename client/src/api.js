import http from './http-common';

const getRam = () => {
    return http.get('/modulo_ram');
}

const getOneDose = () => {
    return http.get('/one_dose');
}

export default {
    getRam,
    getOneDose
}