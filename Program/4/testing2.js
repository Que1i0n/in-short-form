  //Testing for Derive in Genesis
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
  canvas.width = 5;  // 4K resolution
  canvas.height = 5;
  const ctx = canvas.getContext("2d");
  
  let prngno = fxrand();
  let diceArray = nozeroArray(prngno);
  let diceQuant = diceArray[0];
  let diceMultiple = diceArray[0] * diceArray[1];
  
  let AngledData = [];
  
  const Phrases = getPhrases("Genesis.txt", diceQuant);
  let Pallettes = [];
  let palletteDepth = diceArray[0];
  const ProportionChance = getStringLengths(Phrases);
  const blendModes = ['multiply', 'color-dodge', 'color-burn', 'hard-light', 'soft-light'];
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


  


function colorCanvasAngled() {
    for (let i = 0; i < iterations; i++) {
      const angle = (ProportionChance[i] / prngno) ;
      ctx.rotate(angle);
      const totalPercentage = ProportionChance.reduce((sum, percentage) => {
        return sum + parseInt(percentage);
      }, 0);
      AngledData.push(`\nAngled Outer iteration [${[i]}], ProportionChance[i]: ${ProportionChance[i]}, totalPercentage: ${totalPercentage}, angle: ${angle}`);
      const segmentHeight = canvas.width / totalPercentage;
      for (let i = 0; i < Pallettes.length; i++) {
        const colors = Pallettes[i];
        const angle = (ProportionChance[i] / totalPercentage) * 360;
        AngledData.push(`\nAngled Inner iteration [${[i]}], angle: ${angle} \n colors: ${colors}`)
        ctx.globalCompositeOperation = blendMode;
        const color = colors[Math.min(Math.floor(noZero(prngno) * colors.length), colors.length - 1)];
        for (let y = 0; y < canvas.height; y++) {
          for(let x = 0; x < canvas.width; x++) {
          //for (let x = i * canvas.width; x < (i + 1) * canvas.width; x++) {
            ctx.rotate(angle);
            ctx.fillStyle = color;
            ctx.fillRect(x, y, 1, 1);
          }
        }
        ctx.rotate(-angle);
      }
    }
    ctx.scale(4,4);
  }

  function draw() {
    for (let i = 0; i < 5; i++) {
      console.log("colorCanvasAngled start: ", i)
      colorCanvasAngled();
      console.log("fin.")
    }
    console.log("fxhash():", prngno, "Phrases:", Phrases, "dice no.:", diceQuant, "ProportionChance:", ProportionChance, "Pallettes:", Pallettes, "blendMode:", blendMode);
    let filename = `${startTime} - ${fxhash}`
    downloadCanvas(filename);
    downloadMetadata(filename);
  }
    
  
  
  
    draw();