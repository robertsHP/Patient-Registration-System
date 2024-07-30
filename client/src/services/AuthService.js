import ApiService from './ApiService';

import axios from 'axios';

class AuthService {
    validateInput (input, regex) {
        return regex.test(input);
    }

    async register(name, email, password) {
        if (this.validateInput(name, /^[a-zA-Z\s]+$/)) {
            return 'Nederīgs lietotājvārds';
        }

        if (this.validateInput(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            return 'Nederīgs e-pasts';
        }

        if (this.validateInput(password, /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)) {
            return 'Nederīga parole';
        }

        try {
            return await ApiService.post('/api/admin/register', { name, email, password });
        } catch (error) {
            throw new Error(`Register Error: ${error.message}`);
        }
    }

    async login(email, password) {
        if (this.validateInput(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            return 'Nederīgs e-pasts';
        }

        if (this.validateInput(password, /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)) {
            return 'Nederīga parole';
        }

        try {
            return await ApiService.post('/api/admin/login', { email, password });
        } catch (error) {
            throw new Error(`Login Error: ${error.message}`);
        }
    }

    async forgotPassword(email) {
        if (this.validateInput(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            return 'Nederīgs e-pasts';
        }

        try {
            return await this.post('/api/admin/forgot-password', { email });
        } catch (error) {
            throw new Error(`Forgot Password Error: ${error.message}`);
        }
    }
}

export default new AuthService();
