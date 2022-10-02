let config;

//Bind all necessary clicks
document.getElementById("btnGoHome").addEventListener("click", () => {
    redirect('home');
});
document.getElementById("btnLoadCfg").addEventListener("click", () => {
    ipcRenderer.send('load-config');
});
document.getElementById("btnAlignPrinter").addEventListener("click", () => {
    alignPrintHead();
});

//create a div for error message when printer is not connected etc...
let printerErrMsg = document.createElement('div')
printerErrMsg.id = "printerErrMsg";
printerErrMsg.innerText = "There was an issue reaching the printer."
printerErrMsg.classList.add("alert", "alert-danger", "align-middle", "m-0", "px-3", "py-2", "d-none")
document.getElementById("topNavBar").appendChild(printerErrMsg)
//bind the error throwing to the message
window.electronAPI.handlePrinterErr((event, value) => {
    if (value === true) {
        console.log("Frontend recieved an error about a printer. Good luck.")
        try {
            document.getElementById("printerErrMsg").classList.replace("d-none", "visible")
        } catch (error) { }
    } else {
        console.log("Frontend recieved a cancellation of an error about a printer. Good work.")
        try {
            document.getElementById("printerErrMsg").classList.replace("visible", "d-none")
        } catch (error) { }
    }
});
window.electronAPI.handleSyncConfig((event, data) => {
    config = data;
    renderConfig();
});

function renderConfig(){

}

function alignPrintHead() {
    document.getElementById("btnAlignPrinter").value = "Aligning...";
    setTimeout(() => {
        document.getElementById("btnAlignPrinter").value = "Align Printer";
    }, 3000);
    ipcRenderer.send('alignPrintHead', true);
}

function redirect(url){
    ipcRenderer.send('redirect', url);
}