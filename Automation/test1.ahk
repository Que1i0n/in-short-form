CheckConsole:
{
    ; Get the title of the active window
    activeTitle := WinGetActiveTitle()

    ; Check the console for the message "Done!"
    If (InStr(clipboard, "Done!") > 0)
    {
        ; If the active window is not the desired webpage, activate it
        If (activeTitle != "http://127.0.0.1:5500/Program/4/index.html")
        {
            WinActivate, http://127.0.0.1:5500/Program/4/index.html
        }

        ; Refresh the webpage
        Send, ^R
    }
}

