// var Phrases = [];
// var Pallettes = [];
// var PropPalle = [];
// var ProportionChance = [];


const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

// Read phrases from phrases.txt
function getPhrases() {
  const reading = [];
  const txtFile = "phrases.txt";
  const rawFile = new XMLHttpRequest();
  rawFile.open("GET", txtFile, false);
  rawFile.onreadystatechange = function() {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status == 0) {
        const textData = rawFile.responseText;
        const rows = textData.split('\n');
        rows.forEach(row => {
          const items = row.split('>');
          items.forEach(item => {
            reading.push(item);
          });
        });
      }
    }
  };
  rawFile.send(null);
  return reading;
}

// Convert a sentence into an array of hexadecimal colors
function sentenceToHexColors(sentence) {
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

// Generate a random selection of colors from the given array of hexadecimal colors
function getRandomColors(colors, numColors) {
  const shortenedColors = [];
  for (let i = 0; i < numColors; i++) {
    const index = Math.floor(Math.random() * colors.length);
    shortenedColors.push(colors[index]);
  }
  return [...new Set(shortenedColors)]; // remove duplicates
}

// Calculate the normalized lengths of the given strings as proportions
function getStringLengths(strings) {
  const totalLength = strings.reduce((sum, str) => sum + str.length, 0);
  const proportionSum = strings.reduce((sum, str) => sum + (str.length / totalLength), 0);
  return strings.map(str => (str.length / totalLength) / proportionSum * 100);
}

const Phrases = getPhrases();
const Pallettes = [];
Phrases.forEach(phrase => {
  const hexColors = sentenceToHexColors(phrase);
  const shortenedColors = getRandomColors(hexColors, 15);
  Pallettes.push(shortenedColors);
});
const ProportionChance = getStringLengths(Phrases);

console.log(Pallettes);


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
        const color = colors[Math.floor(Math.random() * colors.length)];

        // Set the fill style and draw a 1x1 pixel at the current coordinates
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);

    }
  }
  }}

  const blendModes = ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'];

function colorCanvasVertical(ctx, Pallettes, ProportionChance) {
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

    // Choose a random blend mode from the array
    const blendMode = blendModes[Math.floor(Math.random() * blendModes.length)];
    
    // Set the blend mode for the current segment
    ctx.globalCompositeOperation = blendMode;

    // Loop through the x-coordinates of the canvas
    for (let y = 0; y < canvas.width; y++) {
      // Loop through the y-coordinates of the segment
      for (let x = i * width; x < (i + 1) * width; x++) {
        // Choose a random color from the palette
        const color = colors[Math.floor(Math.random() * colors.length)];

        // Set the fill style and draw a 1x1 pixel at the current coordinates
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }
}

const angle = (ProportionChance[0]) * 360;
ctx.rotate(angle);
function colorCanvasAngled(ctx, Pallettes, ProportionChance) {
const totalPercentage = ProportionChance.reduce((sum, percentage) => {
return sum + parseInt(percentage);
}, 0);
const segmentHeight = canvas.width / totalPercentage;
for (let i = 0; i < Pallettes.length; i++) {
const colors = Pallettes[i];
const y = i * segmentHeight;
const width = segmentHeight * parseInt(ProportionChance[i]);
const angle = (ProportionChance[i] / totalPercentage) * 360;
const blendMode = blendModes[Math.floor(Math.random() * blendModes.length)];

// Set the blend mode for the current segment
ctx.globalCompositeOperation = blendMode;

ctx.rotate(angle);
for (let y = 0; y < canvas.width; y++) {
  for (let x = i * width; x < (i + 1) * width; x++) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
  }
}
ctx.rotate(-angle);
}
}

colorCanvasHorizontal(ctx, Pallettes, ProportionChance);
colorCanvasVertical(ctx, Pallettes, ProportionChance);
colorCanvasAngled(ctx, Pallettes, ProportionChance)

//rotateCanvas(canvas, ProportionChance);

window.addEventListener("resize", () => colorCanvas(canvas));

