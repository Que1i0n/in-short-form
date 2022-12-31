#Persistent
SetTimer, CheckScreen, 100000

CheckScreen:
  ImageSearch, FoundX, FoundY, 0, 0, A_ScreenWidth, A_ScreenHeight, C:\Users\alexs\Documents\ChatGPT\Github Repository\in-short-form\Program\4\favicon.png
  if ErrorLevel = 0
  {
    SendInput, ^R
    SetTimer, CheckScreen, Off
  }
return