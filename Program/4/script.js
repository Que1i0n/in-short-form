  // Derive in Genesis
const initTime = Date.now();
const date = new Date(initTime);
const year = date.getFullYear();
const month = `0${date.getMonth() + 1}`.slice(-2);
const day = `0${date.getDate()}`.slice(-2);
const hours = `0${date.getHours()}`.slice(-2);
const minutes = `0${date.getMinutes()}`.slice(-2);
const formattedDate = `${year}/${month}/${day} | ${hours}:${minutes}`;
const startTime = formattedDate;
const canvas = document.getElementById("canvas");
canvas.width = 3840;  // 4K resolution
canvas.height = 2160;
//3840;
const ctx = canvas.getContext("2d");

let prngno = fxrand();
let diceArray = nozeroArray(prngno);
let diceQuant = diceArray[0];
let diceMultiple = diceArray[0] * diceArray[1];

let AngledData = [];
let usedColors = [];

const Phrases = getPhrases("Genesis.txt", diceQuant);
let Pallettes = [];
//let Pallettes =  [['#000E38',' #0E2C58','#0A2518','#9C4A10','#E0A871','#D8863E'],['#BD2136','#863526','#1F2928','#A4B6D2','#25130C','#5A2011'],['#0B0805','#352D21','#5F5444','#92836E','#B6C4CC','#196ECF'],['#1A060F','#061A4B','#635411','#C1AA11','#A20946','#C5EBAA'],['#210803','#511C11','#EC1C09','#951709','#926D72','#C7B9C2'],['#0C61F7','#022CBF','#011581','#01084A','#020420','#010107'],['#798152','#626C4D','#4B5028','#646931','#3B443D','#515644'],['#3A420D','#141A07','#72750A','#B3A822','#5C543A','#DFC76F']]
let palletteDepth = 5;
const ProportionChance = getStringLengths(Phrases);
const blendModes = ['color-dodge','color-dodge', 'lighten', 'darken', 'color-dodge'];
//const blendModes = ['overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light']
//['multiply', 'color-dodge', 'color-burn', 'hard-light', 'soft-light'];
const blendMode = blendModes[Math.floor(prngno * blendModes.length)];
Phrases.forEach(phrase => {
  const hexColors = sentenceToHexColors(phrase);
  let shortenedColors = getRandomColors(hexColors, palletteDepth);  // <--- colour pallette depth
  Pallettes.push(shortenedColors);
});

let rectangles = [];
let currentRectangleIndex = 0;
const pixelBatch = 1;
let iterations = ((ProportionChance.length - 1) * (4)) / (8) + 2


