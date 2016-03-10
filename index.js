const app = require('app')
const BrowserWindow = require('browser-window')

require('electron-reload')(__dirname)

app.on('ready', function() {
  var mainWindow = new BrowserWindow({
    width: 1024, height: 512
  })

  mainWindow.loadURL('file://' + __dirname + '/index.html')
  mainWindow.openDevTools()
})
