
  // the program

  function noZero(prngno) {
    // Shift the decimal place one digit to the right and convert to an integer
    const digit1 = parseInt(prngno * 10);
    // Subtract the integer part to remove it
    prngno -= digit1;
    // Shift the decimal place one digit to the right and convert to an integer
    const digit2 = parseInt(prngno * 10);
    // Return the first and second digits as diceQuant and diceMultiple, respectively
    return {
      diceQuant: digit1,
      diceMultiple: digit1 * digit2,
    };
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

function cleanPhrases(phrases) {
    const cleanedPhrases = [];
    for (const phrase of phrases) {
      // Use a regular expression to match and remove the pattern "some characters, a number a : and another number and a space" from the start of the phrase
      const cleanedPhrase = phrase.replace(/^[a-zA-Z]+\d+:\d+\s/, '');
      cleanedPhrases.push(cleanedPhrase);
    }
    return cleanedPhrases;
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

function getRandomColors(colors, numColors, prngno) {
    const shortenedColors = [];
  
    // Initialize the PRNG with a seed value
    let seed = prngno;
    function prng() {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    }
  
    for (let i = 0; i < numColors; i++) {
      // Generate a new random number using the PRNG
      const Newprngno = prng();
      const index = Math.floor(Newprngno * Math.min(colors.length, numColors));
      shortenedColors.push(colors[index]);
    }
  
    return shortenedColors;
  }
  

function getStringLengths(strings) {
  const totalLength = strings.reduce((sum, str) => sum + str.length, 0);
  const proportionSum = strings.reduce((sum, str) => sum + (str.length / totalLength), 0);
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


*/

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
function downloadCanvas(fileName, prngno, Phrases, diceQuant, ProportionChance, Pallettes, blendMode) {
  let metadata = `fxhash:${prngno}\nPhrases:\n`;
  for (let i = 0; i < Phrases.length; i++) {
    metadata += `${i + 1}. ${Phrases[i]}\n`;
  }
  metadata += `dice:${diceQuant}\nProportionChance:${ProportionChance}\nPallettes:${JSON.stringify(Pallettes)}\nblendMode:${blendMode}`;

  //const metadata = `fxhash:${prngno}\nPhrases:${Phrases}\ndice:${diceQuant}\nProportionChance:${ProportionChance}\nPallettes:${JSON.stringify(Pallettes)}\nblendMode:${blendMode}`;

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
}
function draw(ctx, Pallettes, ProportionChance, blendMode) {
colorCanvas(ctx, Pallettes, ProportionChance, blendMode);

//colorCanvasHorizontal(ctx, Pallettes, ProportionChance);
colorCanvasVertical(ctx, Pallettes, ProportionChance, blendMode);

for (let i = 0; i < 5; i++) {
    colorCanvasAngled(ctx, Pallettes, ProportionChance, blendMode, pixelBatch);
    ctx.scale(4, 4);
}
console.log("fxhash():", prngno, "Phrases:", Phrases, "dice no.:", diceQuant, "ProportionChance:", ProportionChance, "Pallettes:", Pallettes, "blendMode:", blendMode);
downloadCanvas(fxhash, prngno, Phrases, diceQuant, ProportionChance, Pallettes, blendMode);
}
  
  const canvas = document.getElementById("canvas");
  canvas.width = 3840;  // 4K resolution
  canvas.height = 2160;
  const ctx = canvas.getContext("2d");

  const pixelBatch = 100;

  let prngno = fxrand();
  let diceMultiple = 4;
  let diceQuant = 2; 
   
  const Phrases = getPhrases("Genesis.txt", diceQuant);
  const Pallettes = [];
  let palletteDepth = 3;
  const ProportionChance = getStringLengths(Phrases);
  const blendModes = ['normal', 'multiply', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference'];
  const blendMode = blendModes[Math.floor(prngno * blendModes.length)];
 
  const cleanedPhrases = cleanPhrases(Phrases);

  // Generate the hexadecimal color codes for each cleaned phrase
  cleanedPhrases.forEach(phrase => {
    const hexColors = sentenceToHexColors(phrase);
    // Select a random subset of colors using the getRandomColors function
    const shortenedColors = getRandomColors(hexColors, palletteDepth);
    Pallettes.push(shortenedColors);
  });

  Phrases.forEach(phrase => {
    const hexColors = sentenceToHexColors(phrase);
    const shortenedColors = getRandomColors(hexColors, palletteDepth, prngno);  // <--- colour pallette depth
    Pallettes.push(shortenedColors);
  });


  console.log(diceQuant, diceMultiple);  

  draw(ctx, Pallettes, ProportionChance, blendMode);

console.log("diceQuant:", diceQuant, "diceMultiple:", diceMultiple);
console.log(diceQuant);

 // console.log("fxhash():", prngno, "Phrases:", Phrases, "dice no.:", diceQuant, "ProportionChance:", ProportionChance, "Pallettes:", Pallettes, "blendMode:", blendMode);
  
