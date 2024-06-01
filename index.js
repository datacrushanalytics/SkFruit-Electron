// const { app, BrowserWindow } = require('electron');
// const path = require('path');

// // Handle creating/removing shortcuts on Windows when installing/uninstalling.
// if (require('electron-squirrel-startup')) {
//   app.quit();
// }

// const createWindow = () => {
//   // Create the browser window.
//   const mainWindow = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {
//       preload: path.join(__dirname, 'preload.js'),
//     },
//   });

  

//   // and load the index.html of the app.
//   mainWindow.loadFile(path.join(__dirname, "section/index.html"));

//   // Open the DevTools.
//   mainWindow.webContents.openDevTools();
// };

// // This method will be called when Electron has finished
// // initialization and is ready to create browser windows.
// // Some APIs can only be used after this event occurs.
// app.on('ready', createWindow);

// // Quit when all windows are closed, except on macOS. There, it's common
// // for applications and their menu bar to stay active until the user quits
// // explicitly with Cmd + Q.
// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });

// app.on('activate', () => {
//   // On OS X it's common to re-create a window in the app when the
//   // dock icon is clicked and there are no other windows open.
//   if (BrowserWindow.getAllWindows().length === 0) {
//     createWindow();
//   }
// });






// const { app, BrowserWindow } = require('electron');
// const path = require('path');

// // Handle creating/removing shortcuts on Windows when installing/uninstalling.
// if (require('electron-squirrel-startup')) {
//   app.quit();
// }

// const createWindow = () => {
//   // Create the browser window.
//   const mainWindow = new BrowserWindow({
//     width: 800,
//     height: 600,
//     icon: path.join(__dirname, '/logo.png'),
//     webPreferences: {
//       preload: path.join(__dirname, 'preload.js'),
//       // Allow all operations on the specified IP address
//       contentSecurityPolicy: "default-src 'self' http://65.2.144.249:*",
//     },
//   });

//   // Load the index.html of the app.
//   mainWindow.loadFile(path.join(__dirname, "section/index.html"));

//   // Open the DevTools.
//   // mainWindow.webContents.openDevTools();
// };

// // This method will be called when Electron has finished
// // initialization and is ready to create browser windows.
// // Some APIs can only be used after this event occurs.
// app.on('ready', createWindow);

// // Quit when all windows are closed, except on macOS.
// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });

// app.on('activate', () => {
//   // On macOS, re-create a window when the dock icon is clicked and no other windows are open.
//   if (BrowserWindow.getAllWindows().length === 0) {
//     createWindow();
//   }
// });




const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        // Set the icon for the application
        icon: path.join(__dirname, './assets/img/logo.png'), // Adjust the path accordingly
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadFile('section/index.html');
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});



