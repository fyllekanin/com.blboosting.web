module.exports = {
    apps: [{
        name: 'application',
        script: './dist/main.js',
        env: {
            NODE_ENV: "production",
        },
        env_production: {
            NODE_ENV: "production",
        },
        exec_mode: 'cluster',
        instances: 'max'
    }]
}
