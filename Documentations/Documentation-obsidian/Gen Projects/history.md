# Learning about art, language, coding, and project development

## Using chatGPT to generate and then code a generative art project 
### ;or, learning to code

**produce a generative art project ruleset using only dice, the KJV bible, and a notepad**

	One possible generative art project ruleset using only dice, the KJV Bible, and a notepad could be as follows:
	
	1. Roll a six-sided die to determine the number of words that will be used in the artwork. This number will represent the total number of words that will be selected from the Bible and used in the final artwork.
	
	2. Use the notepad to randomly select the specified number of words from the Bible. These words will serve as the building blocks for the artwork.
	
	3. Roll a six-sided die to determine the overall composition of the artwork. This could include things like the number and arrangement of shapes, the use of color, and the overall layout of the artwork.
	
	4. Use the selected Bible words to create the artwork according to the composition determined in step 3. The words could be used as labels for different shapes or elements in the artwork, or they could be used to create a visual representation of the words themselves.
	
	5. Roll a six-sided die to determine any additional constraints or parameters that will be imposed on the artwork. These could include things like a maximum number of colors that can be used, a specific arrangement of shapes or elements, or any other creative constraints that the artist wants to impose.
	
	6. Use the ruleset to create multiple unique artworks, varying the selected Bible words, the composition, and the additional constraints in each iteration to produce a diverse collection of generative artworks.

---

[ChatGPT algorithm refinement history](ChatGPTAlgo_log1.md)


## ChatGPT-GEN.1

### Test 1. of [Algorithm - 0.0](Algorithm-0.0.md)


**Test Book: Gideon Bible**
	1. 4+5=9
	2. 1+2=3, page: 446 = 148.6
	3. 16.52

	Phrases: 9
	Pages: 148
	Interval: 16

	Phrases:
	1. (5) Solomon the father of Rehoboam,
	2. (5) Then they came to Jericho
	3. (19) They saw what seemed to be tongues of fire that separated and came to rest on each of them.
	4. (15) Anyone who receives instruction in the world must share all good things with his instructor.
	5. (4) How long, O Lord?
	6. (13) What will he do to you, and what more besides, O deceitful tongue?
	7. Error: Null
		1. Selected page number (888) out of bounds, maximum page range exceeded (766)
		2. Exit


The herein [linked](ChatGPTAlgo_log2.md) page details the conversation remediating the algorithm 'error' which occurred above.

<iframe src="/ChatGPTAlgo_log2.md" title="ChatGPT Algo chat log 2"></iframe>
Testing using iframes to preview further pages in this documentation.

---


The [0.1 algorithm](Algorithm-0.1.md) will run - I've already checked the values will fall within the range, Gideon Bible again, more specified in that I'm using verse numbers instead of phrase length, but potentially, want to see what happens first:

	numberOfPhrases:	9
	IterationSeed:		5
	bookLength:			760
	PageInterval:		70
	PhraseInterval:		7
	
	(checkValue:)
	
	
	Phrases:
	
	1. Then John's disciples came and asked him, "How is it that we and the Pharisees fast, but your disciples do not fast?"
	2. Then Jesus left the vicinity of Tyre and went through Sidon, down to the Sea of Galilee and into the region of the Decapolis.
	3. Indeed there are those who are last who will be first, and first who will be last."
	4. If you belonged to the world, it would love you as its own. As it is, you do not belong to the world, but I have chosen you out of the world. That is why the world hates you.
	5. There was a great uproar, and some of the teachers of the law who were Pharisees stood up and argued vigorously. "We find nothing wrong with this man," they said. "What if a spirit or an angel has spoken to him?"
	6. as you have understood us in part, you will come to understand us in part, you will come to understand fully that you can boast of us just as we will boast of you in the day of the Lord Jesus.
	7. Likewise, teach the older women to be reverent in the way they live, not to be slanderers or addicted to much wine, but to teach what is good.
	8. They had breastplates like breastplates of iron, and the sound of their wings was like the thundering of many horses and chariots rushing into battle.
	9. My enemies say of me in malice, "When will he die and his name perish?"


Now I have a legitimate set of phrases it's time to try and generate an artwork, [here](chatGPTAlgo_log3) are the discussions on how to generate first colours from the strings.

---

## Drawings - definitions

I guess I have a abstract data I can do stuff with now though, so that should be interesting. Let's see what's next.

