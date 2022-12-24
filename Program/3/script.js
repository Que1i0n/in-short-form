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
    const index = Math.floor(fxrand() * colors.length);
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



let positions = [];
let currentX = 0;
let currentY = 0;

for (let i = 0; i < sentences.length; i++) {
  let sentence = Phrases[i];
  let sentencePositions = positionLetters(sentence, currentX, currentY);
  positions = positions.concat(sentencePositions);
  currentY += 20; // Move down 20 pixels for the next sentence
}

console.log(positions);

// Use the positions to draw the sentences
function draw() {
  for (let i = 0; i < positions.length; i++) {
    let position = positions[i];
    fill(255);
    ellipse(position.x, position.y, 5, 5); // Draw a tiny dot at each position
  }
}

