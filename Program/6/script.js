let isCalculating = false;
let hasError = false;
let statusMessage = '';
let previousStatusMessage = '';

// Create a new Worker object
//const worker = new Worker('status-worker.js');

// Listen for messages from the worker
//worker.onmessage = (event) => {
  // Set the background color of the statusIndicator element
//  document.querySelector('#statusIndicator').style.backgroundColor = event.data;
//};

// Update the status when the variables change
//setInterval(() => {
  // Send a message to the worker with the current status information
//  worker.postMessage({ statusMessage, hasError, isCalculating });
//}, 100);

// If the hasError flag is set, log an orange circle to the console
//if (hasError) {  console.log('%c \u25CF', 'color: orange; font-size: 16px');}

  

  // the program

function noZero(prngno) {
  isCalculating = true;
  statusMessage = 'Calculating non-zero digits';
  
  const parts = String(prngno).split('.');
  const digits = parts[1] ? parts[1].split('') : [];
  for (let i = 0; i < digits.length; i++) {
    if (digits[i] !== '0') {
      isCalculating = false;
      statusMessage = 'Calculation complete';
      return parseInt(digits[i]);
    }
  }
  if (parts[0]) {
    const digits = parts[0].split('');
    for (let i = 0; i < digits.length; i++) {
      if (digits[i] !== '0') {
        isCalculating = false;
        statusMessage = 'Calculation complete';
        return parseInt(digits[i]);
      }
    }
  }
  hasError = true;
  statusMessage = 'No non-zero digits found';
  console.error('No non-zero digits found');
  isCalculating = false;
  return 1;
}

function getPhrases(filePath, number) {
  isCalculating = true;
  statusMessage = 'Retrieving phrases';
  
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
        const numDice = noZero(number);
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
      } else {
        hasError = true;
        statusMessage = `Error retrieving file: ${rawFile.statusText}`;
      }
    }
  };

  rawFile.send(null);

  isCalculating = false;
  statusMessage = 'Phrase retrieval complete';
  return reading;
}

function sentenceToHexColors(sentence) {
  isCalculating = true;
  statusMessage = 'Converting sentence to hex colors';

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

  isCalculating = false;
  statusMessage = 'Conversion complete';
  return hexColors;
}

function getRandomColors(colors, numColors) {
  isCalculating = true;
  statusMessage = 'Selecting random colors';
  
  const shortenedColors = [];

  for (let i = 0; i < numColors; i++) {
    const index = Math.floor(prngno * colors.length);
    shortenedColors.push(colors[index]);
  }

  isCalculating = false;
  statusMessage = 'Selection complete';
  return shortenedColors;
}

function getStringLengths(strings) {
  isCalculating = true;
  statusMessage = 'Calculating string lengths';
  
  const totalLength = strings.reduce((sum, str) => sum + str.length, 0);
  const proportionSum = strings.reduce((sum, str) => sum + (str.length / totalLength), 0);
  isCalculating = false;
  statusMessage = 'Calculation complete';
  return strings.map(str => (str.length / totalLength) / proportionSum * 100);
}
/*
function colorCanvasHorizontal(ctx, Pallettes, ProportionChance) {
  isCalculating = true;
  statusMessage = 'Coloring canvas';
  
  if (!Array.isArray(ProportionChance)) {
      ProportionChance = [ProportionChance];
  }

  const totalPercentage = ProportionChance.reduce((sum, percentage) => {
      return sum + parseInt(percentage);
  }, 0);
  const segmentHeight = canvas.height / totalPercentage; 
  for (let i = 0; i < Pallettes.length; i++) {
    const colors = Pallettes[i];
    const y = i * segmentHeight;
    const height = segmentHeight * parseInt(ProportionChance[i]);
      for (let x = 0; x < canvas.width; x++) {
          for (let y = i * height; y < (i + 1) * height; y++) {
              ctx.fillStyle = colors[x % colors.length];
              ctx.fillRect(x, y, 1, 1);
          }
      }
  }

  isCalculating = false;
  statusMessage = 'Canvas coloring complete';
}
*/
function colorCanvasVertical(ctx, Pallettes, ProportionChance, blendMode) {
  isCalculating = true;
  statusMessage = 'Coloring canvas vertically';

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
    }
  }

  isCalculating = false;
  statusMessage = 'Vertical canvas coloring complete';
}


function colorCanvas(ctx, Pallettes, ProportionChance, blendMode) {
  isCalculating = true;
  statusMessage = 'Coloring canvas';

  if (!Array.isArray(ProportionChance)) {
    proportionChance = [proportionChance];
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

  isCalculating = false;
  statusMessage = 'Canvas coloring complete';
}

function colorCanvasAngled(ctx, Pallettes, ProportionChance, blendMode) {
  isCalculating = true;
  statusMessage = 'Coloring canvas at an angle';

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

  isCalculating = false;
  statusMessage = 'Angled canvas coloring complete';
}

function downloadCanvas(fileName, prngno, Phrases, diceQuant, ProportionChance, Pallettes, blendMode) {
  isCalculating = true;
  statusMessage = 'Downloading canvas and metadata';

  const metadata = `fxhash:${prngno}\nPhrases:${Phrases}\ndice:${diceQuant}\nProportionChance:${ProportionChance}\nPallettes:${Pallettes}\nblendMode:${blendMode}`;

  const imageDataURL = canvas.toDataURL();
  const imageLink = document.createElement("a");
  imageLink.href = imageDataURL;
  imageLink.download = fileName;
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

  isCalculating = false;
  statusMessage = 'Canvas and metadata download complete';
}

  
  function draw(ctx, Pallettes, ProportionChance, blendMode) {
    isCalculating = true;
    statusMessage = 'Drawing canvas';
    
    colorCanvas(ctx, Pallettes, ProportionChance, blendMode);

    //colorCanvasHorizontal(ctx, Pallettes, ProportionChance);
    colorCanvasVertical(ctx, Pallettes, ProportionChance, blendMode);
    
    for (let i = 0; i < 5; i++) {
      colorCanvasAngled(ctx, Pallettes, ProportionChance, blendMode);
      ctx.scale(4, 4);
    }
    console.log("fxhash():", prngno, "Phrases:", Phrases, "dice no.:", diceQuant, "ProportionChance:", ProportionChance, "Pallettes:", Pallettes, "blendMode:", blendMode);
    downloadCanvas(fxhash, prngno, Phrases, diceQuant, ProportionChance, Pallettes, blendMode);
  
    isCalculating = false;
    statusMessage = 'Canvas drawing complete';
  }
  
  const canvas = document.getElementById("canvas");
  canvas.width = 3840;  // 4K resolution
  canvas.height = 2160;
  const ctx = canvas.getContext("2d");
  let prngno = fxrand();
  let diceQuant = noZero(prngno);
  const Phrases = getPhrases("Genesis.txt", diceQuant);  
  const Pallettes = [];
  let palletteDepth = 3;
  const ProportionChance = getStringLengths(Phrases);
  const blendModes = ['normal', 'multiply', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'luminositiy'];
  const blendMode = blendModes[Math.floor(prngno * blendModes.length)];
  Phrases.forEach(phrase => {
    const hexColors = sentenceToHexColors(phrase);
    const shortenedColors = getRandomColors(hexColors, palletteDepth);  // <--- colour pallette depth
    Pallettes.push(shortenedColors);
  });
  draw(ctx, Pallettes, ProportionChance, blendMode);
 // console.log("fxhash():", prngno, "Phrases:", Phrases, "dice no.:", diceQuant, "ProportionChance:", ProportionChance, "Pallettes:", Pallettes, "blendMode:", blendMode);
  

