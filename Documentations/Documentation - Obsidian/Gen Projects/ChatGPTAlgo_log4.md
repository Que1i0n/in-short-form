
*skipping the rgb bit, doing it in code, chatGPT is also writing.

can you write a boilerplate javascript segment that has space for colour pallettes, variables for angle of rotation, a piece of code that adjusts the hex codes provided for the colours by an rgb limit variable, also including a piece that splits the canvas into proportion segments based on ratios of two sepereate variables?*

	Sure, here is a boilerplate JavaScript segment that includes space for colour palettes, variables for angle of rotation, a piece of code that adjusts the hex codes provided for the colours by an RGB limit variable, and a piece that splits the canvas into proportion segments based on ratios of two separate variables:
		
		var colorPalettes = [
		["#4D7920", "#656E65", "#6D6965", "#732073", "#617920"],
		["#6F6620", "#6D6520", "#696E20", "#6D616C", "#696365"],
		["#2C2022", "#576865", "#6E2077", "#696C6C", "#206865"],
		["#206469", "#652061", "#6E6420", "#686973", "#206E61"],
		["#6D6520", "#706572", "#697368", "#3F2200"]
		];
		
		var angleOfRotation = 0;
		
		function adjustHexCodes(colors, limit) {
		for (var i = 0; i < colors.length; i++) {
		var r = parseInt(colors[i].substring(1,3), 16);
		var g = parseInt(colors[i].substring(3,5), 16);
		var b = parseInt(colors[i].substring(5,7), 16);
		r = Math.min(r + limit, 255);
		g = Math.min(g + limit, 255);
		b = Math.min(b + limit, 255);
		colors[i] = "#" + r.toString(16) + g.toString(16) + b.toString(16);
		}
		return colors;
		}
		
		function splitCanvas(width, height, ratio1, ratio2) {
		var segmentWidth = width * ratio1 / (ratio1 + ratio2);
		var segmentHeight = height * ratio1 / (ratio1 + ratio2);
		return [segmentWidth, segmentHeight];
		}


*can you adjust it so there is a variable for number of proportions the canvas will be split into and make the rotational adjustment effect each segment individually (the range of the proportion is 2-12)*


	Sure, here is an updated version of the JavaScript segment that includes a variable for the number of proportions the canvas will be split into, and makes the rotational adjustment affect each segment individually:
	
		var colorPalettes = [
		["#4D7920", "#656E65", "#6D6965", "#732073", "#617920"],
		["#6F6620", "#6D6520", "#696E20", "#6D616C", "#696365"],
		["#2C2022", "#576865", "#6E2077", "#696C6C", "#206865"],
		["#206469", "#652061", "#6E6420", "#686973", "#206E61"],
		["#6D6520", "#706572", "#697368", "#3F2200"]
		];
		
		var angleOfRotation = 0;
		var numProportions = 4;
		
		function adjustHexCodes(colors, limit) {
		for (var i = 0; i < colors.length; i++) {
		var r = parseInt(colors[i].substring(1,3), 16);
		var g = parseInt(colors[i].substring(3,5), 16);
		var b = parseInt(colors[i].substring(5,7), 16);
		r = Math.min(r + limit, 255);
		g = Math.min(g + limit, 255);
		b = Math.min(b + limit, 255);
		colors[i] = "#" + r.toString(16) + g.toString(16) + b.toString(16);
		}
		return colors;
		}
		
		function splitCanvas(width, height) {
		var segmentWidth = width / numProportions;
		var segmentHeight = height / numProportions;
		var segments = [];
		for (var i = 0; i < numProportions; i++) {
		for (var j = 0; j < numProportions; j++) {
		segments.push([i * segmentWidth, j * segmentHeight, segmentWidth, segmentHeight]);
		}
		}
		return segments;
		}
		
		function draw() {
		var canvas = document.getElementById("canvas");
		var ctx = canvas.getContext("2d");
		var segments = splitCanvas(canvas.width, canvas.height);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for (var i = 0; i < segments.length; i++) {
		ctx.save();
		ctx.translate(segments[i][0] + segments[i][2] / 2, segments[i][1] + segments[i][3] / 2);
		ctx.rotate(angleOfRotation);
		ctx.translate(-segments[i][0] - segments[i][2] / 2, -segments[i][1] - segments[i][3] / 2);
		var colors = adjustHexCodes(colorPalettes[i % colorPalettes.length], 20);
		ctx.fillStyle = colors[0];
		ctx.fillRect(segments[i][0], segments[i][1], segments[i][


Now I don't know how to code at all, at least not in javascript, and definitely notm for this kind of thing, so it's pure trial and error to see whether GPT can code from my perspective. At time of writing this bit though (2022-12-17 - 21:22), GPT seems to be able to code pretty well, I'd say we're going well with it so far.


At this point in the process though I had to go out to go see BadBadNotGood, so I'm going to throw back to the main [history](history.md) to continue.





