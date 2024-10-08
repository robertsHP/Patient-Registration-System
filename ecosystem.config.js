
require('dotenv').config({ path: '.env' });

module.exports = {
    apps: [
        {
            name: 'client',
            script: 'boot.js',
            cwd: './client',
            env: {
                NODE_COMMAND: 'npm run dev',
                CLIENT_PORT: process.env.CLIENT_PORT
            },
            env_production: {
                NODE_COMMAND: 'npm start',
                CLIENT_PORT: process.env.CLIENT_PORT
            },
            env_test: {
                NODE_COMMAND: 'npm test',
                CLIENT_PORT: process.env.CLIENT_PORT
            },
        },
        {
            name: 'admin',
            script: 'boot.js',
            cwd: './admin',
            env: {
                NODE_COMMAND: 'npm run dev',
                ADMIN_PORT: process.env.ADMIN_PORT
            },
            env_production: {
                NODE_COMMAND: 'npm start',
                ADMIN_PORT: process.env.ADMIN_PORT
            },
            env_test: {
                NODE_COMMAND: 'npm test',
                ADMIN_PORT: process.env.ADMIN_PORT
            },
        },
        {
            name: 'server',
            script: 'boot.js',
            cwd: './server',
            env: {
                NODE_COMMAND: 'npm run dev',
                BACKEND_PORT: process.env.BACKEND_PORT
            },
            env_production: {
                NODE_COMMAND: 'npm start',
                BACKEND_PORT: process.env.BACKEND_PORT
            },
            env_test: {
                NODE_COMMAND: 'npm test',
                BACKEND_PORT: process.env.BACKEND_PORT
            },
        },



        // {
        //     name: "new_server",
        //     script: "php",
        //     args: `-S localhost:5000 -t .`,
        //     cwd: "./new_server",
        //     watch: true,
        //     env: {
        //         NODE_ENV: 'development'
        //     },
        //     env_production: {
        //         NODE_ENV: 'production'
        //     },
        //     env_test: {
        //         NODE_ENV: 'test'
        //     },
        // }
    ]
}

