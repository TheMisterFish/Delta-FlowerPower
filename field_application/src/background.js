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
    IPC_CHANNELS,
    IPC_MESSAGES,
    DB_NAMES
} from './constants'
import * as Datastore from "nedb-promises"

const isDevelopment = process.env.NODE_ENV !== 'production'
const userData = app.getPath('userData');


DB_NAMES.RESEARCHDB = null;
DB_NAMES.MODELDB = null;
DB_NAMES.SESSIONSDB = null;

let pythonProcess = null;

const PYTHON_DIST_FOLDER = 'backend_dist';
const PYTHON_FOLDER = 'backend';
const PYTHON_MODULE = 'api';

console.log("STARTED!");

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

    pythonProcess.stdout.on('data', function(data) {
        console.log('PYTHON: stdout:', data.toString());
    })

    pythonProcess.stderr.on('data', function(data) {
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
        width: 740,
        height: 820,
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

    // win.setMenu(null);

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
app.on('ready', async() => {
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


async function createDbs() {
    DB_NAMES.RESEARCHDB = Datastore.create({
        filename: path.join(userData, "database", "researches.db"),
        autoload: true
    })
    DB_NAMES.MODELDB = Datastore.create({
        filename: path.join(userData, "database", "ai_models.db"),
        autoload: true
    })
    DB_NAMES.SESSIONSDB = Datastore.create({
        filename: path.join(userData, "database", "sessions.db"),
        autoload: true
    })
}

app.on('ready', createDbs)

//--------------------------------------- IPC MAIN PROCESS ---------------------------------------//
ipcMain.handle(IPC_CHANNELS.FILESYSTEM, async(event, args) => {
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
            const response = await fs.promises.readdir(args.data.toLowerCase());
            return response;
        } catch (error) {
            console.error(error);
        }
    } else if (args.message === IPC_MESSAGES.DOWNLOAD_IMAGES_FROM_FOLDER) {
        try {
            let images = []
            const files = await fs.promises.readdir(args.data);

            files.forEach(f => {
                const image = fs.readFileSync(path.join(args.data, f));
                images.push({ data: image, name: f });
            })

            return images;
        } catch (error) {
            console.error(error);
        }
    } else if (args.message === IPC_MESSAGES.COPY_IMAGES_FROM_FOLDER) {
        try {
            const files = fs.readdirSync(args.data.from);

            const destionationFolder = path.join(userData, "sessions", args.data.to);

            if (!fs.existsSync(destionationFolder)) {
                fs.mkdirSync(destionationFolder, { recursive: true });
            }

            files.forEach(f => {
                fs.copyFileSync(path.join(args.data.from, f), path.join(destionationFolder, f));
            })

            return destionationFolder;
        } catch (error) {
            console.log(error);
        }
    }
})

ipcMain.handle(IPC_CHANNELS.DOWNLOAD_WEIGHTS, async(event, args) => {
    const response = await download(BrowserWindow.getFocusedWindow(), args.url, {
        directory: path.join(userData, "weights", args.modelName.toLowerCase())
    })
    return response.getSavePath();
})

ipcMain.handle(IPC_CHANNELS.REMOVE_WEIGHT, async(event, args) => {
    try {
        fs.unlinkSync(args.path.toLowerCase())
        return true;
    } catch (err) {
        console.error(err)
        return false;
    }
})

ipcMain.handle(IPC_CHANNELS.GET_WEIGHTS_FROM_FOLDER, async(event, args) => {
    const modelName = args.modelName.toLowerCase();
    try {
        const response = await fs.promises.readdir(path.join(userData, "weights", modelName))
        return response.map(w => ({
            path: path.join(userData, "weights", modelName, w),
            name: w,
            modelName: modelName
        }))
    } catch (error) {
        console.log(error);
    }
})

ipcMain.handle(IPC_CHANNELS.DATABASE, async(event, args) => {
    switch (args.message) {
        case IPC_MESSAGES.SAVE_IN_DB:
            return await DB_NAMES[args.database].insert(args.data, function(err, newDoc) {
                if (err) {
                    return err
                }
                return newDoc
            });
        case IPC_MESSAGES.UPDATE_IN_DB:
            return await DB_NAMES[args.database].update(args.to_update, args.data, args.options, function(err, updatedDoc) {
                if (err)
                    return err
                return updatedDoc
            });
        case IPC_MESSAGES.FIND_IN_DB:
            return await DB_NAMES[args.database].find(args.data, (err, docs) => {
                if (err)
                    return err;
                return docs
            });
        case IPC_MESSAGES.COUNT_IN_DB:
            return await DB_NAMES[args.database].count(args.data, function(err, count) {
                if (err)
                    return err
                return count
            });
        case IPC_MESSAGES.REMOVE_IN_DATABASE:
            return await DB_NAMES[args.database].remove(args.data, args.options, function(err, numRemoved) {
                if (err)
                    return err
                return numRemoved;
            });
        case IPC_MESSAGES.RESET_DATABASE:
            return await DB_NAMES[args.database].remove({}, {
                multi: true
            }, function(err, numRemoved) {
                DB_NAMES[args.database].loadDatabase(function(err) {
                    if (err)
                        return err
                    return true;
                });
            });
        default:
            return false;
    }
})