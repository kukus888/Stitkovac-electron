class Device {
    CN;
    Model;
    IMEI;
    SN;
    SMSN;
    constructor(CN, Model, IMEI, SN, SMSN) {
        this.CN = CN;
        this.Model = Model;
        this.IMEI = IMEI;
        this.SN = SN;
        this.SMSN = SMSN;
    }
}

//create an empty array for devices
let devices = []

//Bind all necessary clicks
document.getElementById("btnAddItem").addEventListener("click", () => {
    btnAddRow();
});
document.getElementById("btnPrintAll").addEventListener("click", () => {
    printAll();
});
document.getElementById("btnProcessCSV").addEventListener("click", () => {
    parseCSV();
});
document.getElementById("btnOpenSettings").addEventListener("click", () => {
    redirect('settings.html');
});
document.getElementById("btnClearAll").addEventListener("click", () => {
    for (i = 0; i < document.getElementsByTagName("tr").length; i++) {
        if (document.getElementsByTagName("tr").item(i).id.includes("devTr")) {
            document.getElementsByTagName("tr").item(i).remove();
        }
    }
});

//create a div for error message when printer is not connected etc...
let printerErrMsg = document.createElement('div')
printerErrMsg.id = "printerErrMsg";
printerErrMsg.innerText = "There was an issue reaching the printer."
printerErrMsg.classList.add("alert", "alert-danger", "align-middle", "m-0", "px-3", "py-2", "d-none")
document.getElementById("topNavBar").appendChild(printerErrMsg)
//bind the error throwing to the message
window.electronAPI.handlePrinterErr((event, value) => {
    console.error(data)
    try {
        document.getElementById("printerErrMsg").classList.replace("d-none", "visible")
    } catch (error) { }
    //document.getElementById("printerErrMsg").classList.replace("visible", "d-none")
});

function btnAddRow() {
    let CN = document.querySelector("#inputNewCN").value;
    let Model = document.querySelector("#inputNewModel").value;
    let IMEI = document.querySelector("#inputNewIMEI").value;
    let Serial = document.querySelector("#inputNewSerial").value;
    let SMSN = document.querySelector("#inputNewSMSN").value;

    //Reset values
    document.querySelector("#inputNewCN").value = "";
    document.querySelector("#inputNewModel").value = "";
    document.querySelector("#inputNewIMEI").value = "";
    document.querySelector("#inputNewSerial").value = "";
    document.querySelector("#inputNewSMSN").value = "";
    let device = new Device(CN, Model, IMEI, Serial, SMSN)
    addRow(device)
}

function addRow(device) {

    //TODO: CHeck for CN collisions

    devices.push(device)
    let index = devices.length - 1;
    //console.log({ index, CN, Model, IMEI, Serial, SMSN });

    let idRmvBtn = "btnRmvDev" + index;
    let idTr = "devTr" + index;

    let elementStr = `<td class="align-middle">${index}</td>
                    <td class="align-middle">
                        ${device.CN}
                    </td>
                    <td class="align-middle">
                    ${device.Model}
                    </td>
                    <td class="align-middle">
                    ${device.IMEI}
                    </td>
                    <td class="align-middle">
                    ${device.SN}
                    </td>
                    <td class="align-middle">
                    ${device.SMSN}
                    </td>
                    <td>
                        <button class="btn btn-outline-secondary" id="${idRmvBtn}">X</button>
                    </td>
    `;
    let newTr = document.createElement('tr');
    newTr.id = idTr;
    document.getElementById("datatableBody").appendChild(newTr);
    document.getElementById(idTr).innerHTML += elementStr;

    document.getElementById(idRmvBtn).addEventListener("click", () => {
        let delInd = devices.findIndex(x => x.CN === device.CN);
        devices.splice(delInd, 1)
        document.getElementById(idTr).remove();
    });
}

function parseCSV() {
    let data = document.getElementById("textboxCSV").value
    let lines = data.split('\n')
    //CN, Model, IMEI, SN, SMSN
    lines.forEach(line => {
        if (line != "") {
            let CN = line.split(',')[0].toString()
            let Model = line.split(',')[1].toString()
            if(Model.startsWith("S-")){
                Model = Model.replace("S-","");
            }
            if(Model.endsWith("-1")){
                Model = Model.replace("-1","");
            }
            if (Model === "undefined") {
                Model = ""
            }
            let IMEI = line.split(',')[2].toString()
            if (IMEI === "undefined") {
                IMEI = ""
            }
            let SN = line.split(',')[3].toString()
            if ((IMEI.length > 12) /*&& ((SN === undefined) || (SN === "") || (SN === "undefined"))*/) {
                //SN = IMEI.slice(12, IMEI.length)
                IMEI = "*" + IMEI.slice(-11)
            }
            if (SN === "undefined") {
                SN = ""
            }
            let SMSN = line.split(',')[4].toString()
            if (SMSN === "undefined") {
                SMSN = ""
            }
            let dev = new Device(CN, Model, IMEI, SN, SMSN)
            addRow(dev)
        }
    })
}

function printAll() {
    ipcRenderer.send('sync-dev', devices);
    ipcRenderer.send('printAll', true);
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