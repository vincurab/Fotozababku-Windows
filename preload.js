const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('desktopFiles',{
  chooseDirectory:()=>ipcRenderer.invoke('choose-directory'),
  writeFile:(directory,subfolder,name,data)=>ipcRenderer.invoke('write-file',{directory,subfolder,name,data}),
  close:()=>ipcRenderer.invoke('close-app')
});
