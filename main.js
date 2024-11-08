const { app, BrowserWindow, Menu } = require("electron");
const path = require("node:path");
const childProcess = require('child_process');

const isDev = process.env.NODE_ENV === "dev";
const menu = [];

const createMainWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    icon: path.join(__dirname, "images/chapo-icon-linux.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: true,
    },
  });

  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "renderer/index.html"));

  // Open the DevTools.
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  if (process.platform === 'win32' && !isDev) {
    // Run the batch file
    childProcess.exec('run_llama_server_for_chapo.bat', (error) => {
      if (error) {
        console.error('Error running batch file:', error);
      } else {
        console.log('Batch file executed successfully');
      }
    });
  }

  createMainWindow();

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
