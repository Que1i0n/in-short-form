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
  const shortenedColors = [];

  for (let i = 0; i < numColors; i++) {
    let index = Math.floor(prngno * colors.length);
    let counter = 0;
    while (shortenedColors.includes(colors[index])) {
    index = Math.floor(prngno * colors.length);
    counter++;
    if (counter > 3) {
    break;
    }
    }
    shortenedColors.push(colors[index]);
    }
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
  let lastX = 0;
  for (let i = 0; i < Pallettes.length; i++) {
    console.log("lastX: ", lastX);
    let colors = Pallettes[i];   
    let x = lastX;
    let y = parseInt(ProportionChance[i]*i);
    let width = Math.min((canvas.width / totalPercentage) * parseInt(ProportionChance[i])/2, canvas.width/2);
    let height = Math.min(canvas.height * (1/150-ProportionChance[i]), canvas.height);
    lastX += width/2;
    ctx.globalCompositeOperation = blendMode;
    ctx.fillStyle = colors[0];
    ctx.fillRect(x, y, width, height);
    console.log("colorCanvas",[i]);
    console.log("Rect sizes: ", "x: ",x,"y: ",y,"width: ",width," height: ",height);
  }
  let filename = `${startTime} - ${fxhash} - ${noZero(prngno)}`
  downloadCanvas(filename)
}

function colorCanvasAngled() {
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
/* Something's up with the drawing off screen and rectanlges bit, goingto run the script for a bit to try and fix
function colorCanvasAngled() {
  // Create an array to store the rectangles
  const rectangles = [];

  // Loop through the ProportionChance array
  for (let i = 0; i < ProportionChance.length; i++) {
    // Calculate the angle to rotate the canvas
    const angle = (ProportionChance[i] / prngno) * 360;
    ctx.rotate(angle);

    // Calculate the total percentage of all the ProportionChance values
    const totalPercentage = ProportionChance.reduce((sum, percentage) => {
      return sum + parseInt(percentage);
    }, 0);

    // Calculate the segment height for each color palette
    const segmentHeight = canvas.width / totalPercentage;

    // Loop through the Pallettes array
    for (let i = 0; i < Pallettes.length; i++) {
      const colors = Pallettes[i];
      // Calculate the angle to rotate the canvas
      const angle = (ProportionChance[i] / totalPercentage) * 360;
      ctx.globalCompositeOperation = blendMode;

      // Loop through each pixel in the segment
      for (let y = 0; y < canvas.width; y++) {
        for (let x = i * canvas.width; x < (i + 1) * canvas.width; x++) {
          // Rotate the canvas
          ctx.rotate(angle);
          // Get a random color from the colors array
          const color = colors[Math.floor(prngno * colors.length)];
          // Create a rectangle object and add it to the rectangles array
          rectangles.push({ x, y, width: 1, height: 1, color });
        }
      }
      // Reset the canvas rotation
      ctx.rotate(-angle);
    }
  }
  console.log("before rectanlge sorting: ", rectangles.length);
  const optimisedRectangles = optimiseRectangles(rectangles);

  // Loop through the rectangles array and draw each rectangle to the canvas
  console.log("after rectangle sorting: ", optimisedRectangles.length);
  optimisedRectangles.forEach(rect => {
    ctx.fillStyle = rect.color;
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
  });
}
*/
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
const start = new Date(startTime);
const end = new Date(getEndTime());
const elapsedTime = end - start;
let metadata = `fxhash:${prngno}\nPhrases:\n`;

// Add each phrase to the metadata string
for (let i = 0; i < Phrases.length; i++) {
  metadata += `${i + 1}. ${Phrases[i]}\n`;
}

// Add the remaining metadata to the string
metadata += `
dice:${diceQuant}
ProportionChance:${ProportionChance}
Pallettes:${JSON.stringify(Pallettes)}
blendMode:${blendMode}

startTime:${startTime}
endTime:${getEndTime()}

Elapsed${elapsedTime/1000}'s
`;

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
    console.log("fxhash():", prngno, "Phrases:", Phrases, "dice no.:", diceQuant, "ProportionChance:", ProportionChance, "Pallettes:", Pallettes, "blendMode:", blendMode);

    console.time("drawing");
    colorCanvas(ctx, Pallettes, ProportionChance, blendMode);

    //colorCanvasHorizontal(ctx, Pallettes, ProportionChance);
    colorCanvasVertical(ctx, Pallettes, ProportionChance, blendMode);
    
    for (let i = 0; i < 5; i++) {
      console.log("colorCanvasAngled start: ", i)
      colorCanvasAngled();

      console.log("fin.")    
      let filename = `${startTime} - ${fxhash} - Angled - ${[i]}`;
      downloadCanvas(filename);
      ctx.scale(4, 4);
    }
    let FinTiem = getEndTime();
    console.log("fxhash():", prngno, "Phrases:", Phrases, "dice no.:", diceQuant, "ProportionChance:", ProportionChance, "Pallettes:", Pallettes, "blendMode:", blendMode);
    let filename = `${startTime} - ${FinTiem} - ${fxhash}`;
    downloadCanvas(filename);
    downloadMetadata(filename);
    console.log("drawing took: ", FinTiem);
    triggerReload("Done!");
  }
  
  const canvas = document.getElementById("canvas");
  canvas.width = 3840;  // 4K resolution
  canvas.height = 2160;
  const ctx = canvas.getContext("2d");

  const pixelBatch = 100;

  let prngno = fxrand();
  let diceArray = nozeroArray(prngno);
  let diceQuant = diceArray[0];
  let diceMultiple = diceArray[0] * diceArray[1];
 
  const Phrases = getPhrases("Genesis.txt", diceQuant);
  const Pallettes = [];
  let palletteDepth = 3;
  const ProportionChance = getStringLengths(Phrases);
  const blendModes = ['normal', 'multiply', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'saturation'];
  const blendMode = blendModes[Math.floor(prngno * blendModes.length)];
  Phrases.forEach(phrase => {
    const hexColors = sentenceToHexColors(phrase);
    const shortenedColors = getRandomColors(hexColors, palletteDepth);  // <--- colour pallette depth
    Pallettes.push(shortenedColors);
  });


  draw();
 // console.log("fxhash():", prngno, "Phrases:", Phrases, "dice no.:", diceQuant, "ProportionChance:", ProportionChance, "Pallettes:", Pallettes, "blendMode:", blendMode);


