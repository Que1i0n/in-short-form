function noZero(prngno) {
  // Split prngno into two parts, one before and one after the decimal point
  const parts = String(prngno).split('.');
  // If there is a part after the decimal point, assign it to the digits variable
  // Otherwise, assign an empty array to the digits variable
  const digits = parts[1] ? parts[1].split('') : [];

  // Iterate through the digits and return the first non-zero digit as an integer
  for (let i = 0; i < digits.length; i++) {
    if (digits[i] !== '0') {
      return parseInt(digits[i]);
    }
  }

  // If no non-zero digits were found in the part after the decimal point,
  // iterate through the characters in the part before the decimal point
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

function getPhrases(filePath, number) {
  const reading = [];
  const rawFile = new XMLHttpRequest();

  // Open the file asynchronously
  rawFile.open("GET", filePath, false);

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
// Convert a sentence into an array of hexadecimal colors
function sentenceToHexColors(sentence) {
const hexColors = [];

// split the sentence into an array of characters
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

// Generate a random selection of colors from the given array of hexadecimal colors
function getRandomColors(colors, numColors, prngno) {
  const shortenedColors = [];  
  let seed = prngno;
  function prng() {
    seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
  } 
  for (let i = 0; i < numColors; i++) {
    const Newprngno = prng();
    const index = Math.floor(Newprngno * Math.min(colors.length, numColors));
  shortenedColors.push(colors[index]);
  }
return [...new Set(shortenedColors)]; // remove duplicates

}

// Calculate the normalized lengths of the given strings as proportions
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

function downloadCanvas(fileName, prngno, Phrases, diceQuant, ProportionChance, Pallettes, blendMode) {
    
  let metadata = `fxhash:${prngno}\nPhrases:\n`;
      for (let i = 0; i < Phrases.length; i++) {
        metadata += `${i + 1}. ${Phrases[i]}\n`;
    }
  metadata += `dice:${diceQuant}\nProportionChance:${ProportionChance}\nPallettes:${JSON.stringify(Pallettes)}\nblendMode:${blendMode}`;

  //const metadata = `fxhash:${prngno}\nPhrases:${Phrases}\ndice:${diceQuant}\nProportionChance:${ProportionChance}\nPallettes:${JSON.stringify(Pallettes)}\nblendMode:${blendMode}`;

  const imageDataURL = canvas.toDataURL();
  const imageLink = document.createElement("a");
  imageLink.href = imageDataURL;
  imageLink.download = fileName;
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
    colorCanvas(ctx, Pallettes, ProportionChance, blendMode);
    //colorCanvasHorizontal(ctx, Pallettes, ProportionChance);
    colorCanvasVertical(ctx, Pallettes, ProportionChance, blendMode);

        for (let i = 0; i < 5; i++) {
            colorCanvasAngled(ctx, Pallettes, ProportionChance, blendMode);
            ctx.scale(4, 4);
            console.log("Angle Pass:", [i], ":", "        Elapsed time: " + minutes + " minutes " + seconds + " seconds");
        }
    console.log("fxhash():", prngno, "Phrases:", Phrases, "dice no.:", diceQuant, "ProportionChance:", ProportionChance, "Pallettes:", Pallettes, "blendMode:", blendMode);
    downloadCanvas(fxhash, prngno, Phrases, diceQuant, ProportionChance, Pallettes, blendMode);
}

const canvas = document.getElementById("canvas");
canvas.width = 3840;  // 4K resolution
canvas.height = 2160;
const ctx = canvas.getContext("2d");

let prngno = fxrand();
let diceQuant = noZero(prngno);

const Phrases = getPhrases("Genesis.txt", diceQuant);
const Pallettes = [];
let palletteDepth = 3;
const ProportionChance = getStringLengths(Phrases);
const blendModes = ['normal', 'multiply', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference'];
const blendMode = blendModes[Math.floor(prngno * blendModes.length)];

var startTime = new Date();
var elapsedTime = new Date() - startTime;
var minutes = Math.floor(elapsedTime / 60000);
var seconds = Math.floor((elapsedTime % 60000) / 1000);

Phrases.forEach(phrase => {
// translates the phrase into an array of hexadecimal colours
const hexColors = sentenceToHexColors(phrase);
// select palletteDepth number of colours from hexColors
const shortenedColors = getRandomColors(hexColors, palletteDepth);  // <--- colour pallette depth
// add shortenedColors to Pallettes
Pallettes.push(shortenedColors);
});

console.log("Start Time:", startTime);

// call the drawAndDownload function
draw(ctx, Pallettes, ProportionChance, blendMode);

console.log("Elapsed Time:", elapsedTime)

// console.log("fxhash():", prngno, "Phrases:", Phrases, "dice no.:", diceQuant, "Colours:", Pallettes);