import axios from 'axios';

class ApiService {
    constructor() {
        this.apiClient = axios.create({
            baseURL: import.meta.env.VITE_SERVER_ORIGIN,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }

    // Method to handle GET requests
    get(endpoint, params = {}) {
        return this.apiClient.get(endpoint, { params })
            .then(response => response.data)
            .catch(error => {
                throw new Error(`GET Error: ${error.response ? error.response.data : error.message}`);
            });
    }

    // Method to handle POST requests
    post(endpoint, data) {
        return this.apiClient.post(endpoint, data)
            .then(response => response.data)
            .catch(error => {
                throw new Error(`POST Error: ${error.response ? error.response.data : error.message}`);
            });
    }

    // Method to handle PUT requests
    put(endpoint, data) {
        return this.apiClient.put(endpoint, data)
            .then(response => response.data)
            .catch(error => {
                throw new Error(`PUT Error: ${error.response ? error.response.data : error.message}`);
            });
    }

    // Method to handle DELETE requests
    delete(endpoint) {
        return this.apiClient.delete(endpoint)
            .then(response => response.data)
            .catch(error => {
                throw new Error(`DELETE Error: ${error.response ? error.response.data : error.message}`);
            });
    }
}

export default new ApiService();