// the program
function noZero(prngno) {
  const parts = String(prngno).split('.');
  const digits = parts[1] ? parts[1].split('') : [];
  for (let i = 0; i < digits.length; i++) {
    if (digits[i] !== '0') {
      return digits[i] === '1' ? 1 : parseInt(digits[i]);
      //return parseInt(digits[i]);
    }
  }
  if (parts[0]) {
    const digits = parts[0].split('');
    for (let i = 0; i < digits.length; i++) {
      if (digits[i] !== '0') {
        return digits[i] === '1' ? 1 : parseInt(digits[i]);
        //return parseInt(digits[i]);
      }
    }
  }

  // If no non-zero digits were found, log an error message to the console and return 1
  console.error('No non-zero digits found');
  return 1;
}
function nozeroArray(prngno) {
  const parts = String(prngno).split('.');
  const digits = parts[1] ? parts[1].split('') : [];
  let nonZeroDigits = [];
  for (let i = 0; i < digits.length; i++) {
    if (digits[i] !== '0') {
      nonZeroDigits.push(parseInt(digits[i]));
    }
  }
  if (parts[0]) {
    const digits = parts[0].split('');
    for (let i = 0; i < digits.length; i++) {
      if (digits[i] !== '0') {
        nonZeroDigits.push(parseInt(digits[i]));
      }
    }
  }

  // If no non-zero digits were found, log an error message to the console and return an array with a single element 1
  if (nonZeroDigits.length === 0) {
    console.error('No non-zero digits found');
    return [1];
  }

  return nonZeroDigits;
}
 function getPhrases(filePath, number) {
  const reading = [];
  const rawFile = new XMLHttpRequest();
  rawFile.open("GET", filePath, false);
  rawFile.onreadystatechange = function() {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status == 0) {
        const textData = rawFile.responseText;
        const rows = textData.split('\n');
        var startRow = 0;
        var skipInterval = 1;
        const numDice = number;
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
function sentenceToHexColors(sentence) {
  sentence = sentence.replace(/\d+:\d+\s/, '');
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
function getRandomColors(colors, numColors) {
  const rsColors = [];
  for (let i = 0; i < numColors; i++) {
    let index = Math.floor(prngno * colors.length);
    let counter = 0;
    while (rsColors.includes(colors[index])) {
    index = Math.floor(prngno * colors.length);
    counter++;
    if (counter > 3) {
    break;
    }
    }
    rsColors.push(colors[index]);
    colors.splice(index, 1); // <--- remove the chosen color from colors
    }
 return rsColors;
}
function getStringLengths(strings) {
  const totalLength = strings.reduce((sum, str) => sum + str.length, 0);
  const proportionSum = strings.reduce((sum, str) => sum + (str.length / totalLength), 0);
  return strings.map(str => (str.length / totalLength) / proportionSum * 100);
}
function optimiseRectangles(rectangles) {  
  for (let i = 0; i < rectangles.length - 1; i++) {
    const currentRect = rectangles[i];
    const nextRect = rectangles[i + 1];
    if (currentRect.color === nextRect.color) {
      if (currentRect.x === nextRect.x && currentRect.y + currentRect.height === nextRect.y) {
        // Combine rectangles in the same column
        currentRect.height += nextRect.height;
        rectangles.splice(i + 1, 1);
        i--;
      } else if (currentRect.y === nextRect.y && currentRect.x + currentRect.width === nextRect.x) {
        // Combine rectangles in the same row
        currentRect.width += nextRect.width;
        rectangles.splice(i + 1, 1);
        i--;
      }
    }
  

  return rectangles;
}
}
function colorCanvasVertical(ctx, Pallettes, ProportionChance, blendMode) {
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
//      ctx.drawImage(canvas, 0, 0);
    }
  }
}
function colorCanvas(ctx, Pallettes, ProportionChance, blendMode) {
  const totalPercentage = ProportionChance.reduce((sum, percentage) => {
    return sum + parseInt(percentage);
  }, 0);
  //const segmentSize = Math.max(canvas.width, canvas.height) / totalPercentage; 
  let lastWidth = Math.min((canvas.width / totalPercentage) * parseInt(ProportionChance[0]), canvas.width);
  let lastHeight = Math.min((canvas.height / totalPercentage) * parseInt(ProportionChance[0]), canvas.height);
  let a = nozeroArray(prngno);

    for (let i = 0; i < iterations; i++) {
      let colors = Pallettes[i];
      // Generate random width and height for the bar
      let width = Math.min(lastWidth, canvas.width)/(i+1);
      let height = Math.min(lastHeight, canvas.height)/(i+1);
  
      // Generate random x and y for the bar
      let x = 1/diceArray[i] * (canvas.width - width);
      let y = 1/diceArray[i] * (canvas.height - height);

      console.log("lastX: ", lastWidth);
      console.log("lastY: ", lastHeight);
  
      lastHeight += height;
      lastWidth += width;
      ctx.globalCompositeOperation = blendModes[Math.floor(prngno)];
      console.log(colors);   
      ctx.fillStyle = colors[Math.floor(prngno * 5) + 1];
      // Check if we should draw a vertical or horizontal bar
      if (i % 2 == 0) {
        // Draw a vertical bar
        ctx.fillRect(x, 0, width, canvas.height);
      } else {
        // Draw a horizontal bar
        ctx.fillRect(0, y, canvas.width, height);
      }
    }
}
function colorCanvasNew(ctx, Pallettes, ProportionChance, blendMode) {
  const totalPercentage = ProportionChance.reduce((sum, percentage) => {
    return sum + parseInt(percentage);
  }, 0);
  //const segmentSize = Math.max(canvas.width, canvas.height) / totalPercentage; 
  let lastWidth = Math.min((canvas.width / totalPercentage) * parseInt(ProportionChance[0]), canvas.width);
  let lastHeight = Math.min((canvas.height / totalPercentage) * parseInt(ProportionChance[0]), canvas.height);
  let a = nozeroArray(prngno);

  for (let i = 0; i < iterations; i++) {
    let colors = Pallettes[Math.min(i, diceQuant-1)];
    // Generate random width and height for the bar
    let width = Math.min(lastWidth, canvas.width);
    let height = Math.min(lastHeight, canvas.height)/(i+1);

    // Set x to 0 and y to a random value
    let x = 0;
    let y = 1/diceArray[i] * (canvas.height - height);

    console.log("lastX: ", lastWidth);
    console.log("lastY: ", lastHeight);

    lastHeight += height;
    lastWidth += width;
    ctx.globalCompositeOperation = blendModes[Math.floor(prngno)];
    console.log(colors);
    ctx.fillStyle = colors[Math.min((Math.floor(prngno * 5) + 1), palletteDepth)];
    // Draw a vertical bar
    ctx.fillRect(x, y, width, canvas.height);
    // Rotate the canvas by ProportionChance[i]
    ctx.rotate(ProportionChance[i]);
  }
}
function colorCanvasAngled() {
  let counter = 0;
  //ctx.translate(canvas.width/2, canvas.height/2);
  for (let i = 0; i < (iterations/2); i++) {
    const angle = (ProportionChance[i] / prngno) ;
    ctx.rotate(angle);
    const totalPercentage = ProportionChance.reduce((sum, percentage) => {
      return sum + parseInt(percentage);
    }, 0);
    AngledData.push(`\nAngled Outer iteration [${[i]}], ProportionChance[i]: ${ProportionChance[i]}, totalPercentage: ${totalPercentage}, angle: ${angle}`);
    const segmentHeight = canvas.width / totalPercentage;
    for (let i = 0; i < 3; i++) {
      const colors = Pallettes[Math.min(i, Pallettes.length-1)];
      const angle = (ProportionChance[i] / totalPercentage) * 360;
      AngledData.push(`\nAngled Inner iteration [${[i]}], angle: ${angle} \n colors: ${colors}`)
      ctx.globalCompositeOperation = blendMode;
      let usedInnerColors = [];
      const color = colors[Math.floor((diceArray[counter]/10) * palletteDepth) % palletteDepth];
      console.log(color);
      usedInnerColors.push(color);
     // for (let x = 0; x < canvas.width/2; x++) {
  //      if (x % i == 0){
        for(let y = 0; y < canvas.height; y++) {
  //        if (y % i == 0){
         for (let x = 0; x < canvas.width; x++) {
  //      for (let x = i * canvas.width; x < (i + 1) * canvas.width; x++) {
          ctx.rotate(angle);
          ctx.fillStyle = color;
          ctx.fillRect(x, y, 1, 1);
        }
      }
      ctx.rotate(-angle);
    usedColors.push(`\n Inner iterations usedInnerColors: ${usedInnerColors}`);
    counter += 1;
    }
    ctx.scale(4,4);
  }
  //ctx.scale(4,4);
}
async function triggerReload(text) {
  try {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();    
    await navigator.clipboard.writeText(textarea.value);
    document.body.removeChild(textarea);
  } catch (error) {
    console.error(error);
  }
}
function downloadCanvas(fileName) {
  const imageDataURL = canvas.toDataURL();
  const imageLink = document.createElement("a");
  imageLink.href = imageDataURL;
  imageLink.download = `${fileName}`;
  document.body.appendChild(imageLink);
  imageLink.click();
  document.body.removeChild(imageLink);
};
function downloadMetadata(fileName) {
const start = initTime;
const end = Date.now();
const elapsedTime = end - start;
let metadata = `\n fxhash:${fxhash} \n ${prngno} \n\nPhrases:\n`;

// Add each phrase to the metadata string
for (let i = 0; i < Phrases.length; i++) {
  metadata += `${i + 1}. ${Phrases[i]}\n`;
}

// Add the remaining metadata to the string
metadata += `
dice: ${diceQuant}
ProportionChance: ${ProportionChance}
iterations: ${iterations}

Pallettes: ${JSON.stringify(Pallettes)}
blendMode :${blendMode}

startTime:${startTime}
endTime:${getEndTime()}
elapsedTime ${elapsedTime}
`;

metadata += `\n Used Colours \n ${usedColors}`;
metadata += `\n Angled Data \n \n ${AngledData}`;

const metadataBlob = new Blob([metadata], {type: 'text/plain'});
const metadataUrl = URL.createObjectURL(metadataBlob);
const metadataLink = document.createElement("a");
metadataLink.href = metadataUrl;
metadataLink.download = `${fileName}.txt`;
document.body.appendChild(metadataLink);
metadataLink.click();
document.body.removeChild(metadataLink);

}  
function getEndTime() {
let finTime = Date.now();
let findate = new Date(finTime);
let finyear = findate.getFullYear();
let finmonth = `0${findate.getMonth() + 1}`.slice(-2);
let finday = `0${findate.getDate()}`.slice(-2);
let finhours = `0${findate.getHours()}`.slice(-2);
let finminutes = `0${findate.getMinutes()}`.slice(-2);
let finformattedDate = `${finyear}/${finmonth}/${finday} | ${finhours}:${finminutes}`;
let ENDTime = finformattedDate;

  return ENDTime;
}
  



function draw(  ) {
  console.log("fxhash():", prngno, "Phrases:", Phrases, "dice no.:", diceQuant, "ProportionChance:", ProportionChance,"iterations: ", iterations, "Pallettes:", Pallettes, "blendMode:", blendMode);
  
  console.time("drawing");
  //colorCanvasNew(ctx, Pallettes, ProportionChance, blendMode);

  //let filename1 = `${startTime} - ${fxhash} - ${noZero(prngno)}`
  //downloadCanvas(filename1)
  //colorCanvasHorizontal(ctx, Pallettes, ProportionChance);
  //colorCanvasVertical(ctx, Pallettes, ProportionChance, blendMode);
  
  for (let i = 0; i < 5; i++) {
    console.log("colorCanvasAngled start: ", i)
    colorCanvasAngled();
    console.log("fin.")    
    //let filename = `${startTime} - ${fxhash} - Angled - ${[i]}`;
    //downloadCanvas(filename);
  }

  console.log("fxhash():", prngno, "Phrases:", Phrases, "dice no.:", diceQuant, "ProportionChance:", ProportionChance, "Pallettes:", Pallettes, "blendMode:", blendMode);
  let filename = `${startTime} - ${fxhash}`
  downloadCanvas(filename);
  downloadMetadata(filename);
  triggerReload("Done!");
}
  



  draw();
 // console.log("fxhash():", prngno, "Phrases:", Phrases, "dice no.:", diceQuant, "ProportionChance:", ProportionChance, "Pallettes:", Pallettes, "blendMode:", blendMode);


