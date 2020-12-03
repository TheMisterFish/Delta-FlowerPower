/* eslint-disable no-undef */
'use strict'

import {
    app,
    protocol,
    BrowserWindow,
    ipcMain,
    dialog
} from 'electron'
import {
    download
} from 'electron-dl'
import {
    createProtocol
} from 'vue-cli-plugin-electron-builder/lib'
import installExtension, {
    VUEJS_DEVTOOLS
} from 'electron-devtools-installer'
import path from 'path'
import fs from 'fs'
import {
    DOWNLOAD,
    FILESYSTEM,
    IPC_MESSAGES
} from './constants'
const isDevelopment = process.env.NODE_ENV !== 'production'

let pythonProcess = null;
const PYTHON_DIST_FOLDER = 'backend_dist';
const PYTHON_FOLDER = 'backend';
const PYTHON_MODULE = 'api';

/*************************************************************
 * Python process
 *************************************************************/
function packaged() {
    return process.env.VUE_APP_MODE === "PRODUCTION"
}

function getPythonScriptPath() {
    if (!packaged()) {
        return path.join(__static, PYTHON_FOLDER, `${PYTHON_MODULE}.py`);
    }

    if (process.platform === 'win32') {
        return path.join(__static, '..', PYTHON_DIST_FOLDER, PYTHON_MODULE, `${PYTHON_MODULE}.exe`);
    }

    return path.join(__static, '..', PYTHON_DIST_FOLDER, PYTHON_MODULE, PYTHON_MODULE);
}

function createPythonProcess() {
    const script = getPythonScriptPath();

    if (packaged()) {
        pythonProcess = require('child_process').execFile(script);
    } else {
        pythonProcess = require('child_process').spawn('python', [script]);
    }

    pythonProcess.stdout.on('data', function (data) {
        console.log('PYTHON: stdout:', data.toString());
    })

    pythonProcess.stderr.on('data', function (data) {
        //Here is where the error output goes
        console.log('PYTON: stderr:', data.toString());
    });
}

function exitPythonProcess() {
    pythonProcess.kill()
}

app.on('ready', createPythonProcess)
app.on('will-quit', exitPythonProcess)

/*************************************************************
 * window management
 *************************************************************/

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{
    scheme: 'app',
    privileges: {
        secure: true,
        standard: true
    }
}])

async function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 420,
        height: 800,
        webPreferences: {
            // enableRemoteModule: true,
            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
            contextIsolation: true,
            webSecurity: false,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        if (!process.env.IS_TEST) win.webContents.openDevTools()
    } else {
        createProtocol('app')
        // Load the index.html when not in development
        win.loadURL('app://./index.html')
    }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    protocol.registerFileProtocol('file', (request, callback) => {
        const pathname = decodeURI(request.url.replace('file:///', ''));
        callback(pathname)
    })
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installExtension(VUEJS_DEVTOOLS)
        } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString())
        }
    }
    createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}

//--------------------------------------- IPC MAIN PROCESS ---------------------------------------//
ipcMain.handle(FILESYSTEM, async (event, args) => {
    if (args.message === IPC_MESSAGES.SELECT_FOLDER) {
        try {
            const response = await dialog.showOpenDialog({
                properties: ['openDirectory']
            });
            return response.filePaths[0];
        } catch (error) {
            console.error(error);
        }
    } else if (args.message === IPC_MESSAGES.GET_IMAGE_FILES_FROM_FOLDER) {
        try {
            const response = await fs.promises.readdir(args.data);
            return response;
        } catch (error) {
            console.error(error);
        }
    }
})

ipcMain.on(DOWNLOAD, (event, args) => {
    download(BrowserWindow.getFocusedWindow(), args.url, args.properties)
        .then(dl => window.webContents.send("download complete", dl.getSavePath()));
})