### ratio of each image controlled by each phrase
	
	total number of words = 252
	
	1. 22:252 - 0.0873015873015873
	2. 24:252 - 0.0952380952380952
	3. 17:252 - 0.0674603174603175
	4. 39:252 - 0.1547619047619048
	5. 41:252 - 0.1626984126984127
	6. 41:252 - 0.1626984126984127
	7. 28:252 - 0.1111111111111111
	8. 15:252 - 0.0595238095238095
	
	angle of rotation of effect (clock face)
	
	1. 4
	2. 12
	3. 3
	4. 7
	5. 5
	6. 10
	7. 8
	8. 6
	9. 8
	
	aspect ratio
	1:1
	
	Colour range limit
	Min:
	R. 6
	G. 5
	B. 4
	
	Max:
	R: 3
	G: 1
	B: 6
	
	Range:
	R: 50%
	G: Less Than 17%
	B: Greater than 60%
	
	1. 
	#546865 #6e204a #6f686e #277320 #646973 #636970 #6c6573 #206361 #6d6520 #616e64 #206173 #6b6564 #206869 #6d2c20 #27486f #772069 #742077 #652061 #6e6420 #746865 #205068 #617269 #736565 #732066 #617374 #2c2062 #757420 #796f75 #722064 #697363 #69706c #657320 #646f20 #6e6f74 #206661 #73743f #270000
	
	2. 
	#546865 #6e204a #657375 #73206c #656674 #207468 #652076 #696369 #6e6974 #79206f #662054 #797265 #20616e #642077 #656e74 #207468 #726f75 #676820 #536964 #6f6e2c #20646f #776e20 #746f20 #746865 #205365 #61206f #662047 #616c69 #6c6565 #20616e #642069 #6e746f #207468 #652072 #656769 #6f6e20 #6f6620 #746865 #204465 #636170 #6f6c69 #732e00
	
	3. 
	#496e64 #656564 #207468 #657265 #206172 #652074 #686f73 #652077 #686f20 #617265 #206c61 #737420 #77686f #207769 #6c6c20 #626520 #666972 #73742c #20616e #642066 #697273 #742077 #686f20 #77696c #6c2062 #65206c #617374 #2e0000
	
	4. 
	#496620 #796F75 #206265 #6C6F6E #676564 #20746F #207468 #652077 #6F726C #642C20 #697420 #776F75 #6C6420 #6C6F76 #652079 #6F7520 #617320 #697473 #206F77 #6E2E20 #417320 #697420 #69732C #20796F #752064 #6F206E #6F7420 #62656C #6F6E67 #20746F #207468 #652077 #6F726C #642C20 #627574 #204920 #686176 #652063 #686F73 #656E20 #796F75 #206F75 #74206F #662074 #686520 #776F72 #6C642E #205468 #617420 #697320 #776879 #207468 #652077 #6F726C #642068 #617465 #732079 #6F752E
	
	5. 
	#546865 #726520 #776173 #206120 #677265 #617420 #75706F #722061 #6E6420 #736F6D #65206F #662074 #686520 #746561 #636865 #727320 #6F6620 #746865 #206C61 #772077 #686F20 #776572 #652070 #686172 #697365 #657320 #73746F #6D6420 #757020 #616E64 #206172 #677565 #642076 #69676F #726F75 #736C79 #2E2022 #576520 #66696E #64206E #6F7468 #696E67 #207772 #6F6E67 #207769 #746820 #746869 #73206D #616E2C #222074 #686579 #207361 #69642E #202257 #686174 #206966 #206120 #737069 #726974 #206F72 #20616E #20616E #67656C #206861 #732073 #706F6B #656E20 #746F20 #68696D #3F2200
	
	6. 
	#617379 #6f7520 #686176 #652075 #6e6465 #727374 #6f6f64 #207573 #20696e #207061 #72742c #20796f #752077 #696c6c #20636f #6d6520 #746f20 #756e64 #657273 #74616e #642075 #732069 #6e2070 #617274 #2c2079 #6f7520 #77696c #6c2063 #6f6d65 #20746f #20756e #646572 #737461 #6e6420 #66756c #6c6c79 #207468 #617420 #796f75 #206361 #6e2062 #6f6173 #74206f #662075 #73206a #757374 #206173 #207765 #207769 #6c6c20 #626f61 #737420 #6f6620 #796f75 #20696e #207468 #652064 #617920 #6f6620 #746865 #204c6f #726420 #4a6573 #75732e
	
	7. 
	#4c696b #657769 #73652c #207465 #616368 #207468 #65206f #6c6465 #722077 #6f6d65 #6e2074 #6f2062 #652072 #657665 #72656e #742069 #6e2074 #686520 #776179 #207468 #657920 #6c6976 #652c20 #6e6f74 #20746f #206265 #20736c #616e64 #65726f #727320 #6f7220 #616464 #696374 #656420 #746f20 #6d7563 #682077 #696e65 #2c2062 #757420 #746f20 #746561 #636820 #776861 #742069 #732067 #6f6f64 #2e0000
	
	8. 
	#546865 #792068 #616420 #627265 #617374 #706C61 #746573 #206C69 #6B6520 #627265 #617374 #706C61 #746573 #206F66 #206972 #6F6E2C #20616E #642074 #686520 #736F75 #6E6420 #6F6620 #746865 #686572 #207769 #6E6773 #207761 #73206C #696B65 #207468 #652074 #68756E #646572 #696E67 #206F66 #206D61 #6E7920 #686F72 #736573 #20616E #642063 #686172 #696F74 #732072 #757368 #696E67 #20696E #746F20 #626174 #746C65 #2E0000
	
	9. 
	#4D7920 #656E65 #6D6965 #732073 #617920 #6F6620 #6D6520 #696E20 #6D616C #696365 #2C2022 #576865 #6E2077 #696C6C #206865 #206469 #652061 #6E6420 #686973 #206E61 #6D6520 #706572 #697368 #3F2200


