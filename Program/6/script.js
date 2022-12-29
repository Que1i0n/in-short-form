const canvas = document.getElementById("canvas");
canvas.width = 3840;  // 4K resolution
canvas.height = 2160;
const ctx = canvas.getContext("2d");

let prngno = fxrand();
//let prngno = 0.30123451423451
let diceQuant = noZero(prngno);
let diceRolls = [];
let Phrases = [];
let ProjectColors = [];
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

  console.log("Number of Dice: ", diceQuant, "  Dice Rolls: ", diceRolls);
  console.log("ProcessedPhrases:", JSON.stringify(ProcessedPhrases));
  const colors = [];
  const seed = diceProduct;
  for (let i = 0; i < ProcessedPhrases.length; i++) {
    let phrase = ProcessedPhrases[i];
    const colorArray = [];
    console.log("generateColors phrase:", JSON.stringify(phrase));
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
          hue = (hue / max) * 358 + 1;
          saturation = (saturation / max) * 98 + 1;
          lightness = (lightness / max) * 98 + 1;
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
function getStringLengths(strings) {
  const totalLength = strings.reduce((sum, str) => sum + str.length, 0);
  const proportionSum = strings.reduce((sum, str) => sum + (str.length / totalLength), 0);
  return strings.map(str => (str.length / totalLength) / proportionSum * 100);
}
function tidyPallette(colorArray) {
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

  console.log("--------------Initialisation Done--------------")
}
  ////////
  
function colorCanvas(ctx, Pallette, ProportionChance, blendMode) {
  if (!Array.isArray(ProportionChance)) {
    ProportionChance = [ProportionChance];
  }
  const totalPercentage = ProportionChance.reduce((sum, percentage) => {
    return sum + parseInt(percentage);
  }, 0);
  const segmentSize = Math.max(canvas.width, canvas.height) / totalPercentage; 
  for (let i = 0; i < Pallette.length; i++) {
    const colors = Pallette[i];   
    const x = canvas.width > canvas.height ? i * segmentSize : 0;
    const y = canvas.width > canvas.height ? 0 : i * segmentSize;
    const width = canvas.width > canvas.height ? segmentSize * parseInt(ProportionChance[i]) : canvas.width;
    const height = canvas.width > canvas.height ? canvas.height : segmentSize * parseInt(ProportionChance[i]);
    ctx.globalCompositeOperation = blendMode;
    ctx.fillStyle = colors[0];
    ctx.fillRect(x, y, width, height);
  }
}
function colorCanvasAngled(ctx, Pallette, ProportionChance, blendMode) {
  for (let i = 0; i < ProportionChance.length; i++) {
    const angle = (ProportionChance[i] / prngno) * 360;
    ctx.rotate(angle);
    const totalPercentage = ProportionChance.reduce((sum, percentage) => {
      return sum + parseInt(percentage);
    }, 0);
    const segmentHeight = canvas.width / totalPercentage;
    for (let i = 0; i < Pallette.length; i++) {
      const colors = Pallette[i];
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
function colorCanvasVertical(ctx, pallette, ProportionChance, blendMode) {
  if (!Array.isArray(ProportionChance)) {
    ProportionChance = [ProportionChance];
  }
  const totalPercentage = ProportionChance.reduce((sum, percentage) => {
    return sum + parseInt(percentage);
  }, 0);
  const segmentHeight = canvas.width / totalPercentage; 
  for (let i = 0; i < pallette.length; i++) {
    const colors = pallette[i];   
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
function downloadCanvas(fileName, prngno, ProcessedPhrases, diceQuant, ProportionChance, Pallette, blendMode) {
    
  let metadata = `fxhash:${prngno}\ndice:${diceQuant}\nVerse Index:\n`;
      for (let i = 0; i < ProcessedPhrases.length; i++) {
        metadata += `${i + 1}. ${ProcessedPhrases[i]}`;
    }
    metadata += `\nPhrases:\n`;
    for (let i = 0; i < PhrasesString.length; i++) {
      metadata += `${i + 1}. ${PhrasesString[i]}`;
  }
    metadata += `\nProportionChance:\n${ProportionChance}\nPallettes:\n${JSON.stringify(Pallette)}\nblendMode:${blendMode}\n\nStartTime:${startTime}\nElapsedTime:${startTime + Math.floor(getElapsedTime() / 1000)}\nFinishTime:${currentTime}}`;
  
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

async function draw(ctx, pallette, ProportionChance, blendMode) {
    console.log("ctx: ", ctx);
    console.log("pallette: ", pallette);
    console.log("ProportionChance: ", ProportionChance);
    console.log("blendmode: ",blendMode);
    
    colorCanvas(ctx, Pallette, ProportionChance, blendMode);
    console.log("Colours1 - Done!",  "      ", getElapsedTime());
    //colorCanvasHorizontal(ctx, Pallette, ProportionChance);
    colorCanvasVertical(ctx, pallette, ProportionChance, blendMode);
    console.log("Colouring Vertically - Done!",  "      ", Math.floor(getElapsedTime() / 1000));
        for (let i = 0; i < 5; i++) {
            console.log("Angle Pass:", [i], "Start :",  "      ", Math.floor(getElapsedTime() / 1000));
            colorCanvasAngled(ctx, pallette, ProportionChance, blendMode);
            ctx.scale(4, 4);
            console.log("Angle Pass:", [i], " End :",  "      ", Math.floor(getElapsedTime() / 1000));
        }
       // drawBoxes(Pallette, 100);
      //  console.log("Pallette Pass: ", getElapsedTime());
    console.log("fxhash():", prngno, "Phrases:", ProcessedPhrases, "dice no.:", diceQuant, "ProportionChance:", ProportionChance, "Pallette:", Pallette, "blendMode:", blendMode);
    downloadCanvas(fxhash, prngno, ProcessedPhrases, diceQuant, ProportionChance, pallette, blendMode);
    const finishTime = new Date();
    console.log("Finish Time: ", finishTime.toString());
    console.log("Elapsed Time: ", getElapsedTime(), "seconds");
}
async function main() {
  await initialize();
  draw(ctx, ProjectColors, ProportionChance, blendMode);
}

main().then(() => {
  console.log('Done!');
});