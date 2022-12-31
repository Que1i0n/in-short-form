#Persistent
<<<<<<< HEAD
SetTimer, CheckScreen, 100000

CheckScreen:
  ImageSearch, FoundX, FoundY, 0, 0, A_ScreenWidth, A_ScreenHeight, C:\Users\alexs\Documents\ChatGPT\Github Repository\in-short-form\Program\4\favicon.png
  if ErrorLevel = 0
  {
    SendInput, ^R
    SetTimer, CheckScreen, Off
  }
return
=======
SetTimer, CheckConsole, 100000

CheckConsole:
{
    ; Check the console for the message "Done!"
    If (InStr(clipboard, "Done!") > 0)
    {
        ; Refresh the webpage
        Send, ^R
	clipboard:= ""
    }
}
>>>>>>> c396b51a300fc19b27d000d7544a75c9842b44a2
