const initTime = Date.now();
const date = new Date(initTime);
const year = date.getFullYear();
const month = `0${date.getMonth() + 1}`.slice(-2);
const day = `0${date.getDate()}`.slice(-2);
const hours = `0${date.getHours()}`.slice(-2);
const minutes = `0${date.getMinutes()}`.slice(-2);
const formattedDate = `${year}/${month}/${day} | ${hours}:${minutes}`;
const startTime = formattedDate;

//const canvas = document.getElementById("canvas");
//canvas.width = 3840;  // 4K resolution
//canvas.height = 2160;
//const ctx = canvas.getContext("2d");
let prngno = fxrand();
let diceArray = nozeroArray(prngno);
let diceQuant = diceArray[0];
let Phrases = getPhrases("Genesis.txt", diceQuant);
let Pallettes = [];
let palletteDepth = diceQuant;
const blendModes = ['color-dodge','color-dodge', 'lighten', 'darken', 'color-dodge'];
let blendMode = blendModes[Math.floor(prngno * blendModes.length)];
const width = window.innerWidth;
const height = window.innerHeight;
//let color = Pallettes[diceQuant];

let ProportionChance = getStringLengths(Phrases);
let iterations = ((ProportionChance.length - 1) * (4)) / (8) + 2;

Phrases.forEach(phrase => {
  const hexColors = sentenceToHexColors(phrase);
  let shortenedColors = getRandomColors(hexColors, palletteDepth);  // <--- colour pallette depth
  Pallettes.push(shortenedColors);
});


const angledRectangles = [];

//ctx.strokeStyle = "#567";
//ctx.lineWidth = .1;
//ctx.fillStyle = "#fff";
// Initialize v array
let v = [
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}mm" height="${height}mm">\n`,
  ,
  //`<rect x="${-H * Y}" y="${-H}" width="${H * Y * 3}" height="${H * 3}" fill="#ffffff"/>`
];



// Create an image element, set its source to the encoded SVG, and then replace the children of B element with the new image
//(im = new Image()).src = `data:image/svg+xml,` + encodeURIComponent(v.join`\n`);
//im.decode().then((_) => {
//  B.replaceChildren(im);
//});



