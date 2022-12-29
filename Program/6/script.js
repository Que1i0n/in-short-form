const canvas = document.getElementById("canvas");
canvas.width = 3840;  // 4K resolution
canvas.height = 2160;
const ctx = canvas.getContext("2d");

//let prngno = fxrand();

let prngno = 0.30123451423451
let diceQuant = noZero(prngno);
let diceRolls = [];


const Phrases = getPhrases();
// Convert the Phrases array to a string
const PhrasesString = JSON.stringify(Phrases);

// Convert the string back to an array
const PhrasesArray = JSON.parse(PhrasesString);

// Iterate over the elements in the PhrasesArray and extract the text between the ':' and the '\r'
const ProcessedPhrases = PhrasesArray.map(phrase => {
  // Split the string around the ':' character
  const [numbersString, phrasePart] = phrase.split(':');
  // Remove the "Ge" prefix from the numbers string
  const numbersStringWithoutPrefix = numbersString.substring(2);
  // Concatenate the numbers and convert the result to an integer
  const number = parseInt(numbersStringWithoutPrefix.replace(/ /g, ''), 10);
  // Split the phrase part around the ' ' character and take the first element
  const numberAfterColon = parseInt(phrasePart.split(' ')[0], 10);
  return [number, numberAfterColon];
});



let palletteDepth = 3;

let globalHexColors = [];



