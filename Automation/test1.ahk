#Persistent
SetTimer, CheckDownloads, 1000

CheckDownloads:
{
    ; Get the current list of downloads
    DownloadList := ComObjCreate("Shell.Application").NameSpace(3).Items()

    ; Get the name of the most recently downloaded file
    NewestFile := DownloadList.Item(DownloadList.Count).Name

    ; Check if the most recently downloaded file is different than the previous one
    If (NewestFile != OldestFile)
    {
        OldestFile := NewestFile
        ; Refresh the webpage
        Send, ^F5
    }
}
