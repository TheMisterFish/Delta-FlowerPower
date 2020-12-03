console.log("loaded preload!")

import { contextBridge, ipcRenderer } from 'electron';

console.log("imported electron")

console.log("exposing main world")

contextBridge.exposeInMainWorld(
                'electron', {
                                send: (channel, data) => {
                                                ipcRenderer.send(channel, data);
                                },
                                receive: (channel, func) => {
                                                ipcRenderer.on(channel, (event, ...args) => func(...args));
                                },
                                invoke: async(channel, data) => {
                                                const result = await ipcRenderer.invoke(channel, data);
                                                return result;
                                }
                }
)

console.log("exposed!")