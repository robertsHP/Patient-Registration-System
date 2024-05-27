module.exports = {
    apps: [
        {
            name: 'client',
            script: 'npm',
            args: 'run start',
            cwd: './client',
            instances: 1,
            exec_mode: 'fork',
            env: {
                NODE_ENV: 'production'
            }
        },
        {
            name: 'client-dev',
            script: 'npm',
            args: 'run dev',
            cwd: './client',
            instances: 1,
            exec_mode: 'cluster',
            env: {
                NODE_ENV: 'development'
            }
        },
        {
            name: 'client-test',
            script: 'npm',
            args: 'run test',
            cwd: './client',
            instances: 1,
            exec_mode: 'fork',
            env: {
                NODE_ENV: 'test'
            }
        },
        {
            name: 'server',
            script: 'npm',
            args: 'run start',
            cwd: './server',
            env: {
                NODE_ENV: 'production'
            },
            env_production: {
                NODE_ENV: 'production',
                FORCE_COLOR: 'true'
            }
        },
        {
            name: 'server-dev',
            script: 'npm',
            args: 'run dev',
            cwd: './server',
            env: {
                NODE_ENV: 'development'
            }
        },
        {
            name: 'server-test',
            script: 'npm',
            args: 'run test',
            cwd: './server',
            env: {
                NODE_ENV: 'test'
            }
        },
        {
            name: 'admin',
            script: 'npm',
            args: 'run start',
            cwd: './admin',
            instances: 'max',
            exec_mode: 'cluster',
            env: {
                NODE_ENV: 'production'
            }
        },
        {
            name: 'admin-dev',
            script: 'npm',
            args: 'run dev',
            cwd: './admin',
            instances: 'max',
            exec_mode: 'cluster',
            env: {
                NODE_ENV: 'development'
            }
        },
        {
            name: 'admin-test',
            script: 'npm',
            args: 'run test',
            cwd: './admin',
            instances: 'max',
            exec_mode: 'fork',
            env: {
                NODE_ENV: 'test'
            }
        }
    ]
}