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