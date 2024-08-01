import axios from 'axios';

class SessionService {
    constructor(baseURL) {
        this.api = axios.create({
            baseURL: baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    async getSession() {
        try {
            const response = await this.api.get('/api/session/get-all');
            return response;
        } catch (error) {
            console.error('Failed to get all sessions:', error);
            throw error;
        }
    }

    async getSessionKey(key) {
        try {
            const response = await this.api.get('/api/session/get', {
                params: key ? { key } : {},
            });
            return response.data;
        } catch (error) {
            console.error('Failed to get session:', error);
            throw error;
        }
    }

    async updateSessionKey(key, value) {
        try {
            const response = await this.api.post('/api/session/update', { key, value });
            return response.data;
        } catch (error) {
            console.error('Failed to update session:', error);
            throw error;
        }
    }

    async deleteSessionKey(key) {
        try {
            const response = await this.api.delete('/api/session/delete', {
                data: key ? { key } : {},
            });
            return response.data;
        } catch (error) {
            console.error('Failed to delete session:', error);
            throw error;
        }
    }
}

export default new SessionService();

// Usage example:

// const sessionService = new SessionService('http://localhost:3000/api');
// sessionService.updateSession('username', 'john_doe').then(response => console.log(response));
// sessionService.getSession('username').then(response => console.log(response));
// sessionService.getAllSessions().then(response => console.log(response));
// sessionService.deleteSession('username').then(response => console.log(response));
