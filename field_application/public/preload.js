console.log("we reading the preload!!")

import { ipcRenderer } from 'electron';

window.ipcRenderer = ipcRenderer;

import rpc from 'json-rpc2';

var client = rpc.Client.$create(4242, 'localhost');

// Call add function on the server

client.call('add', [1, 2], function(err, result) {
    console.log('1 + 2 = ' + result);
});