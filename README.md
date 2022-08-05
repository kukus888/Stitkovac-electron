# TSC TE2xx Printer app
This is an printer app made with electron for TSC TE200 and TE210 printers.

### Labels
App currently supports only hard coded 128x64 (32mm x 16mm) labels.

---

### Installation
1. Clone the repository
2. Initialize with `npm init`
3. Build with `build.bat`
4. Run .exe from `Stitkovac-win32-x64/Stitkovac.exe`

### Zadig
In order for the printer to function properly, WinUSB driver must be installed:
1. Download driver from [here](https://zadig.akeo.ie/)
2. Run Zadig
3. Enable List all devices in `Options > List All Devices`
4. Find `USB Printing Support`. The USB ID should be `1203 0274` for TSC TE210.
5. Click Install driver
6. Reboot computer
The PC now should be ready to work with Stitkovac-electron. There may be issues when installing Zadig on corporate computers with ESCORT. In that case, the driver is installed but is NOT ENABLED. Go to Device manager in windows, find USB Printing Support, and try activating it. If it cannot be activated, fill in approval on IT4U for USB printing support (Printer USB).

### References
This program is based on [tsc-printer-js](https://github.com/ThinhVu/tsc-printer-js), and is using [this](http://www.kroyeuropedownload.com/English_User_Manuals/TSPL_TSPL2_Programming_Jan_2017.pdf) amazing guide.