---
Colours and RGB values - I had at this point still thoughts about latent colour space definied by ranges of RGB values - limited by some element of the selected phrases so I did things like this:

	Sure, here is the rest of the list converted to RGB colours:
	
	#4D7920 = rgb(77,121,32)
	#656E65 = rgb(101,110,101)
	#6D6965 = rgb(109,105,101)
	#732073 = rgb(115,32,115)
	#617920 = rgb(97,121,32)
	#6F6620 = rgb(111,102,32)
	#6D6520 = rgb(109,101,32)
	#696E20 = rgb(105,110,32)
	#6D616C = rgb(109,97,108)
	#696365 = rgb(105,99,101)
	#2C2022 = rgb(44,32,34)
	#576865 = rgb(87,104,101)
	#6E2077 = rgb(110,32,119)
	#696C6C = rgb(105,108,108)
	#206865 = rgb(32,104,101)
	#206469 = rgb(32,100,105)
	#652061 = rgb(101,32,97)
	#6E6420 = rgb(110,100,32)
	#686973 = rgb(104,105,115)
	#206E61 = rgb(32,110,97)
	#6D6520 = rgb(109,101,32)
	#706572 = rgb(112,101,114)
	#697368 = rgb(105,115,104)
	#3F2200 = rgb(63,34,0)

*It was at this point I decided doing what I was trying to do on paper first wasn't really going to work as I suddenly had gone from having 9 sentences I could reasonbly deal with to hundreds of hex codes which I could not.*

I'm going to truncate the next part into it's own chatlog page which is [here](ChatGPTAlgo_log4.md)

Which will create a strange break here if you've not gone through, but heyo - life's too short quite a lot of the time to go and look at everything, I think thisn one might be worth it though.

---

*Had to take a break from the project to go see BadBadNotGood - was dope, but on reflection I am going to take a slightly different approach to creating the final image.

*I'm satisfied the selection process functions - and ingesting a book as .txt and outputting a selected set of phrases - is a separate problem to the current image generation problem.*

*So to start with we have a variety of selected parameters from the original dice rolling trial.