const ProportionChance = getStringLengths(Phrases);
const blendModes = ['normal', 'multiply', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference'];
const blendMode = blendModes[Math.floor(prngno * blendModes.length)];

const startTime = new Date();
function getElapsedTime() {
  var elapsedTime = Date.now() + startTime; // Calculate the elapsed time as the difference between the current time and the start time
  return elapsedTime;
}

console.log("Start Time:", startTime);
let Pallettestemp = generateColors(ProcessedPhrases, palletteDepth, prngno, ProportionChance);
const Pallettes = Pallettestemp.reduce((acc, val) => acc.concat(val), []);


function noZero(prngno) {
  const parts = String(prngno).split('.');
  const digits = parts[1] ? parts[1].split('') : [];
  for (let i = 0; i < digits.length; i++) {
    if (digits[i] !== '0') {
      return parseInt(digits[i]);
    }
  }
  if (parts[0]) {
    const digits = parts[0].split('');
    for (let i = 0; i < digits.length; i++) {
      if (digits[i] !== '0') {
        return parseInt(digits[i]);
      }
    }
  }

  // If no non-zero digits were found, log an error message to the console and return 1
  console.error('No non-zero digits found');
  return 1;
}

function getPhrases() {
  const reading = [];
  const rawFile = new XMLHttpRequest();

  // Open the file asynchronously
  rawFile.open("GET", "Genesis.txt", false);

  rawFile.onreadystatechange = function() {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status == 0) {
        const textData = rawFile.responseText;
        const rows = textData.split('\n');
        var startRow = diceQuant;
        var skipInterval = 1;
        // Roll the dice to determine the number of phrases to select
        const numPhrases = diceQuant > 0 ? diceQuant : 1;
        for (let i = 0; i < diceQuant; i++) {
          const roll = Math.floor(fxrand() * 6) + 1;
          startRow += roll;
          skipInterval *= roll;
          diceRolls.push(roll);
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

function generateColors(ProcessedPhrases, palletteDepth, prngno, ProportionChance) {
  // Helper function to convert an HSL value array to a string
  function hslToString(hsl) {
    const [hue, saturation, lightness] = hsl;
    return `hsl(${hue},${saturation}%,${lightness}%)`;
  }

  // Modify the color arrays to contain HSL strings instead of HSL arrays
  function modifyColorArrays(colorArrays) {
    return colorArrays.map(colors => {
      return colors.map(hsl => {
        const [hue, saturation, lightness] = hsl;
        return `hsl(${hue},${saturation}%,${lightness}%)`;
      });
    });
  }

  const colors = [];
  for (let i = 0; i < ProcessedPhrases.length; i++) {
    let phrase = ProcessedPhrases[i];
    const colorArray = [];
    for (let j = 0; j < palletteDepth; j++) {
      // Convert the phrase to an array of integers if it is not already an array
      if (!Array.isArray(phrase)) {
        phrase = [parseInt(phrase, 10)];
      }
      // Use a custom PRNG function that seeds the PRNG with the prngno value
      const prng = seed => {
        let x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
      };
      let hsl;
      do {
        // Generate a different random number for each color component
        const [min, max] = phrase;
        let hue = Math.floor(prng(prngno + j) * (max - min + 1)) + min;
        let saturation = Math.floor(prng(prngno + j + 2) * (max - min + 1)) + min;
        let lightness = Math.floor(prng(prngno + j + 2) * (max - min + 1)) + min;
        // Increase the saturation and lightness values by the desired amount
        saturation = saturation + (saturation * 0.75);
        lightness = lightness + (lightness * 0.2);
        // Create the HSL value as an array of integers
        hsl = [hue, saturation, lightness];
      } while (colorArray.includes(hsl));
      colorArray.push(hsl);
    }
    // Modify the color array to contain HSL strings instead of HSL arrays
    colors.push(modifyColorArrays([colorArray]));
  }    
  console.log("generateColours result: ", JSON.stringify(colors));
  
  // Return the modified color arrays
  return colors;
  
}

function getStringLengths(strings) {
const totalLength = strings.reduce((sum, str) => sum + str.length, 0);
const proportionSum = strings.reduce((sum, str) => sum + (str.length / totalLength), 0);
return strings.map(str => (str.length / totalLength) / proportionSum * 100);
}


function colorCanvas(ctx, Pallettes, ProportionChance, blendMode) {
  if (!Array.isArray(ProportionChance)) {
    ProportionChance = [ProportionChance];
  }
  const totalPercentage = ProportionChance.reduce((sum, percentage) => {
    return sum + parseInt(percentage);
  }, 0);
  const segmentSize = Math.max(canvas.width, canvas.height) / totalPercentage; 
  for (let i = 0; i < Pallettes.length; i++) {
    const colors = Pallettes[i];   
    const x = canvas.width > canvas.height ? i * segmentSize : 0;
    const y = canvas.width > canvas.height ? 0 : i * segmentSize;
    const width = canvas.width > canvas.height ? segmentSize * parseInt(ProportionChance[i]) : canvas.width;
    const height = canvas.width > canvas.height ? canvas.height : segmentSize * parseInt(ProportionChance[i]);
    ctx.globalCompositeOperation = blendMode;
    ctx.fillStyle = colors[0];
    ctx.fillRect(x, y, width, height);
  }
}
function colorCanvasAngled(ctx, Pallettes, ProportionChance, blendMode) {
  for (let i = 0; i < ProportionChance.length; i++) {
    const angle = (ProportionChance[i] / prngno) * 360;
    ctx.rotate(angle);
    const totalPercentage = ProportionChance.reduce((sum, percentage) => {
      return sum + parseInt(percentage);
    }, 0);
    const segmentHeight = canvas.width / totalPercentage;
    for (let i = 0; i < Pallettes.length; i++) {
      const colors = Pallettes[i];
      const angle = (ProportionChance[i] / totalPercentage) * 360;
      ctx.globalCompositeOperation = blendMode;
      for (let y = 0; y < canvas.width; y++) {
        for (let x = i * canvas.width; x < (i + 1) * canvas.width; x++) {
          ctx.rotate(angle);
          const color = colors[Math.floor(prngno * colors.length)];
          ctx.fillStyle = color;
          ctx.fillRect(x, y, 1, 1);
        }
      }
      ctx.rotate(-angle);
    }
  }
}
function colorCanvasVertical(ctx, Pallettes, ProportionChance, blendMode) {
  if (!Array.isArray(ProportionChance)) {
    ProportionChance = [ProportionChance];
  }
  const totalPercentage = ProportionChance.reduce((sum, percentage) => {
    return sum + parseInt(percentage);
  }, 0);
  const segmentHeight = canvas.width / totalPercentage; 
  for (let i = 0; i < Pallettes.length; i++) {
    const colors = Pallettes[i];   
    const y = i * segmentHeight;
    const width = segmentHeight * parseInt(ProportionChance[i]);
    ctx.globalCompositeOperation = blendMode;
    for (let y = 0; y < canvas.width; y++) {
      for (let x = i * width; x < (i + 1) * width; x++) {
        const color = colors[Math.floor(prngno * colors.length)];
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
      }
      // Draw the current segment to the canvas
      ctx.drawImage(canvas, 0, 0);
    }
  }
}

function drawBoxes(colorArray, boxSize) {
  // Get the canvas element
  const canvas = document.getElementById("canvas");
  // Set the width and height of the canvas to match the size of the color array
  canvas.width = colorArray[0].length * boxSize;
  canvas.height = colorArray.length * boxSize;
  // Get the canvas context
  const ctx = canvas.getContext("2d");
  
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
}

function downloadCanvas(fileName, prngno, ProcessedPhrases, diceQuant, ProportionChance, Pallettes, blendMode) {
    
  let metadata = `fxhash:${prngno}\ndice:${diceQuant}\nVerse Index:\n`;
      for (let i = 0; i < ProcessedPhrases.length; i++) {
        metadata += `${i + 1}. ${ProcessedPhrases[i]}`;
    }
    metadata += `\nPhrases:\n`;
    for (let i = 0; i < PhrasesString.length; i++) {
      metadata += `${i + 1}. ${PhrasesString[i]}`;
  }
    metadata += `\nProportionChance:\n${ProportionChance}\nPallettes:\n${JSON.stringify(Pallettes)}\nblendMode:${blendMode}\nStartTime:${startTime}\nElapsedTime:${startTime + getElapsedTime()}`;
  
  //const metadata = `fxhash:${prngno}\nPhrases:${Phrases}\ndice:${diceQuant}\nProportionChance:${ProportionChance}\nPallettes:${JSON.stringify(Pallettes)}\nblendMode:${blendMode}`;

  const imageDataURL = canvas.toDataURL();
  const imageLink = document.createElement("a");
  imageLink.href = imageDataURL;
  imageLink.download =  startTime + " - " + fileName;
  document.body.appendChild(imageLink);
  imageLink.click();
  document.body.removeChild(imageLink);

  const metadataBlob = new Blob([metadata], {type: 'text/plain'});
  const metadataUrl = URL.createObjectURL(metadataBlob);
  const metadataLink = document.createElement("a");
  metadataLink.href = metadataUrl;
  metadataLink.download = `${fileName}.txt`;
  document.body.appendChild(metadataLink);
  metadataLink.click();
  document.body.removeChild(metadataLink);
}
function draw(ctx, Pallettes, ProportionChance, blendMode) {
  console.log(prngno);
    colorCanvas(ctx, Pallettes, ProportionChance, blendMode);
    console.log("Colours1 - Done!",  "      ", getElapsedTime());
    console.log("ProcessedPhrases: ", JSON.stringify(ProcessedPhrases));
    console.log("Pallettes: ", JSON.stringify(Pallettes));
    console.log("Number of Dice: ",  diceQuant, "  Dice Rolls: ", diceRolls);
    //colorCanvasHorizontal(ctx, Pallettes, ProportionChance);
    colorCanvasVertical(ctx, Pallettes, ProportionChance, blendMode);
    console.log("Colouring Vertically - Done!",  "      ", getElapsedTime());
        for (let i = 0; i < 5; i++) {
            colorCanvasAngled(ctx, Pallettes, ProportionChance, blendMode);
            ctx.scale(4, 4);
            console.log("Angle Pass:", [i], ":",  "      ", getElapsedTime());
        }
       // drawBoxes(Pallettes, 100);
      //  console.log("Pallette Pass: ", getElapsedTime());
    console.log("fxhash():", prngno, "Phrases:", ProcessedPhrases, "dice no.:", diceQuant, "ProportionChance:", ProportionChance, "Pallettes:", Pallettes, "blendMode:", blendMode);
    downloadCanvas(fxhash, prngno, ProcessedPhrases, diceQuant, ProportionChance, Pallettes, blendMode);
}




// call the drawAndDownload function
draw(ctx, Pallettes, ProportionChance, blendMode);

console.log("Elapsed Time:", getElapsedTime());