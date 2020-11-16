const zerorpc = require("zerorpc")
let client = new zerorpc.Client()

console.log("working?");

client.connect("tcp://127.0.0.1:4242")

client.invoke("echo", "server ready", (error, res) => {
    if (error || res !== 'server ready') {
        console.error(error)
    } else {
        console.log("server is ready")
    }
})

let button = document.getElementById('#clickme')

button.addEventListener('click', () => {
    console.log("clicking!!");
    // client.invoke("calc", formula.value, (error, res) => {
    //     if (error) {
    //         console.error(error)
    //     } else {
    //         result.textContent = res
    //     }
    // })
})

button.dispatchEvent(new Event('click'))