const canvas = document.getElementById("canvas");
canvas.width = 3840;  // 4K resolution
canvas.height = 2160;
const ctx = canvas.getContext("2d");

let prngno = fxrand();
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

let Pallettes = generateColors();

const ProportionChance = getStringLengths(Phrases);
const blendModes = ['normal', 'multiply', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference'];
const blendMode = blendModes[Math.floor(prngno * blendModes.length)];

const startTime = new Date();
function getElapsedTime() {
  var elapsedTime = Date.now() - startTime; // Calculate the elapsed time as the difference between the current time and the start time
  return elapsedTime;
}

console.log("Start Time:", startTime);



//let hexColorArrays = phraseToHexColors(ProcessedPhrases);

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

function generateColors() {
  console.log("Number of Dice: ",  diceQuant, "  Dice Rolls: ", diceRolls);
  console.log("Phrases:", JSON.stringify(ProcessedPhrases));
  const colors = [];
  for (let i = 0; i < ProcessedPhrases.length; i++) {
    let phrase = ProcessedPhrases[i];
    const colorArray = [];
    console.log("generateColors phrase:", JSON.stringify(phrase));
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
      let hexCode;
      do {
        // Generate a different random number for each color component
        const [min, max] = phrase;
        let r = Math.floor(prng(prngno + j) * (max - min + 1)) + min;
        let g = Math.floor(prng(prngno + j + 1) * (max - min + 1)) + min;
        let b = Math.floor(prng(prngno + j + 2) * (max - min + 1)) + min;
        // Convert the numbers to hexadecimal strings and concatenate them
        hexCode = '#' + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');

        // Calculate the average value of the color components
        const avg = (r + g + b) / 3;
          // If the average value is less than a certain threshold, increase the saturation by 75%
      if (avg < 128) {
        r = Math.min(255, Math.floor(r * 1.75));
        g = Math.min(255, Math.floor(g * 1.75));
        b = Math.min(255, Math.floor(b * 1.75));
        hexCode = '#' + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');
      }
  } while (colorArray.includes(hexCode));
    // Add the hex code to the color array
    colorArray.push(hexCode);
    }
    // Push the current color array to the colors array
    colors.push(colorArray);
    console.log("hexcolors ext: ", JSON.stringify(colorArray));
  }
  return colors;
}


/*

function generateColors() {
  console.log("Phrases:", JSON.stringify(ProcessedPhrases));
  const colors = [];
  for (let i = 0; i < ProcessedPhrases.length; i++) {
    const phrase = ProcessedPhrases[i];
    let hexColors = phraseToHexColors(ProcessedPhrases);
    console.log("generateColors hexColors:", JSON.stringify(hexColors));
    const colorArray = [];
    for (let j = 0; j < palletteDepth; j++) {
      // Select a random color from the hexColors array
      const color = hexColors[Math.floor(fxrand() * hexColors.length)];
      colorArray.push(color);
    }
    colors.push(colorArray);
    console.log("hexcolors ext: ", JSON.stringify(colors));
  }
  return colors;
}

function phraseToHexColors(phrases) {
  const hexColorArrays = [];

  // Iterate over the phrases in the array
  for (let i = 0; i < phrases.length; i++) {
    let phrase = phrases[i];

    // Convert the phrase to a string if it is not a string
    if (typeof phrase !== 'string') {
      phrase = phrase.toString();
    }

    // Split the phrase into an array of characters
    const chars = phrase.split('');

    // Iterate over the characters in the phrase
    const currentHexColors = chars.map(char => {
      // Convert the character to its ASCII code
      const asciiCode = char.charCodeAt(0);
      // Convert the ASCII code to a hexadecimal code
      let hexCode = asciiCode.toString(16);

      // Pad the hex code with leading zeros if it is less than 6 digits long
      while (hexCode.length < 6) {
        hexCode = hexCode.substring(0, 2) + hexCode.substring(2, 4) + hexCode.substring(4, 6);
      return '#' + hexCode;
  }});

    // Push the currentHexColors array to the hexColorArrays array
    hexColorArrays.push(currentHexColors);
  }

  return hexColorArrays;
}




function generateColors(phrase) {
  const colors = [];
  const phraseLength = phrase.length;
  const hexColors = sentenceToHexColors(phrase);

  // Select a random color from the hexColors array
  const baseColor = hexColors[Math.floor(fxrand() * hexColors.length)];
  colors.push(baseColor);

  // Convert the base color to RGB values
  const baseColorRGB = hexToRGB(baseColor);

  // Generate the remaining colors by rotating the hue of the base color
  for (let i = 1; i < palletteDepth; i++) {
    const hue = (baseColorRGB.h + (30 * i)) % 360;
    const color = hslToHex(hue, baseColorRGB.s, baseColorRGB.l);
    colors.push(color);
  }

  return colors;
}

function hexToRGB(hex) {
  // Extract the R, G, and B values from the hex code
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Convert the RGB values to HSL
  return rgbToHSL(r, g, b);
}

function rgbToHSL(r, g, b) {
  // Convert the RGB values to 0-1 range
  r /= 255;
  g /= 255;
  b /= 255;

  // Find the min and max values
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);

  // Calculate the hue, saturation, and lightness
  let h, s, l = (max + min) / 2;
  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  // Return the HSL values as an object
  return { h: h * 360, s: s, l: l };
}

function hslToHex(h, s, l) {
  // Convert the HSL values to RGB
  let r, g, b;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  // Convert the RGB values to hex code
  const hex = "#" + Math.round(r * 255).toString(16) + Math.round(g * 255).toString(16) + Math.round(b * 255).toString(16);
  return hex;
}
*/


function getStringLengths(strings) {
const totalLength = strings.reduce((sum, str) => sum + str.length, 0);
const proportionSum = strings.reduce((sum, str) => sum + (str.length / totalLength), 0);
// does strings.map convert the values being produced to strings, or does it leave them as numbers?
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

function drawBoxes(colorArray, boxSize = 100) {
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
    
  let metadata = `fxhash:${prngno}\ndice:${diceQuant}\n\nVerse Index:\n`;
      for (let i = 0; i < ProcessedPhrases.length; i++) {
        metadata += `${i + 1}. ${ProcessedPhrases[i]}\n\n`;
    }
    metadata += `Phrases:\n`;
    for (let i = 0; i < PhrasesString.length; i++) {
      metadata += `${i + 1}. ${PhrasesString[i]}\n`;
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
    console.log("Number of Dice: ",  diceQuant, "  Dice Rolls: ", diceRolls);
    //colorCanvasHorizontal(ctx, Pallettes, ProportionChance);
    colorCanvasVertical(ctx, Pallettes, ProportionChance, blendMode);
    console.log("Colouring Vertically - Done!",  "      ", getElapsedTime());
        for (let i = 0; i < 5; i++) {
            colorCanvasAngled(ctx, Pallettes, ProportionChance, blendMode);
            ctx.scale(4, 4);
            console.log("Angle Pass:", [i], ":",  "      ", getElapsedTime());
        }
        drawBoxes(colorArray);
        console.log("Pallette Pass: ", getElapsedTime());
    console.log("fxhash():", prngno, "Phrases:", ProcessedPhrases, "dice no.:", diceQuant, "ProportionChance:", ProportionChance, "Pallettes:", Pallettes, "blendMode:", blendMode);
    downloadCanvas(fxhash, prngno, ProcessedPhrases, diceQuant, ProportionChance, Pallettes, blendMode);
}




// call the drawAndDownload function
draw(ctx, Pallettes, ProportionChance, blendMode);

console.log("Elapsed Time:", getElapsedTime())