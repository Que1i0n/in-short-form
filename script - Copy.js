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

  // Return the hexColors array instead of logging it to the console
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
  var numColors = 5; // number of colors to keep in shortened array
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

var PalPerc = percentagePalletes(ProportionChance, Pallettes);


// create array of color palettes and their respective chances
function percentagePalletes(ProportionChance, Pallettes) {
  // Make sure the arrays have the same length
  if (ProportionChance.length !== Pallettes.length) {
    return "Error: arrays have different lengths";
  }

  // Create an empty result array
  const palperc = [];

  // Calculate the sum of the percentage values
  const sum = ProportionChance.reduce((a, b) => a + b, 0);

  // Calculate the factor to adjust the percentage values
  const factor = 100 / sum;

  // Loop through the arrays and combine the corresponding elements
  for (let i = 0; i < ProportionChance.length; i++) {
    const truncatedPercentage = Math.trunc(ProportionChance[i] * factor);
    
    palperc.push(`${truncatedPercentage} - [${Pallettes[i].join(", ")}]`);
  }

  // Return the result array
  return palperc;
  
}
  
function colorCanvas(canvas, PalPerc) {
  // Get the 2D context of the canvas
  const ctx = canvas.getContext("2d");

  // Calculate the total sum of the percentages
  const totalPercentage = PalPerc.reduce((sum, segment) => {
    const [percentage] = segment.split(" - [");
    return sum + parseInt(percentage);
  }, 0);

  // Calculate the height of each segment based on its percentage
  const segmentHeight = canvas.height / totalPercentage;

  // Loop through the segments
  for (let i = 0; i < PalPerc.length; i++) {
    // Parse the percentage and palette from the current segment
    const [percentage, palette] = PalPerc[i].split(" - [");
    const colors = palette.split(", ");

    // Calculate the starting y coordinate of the segment
    const y = i * segmentHeight;


    // Calculate the height of the segment based on its percentage value
    const height = segmentHeight * parseInt(percentage);

    // Loop through the pixels in the segment
    for (let x = 0; x < canvas.width; x++) {
      for (let y = i * height; y < (i + 1) * height; y++) {
        // Choose a random color from the palette
        const color = colors[Math.floor(Math.random() * colors.length)];

        // Set the pixel color
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
        
      }
    }
  } 
}
function roll(){
  // Define the maxrotate array
  var maxrotate = ProportionChance.map(x => Math.trunc(x));

  // Initialize the rotation array with the starting value of 0 rotation
  var rotation = Array(maxrotate.length).fill(0);

  // Loop through the maxrotate array and rotate each segment of the canvas
  for (var i = 0; i < maxrotate.length; i++){         
    if (rotation[i] < maxrotate[i]){
      // Increment the rotation for this segment
      rotation[i]++;

      // Rotate the canvas by the current rotation value
      ctx.save();
      ctx.rotate(canvas, rotation[i]);
      ctx.drawImage(canvas, 0, 0);
      ctx.globalCompositeOperation = "lighten";
      ctx.drawImage(canvas, 0, 0);
      ctx.restore();
    }
  }
};




window.addEventListener("resize", () => colorCanvas(canvas, PalPerc));

console.log(PalPerc);