*These are:
	
	NumberofPhrases = 9
	IterationSeed = 5
	BookLength = 760
	PageInterval = 70
	PhraseInterval = 7
	
	Phrases:
	1. Then John's disciples came and asked him, "How is it that we and the Pharisees fast, but your disciples do not fast?"
	2. Then Jesus left the vicinity of Tyre and went through Sidon, down to the Sea of Galilee and into the region of the Decapolis.
	3. Indeed there are those who are last who will be first, and first who will be last."
	4. If you belonged to the world, it would love you as its own. As it is, you do not belong to the world, but I have chosen you out of the world. That is why the world hates you.
	5. There was a great uproar, and some of the teachers of the law who were Pharisees stood up and argued vigorously. "We find nothing wrong with this man," they said. "What if a spirit or an angel has spoken to him?"
	6. as you have understood us in part, you will come to understand us in part, you will come to understand fully that you can boast of us just as we will boast of you in the day of the Lord Jesus.
	7. Likewise, teach the older women to be reverent in the way they live, not to be slanderers or addicted to much wine, but to teach what is good.
	8. They had breastplates like breastplates of iron, and the sound of their wings was like the thundering of many horses and chariots rushing into battle.
	9. My enemies say of me in malice, "When will he die and his name perish?"
	
	Phrase details:
		Roll	Words	Characters
	1.	4		22		117
	2.	12		24		125
	3.	3		17		83
	4.	7		39		174
	5.	5		41		212
	6.	10		41		192
	7.	8		28		142
	8.	6		25		150
	9.	8 		15		71
---

*Please can you write a javascript snippet which performs the following algorithm*

	The script wants to create the page to draw in
	Then it wants to split the canvas up into segments based on proportions of phrase length to total selected word length
	Then it wants to select colours from the colour palettes
	Then it wants to generate gradients from the selected colours to fill the segments defined previously up
	Rotate each segment by each relative phrases 'roll' variable
	Reorder the colour gradient
	Fill the segments with the colour
	Blend the overlapping segments Multiplicatively

	Here is a simple example of a javascript snippet that performs the algorithm you described:
	
		// create canvas element
		var canvas = document.createElement('canvas');
		
		// set canvas size
		canvas.width = 600;
		canvas.height = 400;
		
		// get canvas context for drawing
		var ctx = canvas.getContext('2d');
		
		// split canvas into segments based on proportions of phrase length to total selected word length
		var segments = getSegments(canvas.width, canvas.height);
		
		// select colors from the color palettes
		var colors = getColors(segments.length);
		
		// generate gradients from the selected colors
		var gradients = generateGradients(colors);
		
		// rotate each segment by each relative phrase's "roll" variable
		segments.forEach(function(segment, i) {
		  var roll = segment.roll;
		  ctx.translate(segment.x + segment.width / 2, segment.y + segment.height / 2);
		  ctx.rotate(roll);
		  ctx.translate(-(segment.x + segment.width / 2), -(segment.y + segment.height / 2));
		});
		
		// reorder the color gradient
		gradients = reorderGradients(gradients);
		
		// fill the segments with the color
		segments.forEach(function(segment, i) {
		  ctx.fillStyle = gradients[i];
		  ctx.fillRect(segment.x, segment.y, segment.width, segment.height);
		});
		
		// blend the overlapping segments multiplicatively
		blendOverlappingSegments(segments);
		
		// helper functions
		function getSegments(width, height) {
		  // logic to calculate and return the segments
		}
		
		function getColors(numColors) {
		  // logic to return an array of colors
		}
		
		function generateGradients(colors) {
		  // logic to generate and return gradients from the colors
		}
		
		function reorderGradients(gradients) {
		  // logic to reorder the gradients
		}
		
		function blendOverlappingSegments(segments) {
		  // logic to blend overlapping segments multiplicatively
		}
	
	Note that this is just a simple example and there may be different ways to implement the algorithm. You may need to adjust the logic in the helper functions to meet your specific needs.

At this point the chatlog turns into just coding which is encapsulated in [here](ChatGPTAlgo_log5.md)

---- 

Which I think gets interesting again when I ran into an error in the testing environment.

*The code above is producing a typescript error:*

	TypeError: Cannot read properties of undefined (reading 'charCodeAt')
	    at <anonymous>:21:48
	    at sentenceToHexColors (<anonymous>:12:9)
	    at <anonymous>:39:1
	    at dn (<anonymous>:16:5449)

*Do you have suggestions for how to fix this?*


