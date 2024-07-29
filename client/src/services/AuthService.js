import ApiService from './ApiService';

class AuthService extends ApiService {
    async register(name, email, password) {
        try {
            const response = await this.post('/api/users/register', { name, email, password });
            return response;
        } catch (error) {
            throw new Error(`Register Error: ${error.message}`);
        }
    }

    async login(email, password) {
        try {
            const response = await this.post('/api/users/login', { email, password });
            return response;
        } catch (error) {
            throw new Error(`Login Error: ${error.message}`);
        }
    }

    async forgotPassword(email) {
        try {
            const response = await this.post('/api/users/forgot-password', { email });
            return response;
        } catch (error) {
            throw new Error(`Forgot Password Error: ${error.message}`);
        }
    }
}

export default new AuthService();
