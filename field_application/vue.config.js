module.exports = {
    "transpileDependencies": [
        "vuetify"
    ],
    pluginOptions: {
        electronBuilder: {
            // nodeIntegration: true,
            preload: 'public/preload.js',
            externals: ['json-rpc2'],
            builderOptions: {
                extraResources: ['public/preload.js']
            }
        }
    }
}