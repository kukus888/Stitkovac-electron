npx electron-packager ./ Stitkovac
.\rcedit-x64.exe .\Stitkovac-win32-x64\Stitkovac.exe --set-version-string version "1.1.0"
.\rcedit-x64.exe .\Stitkovac-win32-x64\Stitkovac.exe --set-product-version "1.1.0"
cp ./config.json ./Stitkovac-win32-x64/config.json