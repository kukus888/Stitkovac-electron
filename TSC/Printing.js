const usb = require('usb');
const Jimp = require('jimp');
const TscBuffer = require('./TscBuffer')
const TscPrinter = require('./TscPrinter')

/*const deviceList = usb.getDeviceList();
console.log(`Found ${deviceList.length} device list`);
for (i=0;i< deviceList.length;i++){
  let dev = deviceList[i];
  if(dev.deviceDescriptor.idProduct === 274 && dev.deviceDescriptor.idVendor === 1203){
    //found correct printer, TSC 210
    console.log("Found!");
  }
  console.log(dev.deviceDescriptor.idProduct + " " + dev.deviceDescriptor.idVendor);
}*/

//Find TE210
const OurTSCPrinter = usb.findByIds(0x1203, 0x0274);
if (OurTSCPrinter === undefined) {
  //throw new Exception("Printer not recognized");
}
const xPrinterDev = new TscPrinter(OurTSCPrinter);

//May want to install Zadig driver if LIBUSB_ERROR_NOT_SUPPORTED
// https://zadig.akeo.ie/#google_vignette
// https://coffee-web.ru/blog/how-to-print-labels-with-tspl-and-javascript/

/*const printImage = async () => {
  const imgPath = './assets/sample-image.jpg';
  const img = await Jimp.read(imgPath);
  const buffer = await TscBuffer.bitmap(0, 0, img.bitmap)
  await xPrinterDev.Write(Buffer.concat([
    TscBuffer.cls(),
    buffer,
    TscBuffer.print(1)
  ]));
}*/

const printText = (QR, BigText, Text1, Text2, Text3, Text4) => {
  let data = Buffer.concat([
    TscBuffer.sizeBymm(32, 16),
    TscBuffer.cls(),
    TscBuffer.qrCode(10, 10, "M", 5, "A", 0, QR),
    TscBuffer.text(130, 10, 3, 0, 1, 1, BigText),
    TscBuffer.text(130, 44, 1, 0, 1, 1, Text1),
    TscBuffer.text(130, 58, 1, 0, 1, 1, Text2),
    TscBuffer.text(130, 72, 1, 0, 1, 1, Text3),
    TscBuffer.text(130, 86, 1, 0, 1, 1, Text4),
    TscBuffer.text(130, 100, 1, 0, 1, 1, QR),
    TscBuffer.print(1)
  ])
  xPrinterDev.Write(data)
}
const printing = async (...arguments) => {
  await printText(...arguments);
}

/*const printBarcode = () => {
  [
    TscBuffer.sizeBymm(32,16),
    TscBuffer.cls(),
    TscBuffer.barCode(32,16,"128",100,1,0,2,2,"Hello there"),
    TscBuffer.print(1)
  ].forEach(data => xPrinterDev.Write(data));
}*/

class Printer {
  labelWidthPts = 128;
  labelHeightPts = 64;
  /**
   * Creates a new printer class with defined label size
   * @param {Number} labelWidth Width of the label in points
   * @param {Number} labelHeight Height of the label in points
   */
  constructor(labelWidth, labelHeight) {
    this.labelWidthPts = labelWidth;
    this.labelHeightPts = labelHeight;
  }
  /**
   * Prints labels as fast as possible
   * @param {String} QR String to be encoded in QR
   * @param {String} BigText Big Text, 5 chars max
   * @param {String} Text1 Smaller text, 12 chars max
   * @param {String} Text2 Smaller text, 12 chars max
   * @param {String} Text3 Smaller text, 12 chars max
   * @param {String} Text4 Smaller text, 12 chars max
   */
  async printLabel(QR, BigText, Text1, Text2, Text3, Text4) {
    await printText(QR, BigText, Text1, Text2, Text3, Text4);
  }
  /**
   * Prints labels. Do not use from outside the class
   * @param {String} QR String to be encoded in QR
   * @param {String} BigText Big Text, 5 chars max
   * @param {String} Text1 Smaller text, 12 chars max
   * @param {String} Text2 Smaller text, 12 chars max
   * @param {String} Text3 Smaller text, 12 chars max
   * @param {String} Text4 Smaller text, 12 chars max
   */
  #printText(QR, BigText, Text1, Text2, Text3, Text4) {
    let data = Buffer.concat([
      TscBuffer.sizeBymm(32, 16),
      TscBuffer.cls(),
      TscBuffer.qrCode(10, 40, "M", 5, "A", 0, QR),
      TscBuffer.text(130, 40, 4, 0, 1, 1, BigText),
      TscBuffer.text(130, 74, 1, 0, 1, 1, Text1),
      TscBuffer.text(130, 88, 1, 0, 1, 1, Text2),
      TscBuffer.text(130, 102, 1, 0, 1, 1, Text3),
      TscBuffer.text(130, 116, 1, 0, 1, 1, Text4),
      TscBuffer.text(130, 130, 1, 0, 1, 1, QR),
      TscBuffer.print(1)
    ])
    xPrinterDev.Write(data)
  }
  /**
   * Automagically aligns print head
   */
  autoAlignHead() {
    [
      TscBuffer.autoDetect(this.labelWidthPts, this.labelHeightPts)
    ].forEach(data => xPrinterDev.Write(data));
  }
  /**
   * Back rolls the printer by 80 points
   */
  backRoll() {
    [
      TscBuffer.backFeed(80)
    ].forEach(data => xPrinterDev.Write(data));
  }
}

module.exports = Printer;