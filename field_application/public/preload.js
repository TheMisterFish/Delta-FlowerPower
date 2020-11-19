console.log("we reading the preload!!")

import { ipcRenderer } from 'electron';

console.log("imported ipcrenderer");

window.ipcRenderer = ipcRenderer;

console.log('setted the window')

import rpc from 'json-rpc2';

console.log("importerd rpc")

console.log(rpc);

const client = rpc.Client.$create(4242, 'localhost');

console.log("created client")

// Call add function on the server

client.call('add', [1, 2], function(err, result) {
    console.log('1 + 2 = ' + result);
});

console.log("END!")