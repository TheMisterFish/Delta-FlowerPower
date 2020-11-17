const { app, BrowserWindow } = require('electron')
const path = require('path')

let mainWindow = null;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600
    })

    mainWindow.loadURL(require('url').format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // win.loadFile('index.html')
    mainWindow.webContents.openDevTools()
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})