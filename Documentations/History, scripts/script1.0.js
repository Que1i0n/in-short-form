var colorPalettes = [
    ["#4D7920", "#656E65", "#6D6965", "#732073", "#617920"],
    ["#6F6620", "#6D6520", "#696E20", "#6D616C", "#696365"],
    ["#2C2022", "#576865", "#6E2077", "#696C6C", "#206865"],
    ["#206469", "#652061", "#6E6420", "#686973", "#206E61"],
    ["#6D6520", "#706572", "#697368", "#3F2200"]
    ];
    
    var angleOfRotation = 0;
    var numProportions = 4;
    
    window.onload = function() {
    draw();}
    
    
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
    ctx.fillRect(segments[i][0], segments[i][1], segments[i][2], segments[i][3]);
    ctx.restore();
    }
    }