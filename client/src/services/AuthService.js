import ApiService from './ApiService';

import axios from 'axios';

class AuthService {
    constructor() {
        this.apiClient = axios.create({
            baseURL: import.meta.env.VITE_SERVER_ORIGIN,
            headers: {
                'Content-Type': 'application/json',
            }
        });

        this.invalidUsernameMessage = 'Nederīgs lietotājvārds';
        this.invalidEmailMessage = 'Nederīgs e-pasts';
    }

    validateUsername(username) {
        const regex = /^[a-zA-Z\s]+$/;
        return regex.test(username);
    }

    validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    validatePassword(password) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        return regex.test(password);
    }

    async register(username, email, password) {
        if (!this.validateUsername(username)) {
            return this.invalidUsernameMessage;
        }

        if (!this.validateEmail(email)) {
            return this.invalidEmailMessage;
        }

        if (!this.validatePassword(password)) {
            return `
                Nederīga parole. 
                Parolei jābūt vismaz 8 rakstzīmēm, jāsatur vismaz vienu lielo burtu, 
                vienu mazo burtu un vienu ciparu.
            `;
        }

        try {
            const response = await this.apiClient.post('/api/admin/register', {
                username,
                email,
                password
            });
            return response.data;
        } catch (error) {
            throw new Error(`Register Error: ${error.message}`);
        }
    }

    async login(email, password) {
        if (!this.validateEmail(email)) {
            return this.invalidEmailMessage;
        }

        if (!this.validatePassword(password)) {
            return `
                Nepareizi ievadīta parole.
            `;
        }

        try {
            const response = await this.apiClient.post('/api/admin/login', {
                email,
                password,
            });
            return response.data;
        } catch (error) {
            throw new Error(`Login Error: ${error.message}`);
        }
    }

    // async forgotPassword(email) {
    //     if (this.validateInput(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    //         return 'Nederīgs e-pasts';
    //     }

    //     try {
    //         return await this.post('/api/admin/forgot-password', { email });
    //     } catch (error) {
    //         throw new Error(`Forgot Password Error: ${error.message}`);
    //     }
    // }
}

export default new AuthService();
