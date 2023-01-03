let boxSize = 100;
//drawBoxes(boxSize);
function drawBoxes(boxSize) {
    // Get the canvas element
    const canvas = document.getElementById("canvas2");
    // Set the width and height of the canvas to match the size of the color array
    let colorArray = Pallette;
    canvas.width = colorArray[0].length * boxSize;
    canvas.height = colorArray.length * boxSize;
      // Iterate over the rows and columns of the color array
    for (let i = 0; i < colorArray.length; i++) {
      for (let j = 0; j < colorArray[i].length; j++) {
        // Get the coordinates of the current box
        const x1 = j * boxSize;
        const y1 = i * boxSize;
        const x2 = (j + 1) * boxSize;
        const y2 = (i + 1) * boxSize;
        // Fill the box with the specified color
        ctx.fillStyle = colorArray[i][j];
        ctx.fillRect(x1, y1, boxSize, boxSize);
        // Draw a white line between each box in the same row
        if (j > 0) {
          ctx.strokeStyle = "white";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x1, y2);
          ctx.stroke();
        }
        // Draw a grey line between each row of boxes
        if (i > 0) {
          ctx.strokeStyle = "#808080";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y1);
          ctx.stroke();
        }
      }
    }
      // Draw a black outline around the entire set of boxes
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    // Create an anchor element and set its href attribute to the data URL of the canvas
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/jpeg");
    // Set the download attribute of the anchor element to the file name
    a.download = `${fxhash}.jpg`;
    // Click the anchor element to initiate the download
    a.click();
    // Reset the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

         // drawBoxes(Pallette, 100);
