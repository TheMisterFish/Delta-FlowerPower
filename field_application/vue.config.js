module.exports = {
    "transpileDependencies": [
        "vuetify"
    ],
    pluginOptions: {
        electronBuilder: {
            // nodeIntegration: true,
            preload: 'public/preload.js',
            builderOptions: {
                extraResources: ['public/preload.js']
            }
        }
    }
}