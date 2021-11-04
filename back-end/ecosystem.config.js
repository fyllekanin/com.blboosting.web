module.exports = {
    apps: [
        {
            name: 'application',
            script: './dist/web/main.js',
            env: {
                NODE_ENV: "development",
            },
            env_production: {
                NODE_ENV: "development",
            },
            exec_mode: 'cluster',
            instances: '1'
        }
    ]
}
