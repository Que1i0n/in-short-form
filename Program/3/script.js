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


/*
//injest bible, and return quantity of phrases
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
      //let startRow = 0;
      //let skipInterval = 1;
      // Roll the dice to determine the number of phrases to select
      const numDice = Math.max(...number.toString().split('').map(Number));
      const startRow = numDice > 0 ? numDice - 1 : 0;
      const numPhrases = numDice > 0 ? numDice : 1;
      const skipInterval = numDice > 0 ? numDice * numPhrases : 1;
      for (let i = 0; i < numDice; i++) {
        const roll = Math.floor(prngno * 6) + 1;
        startRow += roll;
        skipInterval *= roll;
      }
      console.log(startRow, skipInterval);
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
*/




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
function getRandomColors(colors, numColors) {
const shortenedColors = [];

for (let i = 0; i < numColors; i++) {
  const index = Math.floor(prngno * colors.length);
  shortenedColors.push(colors[index]);
  }
return shortenedColors;

//return [...new Set(shortenedColors)]; // remove duplicates

}


// Calculate the normalized lengths of the given strings as proportions
function getStringLengths(strings) {
const totalLength = strings.reduce((sum, str) => sum + str.length, 0);
const proportionSum = strings.reduce((sum, str) => sum + (str.length / totalLength), 0);
// does strings.map convert the values being produced to strings, or does it leave them as numbers?
return strings.map(str => (str.length / totalLength) / proportionSum * 100);
}





function colorCanvasHorizontal(ctx, Pallettes, ProportionChance) {
// Calculate the total percentage of the ProportionChance array
if (!Array.isArray(ProportionChance)) {
  // If ProportionChance is not an array, make it one
    ProportionChance = [ProportionChance];
  }

  const totalPercentage = ProportionChance.reduce((sum, percentage) => {
    return sum + parseInt(percentage);
  }, 0);

  // Calculate the height of each segment based on the total percentage
  const segmentHeight = canvas.height / totalPercentage; 

  // Loop through each segment in the palettes array
  for (let i = 0; i < Pallettes.length; i++) {
    // Split the palette into an array of colors
    const colors = Pallettes[i];

    // Calculate the y-coordinate and height of the segment
    const y = i * segmentHeight;
    const height = segmentHeight * parseInt(ProportionChance[i]);

      // Loop through the x-coordinates of the canvas
      for (let x = 0; x < canvas.width; x++) {
          // Loop through the y-coordinates of the segment
          for (let y = i * height; y < (i + 1) * height; y++) {
          // Choose a random color from the palette
          const color = colors[Math.floor(prngno * colors.length)];

          // Set the fill style and draw a 1x1 pixel at the current coordinates
          ctx.fillStyle = color;
          ctx.fillRect(x, y, 1, 1);
    }
  }
}
}






function colorCanvasVertical(ctx, Pallettes, ProportionChance, blendMode) {
// Calculate the total percentage of the ProportionChance array
if (!Array.isArray(ProportionChance)) {
  // If ProportionChance is not an array, make it one
  ProportionChance = [ProportionChance];
}
const totalPercentage = ProportionChance.reduce((sum, percentage) => {
  return sum + parseInt(percentage);
}, 0);

// Calculate the height of each segment based on the total percentage
const segmentHeight = canvas.width / totalPercentage; 

// Loop through each segment in the palettes array
for (let i = 0; i < Pallettes.length; i++) {
  const colors = Pallettes[i];    const y = i * segmentHeight;
  const width = segmentHeight * parseInt(ProportionChance[i]);


  
  // Set the blend mode for the current segment
  ctx.globalCompositeOperation = blendMode;

  // Loop through the x-coordinates of the canvas
  for (let y = 0; y < canvas.width; y++) {
    // Loop through the y-coordinates of the segment
    for (let x = i * width; x < (i + 1) * width; x++) {
      // Choose a random color from the palette
      const color = colors[Math.floor(prngno * colors.length)];

      // Set the fill style and draw a 1x1 pixel at the current coordinates
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    }
  }
}
console.log(blendMode);
}

// const angle = (ProportionChance[i] / prngno) * 360;
// ctx.rotate(angle);

function colorCanvasAngled(ctx, Pallettes, ProportionChance, blendMode) {
// for loop that goes through each index of ProportionChance
for (let i = 0; i < ProportionChance.length; i++) {
  // convert the proportion chance at index i to an angle in degrees, scaled by prngno
  const angle = (ProportionChance[i] / prngno) * 360;
  // rotate the canvas by angle
  ctx.rotate(angle);


  // totalPercentage should equal 0, verify this?
    const totalPercentage = ProportionChance.reduce((sum, percentage) => {
    return sum + parseInt(percentage);
  }, 0);
  
  // this should throw an error if totalPercentage equals 0?
  const segmentHeight = canvas.width / totalPercentage;

  // go through each colour in Pallettes
  for (let i = 0; i < Pallettes.length; i++) {
    const colors = Pallettes[i];
    
    // angle is being redefined here, using totalPercentage instead of random number, thus angle = Infinity
    const angle = (ProportionChance[i] / totalPercentage) * 360;

    // Set the blend mode for the current segment (now defined at the bottom and passed to this function as a parameter)
    ctx.globalCompositeOperation = blendMode;


    for (let y = 0; y < canvas.width; y++) {
        for (let x = i * canvas.width; x < (i + 1) * canvas.width; x++) {
        // if angle is Inifinity, this line should throw a RangeError
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




function downloadCanvas(fileName) {
// get the canvas content as a data URL
  const dataURL = canvas.toDataURL();

  // create a link element and set its href to the data URL
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = fileName;

  // add the link to the document and click it to trigger the download
  document.body.appendChild(link);
  link.click();

  // remove the link from the document
  document.body.removeChild(link);
}



function draw(ctx, Pallettes, ProportionChance, blendMode) {
colorCanvasHorizontal(ctx, Pallettes, ProportionChance);
colorCanvasVertical(ctx, Pallettes, ProportionChance, blendMode);
for (let i = 0; i < 5; i++) {
colorCanvasAngled(ctx, Pallettes, ProportionChance, blendMode);
ctx.scale(4, 4);
}
downloadCanvas(fxhash);
}


let prngno = fxrand();
let diceQuant = noZero(prngno);
const canvas = document.getElementById("canvas");
    // canvas.width = 500;  // or any other value for the side length of the square
    // canvas.height = 500;
canvas.width = 3840;  // 4K resolution
canvas.height = 2160;
const ctx = canvas.getContext("2d");
const Phrases = getPhrases("kjv.txt", diceQuant);  
const Pallettes = [];
let palletteDepth = 3;
Phrases.forEach(phrase => {
// translates the phrase into an array of hexadecimal colours
const hexColors = sentenceToHexColors(phrase);
// select palletteDepth number of colours from hexColors
const shortenedColors = getRandomColors(hexColors, palletteDepth);  // <--- colour pallette depth
// add shortenedColors to Pallettes
Pallettes.push(shortenedColors);
});

const ProportionChance = getStringLengths(Phrases);


//  ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'];
const blendModes = ['normal', 'multiply', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'luminositiy'];

// Choose a random blend mode from the array
const blendMode = blendModes[Math.floor(prngno * blendModes.length)];


// call the drawAndDownload function
draw(ctx, Pallettes, ProportionChance, blendMode);

console.log("fxhash():", prngno, "Phrases:", Phrases, "dice no.:", diceQuant, "Colours:", Pallettes);