*And then I get a network error and it won't continue, luckily it did write the code to fix the problem before crashing out, so that's nice.*

	function sentenceToHexColors(sentence) {
	  // create an empty array to store the hex colors
	  var hexColors = [];
	
	  // split the sentence into individual characters
	  var chars = sentence.split('');
	
	  // initialize a counter for the number of digits processed
	  var numDigits = 0;
	
	  // iterate over the characters and convert each character to a hex color
	  chars.forEach(function(char) {
	    // get the ascii code for the character
	    var asciiCode = char.charCodeAt(0);
	
	    // convert the ascii code to a hex string
	    var hexCode = asciiCode.toString(16);
	
	    // combine pairs of digits as needed until we have a six digit hex code
	    while (hexCode.length < 6 && numDigits + 1 < chars.length) {
	      hexCode = hexCode + chars[numDigits + 1].charCodeAt(0).toString(16);
	      numDigits += 2;
	    }
	
	    // add the hex code to the array
	    hexColors.push('#' + hexCode);
	  });
	
	  // check if the final hex code is six digits long
	  if (hexColors[hexColors.length - 1].length < 7) {
	    // pad the final hex code with zeros until it is six digits long
	    while (hexColors[hexColors.length - 1].length < 7) {
	      hexColors[hexColors.length - 1] += '0';
	    }
	  }
	
	  // output the array of hex colors to the console
	  console.log(hexColors);
	}


