#Persistent
SetTimer, CheckConsole, 10000

CheckConsole:
{
    ; Check the console for the message "Done!"
    If (InStr(clipboard, "Done!") > 0)
    {
        ; Refresh the webpage
        Send, ^R
    }
}
