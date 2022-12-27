let isCalculating = false;
let hasError = false;
let statusMessage = '';



  // error and status reporting

  const statusIndicator = document.getElementById('status-indicator');

  function updateStatus() {
    if (hasError) {
      statusIndicator.style.backgroundColor = 'red';
    } else if (isCalculating) {
      statusIndicator.style.backgroundColor = 'yellow';
    } else {
      statusIndicator.style.backgroundColor = 'green';
    }
  }
  
  setInterval(updateStatus, 100);
  
  console.log(statusMessage);
  
  if (hasError) {
    console.log('%c \u25CF', 'color: orange; font-size: 16px');
  }
  
  

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

function downloadCanvas(fileName) {
  isCalculating = true;
  statusMessage = 'Downloading canvas';

  const dataURL = canvas.toDataURL();
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  isCalculating = false;
  statusMessage = 'Canvas download complete';
  }
  
  function draw(ctx, Pallettes, ProportionChance, blendMode) {
    isCalculating = true;
    statusMessage = 'Drawing canvas';
  
    colorCanvasHorizontal(ctx, Pallettes, ProportionChance);
    colorCanvasVertical(ctx, Pallettes, ProportionChance, blendMode);
    for (let i = 0; i < 5; i++) {
      colorCanvasAngled(ctx, Pallettes, ProportionChance, blendMode);
      ctx.scale(4, 4);
    }
    downloadCanvas(fxhash);
  
    isCalculating = false;
    statusMessage = 'Canvas drawing complete';
  }
  
  const canvas = document.getElementById("canvas");
  canvas.width = 3840;  // 4K resolution
  canvas.height = 2160;
  const ctx = canvas.getContext("2d");
  let prngno = fxrand();
  let diceQuant = noZero(prngno);
  const Phrases = getPhrases("kjv.txt", diceQuant);  
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
  console.log("fxhash():", prngno, "Phrases:", Phrases, "dice no.:", diceQuant, "ProportionChance:", ProportionChance, "Pallettes:", Pallettes, "blendMode:", blendMode);
  

