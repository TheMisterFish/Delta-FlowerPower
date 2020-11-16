module.exports = {
    "transpileDependencies": [
        "vuetify"
    ],
    pluginOptions: {
        electronBuilder: {
            preload: 'src/preload.js',
            // Or, for multiple preload files:
            preload: { preload: 'src/preload.js' }
        }
    }
}