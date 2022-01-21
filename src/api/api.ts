import axios from 'redaxios'

export const api = axios.create({
    baseURL: 'https://backend.breakroom.show',
}) as typeof axios
