const usb = require('usb');
const Jimp = require('jimp');
const TscBuffer = require('./TscBuffer')
const TscPrinter = require('./TscPrinter')

class PrinterProvider {
    device: any;
    PrinterInterface: any;
    constructor(device) {
        this.device = device
    }
    claimInterface() {
        this.device.open();
        this.PrinterInterface = this.device.interface(0);
        if (/^linux/.test(process.platform) || /^android/.test(process.platform)) {
            if (this.PrinterInterface.isKernelDriverActive()) {
                try {
                    this.PrinterInterface.detachKernelDriver();
                } catch (e) {
                    console.error("[ERROR] Could not detach kernel driver: %s", e)
                }
            }
        }
        this.PrinterInterface.claim();
    }
    releaseInterface(){
        
    }
}

module.exports = PrinterProvider;