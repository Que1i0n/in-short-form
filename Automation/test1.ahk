#Persistent
SetTimer, CheckConsole, 1000

CheckConsole:
{
    ; Check the console for the message "Done!"
    If (InStr(clipboard, "Done!") > 0)
    {
        ; Refresh the webpage
        Send, ^+R
	clipboard:= ""
    }
}
