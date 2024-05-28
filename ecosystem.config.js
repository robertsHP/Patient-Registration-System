module.exports = {
    apps: [
        // {
        //     name: 'admin',
        //     script: './admin/boot.js',
        //     env: {
        //         NODE_ENV: 'npm run dev',
        //     },
        //     env_production: {
        //         NODE_ENV: 'npm start',
        //     },
        //     env_test: {
        //         NODE_ENV: 'npm test',
        //     },
        // },
        {
            name: 'client',
            script: './client/boot.js',
            env: {
                NODE_COMMAND: 'npm run dev',
            },
            env_production: {
                NODE_COMMAND: 'npm start',
            },
            env_test: {
                NODE_COMMAND: 'npm test',
            },
        },
        // {
        //     name: 'server',
        //     script: './server/boot.js',
        //     env: {
        //         NODE_ENV: 'npm run dev',
        //     },
        //     env_production: {
        //         NODE_ENV: 'npm start',
        //     },
        //     env_test: {
        //         NODE_ENV: 'npm test',
        //     },
        // },
    ]
}