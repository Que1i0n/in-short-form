## Day 2 - 13/12/22

Asking GPT to change the way this code is laid out? (I'll need to spin up a git repository to get a proper commit history.

It's basically just the code gpt already wrote to colour the canvas and rotate it, just I keep breaking the rotate thing, it worked once but I didn't save the output.

---

Sure, we can definitely change the way this code is laid out to make it easier to read and understand. Here is one way we could do it:

	// Function to color the canvas using the given palette percentages
	function colorCanvas(canvas, PalPerc) {
	  // Get the 2D context of the canvas
	  const ctx = canvas.getContext("2d");
	
	  // Calculate the total sum of the percentages
	  const totalPercentage = PalPerc.reduce((sum, segment) => {
	    const [percentage] = segment.split(" - [");
	    return sum + parseInt(percentage);
	  }, 0);
	
	  // Calculate the height of each segment based on its percentage
	  const segmentHeight = canvas.height / totalPercentage;
	
	  // Loop through the segments
	  for (let i = 0; i < PalPerc.length; i++) {
	    // Parse the percentage and palette from the current segment
	    const [percentage, palette] = PalPerc[i].split(" - [");
	    const colors = palette.split(", ");
	
	    // Calculate the starting y coordinate of the segment
	    const y = i * segmentHeight;
	
	
	    // Calculate the height of the segment based on its percentage value
	    const height = segmentHeight * parseInt(percentage);
	
	    // Loop through the pixels in the segment
	    for (let x = 0; x < canvas.width; x++) {
	      for (let y = i * height; y < (i + 1) * height; y++) {
	        // Choose a random color from the palette
	        const color = colors[Math.floor(Math.random() * colors.length)];
	
	        // Set the pixel color
	        ctx.fillStyle = color;
	        ctx.fillRect(x, y, 1, 1);
	        
	      }
	    }
	  } 
	}
	
	// Function to rotate the canvas
	function rotateCanvas(canvas, maxrotate, rotation) {
	  // Loop through the maxrotate
	


*what other options are there for ctx.globalCompositeOperation?*

	There are several options for the ctx.globalCompositeOperation property, including:
	
	"source-over" (the default value) - the new content is drawn on top of the existing content
	"source-in" - the new content is drawn only where it intersects with the existing content
	"source-out" - the new content is drawn only where it does not intersect with the existing content
	"source-atop" - the new content is drawn only where it intersects with the existing content, and is placed above the existing content
	"destination-over" - the existing content is drawn on top of the new content
	"destination-in" - the existing content is drawn only where it intersects with the new content
	"destination-out" - the existing content is drawn only where it does not intersect with the new content
	"destination-atop" - the existing content is drawn only where it intersects with the new content, and is placed above the new content
	"lighter" - the new and existing content is drawn together, and the result is the sum of the color values
	"copy" - the new content replaces the existing content
	"xor" - the new content is drawn only where it does not intersect with the existing content, and the existing content is drawn only where it does not intersect with the new content
	"multiply" - the new and existing content is drawn together, and the result is the product of the color values


----

It got too late and I got a bit too stoned to record the whole process properly, but I had a good time so there's that, definitely lost some really useful stuff along the way, but that's life.
There'll forever be the bunch of stuff I never wrote about this but here we are.

Just going to put the gallery of all the ChatGPT code generated outputs up to this point - I think all the relevant code was saved via copy paste to the original version of this document, but I am not sure.

1. ![[1.png]]
2. ![[2.png]]
3. ![[3.png]]
4. ![[4..png]]
5. ![[5.png]]
6. ![[6.png]]
7. ![[7.png]]

I sent 7 and image 6 to Ryan with a brief explainer about what it's doing to get there.

And have subsequently had thoughts about how to proceed with the algorithm for drawing.

	I really don't know why it's not filling in the entire image, but really like that it's not.
	
	I think using this as a noise grid to manipulate another image would be interesting. Can re-use and alter the bit around the second drawing to blend differently.
	
	Aside, it could be interesting to convert the ascii to coordinates rather than colours, and use those as starting points to colour the canvas in from. Where the speed of colouring is controlled by the proportional chance variable and the colours are abstracted from some other data conversion from the words in the strings, or the first x characters - and then we pick from a defined set of palettes because that'll be more interesting.
	
	I think using coordinates abstracted from random data is more interesting than colours. 
	
	We could join all the points in the phrases together following some walking algorithm. Then do something with the resulting shapes.
	
	ie, fill all the enclosed spaces in, rotate the shape, draw in lines between some of the points in colours nearby the colours they're surrounded by, then offset that by some amount. Fill the shapes in again with the same colours and blend them in some way. 
	
	Then apply as a noise altering function the drawing algorithm we've arrived at previously.
	
	Which I'll have to save and test converting to fx variables to. Hopefully the sandbox helps with that.

I am considering minting Image 7. or the code that produces it in a slightly adapted form so that it's in a capacity deterministically 'generative'

The task to ingest all of the bible might have to become it's own element to the project, I think it could be quite a bit of compute to dedicate to abstract data generation - maybe there's a way of splitting the parts up, or phrases up into 'pages' that could be iterated over as a physical book would be - limiting the amount of data that would need to be ingested by the algorithm to produce the dataset it will use to produce an output.

----fin.