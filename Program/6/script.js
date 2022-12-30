const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const prngno = fxrand();
const diceQuant = [];
const diceRolls = [];
const diceProduct = [];
const Phrases = [];
const ProjectColors = [];
const ProportionChance = [];
const palletteDepth = 3;
let blendMode;

//----------------------INITIALISATION FUNCTIONS-----------------------------------------

async function calcualteDiceRolls(diceQuant) {
  try {
    // Convert the decimal part of prngno to a string
    const prngnoString = prngno.toString().split('.')[1];
    // Take diceQuant number of values from the string
    const values = prngnoString.substring(0, diceQuant);
    // Convert the values back to numbers and add them to the diceRolls array
    for (const value of values) {
      diceRolls.push(parseInt(value, 10));
    }
    return diceRolls;
  } catch (error) {
    console.error(error);
  }
}
async function getPhrases(diceRolls, diceQuant, diceProduct) {
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
    for (let i = 0; i < diceQuant; i++) {
      const index = (diceRolls[1] + i * diceProduct) % rows.length;
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
async function generateColors(ProcessedPhrases, diceQuant, prngno) {
  const colors = [];
  const seed = diceProduct;
  for (let i = 0; i < ProcessedPhrases.length; i++) {
    let phrase = ProcessedPhrases[i];
    const colorArray = [];
    for (let j = 0; j < palletteDepth; j++) {
      if (!Array.isArray(phrase)) {
        phrase = [parseInt(phrase, 10)];
      };

      // Multiply the numbers in the phrase array by diceQuant
      phrase = phrase.map(num => num * diceQuant);

      // Generate a third number between the two numbers in the phrase array
      const [min, max] = phrase;
      const middle = Math.floor((min + max) / 2);
      // Use prngno to decide where to insert the third number
      if (prngno < 0.33) {
        phrase.unshift(middle);
      } else if (prngno < 0.66) {
        phrase.splice(1, 0, middle);
      } else {
        phrase.push(middle);
      }

      let hsl;
      do {
        // Use the first number in the phrase array as the hue value
        let hue = phrase[0];
        // Use the second number in the phrase array as the saturation value
        let saturation = phrase[1];
        // Use the third number in the phrase array as the lightness value
        let lightness = phrase[2];
        
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
async function getStringLengths(strings) {
  const totalLength = strings.reduce((sum, str) => sum + str.length, 0);
  const proportionSum = strings.reduce((sum, str) => sum + (str.length / totalLength), 0);
  return strings.map(str => (str.length / totalLength) / proportionSum * 100);
}
function nozero(prngno) {
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
async function diceProducts(diceRolls){
  const diceProduct = diceRolls.reduce((acc, cur) => acc + cur, 0);
  return diceProduct;
}

const blendModes = ['normal', 'multiply', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference'];

//----------------------------INITIALISE----------------------------------

async function handlePromise(promise) {
  try {
    const result = await promise;
    return result;
  } catch (error) {
    console.error(error);
  }
}

async function initialize() {
  // Define prngno
  //const prngno = 0.9077571604866534;

  // Calculate dicequant
  const diceQuant = (nozero(prngno)*2);
  // Calculate dice rolls
  const diceRolls = await handlePromise(calcualteDiceRolls(diceQuant));
  // Calculate dice product
  const diceProduct = await handlePromise(diceProducts(diceRolls));

  // Pick phrases
  const Phrases = await handlePromise(getPhrases(diceRolls, diceQuant, diceProduct));

  // Calculate colours
  const q = await handlePromise(processPhrases(Phrases));
  const r = await handlePromise(generateColors(q, diceQuant, prngno));
  const ProjectColors = await handlePromise(tidyPallette(r));

  // Calculate proportions
  const ProportionChance = await handlePromise(getStringLengths(Phrases));

  // Finish initialization
  blendMode = blendModes[Math.floor(prngno * blendModes.length)];
  
  console.log("prngno:", prngno);
  console.log("nozero(prngno): ", nozero(prngno))
  console.log("Phrases: ", Phrases);
  console.log("ProjectColours :", ProjectColors);
  console.log("ProportionChance: ", ProportionChance);
  console.log("DiceQuant: ", diceQuant, "diceRolls: ", diceRolls, "diceProduct: ", diceProduct)

  console.log("--------------Initialisation Done--------------");
}


//------------------------------DRAWINGS------------------------------

function drawTest() {
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


//------------------------------MAIN LOOP------------------------------
async function main() {
  await initialize();
  drawTest(ctx, ProjectColors, ProportionChance, blendMode);
}

main().then(() => {
  console.log('Done!');
});