function optimiseRectangles(rectangles) {  
  for (let i = 0; i < rectangles.length - 1; i++) {
    const currentRect = rectangles[i];
    const nextRect = rectangles[i + 1];
    if (currentRect.color === nextRect.color) {
      if (currentRect.x === nextRect.x && currentRect.y + currentRect.height === nextRect.y) {
        // Combine rectangles in the same column
        currentRect.height += nextRect.height;
        rectangles.splice(i + 1, 1);
        i--;
      } else if (currentRect.y === nextRect.y && currentRect.x + currentRect.width === nextRect.x) {
        // Combine rectangles in the same row
        currentRect.width += nextRect.width;
        rectangles.splice(i + 1, 1);
        i--;
      }
    }
  

  return rectangles;
}
}
function downloadMetadata(fileName) {
const start = new Date(startTime);
let metadata = `svg: `;

// Add each phrase to the metadata string
//for (let i = 0; i < angledRectangles.length; i++) {
//    metadata += `${i + 1}. ${JSON.stringify(angledRectangles[i])}\n`;
//  }
  
metadata += v;

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
function noZero(prngno) {
  const parts = String(prngno).split('.');
  const digits = parts[1] ? parts[1].split('') : [];
  for (let i = 0; i < digits.length; i++) {
    if (digits[i] !== '0') {
      return digits[i] === '1' ? 1 : parseInt(digits[i]);
      //return parseInt(digits[i]);
    }
  }
  if (parts[0]) {
    const digits = parts[0].split('');
    for (let i = 0; i < digits.length; i++) {
      if (digits[i] !== '0') {
        return digits[i] === '1' ? 1 : parseInt(digits[i]);
        //return parseInt(digits[i]);
      }
    }
  }

  // If no non-zero digits were found, log an error message to the console and return 1
  console.error('No non-zero digits found');
  return 1;
}
function nozeroArray(prngno) {
  const parts = String(prngno).split('.');
  const digits = parts[1] ? parts[1].split('') : [];
  let nonZeroDigits = [];
  for (let i = 0; i < digits.length; i++) {
    if (digits[i] !== '0') {
      nonZeroDigits.push(parseInt(digits[i]));
    }
  }
  if (parts[0]) {
    const digits = parts[0].split('');
    for (let i = 0; i < digits.length; i++) {
      if (digits[i] !== '0') {
        nonZeroDigits.push(parseInt(digits[i]));
      }
    }
  }

  // If no non-zero digits were found, log an error message to the console and return an array with a single element 1
  if (nonZeroDigits.length === 0) {
    console.error('No non-zero digits found');
    return [1];
  }

  return nonZeroDigits;
}
  function getPhrases(filePath, number) {
  const reading = [];
  const rawFile = new XMLHttpRequest();
  rawFile.open("GET", filePath, false);
  rawFile.onreadystatechange = function() {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status == 0) {
        const textData = rawFile.responseText;
        const rows = textData.split('\n');
        var startRow = 0;
        var skipInterval = 1;
        const numDice = number;
        const numPhrases = numDice > 0 ? numDice : 1;
        for (let i = 0; i < numDice; i++) {
          const roll = Math.floor(fxrand() * 6) + 1;
          startRow += roll;
          skipInterval *= roll;
        }

        for (let i = 0; i < numPhrases; i++) {
          const index = (startRow + i * skipInterval) % rows.length;
          reading.push(rows[index]);
        }
      }    
    }
  };

  rawFile.send(null);
  return reading;
}
function sentenceToHexColors(sentence) {
  sentence = sentence.replace(/\d+:\d+\s/, '');
  const hexColors = [];
  const chars = sentence.split('');  
  let numDigits = 0;
  chars.forEach(char => {
    const asciiCode = char.charCodeAt(0);
    let hexCode = asciiCode.toString(16);
    while (hexCode.length < 6 && numDigits + 1 < chars.length) {
      hexCode = hexCode + chars[numDigits + 1].charCodeAt(0).toString(16);
      numDigits += 2;
    }

    if (hexCode.length === 6) {
      hexColors.push('#' + hexCode);
    }
  });
  return hexColors;
}
function getRandomColors(colors, numColors) {
  const rsColors = [];
  for (let i = 0; i < numColors; i++) {
    let index = Math.floor(prngno * colors.length);
    let counter = 0;
    while (rsColors.includes(colors[index])) {
    index = Math.floor(prngno * colors.length);
    counter++;
    if (counter > 3) {
    break;
    }
    }
    rsColors.push(colors[index]);
    colors.splice(index, 1); // <--- remove the chosen color from colors
    }
  return rsColors;
}
function getStringLengths(strings) {
  const totalLength = strings.reduce((sum, str) => sum + str.length, 0);
  const proportionSum = strings.reduce((sum, str) => sum + (str.length / totalLength), 0);
  return strings.map(str => (str.length / totalLength) / proportionSum * 100);
}
function colorCanvasNew(ProportionChance) {
  console.log(prngno);
  console.log(diceArray);
  console.log(diceQuant);
  console.log(Phrases);
  console.log(getStringLengths(Phrases));
  console.log(ProportionChance)


  // Calculate the total percentage
  const totalPercentage = ProportionChance.reduce((sum, percentage) => {
    return sum + parseInt(percentage);
  }, 0);

  // Initialize the x and y coordinates arrays
  const xCoords = [0, ];
  const yCoords = [0, ];

  // Initialize the lastWidth and lastHeight variables
  let lastWidth = Math.min((width / totalPercentage) * parseInt(ProportionChance[0]), width);
  let lastHeight = Math.min((height / totalPercentage) * parseInt(ProportionChance[0]), height);

  for (let i = 0; i < iterations; i++) {
    let colors = Math.min(Pallettes[i], diceQuant);

    // Generate random width and height for the bar
    let wdth = Math.min(lastWidth, width);
    let hight = Math.min(lastHeight, height) / (i + 1);

    // Set x to 0 and y to a random value
    let x = (1 / diceArray[i]) * (width - wdth);
    let y = (1 / diceArray[i]) * (height - hight);

    console.log("lastX: ", lastWidth);
    console.log("lastY: ", lastHeight);



    lastHeight += hight;
    lastWidth += wdth;

    // Add the x and y coordinates to the arrays
    xCoords.push(x);
    yCoords.push(y);
    //calculate the SVG path for this iteration
    console.log(xCoords);
    console.log(yCoords);
    let path = "";
    path += `M ${xCoords[i]} ${yCoords[i]} L ${xCoords[i] + wdth} ${yCoords[i]} L ${xCoords[i] + wdth} ${yCoords[i] + hight} L ${xCoords[i]} ${yCoords[i] + hight} Z `;
    // Append the path to the angledRectangles array
    angledRectangles.push(path);
  }
  // Return the angledRectangles array
  console.log(angledRectangles);
  return angledRectangles;
}

