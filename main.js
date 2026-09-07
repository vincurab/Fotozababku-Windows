const {app, BrowserWindow, dialog, ipcMain} = require('electron');
const fs = require('fs/promises');
const path = require('path');

function createWindow(){
  const win = new BrowserWindow({width:1500,height:950,minWidth:1050,minHeight:700,show:false,webPreferences:{preload:path.join(__dirname,'preload.js'),contextIsolation:true,nodeIntegration:false}});
  win.removeMenu();
  win.loadFile(path.join(__dirname,'index.html'));
  win.once('ready-to-show',()=>win.show());
}

ipcMain.handle('choose-directory',async()=>{
  const result=await dialog.showOpenDialog({properties:['openDirectory','createDirectory']});
  return result.canceled?null:result.filePaths[0];
});
ipcMain.handle('write-file',async(_event,{directory,subfolder,name,data})=>{
  const target=path.join(directory,subfolder||'');
  await fs.mkdir(target,{recursive:true});
  await fs.writeFile(path.join(target,path.basename(name)),Buffer.from(data));
  return true;
});
ipcMain.handle('close-app',()=>app.quit());

app.whenReady().then(createWindow);
app.on('window-all-closed',()=>app.quit());
