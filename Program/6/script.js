const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 3840;  // 4K resolution
canvas.height = 2160;

const prngno = fxrand();
const diceQuant = (nozero(prngno)*2);
const diceRolls = [];
const diceProduct = [];
const Phrases = [];
const ProcessedPhrases = [];
const ProjectColors = [];
const ProportionChance = [];
const palletteDepth = 3;
const blendModes = ['normal', 'multiply', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference'];
const blendMode = blendModes[Math.floor(prngno * blendModes.length)];

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
    Phrases.push(reading);
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
  ProcessedPhrases.push(processedPhrases);
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
  ProjectColors.push(strippedArray);
  return strippedArray;
}
async function getStringLengths(strings) {
  const totalLength = strings.reduce((sum, str) => sum + str.length, 0);
  const proportionSum = strings.reduce((sum, str) => sum + (str.length / totalLength), 0);
  const proportions = strings.map(str => (str.length / totalLength) / proportionSum * 100);
  ProportionChance.push(proportions);
  return proportions
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
  diceProduct.push(diceRolls.reduce((acc, cur) => acc + cur, 0));
  return diceProduct;
}


//----------------------------INITIALISE----------------------------------

const startTime = Date.now();

function getElapsedTime() {
  const elapsedTime = Date.now() - startTime;
  const elapsedTimeInSeconds = elapsedTime / 1000;
  return elapsedTimeInSeconds;
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
  
  
  console.log("prngno:", prngno);
  console.log("nozero(prngno): ", nozero(prngno))
  console.log("Phrases: ", [Phrases]);
  console.log("Processed Phrases: ", ProcessedPhrases)
  console.log("ProjectColours :", [ProjectColors]);
  console.log("ProportionChance: ", [ProportionChance]);
  console.log("DiceQuant: ", diceQuant, "diceRolls: ", diceRolls, "diceProduct: ", diceProduct);
  console.log("Blend Mode: ", blendMode);

  console.log("--------------Initialisation Done--------------");



//------------------------------DRAWINGS------------------------------

async function colorCanvas(ctx, Proportions, ProjectColors, blendMode) {
  return new Promise((resolve, reject) => {
    try {
  // Initialize total percentage to 0
  let totalPercentage = 0;
  // Iterate over the Proportions array
    for (let i = 0; i < Proportions.length; i++) {
      const proportion = Proportions[i];
      const colors = ProjectColors[i];
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
  resolve();  
} catch (error) {
  // reject the promise if an error occurs
  reject(error);
  }});
}
}

//-----------------------DRAWINGS FUNCTIONS??________--------------------

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

function downloadCanvas(fileName) {
  const metadata = {
    fxrand: prngno,
    dice: diceQuant,
    diceRolls: diceRolls,
    diceProduct: diceProduct,
    phrases: Phrases,
    projectColors: ProjectColors,
    proportionChance: ProportionChance,
    blendMode: blendMode,
    startTime: startTime
  };

  const imageDataURL = canvas.toDataURL();
  const imageLink = document.createElement("a");
  imageLink.href = imageDataURL;
  imageLink.download = `${fileName}`;
  document.body.appendChild(imageLink);
  imageLink.click();
  document.body.removeChild(imageLink);

  const metadataBlob = new Blob([JSON.stringify(metadata)], {type: 'text/plain'});
  const metadataUrl = URL.createObjectURL(metadataBlob);
  const metadataLink = document.createElement("a");
  metadataLink.href = metadataUrl;
  metadataLink.download = `${fileName}.txt`;
  document.body.appendChild(metadataLink);
  metadataLink.click();
  document.body.removeChild(metadataLink);
}


function draw(ctx, ProjectColors, ProportionChance, blendMode) {
  colorCanvas(ctx, ProjectColors, ProportionChance, blendMode);
  //colorCanvasHorizontal(ctx, ProjectColors, ProportionChance);
  colorCanvasVertical(ctx, ProjectColors, ProportionChance, blendMode);
  colorCanvasAngled(ctx, ProjectColors, ProportionChance, blendMode)
  
  /*
  colorCanvasVertical();
  
  for (let i = 0; i < 5; i++) {
    colorCanvasAngled();
    ctx.scale(4, 4);
  }
  */
  downloadCanvas(fxhash);
}
  
//------------------------------MAIN LOOP------------------------------

  async function main() {
    console.log("Start Time: ", startTime);
    await initialize();
  }

  async function ColouringTime(ctx, ProjectColors, ProportionChance, blendMode) {
      draw(ctx, ProjectColors, ProportionChance, blendMode);
      const finishTime = new Date();
      console.log("Finish Time: ", finishTime.toString());
      console.log("Elapsed Time: ", getElapsedTime(), "seconds");  
  }
  

main().then(() => {
/*  console.log("SENSE-CHECKING!!!!!!!!!!!>>>>>>>>>>>>>>>>>");
  console.log("prngno:", prngno);
  console.log("nozero(prngno): ", nozero(prngno))
  console.log("Phrases: ", Phrases);  
  console.log("Processed Phrases: ", ProcessedPhrases)
  console.log("ProjectColours :", ProjectColors);
  console.log("ProportionChance: ", ProportionChance);
  console.log("DiceQuant: ", diceQuant, "diceRolls: ", diceRolls, "diceProduct: ", diceProduct);
  console.log("Blend Mode: ", blendMode);*/
  console.log("!!!!!!Starting Drawing!!!!!!!")
  ColouringTime(ctx, ProjectColors, ProportionChance, blendMode);
  console.log('Done!');
});