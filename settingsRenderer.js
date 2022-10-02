let config;

//Bind all necessary clicks
document.getElementById("btnGoHome").addEventListener("click", () => {
    redirect('home');
});
document.getElementById("btnLoadCfg").addEventListener("click", () => {
    ipcRenderer.send('load-config');
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

function renderConfig() {
    //clear all config options...
    for (i = 0; i < document.getElementsByTagName("tr").length; i++) {
        if (!document.getElementsByTagName("tr").item(i).id.includes("header")) {
            document.getElementsByTagName("tr").item(i).remove();
        }
    }
    //...and render them again
    let settings = config.settings;
    for (i = 0; i < settings.length; i++) {
        let args = {
            arg0: "",
            opt0: "",
            arg1: "",
            opt1: ""
        };
        switch(settings[i].arguments.length){
            case 0:
                args.arg0 = "This has no arguments"
                break;
            case 1:
                args.arg0 = Object.keys(settings[i].arguments[0]);
                args.opt0 = Object.values(config.settings[0].arguments[0])[0];
                break;
            case 2:
                args.arg0 = Object.keys(settings[i].arguments[0]);
                args.opt0 = Object.values(config.settings[0].arguments[0])[0];
                args.arg1 = Object.keys(settings[i].arguments[1]);
                args.opt1 = Object.values(config.settings[0].arguments[1])[0];
                break;
        }
        let id = `configItem${i}`;
        let elementStr = `<td class="align-middle">${settings[i].name}</td>
                    <td class="align-middle">
                        ${args.arg0}
                    </td>
                    <td class="align-middle">
                        <input class="input bg-transparent m-0 form-control" type="text" id="inputNewCN" value="${args.opt0}">
                    </td>
                    <td class="align-middle">
                        ${args.arg1}
                    </td>
                    <td class="align-middle">
                    <input class="input bg-transparent m-0 form-control" type="text" id="inputNewCN" value="${args.opt1}">
                    </td>
                    <td>
                        <button class="btn btn-outline-secondary" id="btn${id}Save">Save</button>
                        <button class="btn btn-outline-secondary" id="btn${id}Run">\>_ Run</button>
                    </td>
        `;
        let newTr = document.createElement('tr');
        newTr.id = id;
        document.getElementById("datatableBody").appendChild(newTr);
        document.getElementById(id).innerHTML += elementStr;

        document.getElementById("btn${id}Run").addEventListener("click", () => {
           RunConfigurationCommand(settings[i]);
        });

        document.getElementById("btn${id}Save").addEventListener("click", () => {
            
        });
    }
}

function RunConfigurationCommand(setting){

}

function alignPrintHead() {
    document.getElementById("btnAlignPrinter").value = "Aligning...";
    setTimeout(() => {
        document.getElementById("btnAlignPrinter").value = "Align Printer";
    }, 3000);
    ipcRenderer.send('alignPrintHead', true);
}

function redirect(url) {
    ipcRenderer.send('redirect', url);
}