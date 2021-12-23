import http from './http-common';

const getRam = () => {
    return http.get('/modulo_ram');
}

const getCpu = () => {
    return http.get('/cpu_usage');
}

const getProcess = () => {
    return http.get('/modulo_cpu');
}

const killProcess = (uid) => {
    return http.get(`/kill_process?id=${uid}`);
}

export default {
    getRam,
    getProcess,
    killProcess,
    getCpu
}