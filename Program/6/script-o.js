const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
//canvas.width = 3840;  // 4K resolution
//canvas.height = 2160;
let prngno = fxrand();
//let prngno = 0.30123451423451
let diceQuant = noZero(prngno);
let diceRolls = [];
let Phrases = [];
let ProjectColors = [];
let Proportions = [];
let processed = [];
const PhrasesString = JSON.stringify(Phrases);
let diceProduct = diceRolls.reduce((acc, cur) => acc * cur, 1);
// Convert the string back to an array
const PhrasesArray = JSON.parse(PhrasesString);

// Iterate over the elements in the PhrasesArray and extract the text between the ':' and the '\r'
let ProcessedPhrases = PhrasesArray.map(phrase => {
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

let Pallette = [];

let ProportionChance = [];

const blendModes = ['normal', 'multiply', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference'];
const blendMode = blendModes[Math.floor(prngno * blendModes.length)];

const startTime = Date.now();

function getElapsedTime() {
  const elapsedTime = Date.now() - startTime;
  const elapsedTimeInSeconds = elapsedTime / 1000;
  return elapsedTimeInSeconds;
}
console.log("Start Time:", startTime);
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
async function getPhrases() {
  try {
    const reading = [];
    async function loadTextFile() {
      try {
        const response = await fetch("Genesis.txt");
        return await response.text();
      } catch (error) {
        console.error(error);
      }
    }
    const textData = await loadTextFile();
    const rows = textData.split("\n");
    var startRow = diceQuant;
    var skipInterval = 1;
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
    return reading;
  } catch (error) {
    console.error(error);
  }
}
async function processPhrases(phrases) {
  const processedPhrases = [];
  for (const phrase of phrases) {
    const match = phrase.match(/Ge(\d+):(\d+) /);
    if (match) {
      const [, number1, number2] = match;
      const processedPhrase = phrase.substring(0, match[0].length);
      const digits = processedPhrase.match(/\d+/g).map(Number);
      processedPhrases.push(digits);
    }
  }
  return processedPhrases;
}
async function generateColors(ProcessedPhrases) {
  const colors = [];
  const seed = diceProduct;
  for (let i = 0; i < ProcessedPhrases.length; i++) {
    let phrase = ProcessedPhrases[i];
    const colorArray = [];
    for (let j = 0; j < palletteDepth; j++) {
      if (!Array.isArray(phrase)) {
        phrase = [parseInt(phrase, 10)];
      }
      const prng = (seed) => {
        let x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
      };
      let hsl;
      do {
        const [min, max] = phrase;
        let hue = Math.floor(prng(seed + j) * (max - min + 1)) + min;
        let saturation = Math.floor(prng(seed + j + 2) * (max - min + 1)) + min;
        let lightness = Math.floor(prng(seed + j + 2) * (max - min + 1)) + min;
        
  // Scale the values down by a factor of 10 and round them to whole numbers
  hue = Math.round((hue / max) * 358 / 10 + 1);
  saturation = Math.round((saturation / max) * 98 / 10 + 1);
  lightness = Math.round((lightness / max) * 98 / 10 + 1);
        
        // Check if the values are out of bounds and adjust them if necessary
        hue = hue < 0 ? 0 : hue > 360 ? 360 : hue;
        saturation = saturation < 0 ? 0 : saturation > 100 ? 100 : saturation;
        lightness = lightness < 0 ? 0 : lightness > 100 ? 100 : lightness;
        
        hsl = [hue, saturation, lightness];
      } while (colorArray.includes(hsl));
        colorArray.push(hsl);
      }
    // Modify the color array to contain HSL strings instead of HSL arrays
    const modifiedColorArray = colorArray.map((color) => {
      return `hsl(${color[0]}, ${color[1]}%, ${color[2]}%)`;
    });
    colors.push(modifiedColorArray);
  }
  return colors;
}
async function getStringLengths(strings) {
  const totalLength = strings.reduce((sum, str) => sum + str.length, 0);
  const proportionSum = strings.reduce((sum, str) => sum + (str.length / totalLength), 0);
  return strings.map(str => (str.length / totalLength) / proportionSum * 100);
}
async function tidyPallette(colorArray) {
  // Convert the colorArray to a string
  let str = JSON.stringify(colorArray);

  // Round the HSL values to the nearest multiple of 0.5
  str = str.replace(/(\d+(\.\d+)?)/g, (match, p1) => {
    return Math.round(Number(p1) * 2) / 2;
  });

  // Convert the modified string back to an array
  const strippedArray = JSON.parse(str);
  return strippedArray;
}
async function handlePromise(promise) {
  try {
    const result = await promise;
    return result;
  } catch (error) {
    console.error(error);
  }
}


async function initialize() {
  const p = await handlePromise(getPhrases());
  const q = await handlePromise(processPhrases(p));
  const r = await handlePromise(generateColors(q));
  const s = await handlePromise(tidyPallette(r));
  const t = await handlePromise(getStringLengths(p));

  Phrases.push(p);
  ProcessedPhrases.push(q);
  Pallette.push(r);
  ProjectColors.push(s);
  ProportionChance.push(t);

  console.log("testing !!!!!! - ", Pallette);
  console.log("testing !!!!!! - ", ProjectColors);

  console.log("--------------Initialisation Done--------------");
}
function drawTest(ctx, ProjectColors, ProportionChance, blendMode) {
  // Initialize the total percentage to 0
  let totalPercentage = 0;
  // Iterate over the ProportionChance array
  for (let i = 0; i < ProportionChance.length; i++) {
    // Extract the proportion and colors using destructuring assignment
    const proportion = ProportionChance[i];
    const colors = ProjectColors[i];
    // Add the proportion to the total percentage
    totalPercentage += proportion;
    // Calculate the segment size based on the total percentage
    const segmentSize = canvas.width / totalPercentage;
    // Calculate the x and y coordinates and the width and height
    const x = i * segmentSize;
    const y = 0;
    const width = segmentSize * proportion;
    const height = canvas.height;
    // Set the blend mode and fill style
    ctx.globalCompositeOperation = blendMode;
    // Iterate over the y coordinates
    for (let y = 0; y < canvas.height; y++) {
      // Calculate the index of the color in the colors array
      const colorIndex = Math.floor((y / canvas.height) * colors.length);
      // Set the fill style to the color at the calculated index
      ctx.fillStyle = colors[colorIndex];
      // Fill the pixel
      ctx.fillRect(x, y, width, 1);
    }
  }
}

async function main() {
  await initialize();
  drawTest(ctx, ProjectColors, ProportionChance, blendMode);
}

main().then(() => {
  console.log('Done!');
});


  ////////
  /*
  function colorCanvas(ctx, Proportions, projectColors, blendMode) {
    // Initialize total percentage to 0
    let totalPercentage = 0;
    // Iterate over the Proportions array
    for (let i = 0; i < Proportions.length; i++) {
      const proportion = Proportions[i];
      const colors = projectColors[i];
      // Add the proportion to the total percentage
      totalPercentage += proportion;
      // Calculate the segment size based on the total percentage
      const segmentSize = Math.max(canvas.width, canvas.height) / totalPercentage; 
      // Calculate the x and y coordinates and the width and height based on the orientation of the canvas
      const x = canvas.width > canvas.height ? i * segmentSize : 0;
      const y = canvas.width > canvas.height ? 0 : i * segmentSize;
      const width = canvas.width > canvas.height ? segmentSize * proportion : canvas.width;
      const height = canvas.width > canvas.height ? canvas.height : segmentSize * proportion;
      // Set the blend mode and fill style
      ctx.globalCompositeOperation = blendMode;
      ctx.fillStyle = colors[0]; // use the first color in the colors array as the fill style
      // Fill the rectangle
      ctx.fillRect(x, y, width, height);
    }
  }
  
  //// gradients

function colorCanvas(ctx, processed, blendMode) {
  // Initialize total percentage to 0
  let totalPercentage = 0;
  // Iterate over the processed array
  for (let i = 0; i < processed.length; i++) {
    const proportion = processed[i][0];
    const colors = processed[i][1];
    // Add the proportion to the total percentage
    totalPercentage += proportion;
    // Calculate the segment size based on the total percentage
    const segmentSize = Math.max(canvas.width, canvas.height) / totalPercentage; 
    // Calculate the x and y coordinates and the width and height based on the orientation of the canvas
    const x = canvas.width > canvas.height ? i * segmentSize : 0;
    const y = canvas.width > canvas.height ? 0 : i * segmentSize;
    const width = canvas.width > canvas.height ? segmentSize * proportion : canvas.width;
    const height = canvas.width > canvas.height ? canvas.height : segmentSize * proportion;
    // Create a linear gradient using the colors array
    const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
    for (let j = 0; j < colors.length; j++) {
      gradient.addColorStop(j / (colors.length - 1), colors[j]);
    }
    // Set the blend mode and fill style, and fill the rectangle
    ctx.globalCompositeOperation = blendMode;
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, width, height);
  }
}  


function colorCanvasAngled(ctx, Proportions, projectColors, blendMode) {
// Iterate over the Proportions array
for (let i = 0; i < Proportions.length; i++) {
  const x = i * canvas.width;
  const y = 0;
  const proportion = Proportions[i];
  const colors = projectColors[i];
  // Calculate the angle based on the proportion and prngno
  const angle = (proportion / prngno) * 360;
  // Rotate the canvas
  ctx.rotate(angle);
  // Calculate the total percentage and segment height
  let totalPercentage = 0;
  for (let j = 0; j <= i; j++) {
    totalPercentage += Proportions[j];
  }
  const segmentHeight = canvas.width / totalPercentage;
  // Iterate over the y coordinates
  for (let y = 0; y < canvas.width; y++) {
    // Iterate over the x coordinates
    for (let x = i * canvas.width; x < (i + 1) * canvas.width; x++) {
      ctx.rotate(angle);
      // Choose a random color from the colors array
      const color = colors[Math.floor(Math.random() * colors.length)];
      // Set the blend mode and fill style, and fill the pixel
      ctx.globalCompositeOperation = blendMode;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
      // Rotate the canvas

        // Rotate the canvas back to its original orientation
        ctx.rotate(-angle);
      }
    }
  }
} 
function colorCanvasVertical(ctx, Proportions, projectColors, blendMode) {
  let totalPercentage = 0;
  // Iterate over the Proportions array
  for (let i = 0; i < Proportions.length; i++) {
    // Extract the proportion and colors using destructuring assignment
    const proportion = Proportions[i];
    const colors = projectColors[i];
    // Use proportion and colors in your code here
    console.log("Proportions: ", proportion, "Colors: ", colors);
    // Add the proportion to the total percentage
    totalPercentage += proportion;
    // Calculate the segment size based on the total percentage
    const segmentSize = Math.max(canvas.width, canvas.height) / totalPercentage;
    // Calculate the x and y coordinates and the width and height based on the orientation of the canvas
    const x = 0;
    const y = i * segmentSize;
    const width = canvas.width;
    const height = segmentSize * proportion;
    console.log(x, y, width, height, totalPercentage);

    // Set the blend mode and fill style, and fill the rectangle
    ctx.globalCompositeOperation = blendMode;
    // Choose a random color from the colors array
    const color = colors[Math.floor(Math.random() * colors.length)];
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  }
}  
function downloadCanvas(fileName, prngno, ProcessedPhrases, diceQuant, ProportionChance, Pallette, blendMode) {
    
  let metadata = `fxhash:${prngno}\ndice:${diceQuant}\nVerse Index:\n`;
      for (let i = 0; i < ProcessedPhrases.length; i++) {
        metadata += `${i + 1}. ${ProcessedPhrases[i]}`;
    }
    metadata += `\nPhrases:\n`;
    for (let i = 0; i < PhrasesString.length; i++) {
      metadata += `${i + 1}. ${PhrasesString[i]}`;
  }
    metadata += `\nProportionChance:\n${ProportionChance}\nPallettes:\n${JSON.stringify(Pallette)}\nblendMode:${blendMode}\n\nStartTime:${startTime}}`;
  
  //const metadata = `fxhash:${prngno}\nPhrases:${Phrases}\ndice:${diceQuant}\nProportionChance:${ProportionChance}\nPallettes:${JSON.stringify(Pallette)}\nblendMode:${blendMode}`;

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

async function draw(ctx, projectColors, ProportionChance, blendMode) {
  console.log(`fxrand: `, prngno);
  console.log("Pallettes: ", JSON.stringify(projectColors));
  console.log("ProportionChance: ", JSON.stringify(ProportionChance));
  console.log("blendmode: ", blendMode);
  console.log("Project Colors: ", projectColors)
  colorCanvas(ctx, Proportions, projectColors, blendMode);
  console.log("Colours1 - Done!", "      ", getElapsedTime());
  //colorCanvasHorizontal(ctx, Pallette, ProportionChance);
  colorCanvasVertical(ctx, Proportions, projectColors, blendMode);
  console.log("Colouring Vertically - Done!", "      ", Math.floor(getElapsedTime() / 1000));
  for (let i = 0; i < 5; i++) {
    console.log("Angle Pass:", [i], "Start :", "      ", Math.floor(getElapsedTime() / 1000));
    colorCanvasAngled(ctx, Proportions, projectColors, blendMode);
    ctx.scale(4, 4);
    console.log("Angle Pass:", [i], " End :", "      ", Math.floor(getElapsedTime() / 1000));
  }
  console.log("fxhash():", prngno, "Phrases:", ProcessedPhrases, "dice no.:", diceQuant, "ProportionChance:", ProportionChance, "Pallette:", Pallette, "blendMode:", blendMode);
  downloadCanvas(fxhash, prngno, Phrases, diceQuant, ProportionChance, projectColors, blendMode);
  const finishTime = new Date();
  console.log("Finish Time: ", finishTime.toString());
  console.log("Elapsed Time: ", getElapsedTime(), "seconds");
}
*/

