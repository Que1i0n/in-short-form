
const initTime = Date.now();
const date = new Date(initTime);
const year = date.getFullYear();
const month = `0${date.getMonth() + 1}`.slice(-2);
const day = `0${date.getDate()}`.slice(-2);
const hours = `0${date.getHours()}`.slice(-2);
const minutes = `0${date.getMinutes()}`.slice(-2);
const formattedDate = `${year}/${month}/${day} | ${hours}:${minutes}`;
const startTime = formattedDate;
const canvas = document.getElementById("canvas");
canvas.width = 3840;  // 4K resolution
canvas.height = 2160;
const ctx = canvas.getContext("2d");
let angledRectangles = [];
let ProportionChance = [1];
let prngno = 0.1;
let Pallettes = ["#122C34"];
let blendMode = "normal";

function downloadMetadata() {
    const start = new Date(startTime);
    let metadata = `Rectangles: `;
    
    // Add each phrase to the metadata string
    for (let i = 0; i < angledRectangles.length; i++) {
        metadata += `${i + 1}. ${JSON.stringify(angledRectangles[i])}\n`;
      }
      
    
    // Add the remaining metadata to the string
    metadata += 
    `startTime: ${start}`
    ;
    
    const metadataBlob = new Blob([metadata], {type: 'text/plain'});
    const metadataUrl = URL.createObjectURL(metadataBlob);
    const metadataLink = document.createElement("a");
    metadataLink.href = metadataUrl;
    metadataLink.download = `${fileName}.txt`;
    document.body.appendChild(metadataLink);
    metadataLink.click();
    document.body.removeChild(metadataLink);
    
    }

    function colorCanvasAngled() {
        angledRectangles = [];
        totalRotationAngle = 0;
    
        for (let i = 0; i < ProportionChance.length; i++) {
          const angle = (ProportionChance[i] / prngno) * 360;
          ctx.rotate(angle);
          totalRotationAngle += angle; // Increment total rotation angle by angle that each rectangle is rotated by
          const totalPercentage = ProportionChance.reduce((sum, percentage) => {
            return sum + parseInt(percentage);
          }, 0);
          const segmentHeight = canvas.width / totalPercentage;
          for (let i = 0; i < Pallettes.length; i++) {
            const colors = Pallettes[i];
            const angle = (ProportionChance[i] / totalPercentage) * 360;
            ctx.globalCompositeOperation = blendMode;
            angledRectangles[i] = [];
            for (let y = 0; y < canvas.width; y+=5) {
                angledRectangles[i][y]= [];
                console.log("y");for (let x = 0; x < canvas.width; x+=5) {
                ctx.rotate(angle);
                const color = "#122C34";
                angledRectangles[i][y].push({ // Push rectangle data to array
                  x,
                  color,
                });
              }
            }
            ctx.rotate(-angle);
          }
        }
        console.log(totalRotationAngle);
    }
    


colorCanvasAngled();
let fileName = `${startTime} - ${fxhash}`
downloadMetadata(fileName)



/*
function colorCanvas(ctx, Pallettes, ProportionChance, blendMode) {
  const totalPercentage = ProportionChance.reduce((sum, percentage) => {
    return sum + parseInt(percentage);
  }, 0);
  //const segmentSize = Math.max(canvas.width, canvas.height) / totalPercentage; 
  let lastX = 0;
  let lastY = 0;
  let lastHeight = 0;
  let a = nozeroArray(prngno);
  for (let i = 0; i < Pallettes.length; i++) {
    console.log("lastX: ", lastX);
    console.log("lastY: ", lastY);
    let colors = Pallettes[i];   
    let x = lastX;
    let y = lastY + parseInt(ProportionChance[i]*i);
    let width = Math.min((canvas.width / totalPercentage) * parseInt(ProportionChance[i]), canvas.width);
    let height = Math.min(((lastHeight+a[i]+a[i+1]) * ProportionChance[i]), canvas.height);
    lastX += width*.5;
    lastY += y;
    lastHeight += height;
    rectangles.push({
      x,
      y,
      width,
      height,
      color: colors[0]
    });
  }
  console.log(rectangles);
 

    function moreRectanglesToDraw() {
      // Return true if there are more rectangles to draw, false otherwise
      return currentRectangleIndex < rectangles.length;
    }
    function drawRectangles() {
      // Draw the first batch of rectangles
      drawRectangle();
    
      // Schedule the next batch of rectangles to be drawn
      requestAnimationFrame(drawNextRectangle);
    }
    function drawRectangle() {
      for (let i = 0; i < pixelBatch; i += 1) {
        ctx.globalCompositeOperation = blendMode;
        ctx.fillStyle = rectangles[i].color;
        ctx.fillRect(rectangles[i].x, rectangles[i].y, rectangles[i].width, rectangles[i].height);
      
      }
    }
    
    function drawNextRectangle() {
      // Draw the next batch of rectangles
      for (let i = currentRectangleIndex; i < currentRectangleIndex + pixelBatch && i < rectangles.length; i++) {
        ctx.globalCompositeOperation = blendMode;
        ctx.fillStyle = rectangles[i].color;
        ctx.fillRect(rectangles[i].x, rectangles[i].y, rectangles[i].width, rectangles[i].height);
      }
    
      // Update the index of the next rectangle to draw
      currentRectangleIndex += pixelBatch;
    
      // Schedule the next batch of rectangles to be drawn, if there are more rectangles
      if (moreRectanglesToDraw()) {
        requestAnimationFrame(drawNextRectangle);
      }
    }
    
    drawRectangles();

    let filename = `${startTime} - ${fxhash} - ${noZero(prngno)}`
    downloadCanvas(filename)
}

    */