*Although the console logs this:*

	(114) ["#54686e", "#684a68", "#657364", "#...]
	0:"#54686e"
	1:"#684a68"
	2:"#657364"
	3:"#6e7369"
	4:"#206c73"
	5:"#4a636d"
	6:"#6f206e"
	7:"#682073"
	8:"#6e6520"
	9:"#73692c"
	10:"#204877"
	11:"#646920"
	12:"#697474"
	13:"#736120"
	14:"#636561"
	15:"#696474"
	16:"#706550"
	17:"#6c6169"
	18:"#656573"
	19:"#736673"
	20:"#202c62"
	21:"#637479"
	22:"#617520"
	23:"#6d6963"
	24:"#657065"
	25:"#20206f"
	26:"#616e74"
	27:"#6e6673"
	28:"#643f"
	29:"#20"
	30:"#61"
	31:"#73"
	32:"#6b"
	33:"#65"
	34:"#64"
	35:"#20"
	36:"#68"
	37:"#69"
	38:"#6d"
	39:"#2c"
	40:"#20"
	41:"#48"
	42:"#6f"
	43:"#77"
	44:"#20"
	45:"#69"
	46:"#73"
	47:"#20"
	48:"#69"
	49:"#74"
	50:"#20"
	51:"#74"
	52:"#68"
	53:"#61"
	54:"#74"
	55:"#20"
	56:"#77"
	57:"#65"
	58:"#20"
	59:"#61"
	60:"#6e"
	61:"#64"
	62:"#20"
	63:"#74"
	64:"#68"
	65:"#65"
	66:"#20"
	67:"#50"
	68:"#68"
	69:"#61"
	70:"#72"
	71:"#69"
	72:"#73"
	73:"#65"
	74:"#65"
	75:"#73"
	76:"#20"
	77:"#66"
	78:"#61"
	79:"#73"
	80:"#74"
	81:"#2c"
	82:"#20"
	83:"#62"
	84:"#75"
	85:"#74"
	86:"#20"
	87:"#79"
	88:"#6f"
	89:"#75"
	90:"#72"
	91:"#20"
	92:"#64"
	93:"#69"
	94:"#73"
	95:"#63"
	96:"#69"
	97:"#70"
	98:"#6c"
	99:"#65"
	100:"#73"
	101:"#20"
	102:"#64"
	103:"#6f"
	104:"#20"
	105:"#6e"
	106:"#6f"
	107:"#74"
	108:"#20"
	109:"#66"
	110:"#61"
	111:"#73"
	112:"#74"
	113:"#3f0000"

Which isn't exactly what I want, although it's possibly GPT completely made up the previous pallette set - despite that, there needs to be something that doesn't add the incomplete codes to the array.

So back to GPT

	Here is one way to modify the code so that it only adds complete six digit hex codes to the hexCode array:
	
	Copy code
	function sentenceToHexColors(sentence) {
	  // create an empty array to store the hex colors
	  var hexColors = [];
	
	  // split the sentence into individual characters
	  var chars = sentence.split('');
	
	  // initialize a counter for the number of digits processed
	  var numDigits = 0;
	
	  // iterate over the characters and convert each character to a hex color
	  chars.forEach(function(char) {
	    // get the ascii code for the character
	    var asciiCode = char.charCodeAt(0);
	
	    // convert the ascii code to a hex string
	    var hexCode = asciiCode.toString(16);
	
	    // combine pairs of digits as needed until we have a six digit hex code
	    while (hexCode.length < 6 && numDigits + 1 < chars.length) {
	      hexCode = hexCode + chars[numDigits + 1].charCodeAt(0).toString(16);
	      numDigits += 2;
	    }
	
	    // only add the hex code to the array if it is six digits long
	    if (hexCode.length === 6) {
	      hexColors.push('#' + hexCode);
	    }
	  });
	
	  // output the array of hex colors to the console
	  console.log(hexColors);
	}
	In this modified version of the code, we only add the hex code to the hexColors array if it is six digits long. This ensures that only complete hex codes are added to the array.



*Hole in one, now, time to test the other phrases.

*I'm sure I can do this one myself.*




----


*We've taken a break from note taking, but this is too good not to loose from the GPT logs. Discussing probability in relation to the process we're building to segment the canvas into sections.*

2022-12-17 - 21:41 - this ended up being so comical, I didn't think about whether a model designed to be a chatbot language processing machine would be able to do maths, but follows amused me in the moment, when I think about it, and when I read back through it. So I'm leaving the entire thing in the main history.

*Do these add up to one?*

	No, these numbers do not add up to one. If we add them up, we get:
		0.0873015873015873 + 0.09523809523809523 + 0.06746031746031746 + 0.15476190476190477 + 0.1626984126984127 + 0.1626984126984127 + 0.1111111111111111 + 0.0992063492063492 + 0.05952380952380952 = 1.2698412698412698
		As you can see, the sum of these numbers is 1.2698412698412698, which is not equal to one.



	function getStringLengths(strings) {
	  // total number of words in all strings
	  const totalWords = strings.reduce((sum, str) => sum + str.split(" ").length, 0);
	
	  // array of each string's length as a proportion of totalWords
	  return strings.map(str => str.split(" ").length / totalWords);
	}
	
	const phraseProportions = Phrases
	const lengths = getStringLengths(phraseProportions);
	console.log(lengths);

*Can we alter this code to return the length of each string in the array as a proportion of the total length of all arrays

	Yes, you can alter this code to return the length of each string in the array as a proportion of the total length of all strings. Here is how you can do that:
	
		function getStringLengths(strings) {
		  // total length of all strings
		  const totalLength = strings.reduce((sum, str) => sum + str.length, 0);
		
		  // array of each string's length as a proportion of totalLength
		  return strings.map(str => str.length / totalLength);
		}
		
		const phraseProportions = Phrases;
		const lengths = getStringLengths(phraseProportions);
		console.log(lengths);
	
	In this updated code, we are using the .reduce() method to calculate the total length of all strings in the strings array. Then, we are using the .map() method to return an array of each string's length as a proportion of the total length of all strings.
	
	Note that in the original code, the .split() method was used to split each string into an array of words, and then the length of that array was used to calculate the proportion. In the updated code, we are using the .length property of each string to calculate its length, and then using that length to calculate the proportion.



[0.09176470588235294, 0.0996078431372549, 0.06588235294117648, 0.1380392156862745, 0.16470588235294117, 0.15215686274509804, 0.11294117647058824, 0.1192156862745098, 0.05568627450980392]
*do these add to one?

	No, these numbers do not add up to one. If we add them up, we get:
	
	0.09176470588235294 + 0.0996078431372549 + 0.06588235294117648 + 0.1380392156862745 + 0.16470588235294117 + 0.15215686274509804 + 0.11294117647058824 + 0.1192156862745098 + 0.05568627450980392 = 0.9999999999999999
	As you can see, the sum of these numbers is 0.9999999999999999, which is not equal to one.

*close enough though right?

	In general, it is not acceptable for the sum of a set of numbers to be almost equal to a certain value, but not exactly equal to that value. In this case, the numbers are supposed to represent proportions, and the sum of the proportions should be equal to 1. If the sum of the proportions is not equal to 1, then the numbers do not accurately represent proportions.
	
	However, it is possible that the small difference between the sum of these numbers and 1 is due to rounding error or other factors. In that case, you may be able to accept the numbers as being close enough to representing proportions. But it is important to carefully consider the potential sources of error and whether they are acceptable before making that decision.

*In this context I am thinking of them more as a chance, than directly as proportions, would it be close enough in that case?*

	In this context, where you are thinking of the numbers as representing a chance or probability rather than proportions, it would still be important for the sum of the numbers to be equal to 1. This is because the sum of probabilities or chances should always be equal to 1.
	
	For example, if you have a set of possible outcomes (such as the phrases in your example), and each outcome has a certain probability or chance of occurring, then the sum of the probabilities or chances of all possible outcomes should be equal to 1. This is because the probabilities or chances represent the likelihood of each outcome occurring, and the likelihood of all possible outcomes occurring together should be equal to 1 (since either one of the outcomes will occur, or none of them will occur).
	
	So, even in the context of representing chances or probabilities, it would not be acceptable for the sum of these numbers to be almost equal to 1, but not exactly equal to 1. However, as I mentioned before, it is possible that the small difference between the sum of these numbers and 1 is due to rounding error or other factors. In that case, you may be able to accept the numbers as being close enough to representing probabilities or chances. But again, it is important to carefully consider the potential sources of error and whether they are acceptable before making that decision.


*How would we alter the code above to make sure the resulting array sums to one? I can send it again if we need*
	
	To make sure that the resulting array sums to one, you can divide each number in the array by the sum of all numbers in the array. This will ensure that the sum of the resulting numbers is equal to 1. Here is how you can do that in the code:
	
		function getStringLengths(strings) {
		  // total length of all strings
		  const totalLength = strings.reduce((sum, str) => sum + str.length, 0);
		
		  // array of each string's length as a proportion of totalLength
		  const proportions = strings.map(str => str.length / totalLength);
		
		  // sum of all proportions
		  const sum = proportions.reduce((sum, proportion) => sum + proportion, 0);
		
		  // array of proportions divided by sum, to make the sum equal to 1
		  return proportions.map(proportion => proportion / sum);
		}
		
		const phraseProportions = Phrases;
		const lengths = getStringLengths(phraseProportions);
		console.log(lengths);
	
	In this updated code, we are using the .reduce() method to calculate the sum of all proportions, and then we are using the .map() method to divide each proportion by the sum, so that the resulting array of numbers sums to 1.

*Do these sum to one? [0.09176470588235294, 0.0996078431372549, 0.06588235294117648, 0.1380392156862745, 0.16470588235294117, 0.15215686274509804, 0.11294117647058824, 0.1192156862745098, 0.05568627450980392]

	No, these numbers do not sum to one. If we add them up, we get:
	
	0.09176470588235294 + 0.0996078431372549 + 0.06588235294117648 + 0.1380392156862745 + 0.16470588235294117 + 0.15215686274509804 + 0.11294117647058824 + 0.1192156862745098 + 0.05568627450980392 = 0.9999999999999999
	As you can see, the sum of these numbers is 0.9999999999999999, which is not equal to one. However, as I mentioned in a previous response, it is possible that the small difference between the sum of these numbers and 1 is due to rounding error or other factors. In that case, you may be able to accept the numbers as being close enough to representing proportions or probabilities. But it is important to carefully consider the potential sources of error and whether they are acceptable before making that decision.

*I think we shall consider them carefully considered, and decided they are acceptable.

	If you have carefully considered the potential sources of error and determined that the numbers are acceptable despite not summing exactly to 1, then that is your decision to make. It is important to understand the potential implications of using these numbers and make an informed decision based on that understanding.
	
	However, it is worth noting that if the small difference between the sum of these numbers and 1 is due to rounding error or other factors, you may be able to avoid that error by using a different method to calculate the proportions or probabilities. For example, instead of using the .map() method to divide each number by the sum, you could use the .map() method to divide each number by the total length of all strings, and then multiply the result by 100 to express the proportions as percentages. This would ensure that the sum of the resulting numbers is exactly equal to 100, which is the expected result for proportions expressed as percentages. Here is how you could do that:
	
		function getStringLengths(strings) {
		  // total length of all strings
		  const totalLength = strings.reduce((sum, str) => sum + str.length, 0);
		
		  // array of each string's length as a proportion of totalLength
		  const proportions = strings.map(str => str.length / totalLength);
		
		  // array of proportions multiplied by 100 to express as percentages
		  return proportions.map(proportion => proportion * 100);
		}
		
		const phraseProportions = Phrases;
		const lengths = getStringLengths(phraseProportions);
		console.log(lengths);
	
	In this updated code, we are using the .map() method to divide each string's length by the total length of all strings, and then multiply the result by 100 to express the proportions as percentages. This ensures that the sum of the resulting numbers is exactly equal to 100, which is the expected result for proportions expressed as percentages.

----Which I think is fantastic really


---
----

[History pt. 2](history2.md)

