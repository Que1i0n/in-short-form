import subprocess
import os
import requests

# Set the initial file count to 0
file_count = 0

# Open an instance of the browser
subprocess.run(["C:\Program Files\Google\Chrome\Application\chrome.exe", "http://127.0.0.1:5500/Program/4/index.html"])

while True:
    # Get a list of files in the current directory
    files = os.listdir()

    # Increment the file count for each .txt and .png file in the current directory
    for file in files:
        if file.endswith(".txt") or file.endswith(".png"):
            file_count += 1

    # Print the file count
    print(f"Number of files downloaded: {file_count}")

    # If the file count has reached 50, exit the loop
    if file_count == 50:
        break

    # If the file count has reached a multiple of 2, send an HTTP request to the webpage to reload it
    if file_count % 2 == 0:
        requests.get("http://127.0.0.1:5500/Program/4/index.html")