function draw(){
colorCanvasNew(ProportionChance);
// Push each subpath from angledRectangles array to v array
for (let i = 0; i < angledRectangles.length; i++) {
  let path = angledRectangles[i];
  let color = Pallettes[i]
  let c = Math.floor((angledRectangles.length/(i+1)));
  /*console.log(Pallettes);
  console.log(color);
  console.log(c);
  console.log(color[c]); */
  v.push(`<g fill="${color[c]}" stroke="#000000" stroke-width="1" stroke-linecap="round">`);
  v.push(`<path d="${path}"/>`);
}


// Push the closing tag for the <g> element and the closing tag for the <svg> element to v array
v.push(`</g></svg>`);
//document.getElementById("a").innerHTML = v.join("");
console.log(v);

document.body.innerHTML += v.join('');

let svgMarkup = v.join('');
let im = new Image();
im.src = `data:image/svg+xml,` + encodeURIComponent(svgMarkup);
im.decode().then((_) => {
  document.body.replaceChildren(im);
});

let fileName = `${startTime} - ${fxhash}`;
downloadMetadata(fileName);
}

draw();

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


/*


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

*/

function colorCanvasAngled() {
  // Create an array to store the rectangles
  const rectangles = [];
  let scaleCounter = 1;
  //Loop iterations (scaling factor)
  for (let n = 0; n < iterations; n++) {
  // Loop through the ProportionChance array
  for (let i = 0; i < ProportionChance.length; i++) {
    // Calculate the angle to rotate the canvas
    const angle = (ProportionChance[i] / prngno) * 360;
    ctx.rotate(angle);

    // Calculate the total percentage of all the ProportionChance values
    const totalPercentage = ProportionChance.reduce((sum, percentage) => {
      return sum + parseInt(percentage);
    }, 0);

    // Calculate the segment height for each color palette
    const segmentHeight = canvas.width / totalPercentage;

    // Loop through the Pallettes array
    for (let i = 0; i < Pallettes.length; i++) {
      const colors = Pallettes[i];
      // Calculate the angle to rotate the canvas
      const angle = (ProportionChance[i] / totalPercentage) * 360;
      ctx.globalCompositeOperation = blendMode;

      // Loop through each pixel in the segment
      for (let y = 0; y < canvas.width; y++) {
        for (let x = i * canvas.width; x < (i + 1) * canvas.width; x++) {
          // Rotate the canvas
          ctx.rotate(angle);
          // Get a random color from the colors array
          const color = colors[Math.floor(prngno * colors.length)];
          // Create a rectangle object and add it to the rectangles array
          rectangles.push({ x, y, width: (1*scaleCounter), height: (1*scaleCounter), color });
        }
      }
      // Reset the canvas rotation
      ctx.rotate(-angle);
    }
  }
  console.log("before rectanlge sorting: ", rectangles.length);
 // const optimisedRectangles = optimiseRectangles(rectangles);
  // Loop through the rectangles array and draw each rectangle to the canvas
 // console.log("after rectangle sorting: ", optimisedRectangles.length);
//  optimisedRectangles.forEach(rect => {
//    ctx.fillStyle = rect.color;
//    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
//  });

  scaleCounter *=4
}
}