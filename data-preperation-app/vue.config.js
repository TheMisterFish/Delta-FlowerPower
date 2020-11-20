module.exports = {
    "transpileDependencies": [
        "vuetify"
    ],
    pluginOptions: {
        electronBuilder: {
            preload: 'public/preload.js',
            externals: ['dialog'],
            builderOptions: {
                extraResources: ['public/preload.js']
            }
        }
    }

}