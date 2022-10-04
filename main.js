const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path')
const Printer = require('./TSC/Printing')
const $ = require('jquery');

let devices = [];
let printer = new Printer(128, 64);
let win;

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

function handleSyncingDevices(event, data) {
  devices = data;
}

function handlePrintAll(event, data) {
  try {
    devices.forEach(e => {
      printer.printLabel(e.CN, e.Model, e.IMEI, e.SN, e.SMSN, "BRA1 / BRTN")
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

app.whenReady().then(() => {
  ipcMain.on('printAll', handlePrintAll);
  ipcMain.on('alignPrintHead', handleAligningPrintHead);
  ipcMain.on('sync-dev', handleSyncingDevices);
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
