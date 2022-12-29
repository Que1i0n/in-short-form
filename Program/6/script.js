const canvas = document.getElementById("canvas");
canvas.width = 3840;  // 4K resolution
canvas.height = 2160;
const ctx = canvas.getContext("2d");

let prngno = fxrand();
let diceQuant = noZero(prngno);

const Phrases = getPhrases(diceQuant);
// Convert the Phrases array to a string
const PhrasesString = JSON.stringify(Phrases);

// Convert the string back to an array
const PhrasesArray = JSON.parse(PhrasesString);

// Iterate over the elements in the PhrasesArray and extract the text between the ':' and the '\r'
const ProcessedPhrases = PhrasesArray.map(phrase => {
  const index = phrase.indexOf(':');
  const processedPhrase = phrase.substring(index + 1, phrase.length - 1);
  // Find the first space character in the processedPhrase and return the text after it
  const spaceIndex = processedPhrase.indexOf(' ');
  return [processedPhrase.substring(spaceIndex + 1)];
});

let palletteDepth = 3;

let globalHexColors = [];

let Pallettes = generateColors();

const ProportionChance = getStringLengths(Phrases);
const blendModes = ['normal', 'multiply', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference'];
const blendMode = blendModes[Math.floor(prngno * blendModes.length)];

var startTime = new Date();
var elapsedTime = new Date() - startTime;
var minutes = Math.floor(elapsedTime / 60000);
var seconds = Math.floor((elapsedTime % 60000) / 1000);




let hexColorArrays = phraseToHexColors(ProcessedPhrases);

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

function getPhrases(number) {
  const reading = [];
  const rawFile = new XMLHttpRequest();

  // Open the file asynchronously
  rawFile.open("GET", "Genesis.txt", false);

  rawFile.onreadystatechange = function() {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status == 0) {
        const textData = rawFile.responseText;
        const rows = textData.split('\n');
        var startRow = 0;
        var skipInterval = 1;
        // Roll the dice to determine the number of phrases to select
        const numDice = noZero(number);
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
function generateColors() {
  console.log("Phrases:", ProcessedPhrases);
  const colors = [];
  for (let i = 0; i < ProcessedPhrases.length; i++) {
    const phrase = ProcessedPhrases[i];
    let hexColors = phraseToHexColors(ProcessedPhrases);
    console.log("generateColors hexColors:", hexColors)
    const colorArray = [];
    for (let j = 0; j < palletteDepth; j++) {
      // Select a random color from the hexColors array
      const color = hexColors[Math.floor(fxrand() * hexColors.length)];
      colorArray.push(colors);
    }
    colors.push(colorArray);
  }
  return colors;
}


/*
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
        hexCode = '0' + hexCode;
      }

      return '#' + hexCode;
    });

    // Push the currentHexColors array to the hexColorArrays array
    hexColorArrays.push(currentHexColors);
  }

  return hexColorArrays;
}




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

function downloadCanvas(fileName, prngno, ProcessedPhrases, diceQuant, ProportionChance, Pallettes, blendMode) {
    
  let metadata = `fxhash:${prngno}\nPhrases:\n`;
      for (let i = 0; i < ProcessedPhrases.length; i++) {
        metadata += `${i + 1}. ${ProcessedPhrases[i]}\n`;
    }
  metadata += `dice:${diceQuant}\nProportionChance:${ProportionChance}\nPallettes:${JSON.stringify(Pallettes)}\nblendMode:${blendMode}`;

  //const metadata = `fxhash:${prngno}\nPhrases:${Phrases}\ndice:${diceQuant}\nProportionChance:${ProportionChance}\nPallettes:${JSON.stringify(Pallettes)}\nblendMode:${blendMode}`;

  const imageDataURL = canvas.toDataURL();
  const imageLink = document.createElement("a");
  imageLink.href = imageDataURL;
  imageLink.download =  fileName + "    " + startTime;  
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
    console.log("Colours1 - Done!",  "        Elapsed time: " + minutes + " minutes " + seconds + " seconds", "Palletes:", Pallettes);
    console.log("ProcessedPhrases: ", ProcessedPhrases);
    //colorCanvasHorizontal(ctx, Pallettes, ProportionChance);
    colorCanvasVertical(ctx, Pallettes, ProportionChance, blendMode);
    console.log("Colouring Vertically - Done!",  "        Elapsed time: " + minutes + " minutes " + seconds + " seconds");
        for (let i = 0; i < 5; i++) {
            colorCanvasAngled(ctx, Pallettes, ProportionChance, blendMode);
            ctx.scale(4, 4);
            console.log("Angle Pass:", [i], ":", "        Elapsed time: " + minutes + " minutes " + seconds + " seconds");
        }
    console.log("fxhash():", prngno, "Phrases:", ProcessedPhrases, "dice no.:", diceQuant, "ProportionChance:", ProportionChance, "Pallettes:", Pallettes, "blendMode:", blendMode);
    downloadCanvas(fxhash, prngno, ProcessedPhrases, diceQuant, ProportionChance, Pallettes, blendMode);
}



console.log("Start Time:", startTime);

// call the drawAndDownload function
draw(ctx, Pallettes, ProportionChance, blendMode);

console.log("Elapsed Time:", elapsedTime)