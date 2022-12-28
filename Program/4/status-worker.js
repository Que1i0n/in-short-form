let isCalculating = false;
let hasError = false;
let statusMessage = '';
let previousStatusMessage = '';

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
  const { statusMessage: newStatusMessage, hasError: newHasError, isCalculating: newIsCalculating } = event.data;

  // Update the status variables
  statusMessage = newStatusMessage;
  hasError = newHasError;
  isCalculating = newIsCalculating;

  // Update the status message and color
  if (statusMessage !== previousStatusMessage) {
    console.log(statusMessage);
    previousStatusMessage = statusMessage;
  }

  if (hasError) {
    console.log("error");
    self.postMessage('red');
  } else if (isCalculating) {
    console.log("calculating");
    self.postMessage('yellow');
  } else {
    console.log("calculated");
    self.postMessage('green');
  }
});
