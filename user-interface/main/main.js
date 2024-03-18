const { app, BrowserWindow } = require("electron");
const serve = require("electron-serve");
const path = require("path");

const appServe = app.isPackaged ? serve({
  directory: path.join(__dirname, "../out")
}) : null;

const fetchData = async () => {
    const url = 'http://localhost:5000/reports';
    try {
      const response = await new Promise((resolve, reject) => {
        const req = net.request(url);
        req.on('response', (resp) => {
          if (resp.statusCode !== 200) {
            reject(new Error(`API request failed with status: ${resp.statusCode}`));
          }
          let data = '';
          resp.on('data', (chunk) => {
            data += chunk;
          });
          resp.on('end', () => {
            // file deepcode ignore ExtractPortToVariable: <Low Severity>
            resolve(JSON.parse(data));
          });
        });
        req.on('error', (error) => {
          reject(error);
        });
        req.end();
      });
      return response;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
};

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });

  if (app.isPackaged) {
    // file deepcode ignore PromiseNotCaughtNode: <Low Severity>
    appServe(win).then(() => {
      win.loadURL("app://-");
    });
  } else {
    // deepcode ignore ElectronLoadInsecureContent: <Low Severity>
    win.loadURL("http://localhost:3000");
    win.webContents.openDevTools();
    win.webContents.on("did-fail-load", (e, code, desc) => {
      win.webContents.reloadIgnoringCache();
    });
  }

  fetchData().then((data) => {
    win.webContents.send('api-data', data);
  });
}

app.on("ready", () => {
    createWindow();
});

app.on("window-all-closed", () => {
    if(process.platform !== "darwin"){
        app.quit();
    }
});