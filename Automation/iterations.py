from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Create a new Chrome browser and go to the specified page
driver = webdriver.Chrome()
driver.get("http://127.0.0.1:5500/Program/4/index.html")

# Wait until the specified element is present on the page
wait = WebDriverWait(driver, 10) # Wait up to 10 seconds
element = wait.until(EC.presence_of_element_located((By.ID, "element-id")))

# Reload the page a few seconds later
driver.refresh()

# Close the browser
driver.quit()