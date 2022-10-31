const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path')
const PrinterLabel = require('./TSC/Printing')
const PrinterBuffer = require('./TSC/TscBuffer')
const $ = require('jquery');
const { readyException } = require('jquery');

let devices = [];
let printer = new PrinterLabel(128, 64);
let win;
let config;

//https://www.electronjs.org/docs/latest/tutorial/tutorial-packaging
//https://www.electronjs.org/de/docs/latest/tutorial/window-customization

const createWindow = () => {
  win = new BrowserWindow({
    width: 1000,
    height: 600,
    title: "Stitkovac",
    webPreferences: {
      preload: path.join(app.getAppPath(), 'preload.js'),
      nodeIntegration: true
    }
  })

  win.loadFile('index.html')

  // Open the DevTools.
  //win.webContents.openDevTools()
}

function handleLoadCfg(event, data){
  let fs = require('fs');
  let configStr = fs.readFileSync("config.json", 'utf-8');
  config = JSON.parse(configStr);
  syncConfig();
}
function syncConfig(){
  win.webContents.send('sync-config', config);
}
function handleSaveConfig(event, data){
  let fs = require('fs');
  config = data
  let configStr = JSON.stringify(config);
  fs.writeFileSync("config.json", configStr)
}

function handlePrinterConfiguration(event, data) {
  //convert config data args to arguments
  let arg0, arg1, buffer;
  switch(data.arguments.length){
    case 0:
      buffer = PrinterBuffer[data.name]();
      break;
    case 1:
      arg0 = Object.values(data.arguments[0])[0];
      buffer = PrinterBuffer[data.name](arg0);
      break;
    case 2:
      arg0 = Object.values(data.arguments[0])[0];
      arg1 = Object.values(data.arguments[1])[0];
      buffer = PrinterBuffer[data.name](arg0, arg1);
      break;
    default:
      throw 'NotImplemented'
      break;
  }
  try{
    printer.write(buffer)
  }catch(e){
    win.webContents.send('printer-err', e)
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

function getWarehouseLocation(){
  let s = "";
  for(i=0;i<config.settings.length;i++){
    //looks for warehouse/location
    if(config.settings[i].name == "Warehouse / Location"){
      s = Object.values(config.settings[i].arguments[0])[0];
      s+= " / ";
      s+= Object.values(config.settings[i].arguments[1])[0];
      break;
    }
  }
  return s;
}

function handlePrintAll(event, data) {
  handleLoadCfg();
  try {
    devices.forEach(e => {
      printer.printLabel(e.CN, e.Model, e.IMEI, e.SN, e.SMSN, getWarehouseLocation(), config)
    });
  } catch (err) {
    win.webContents.send('printer-err', err)
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
  ipcMain.on('redirect', handleRedirection);
  ipcMain.on('load-config', handleLoadCfg);
  ipcMain.on('save-config', handleSaveConfig);
  ipcMain.on('config-command', handlePrinterConfiguration);
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
