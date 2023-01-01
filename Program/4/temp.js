let counter = 0;
for (let i = 0; i < 2; i++) {
  ctx.rotate(angle);
  console.log("Angled1 Total Percentage: ", totalPercentage);
  const segmentHeight = canvas.width / totalPercentage;
  for (let i = 0; i < Pallettes.length; i++) {
    const colors = Pallettes[i];
    const angle = (ProportionChance[i] / totalPercentage) * 360;
    ctx.globalCompositeOperation = blendMode;
    for (let y = 0; y < canvas.width; y++) {
      counter++;
      if (counter !== ProportionNumber) {
        continue;
      }
      counter = 0;
      for (let x = i * canvas.width; x < (i + 1) * canvas.width; x++) {
        ctx.rotate(angle);
        const color = colors[Math.floor(prngno * colors.length)];
        ctx.strokeStyle = color;
        ctx.strokeRect(x, y, 2, 2);
      }
    }
    ctx.rotate(-angle);
  }
}


if (ProportionChance == 1) {
    for (let i = 0; i < 1; i++) {
        Pass1()
    }
    } else if (ProportionChance == 2) {
    //first loop runs once and second loop runs once
    for (let i = 0; i < 1; i++) {
        Pass3()
    }
    for (let i = 0; i < 1; i++) {
        Pass1()
    }
    } else {
    //first loop runs twice and second loop runs ProportionChance-2 number of times
    for (let i = 0; i < 2; i++) {
        Pass1()
    }
    for (let i = 0; i < ProportionChance-2; i++) {
        Pass3()
    }
    }


// from gpt
    function Pass1() {
      const colors = Pallettes[0]; // use the first element of the Pallettes array
      const angle = (ProportionChance[0] / prngno) * 360;
      ctx.rotate(angle);
      ctx.globalCompositeOperation = blendMode;
      const n = ProportionChance.length;
      for (let y = 0; y < canvas.width; y++) {
        if (y % n === 0) {
          continue;
        }
        for (let x = 0; x < canvas.width; x++) {
          ctx.rotate(angle);
          ctx.strokeStyle = colors[Math.floor(prngno * colors.length)];
          ctx.strokeRect(x, y, 2, 2);
        }
      }
      ctx.rotate(-angle);
    }

// being merged with above
    function Pass1() {
      for (let i = 0; i < ProportionChance.length; i++) {
        const angle = (ProportionChance[i] / prngno) * 360;
        ctx.rotate(angle);
        const totalPercentage = ProportionChance.reduce((sum, percentage) => {
        return sum + parseInt(percentage);
        }, 0);
        const segmentHeight = canvas.width / totalPercentage;
        for (let j = 0; j < Pallettes.length; j++) {
          const colors = Pallettes[i];
          const angle = (ProportionChance[i] / totalPercentage) * 360;
          ctx.globalCompositeOperation = blendMode;
          const n = ProportionChance.length;
          for (let y = 0; y < canvas.width; y++) {
       //     console.log("Inside for (let y = loop");
            if (y % n === 0) {
              continue;
            }
            for (let x = j * canvas.width; x < (j + 1) * canvas.width; x++) {
              ctx.rotate(angle);
              const color = colors[Math.floor(prngno * colors.length)];
              ctx.strokeStyle = color;
              ctx.strokeRect(x, y, 2, 2);
              x++;
            }
            console.log(j);
          }
          ctx.rotate(-angle);
        }
      }
      }



//from gpt

function colorCanvasVertical(ctx, Pallettes, ProportionChance, blendMode) {
  if (!Array.isArray(ProportionChance)) {
    ProportionChance = [ProportionChance];
  }
  const totalPercentage = ProportionChance.reduce((sum, percentage) => {
    return sum + parseInt(percentage);
  }, 0);
  const segmentHeight = canvas.width / totalPercentage; 
  const imageData = ctx.createImageData(canvas.width, canvas.height); // create a typed array to store pixel data
  const data = imageData.data; // get a reference to the pixel data array
  ctx.globalCompositeOperation = blendMode;
  for (let i = 0; i < Pallettes.length; i++) {
    const colors = Pallettes[i];   
    const width = segmentHeight * parseInt(ProportionChance[i]);
    for (let y = 0; y < canvas.width; y++) {
      for (let x = i * width; x < (i + 1) * width; x++) {
        const color = colors[Math.floor(prngno * colors.length)];
        const index = (y * canvas.width + x) * 4; // get the index of the pixel in the data array
        data[index] = color[0]; // set the red component
        data[index + 1] = color[1]; // set the green component
        data[index + 2] = color[2]; // set the blue component
        data[index + 3] = color[3]; // set the alpha component
      }
    }
  }
  ctx.putImageData(imageData, 0, 0); // draw the image data to the canvas
}


//being repalced wiht above (18:05 - 01/01/23)
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



/*

// Oldcode stripped from /4 to make it clearer as to what's going on


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


*/

//gpt response to wait for download and error out if fails
function downloadCanvas(fileName) {
  return new Promise((resolve, reject) => {
    let link = document.createElement('a');
    link.download = fileName;
    link.href = canvas.toDataURL();
    link.onclick = () => resolve();
    link.onerror = () => reject(new Error("Download failed"));
    link.click();
  });
}

for (let step4 = 0; step4 < 2; step4++) {
  let n = nozeroArray(prngno)[counter % BlendingModes.length];
  console.log(n);
  let BlendingMode = BlendingModes[n];
  counter++
  console.log("Angled Pass1 Start - (step4)", [counter]);
  Pass1(BlendingMode);
  let fileName = `${startTime} - ${fxhash} - 1. ${[counter]} Angled1 Pass1 - (step4) step ${[step4]} - ${BlendingMode}`;
  await downloadCanvas(fileName).catch(error => {
    console.log(error.message);
    MetadataDownload();
  });
  ctx.scale(4, 4);
}

