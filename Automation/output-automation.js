const puppeteer = require('puppeteer');
const program = require('commander');

program
  .command('start')
  .description('Start the script')
  .action(async () => {
    // Launch Headless Chrome
    const browser = await puppeteer.launch({
        headless: true, // run in headless mode
        timeout: 30000, // increase timeout to 30 seconds
      });
      

    // Set a flag to determine when to stop the loop
    let stop = false;

    // Start the loop
    while (!stop) {
      // Open a new page in Chrome
      const page = await browser.newPage();

      // Navigate to your page
      await page.goto('http://127.0.0.1:5500/Program/4/index.html');

      // Wait for the text file to be downloaded
      await page.waitForResponse(response => {
        return response.headers()['content-type'] === 'text/plain';
      });

      // Wait for the image file to be downloaded
      await page.waitForResponse(response => {
        return response.headers()['content-type'].startsWith('image/');
      });

      // Close the page
      await page.close();

      // Check the flag to see if the loop should be stopped
      if (stop) {
        // If the flag is set, close the browser and break out of the loop
        await browser.close();
        break;
      }
    }
  });

program
  .command('stop')
  .description('Stop the script')
  .action(() => {
    stop = true;
  });

program.parse(process.argv);
