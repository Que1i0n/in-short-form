
// Derive in Genesis
const startTime = Date.now();

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
    let seed = prngno;
    function prng() {
      seed = (seed * 16807) % 2147483647;
        return seed / 2147483647;
    } 
    for (let i = 0; i < numColors; i++) {
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
function nozero(prngno) {
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
function TruncateProjectColors(colors) {
  let ar = nozeroArray(prngno);
  let a = ar[0]
  let b = ar[1];
  let c = ar[2];

console.log(colors);

  console.log("prngno: ", prngno, "a: ", a, "b: ", b, "c: ",c);


  // Create a new array to store the picked colors
  let pickedColors = [];

  // Pick 'numColorsToPick' number of colors from the colors array
  for (let i = 0; i < a; i++) {
    // Generate a random index to pick a color from
    let randomIndex = Math.floor(Math.random() * colors.length);
    const index = Math.floor(a * Math.min(colors.length, a));
    // Add the picked color to the pickedColors array and remove it from the colors array
    pickedColors.push(colors[randomIndex]);
    colors.splice(randomIndex, 1);
  }
  console.log(pickedColors);
  return pickedColors;
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
function downloadCanvas(fileName, prngno, Phrases, diceQuant, ProportionChance, Pallettes, blendMode) {
  let metadata = `fxhash:${prngno}\nPhrases:\n`;

  // Add each phrase to the metadata string
  for (let i = 0; i < Phrases.length; i++) {
    metadata += `${i + 1}. ${Phrases[i]}\n`;
  }
  
  // Add the remaining metadata to the string
  metadata += `
  dice:${diceQuant}
  ProportionChance:${ProportionChance}
  Pallettes:${JSON.stringify(ProjectColors)}
  blendMode:${blendMode}
  `;
  //const metadata = `fxhash:${prngno}\nPhrases:${Phrases}\ndice:${diceQuant}\nProportionChance:${ProportionChance}\nPallettes:${JSON.stringify(Pallettes)}\nblendMode:${blendMode}`;

  const imageDataURL = canvas.toDataURL();
  const imageLink = document.createElement("a");
  imageLink.href = imageDataURL;
  imageLink.download = `${fileName}`;
  document.body.appendChild(imageLink);
  imageLink.click();
  document.body.removeChild(imageLink);
}
function downloadMetadata(fileName, prngno, Phrases, diceQuant, ProportionChance, Pallettes, blendMode, endTime) {
let metadata = `fxhash:${prngno}\nPhrases:\n`;

// Add each phrase to the metadata string
for (let i = 0; i < Phrases.length; i++) {
  metadata += `${i + 1}. ${Phrases[i]}\n`;
}

// Add the remaining metadata to the string
metadata += `
dice:${diceQuant}
ProportionChance:${ProportionChance}
Pallettes:${JSON.stringify(ProjectColors)}
blendMode:${blendMode}
startTime:${startTime}
endTime:${endTime}
Elapsed${(endTime-startTime)/1000}'s
`;

const metadataBlob = new Blob([metadata], {type: 'text/plain'});
const metadataUrl = URL.createObjectURL(metadataBlob);
const metadataLink = document.createElement("a");
metadataLink.href = metadataUrl;
metadataLink.download = `${fileName}.txt`;
document.body.appendChild(metadataLink);
metadataLink.click();
document.body.removeChild(metadataLink);

triggerReload("Done!");
}
function colorCanvasHorizontal1(ctx, Pallettes, ProportionChance) {
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
}
function colorCanvasVertical1(ctx, Pallettes, ProportionChance, blendMode) {
  if (!Array.isArray(ProportionChance)) {
    ProportionChance = [ProportionChance];
  }
  const totalPercentage = ProportionChance.reduce((sum, percentage) => {
    return sum + parseInt(percentage);
  }, 0);
  const segmentHeight = canvas.width / totalPercentage; 
  for (let i = 0; i < Pallettes.length; i++) {
    const colors = Pallettes[i];   
    const width = segmentHeight * parseInt(ProportionChance[i]);
    ctx.globalCompositeOperation = blendMode;
    for (let y = i * segmentHeight; y < canvas.width; y++) {
      for (let x = i * width; x < (i + 1) * width; x++) {
        const color = colors[Math.floor(prngno * colors.length)];
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }
  let fileName = `${startTime} - ${fxhash} - Vertical1 - ${blendMode}`;
  downloadCanvas(fileName, prngno, Phrases, diceQuant, ProportionChance, Pallettes, blendMode);
}
//svg rendering test + horizontal version below (change x's to y's kinda thing)
function colorCanvasVertical1brokensvg(ctx, Pallettes, ProportionChance, blendMode) {
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
    // Parse the SVG path data and draw it on the canvas
    const path = new Path2D(colors[0]);
    ctx.fillStyle = colors[1];
    ctx.fill(path);
  }
/// to test ---------------------- the following or below
  for (let i = 0; i < Pallettes.length; i++) {
    const colors = Pallettes[i];   
    let y = i * segmentHeight;
    const width = segmentHeight * parseInt(ProportionChance[i]);
    ctx.globalCompositeOperation = blendMode;
    // Parse the SVG path data and draw it on the canvas
    const path = new Path2D(colors[0]);
    ctx.fillStyle = colors[1];
    ctx.fill(path);
    
    // Draw the rectangle again along the bottom of the canvas
    y = (i * segmentHeight) + canvas.height;
    ctx.fill(path);
  }

  console.log("Coloring Vertically SVG test Done!");
  let fileName = `${fxhash} - Vertical Iteration`;
  const imageDataURL = canvas.toDataURL();
  const imageLink = document.createElement("a");
  imageLink.href = imageDataURL;
  imageLink.download = `${fileName} - ${blendMode}`;
  document.body.appendChild(imageLink);
  imageLink.click();
  document.body.removeChild(imageLink);
}
//There's a bunch of really wacky redundency in the above code, might be interesting to actually use it properly (but it does what I want)
function colorCanvasALL(ctx, Pallettes, ProportionChance, blendMode){
  if (!Array.isArray(ProportionChance)) {
    ProportionChance = [ProportionChance];
  }
  const totalPercentage = ProportionChance.reduce((sum, percentage) => {
    return sum + parseInt(percentage);
  }, 0);

  // Draw the bars along the top of the canvas
for (let i = 0; i < Pallettes.length; i++) {
  const segmentWidth = canvas.height / totalPercentage; 
  const colors = Pallettes[i];   
  const x = i * segmentWidth;
  const height = segmentWidth * parseInt(ProportionChance[i]);
  ctx.globalCompositeOperation = blendMode;
// Generate the SVG data for the rectangle
const svgData = `<rect x="${x}" y="0" width="${segmentWidth}" height="${height}" fill="${colors[1]}"/>`;
// Parse the SVG data and draw it on the canvas
const parser = new DOMParser();
const svg = parser.parseFromString(svgData, "image/svg+xml");
const path = new Path2D(svg.querySelector("rect"));
ctx.fill(path);
}

// Draw the bars along the left of the canvas
for (let i = 0; i < Pallettes.length; i++) {
  const segmentWidth = canvas.width / totalPercentage; 
  const colors = Pallettes[i];   
  // Adjust the x position to draw the rectangle along the left of the canvas
  const x = (i * segmentWidth) - canvas.width;
  const height = segmentWidth * parseInt(ProportionChance[i]);
  ctx.globalCompositeOperation = blendMode;
// Generate the SVG data for the rectangle
const svgData = `<rect x="${x}" y="0" width="${segmentWidth}" height="${height}" fill="${colors[1]}"/>`;
// Parse the SVG data and draw it on the canvas
const parser = new DOMParser();
const svg = parser.parseFromString(svgData, "image/svg+xml");
const path = new Path2D(svg.querySelector("rect"));
ctx.fill(path);

}

// Draw the bars along the right of the canvas
for (let i = 0; i < Pallettes.length; i++) {
  const segmentWidth = canvas.width / totalPercentage; 

  const colors = Pallettes[i];   
  // Adjust the x position to draw the rectangle along the right of the canvas
  const x = (i * segmentWidth) + canvas.width;
  const height = segmentWidth * parseInt(ProportionChance[i]);
  ctx.globalCompositeOperation = blendMode;
// Generate the SVG data for the rectangle
const svgData = `<rect x="${x}" y="0" width="${segmentWidth}" height="${height}" fill="${colors[1]}"/>`;

// Parse the SVG data and draw it on the canvas
const parser = new DOMParser();
const svg = parser.parseFromString(svgData, "image/svg+xml");
const path = new Path2D(svg.querySelector("rect"));
ctx.fill(path);
}

console.log("Coloring ALL SVG test Done!");
let fileName = `${fxhash} - ALL Iteration`;
const imageDataURL = canvas.toDataURL();
const imageLink = document.createElement("a");
imageLink.href = imageDataURL;
imageLink.download = `${fileName} - ${blendMode}`;
document.body.appendChild(imageLink);
imageLink.click();
document.body.removeChild(imageLink);
}
//Will need to test what is actually drawing what - Might be an idea to slow it down or save an animation
function colorCanvasAngled1(ctx, Pallettes, ProportionChance, blendModes) {
  var counter = 0;
  const BlendingModes = ['multiply', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'screen', 'overlay', 'darken', 'lighten'];
  let n = nozeroArray(prngno)[counter % BlendingModes.length];
  var BlendingMode = BlendingModes[n];
  ;
  function Pass1() {
    console.time("outerPass1");
    for (let i = 0; i < ProportionChance.length; i++) {
      console.time("innerPass1", [i]);
      const totalPercentage = ProportionChance.reduce((sum, percentage) => {
        return sum + parseInt(percentage);
        }, 0);
      const segmentHeight = ProportionChance[i] / totalPercentage;
      const angle = (ProportionChance[i] / segmentHeight) * 360;
      ctx.rotate(angle);
  
        const colors = Pallettes[i];
        ctx.rotate(angle);
        ctx.globalCompositeOperation = BlendingMode;
        ctx.globalAlpha = (10 - ProportionChance.length) / 10;
        const n = ProportionChance.length;
        for (let y = 0; y < canvas.height; y++) {
          if (y % n === 0) {
            continue;
          }
          for (let x = 0; x < canvas.width; x++) {
            ctx.rotate(angle);
            ctx.strokeStyle = colors[Math.floor(prngno * colors.length)];
            ctx.strokeRect(x, y, 2, 2);
            x++;
          }
        }
        console.log("Pass1: ", i);
        console.timeEnd("innerPass1");
        ctx.rotate(-angle);
      }
      console.timeEnd("outerPass1");
    }
  function Pass3() {
    console.time("outerPass1");
    for (let i = 0; i < ProportionChance.length; i++) {
      console.time("innerPass1");
      const totalPercentage = ProportionChance.reduce((sum, percentage) => {
        return sum + parseInt(percentage);
        }, 0);
      const segmentHeight = ProportionChance[i] / totalPercentage;
      const angle = (ProportionChance[i] / segmentHeight) * 360;
      ctx.rotate(angle);
  
        const colors = Pallettes[i-1];
        ctx.rotate(angle);
        ctx.globalCompositeOperation = BlendingMode;
          ctx.globalAlpha = (10 - ProportionChance.length) / 10;
        
        const n = ProportionChance.length;
        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            ctx.rotate(angle);
            ctx.strokeStyle = colors[Math.floor(prngno * colors.length)];
            ctx.strokeRect(x, y, 2, 2);
            x++;
          }
        }
        console.log("Pass3 :", i);
        console.timeEnd("innerPass1");
        ctx.rotate(-angle);
      }
      console.timeEnd("outerPass1");
  }
  function Pass5() { 
    for (let step5 = 2; step5 < ProportionChance.length; step5++) {
      let n = nozeroArray(prngno)[counter % BlendingModes.length];
      console.log(n);
      let BlendingMode = BlendingModes[n];
      console.log(BlendingMode);
      counter++;
    console.log("Angled Pass3 Start - (step5)", [counter]);
    Pass3(BlendingMode)
    let fileName = `${startTime} - ${fxhash} - Angled1 Pass3 - (step5) step ${[counter]} - ${BlendingMode}`;
    downloadCanvas(fileName, prngno, Phrases, diceQuant, ProportionChance, Pallettes, BlendingMode);
    ctx.scale(4, 4);
    }
  }
  let Chance = ProportionChance.length;
  if (Chance == 1) {
    for (let step1 = 0; step1 < 1; step1++) {
      let Ary = nozeroArray(prngno);
      console.log(Ary);
      let n = Ary[counter % BlendingModes.length];
      console.log(n);
      let BlendingMode = BlendingModes[n];    
      console.log("debug Chance = 1 Pass1: ", BlendingMode)
      counter++
        console.log("Angled PassStart - (step1)", [counter]);
        //Pass1(BlendingMode);
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
            let q = Ary[i+1];
            console.log(q);
            ctx.rotate(-angle);
            ctx.scale(q,q)
          }
        }
        let fileName = `${startTime} - ${fxhash} - Angled1 Pass1 - (step1) step ${[counter]} - ${BlendingMode}`;
        downloadCanvas(fileName, prngno, Phrases, diceQuant, ProportionChance, Pallettes, BlendingMode)
        ctx.scale(4, 4);
      }
    } else if (Chance == 2) {
    //first loop runs once and second loop runs once
    for (let step2 = 0; step2 < 1; step2++) {
      let Ary = nozeroArray(prngno);
      console.log(Ary);
      let n = Ary[counter % BlendingModes.length];
      console.log(n);
      let BlendingMode = BlendingModes[n];    
      console.log("debug Chance = 2 Pass3: ", BlendingMode)
      counter++
      console.log("Angled PassStart - (step2)", [counter]);
        Pass3(BlendingMode)
        let fileName = `${startTime} - ${fxhash} - Angled1 Pass3 - (step2) step ${[counter]} - ${BlendingMode}`;
        downloadCanvas(fileName, prngno, Phrases, diceQuant, ProportionChance, Pallettes, BlendingMode)
        ctx.scale(4, 4);
      }
    for (let step3 = 0; step3 < 1; step3++) {
      let n = nozeroArray(prngno)[counter % BlendingModes.length];
      console.log(n);
      let BlendingMode = BlendingModes[n];    counter++
      console.log("Angled Pass1 Start (step3) - ", [counter]);
        Pass1(BlendingMode)
        let fileName = `${startTime} - ${fxhash} - Angled1 Pass1 - (step3) step ${[counter]} - ${BlendingMode}`;
        downloadCanvas(fileName, prngno, Phrases, diceQuant, ProportionChance, Pallettes, BlendingMode)
        ctx.scale(4, 4);
      }
    } else {
      //first loop runs twice and second loop runs ProportionChance-2 number of times
      for (let step4 = 0; step4 < 2; step4++) {
        let n = nozeroArray(prngno)[counter % BlendingModes.length];
        console.log(n);
        let BlendingMode = BlendingModes[n];
        counter++
        console.log("Angled Pass1 Start - (step4)", [counter]);
        Pass1(BlendingMode);
        let fileName = `${startTime} - ${fxhash} - Angled1 Pass1 - (step4) step ${[step4]} - ${BlendingMode}`;
        downloadCanvas(fileName, prngno, Phrases, diceQuant, ProportionChance, Pallettes, BlendingMode)
        ctx.scale(4, 4);
      }
      let n = nozeroArray(prngno)[counter % BlendingModes.length];
      console.log(n);
      let BlendingMode = BlendingModes[n];
      Pass5(BlendingMode);
  
    }
  }
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
function colorCanvasOldforesvgrenderingtest(ctx, Pallettes, ProportionChance, blendMode) {
  if (!Array.isArray(ProportionChance)) {
    ProportionChance = [ProportionChance];
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
//svg rendering test
function colorCanvas(ctx, Pallettes, ProportionChance, blendMode) {
  if (!Array.isArray(ProportionChance)) {
    ProportionChance = [ProportionChance];
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
    // Create a gradient using the colors in the Pallettes array
    const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(1, colors[1]);
    // Draw a band around the edges of the canvas with the gradient
    ctx.fillStyle = gradient;
    ctx.fillRect(x + width / 2, y, width / 2, height);
    ctx.fillRect(x, y + height / 2, width, height / 2);
  }
  console.log("Colours w/ SVG done!");
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

function draw(ctx, Pallettes, ProportionChance, blendMode, blendModes) {
  //will need to do this properly at some point
  console.log(Pallettes);
  triggerReload("Started");
  //colorCanvas(ctx, Pallettes, ProportionChance, blendMode);

  //colorCanvasALL(ctx, Pallettes, ProportionChance, blendMode);
  colorCanvasVertical1(ctx, Pallettes, ProportionChance, blendMode);
  console.log("ColorCanvasVertical1 Fin.");

  console.log("ColorCanvasAngled1 Start!!");
  colorCanvasAngled1(ctx, Pallettes, ProportionChance, blendMode, blendModes);
  console.log("ColorCanvasAngled1 Fin.");

  let FileName = `${startTime} - ${fxhash} - Completed`;
  const endTime = Date.now();
  console.log("METADATA DOWNLOAD INCOMING")
  downloadMetadata(FileName, prngno, Phrases, diceQuant, ProportionChance, Pallettes, blendMode, endTime);
  downloadCanvas(FileName, prngno, Phrases, diceQuant, ProportionChance, Pallettes, blendMode);  
  console.log("fxhash():", prngno, "Phrases:", Phrases, "dice no.:", diceQuant, "ProportionChance:", ProportionChance, "Pallettes:", Pallettes, "blendMode:", blendMode);
} 

const canvas = document.getElementById("canvas");
canvas.width = 3840;  // 4K resolution
canvas.height = 2160;
const ctx = canvas.getContext("2d");

const pixelBatch = 100;

let prngno = 0.1060490249656141;
// let prngno = fxrand();
//let diceMultiple = 4;
let diceQuant = nozero(prngno);

const Phrases = getPhrases("Genesis.txt", diceQuant);
//will need to do this properly at some point
const ProjectColors = [['#000E38','#0E2C58','#0A2518','#9C4A10','#E0A871','#D8863E'], ['#BD2136','#863526','#1F2928','#A4B6D2','#25130C','#5A2011'],['#1A060F',' #061A4B',' #635411',' #C1AA11',' #A20946',' #C5EBAA'],['#0B0805','#352D21','#5F5444','#92836E','#B6C4CC','#196ECF'],['#210803','#511C11','#EC1C09','#951709','#926D72','#C7B9C2'],['#0C61F7','#022CBF','#011581','#01084A','#020420','#010107'],['#798152','#626C4D','#4B5028','#646931','#3B443D','#515644'],['#3A420D','#141A07','#72750A','#B3A822','#5C543A','#DFC76F'],['#B6AFC6','#A099AD','#DCBFC3','#6D7384','#24231E','#61574E']];
let Pallettes = TruncateProjectColors(ProjectColors);

//[['#0F5C46', '#1E6D5F','#1C891D','#A0FD7E','#7FF1F4'],['#5332FE','#9036FF','#FA78E2','#FF5EFF','#F933F7']];
let palletteDepth = 3;
const ProportionChance = getStringLengths(Phrases);
//  ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'];
//['multiply', 'color-dodge', 'color-burn', 'hard-light', 'soft-light'];
const blendModes = ['multiply', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'screen', 'overlay', 'darken', 'lighten'];
const blendModeIndex = Math.floor(prngno * blendModes.length) % blendModes.length;
var blendMode = blendModes[blendModeIndex];
console.log("BlendMode: ", blendMode,
"BlendMdeIndex: ", blendModeIndex, "BlendModesLenght: ", blendModes.length);

const cleanedPhrases = cleanPhrases(Phrases);
// Generate the hexadecimal color codes for each cleaned phrase
cleanedPhrases.forEach(phrase => {
    const hexColors = sentenceToHexColors(phrase);
    // Select a random subset of colors using the getRandomColors function
    const shortenedColors = getRandomColors(hexColors, palletteDepth);
    //Pallettes.push(shortenedColors);
});
Phrases.forEach(phrase => {
    const hexColors = sentenceToHexColors(phrase);
    const shortenedColors = getRandomColors(hexColors, palletteDepth, prngno);  // <--- colour pallette depth
    //Pallettes.push(shortenedColors);
});

console.log("DiceQuant: ", diceQuant, "\nProportion Chance Array: ", JSON.stringify(ProportionChance), "\nProportionChance Array ", ProportionChance);  

draw(ctx, Pallettes, ProportionChance, blendMode, blendModes);

console.log("diceQuant:", diceQuant);
triggerReload("Done!");

//---//
