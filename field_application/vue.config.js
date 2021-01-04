module.exports = {
    "transpileDependencies": [
        "vuetify"
    ],
    pluginOptions: {
        electronBuilder: {
            preload: 'public/preload.js',
            externals: ['dialog'],
            outputDir: 'field_app_build',
            builderOptions: {
                extraResources: [{
                    "from": 'public/backend_dist',
                    "to": 'backend_dist'
                }]
            }
        }
    }
}