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
    async get(endpoint, params = {}) {
        try {
            const response = await this.apiClient.get(endpoint, { params });
            return response.data;
        } catch (error) {
            throw new Error(`GET Error: ${error.response ? error.response.data : error.message}`);
        }
    }

    // Method to handle POST requests
    async post(endpoint, data) {
        try {
            const response = await this.apiClient.post(endpoint, data);
            return response.data;
        } catch (error) {
            throw new Error(`POST Error: ${error.response ? error.response.data : error.message}`);
        }
    }

    // Method to handle PUT requests
    async put(endpoint, data) {
        try {
            const response = await this.apiClient.put(endpoint, data);
            return response.data;
        } catch (error) {
            throw new Error(`PUT Error: ${error.response ? error.response.data : error.message}`);
        }
    }

    // Method to handle DELETE requests
    async delete(endpoint) {
        try {
            const response = await this.apiClient.delete(endpoint);
            return response.data;
        } catch (error) {
            throw new Error(`DELETE Error: ${error.response ? error.response.data : error.message}`);
        }
    }
}

export default new ApiService();
