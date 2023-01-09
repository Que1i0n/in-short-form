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
  canvas.width = 3840;  // 4K resolution
  canvas.height = 2160;
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

  function colorCanvasNew() {
    // Pick a random entry in Pallettes
    let colors = Pallettes[Math.floor(prngno * Pallettes.length)];
    console.log(colors);

    // Iterate through the colors array
    for (let i = 0; i < colors.length; i++) {
    // Set initial x and y to random values
    let width = Math.floor((prngno*[i]) * canvas.width);
    let height = Math.floor((prngno*[i]) * canvas.height);
    
    // Set initial width and height to random values
    let x = Math.floor((prngno*[i]) * (canvas.width - width));
    let y = Math.floor((prngno*[i]) * (canvas.height - height));
    
  // Limit the x coordinate to the maximum dimensions of the canvas
  x = Math.abs(Math.min(x, canvas.width - width));
  // Limit the y coordinate to the maximum dimensions of the canvas
  y = Math.abs(Math.min(y, canvas.height - height));
  // Limit the width to the maximum dimensions of the canvas
  width = Math.abs(Math.min(width, canvas.width));
  // Limit the height to the maximum dimensions of the canvas
  height = Math.abs(Math.min(height, canvas.height));

    // Set the rotation to a random value
    let rotation = prngno * 360;
      // Create a linear gradient with the current color and transparent black
      let gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, colors[i]);
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      
      // Set the fill style to the gradient
      ctx.fillStyle = gradient;
      // Translate the canvas to the center of the rectangle
      ctx.translate(x + width / 2, y + height / 2);
      // Rotate the canvas by the specified rotation
      ctx.rotate(rotation);
      // Draw a rectangle on the canvas using the gradient
      ctx.fillRect(-width / 2, -height / 2, width, height);
      // Reset the canvas transformation
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      console.log(x,y,width,height,rotation);

      console.log(colors[i]);
    }
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
   // for (let i = 0; i < 5; i++) {
   //   console.log("colorCanvasAngled start: ", i)
   //   colorCanvasAngled();
   //   console.log("fin.")
   // }
   colorCanvasNew();
   console.log("fxhash():", prngno, "Phrases:", Phrases, "dice no.:", diceQuant, "ProportionChance:", ProportionChance, "Pallettes:", Pallettes, "blendMode:", blendMode);
    let filename = `${startTime} - ${fxhash}`
   // downloadCanvas(filename);
   // downloadMetadata(filename);
  }
    
  
  
  
   draw();


/*
 v = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${
      (H * Y) | 0
    } ${H}" width="${h * Y}mm" height="${h}mm">\n<!-` +
      `- ` +
      Date(),
    new U(O),
    ,
    `fxhash='${fxhash}';(code=${code})()\n-` + `->`,
    O.bg > 0
      ? `<rect x="${-H * Y}" y="${-H}" width="${H * Y * 3}" height="${
          H * 3
        }" fill="#ffffff"/>`
      : ``,
    `<g fill="none" stroke="#000000" stroke-width="${(LW * H).toFixed(
      4
    )}" stroke-linecap="round">`,
  ];


   function colorCanvasNew(ctx, Pallettes, ProportionChance, blendMode) {
    const totalPercentage = ProportionChance.reduce((sum, percentage) => {
      return sum + parseInt(percentage);
    }, 0);
    //const segmentSize = Math.max(canvas.width, canvas.height) / totalPercentage; 
    let lastWidth = Math.min((canvas.width / totalPercentage) * parseInt(ProportionChance[0]), canvas.width);
    let lastHeight = Math.min((canvas.height / totalPercentage) * parseInt(ProportionChance[0]), canvas.height);
    let a = nozeroArray(prngno);
  
    for (let i = 0; i < iterations; i++) {
      let colors = Math.min(Pallettes[i], diceQuant);
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





              v.push(
              `<path d="M ${SY(qq, 1 / H).map(
                ([x, y]) => (
                  (x += M),
                  (y += 0.5),
                  C.lineTo(x * ch, y * ch),
                  [(x * H) | 0, (y * H) | 0]
                )
              ).join` `}"/>`
            ) %
              24 <
            1
          )
            yield;
          C.stroke();
        }
      }
    }
    v.push`</g></svg>`;
    (im = new Image()).src =
      `data:image/svg+xml,` + encodeURIComponent(v.join`\n`);
    im.decode().then((_) => {
      B.replaceChildren(im);