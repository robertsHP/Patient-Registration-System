module.exports = {
    apps: [
        // {
        //     name: 'client',
        //     script: 'client/app.js',
        //     instances: 'max',
        //     exec_mode: 'cluster',
        //     env: {
        //         NODE_ENV: 'production'
        //     },
        //     env_production: {
        //         NODE_ENV: 'production',
        //         FORCE_COLOR: 'true'
        //     }
        // },
        {
            name: 'server',
            cwd: './server',
            script: 'npm',
            args: 'start',
            // env: {
            //     NODE_ENV: 'production'
            // },
            // env_production: {
            //     NODE_ENV: 'production',
            //     FORCE_COLOR: 'true'
            // }
        },
        // {
        //     name: 'admin',
        //     script: 'client/admin/app.js',
        //     instances: 'max',
        //     exec_mode: 'cluster',
        //     env: {
        //         NODE_ENV: 'production'
        //     }
        // }
    ]
}