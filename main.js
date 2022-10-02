const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path')
const Printer = require('./TSC/Printing')
const $ = require('jquery');
const { readyException } = require('jquery');

let devices = [];
let printer = new Printer(128, 64);
let win;
let config;

//https://www.electronjs.org/docs/latest/tutorial/tutorial-packaging

const createWindow = () => {
  win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(app.getAppPath(), 'preload.js'),
      nodeIntegration: true
    }
  })

  win.loadFile('index.html')

  // Open the DevTools.
  //win.webContents.openDevTools()
}

function handleFrontEndRequest(event, data) {
  switch(data.request){
    case "syncDevices":
      break;
    case "redirect":
      
      break;
    default:
      throw Error("Chyba lol");
      break;
  }
}

function handleRedirection(event, data){
  //handles redirection to other page
  if(data === 'home'){
    win.loadFile(`index.html`)
  }else{
    win.loadFile(`${data}`)
  }
}

function handleSyncingDevices(event, data) {
  devices = data;
}

function handlePrintAll(event, data) {
  try {
    devices.forEach(e => {
      printer.printLabel(e.CN, e.Model, e.IMEI, e.SN, e.SMSN, "PRA2 / PRTN")
    });
    win.webContents.send('printer-err', false)
  } catch (err) {
    win.webContents.send('printer-err', true)
  }
}

function handleAligningPrintHead(event, data) {
  if (data === true) {
    printer.autoAlignHead();
  }
}

function handleLoadCfg(event, data){
  JSON.parse('config.json');
}

app.whenReady().then(() => {
  ipcMain.on('printAll', handlePrintAll);
  ipcMain.on('alignPrintHead', handleAligningPrintHead);
  ipcMain.on('sync-dev', handleSyncingDevices);
  ipcMain.on('redirect', handleRedirection);
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
