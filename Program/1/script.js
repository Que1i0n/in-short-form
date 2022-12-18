var Phrases = [];
var Pallettes = [];
var PropPalle = [];
var ProportionChance = [];


const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

//Turn phrases to Colour Schemes
function sentenceToHexColors(sentence) {
  var hexColors = [];
  var chars = sentence.split('');
  var numDigits = 0;
  chars.forEach(function(char) {
    var asciiCode = char.charCodeAt(0);
    var hexCode = asciiCode.toString(16);

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
//Read phrases from phrases.txt
function phrases() {
    var reading = [];
    var txtFile = "phrases.txt";

    // read text file using XMLHttpRequest
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", txtFile, false);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                var textData = rawFile.responseText;
                var rows = textData.split('\n');
                rows.forEach(function(row) {
                    var items = row.split('>');
                    items.forEach(function(item) {
                        reading.push(item);
                    });
                });
            }
        }
    };
    rawFile.send(null);
    // assign the reading array to the Phrases variable
    Phrases = reading;
    // return the Phrases array
    return Phrases;
}
//creates proportions of string lengths to total strings left
function getStringLengths(strings) {
  // total length of all strings
  const totalLength = strings.reduce((sum, str) => sum + str.length, 0);

  // sum of proportions
  const proportionSum = strings.reduce((sum, str) => sum + (str.length / totalLength), 0);

  // array of normalized proportions multiplied by 100 to express as percentages
  return strings.map(str => (str.length / totalLength) / proportionSum * 100);
}
phrases().forEach(function(phrase) {
  var hexColors = sentenceToHexColors(phrase); // get array of colors for phrase
  PropPalle.push(hexColors);
  var numColors = 15; // number of colors to keep in shortened array
  var shortenedColors = []; // array to hold shortened colors

  // pick colors randomly from original array and add to shortened array
  for (var i = 0; i < numColors; i++) {
    // check if hexColors is defined and in the correct scope
    if (typeof hexColors !== 'undefined') {
      // use hexColors array if it exists
      var index = Math.floor(Math.random() * hexColors.length);
      shortenedColors.push(hexColors[index]);
    } else {
      // use colors array returned by sentenceToHexColors function
      var index = Math.floor(Math.random() * hexColors.length);
      shortenedColors.push(hexColors[index]);
    }
  }

  shortenedColors = [...new Set(shortenedColors)];
  Pallettes.push(shortenedColors);
});
//logging result to check
const phraseProportions = Phrases;
const lengths = getStringLengths(phraseProportions);
ProportionChance = lengths

console.log(Pallettes) 

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
      // Split the palette into an array of colors
      const colors = Pallettes[i];
  
      // Calculate the y-coordinate and height of the segment
      const y = i * segmentHeight;
      const width = segmentHeight * parseInt(ProportionChance[i]);
  
      // Loop through the x-coordinates of the canvas
      for (let y = 0; y < canvas.width; y++) {
        // Loop through the y-coordinates of the segment
        for (let x = i * width; x < (i + 1) * width; x++) {
          // Choose a random color from the palette
          const color = colors[Math.floor(Math.random() * colors.length)];
  
          // Set the fill style and draw a 1x1 pixel at the current coordinates
          ctx.globalCompositeOperation = "multiply";
          ctx.fillStyle = color;
          ctx.fillRect(x, y, 1, 1);
          ctx.globalCompositeOperation = "source-over";
      }
    }
    }}



colorCanvasHorizontal(ctx, Pallettes, ProportionChance);
colorCanvasVertical(ctx, Pallettes, ProportionChance);

//rotateCanvas(canvas, ProportionChance);

window.addEventListener("resize", () => colorCanvas(canvas));

