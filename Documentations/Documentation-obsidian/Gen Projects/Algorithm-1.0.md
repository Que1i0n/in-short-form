	//This will determine the number of phrases that will be used in the artwork.
1. 
Roll two six-sided dice and sum the two dice rolls, use the notepad to record this roll as "NumberofPhrases".

		1a. Roll a number of dice equal to the result of a single die roll, use the notepad to record this roll as "LengthofPhrase"

	//This will give the interval at which the selected phrases will be spaced throughout the Bible.
2. 
Roll two six-sided dice, use the notepad to record this roll as "IterationSeed". 

Then limit the page range. 

"totalPage"/"NumberofPhrases", use the notepad to record this as "pageRange"

Then randomly select a page number from the within the "pageRange", divide the page number by the "IterationSeed", and round down to the nearest whole number, record this number as "pageInterval". This will give the interval at which the pages the selected phrases will be selected from will be spaced throughout the Bible

Divide the "pageInterval" by the "NumberofPhrases", and round down to the nearest whole number, use the notepad to record this as "phraseInterval". This will give the distance at which the selected phrases will be selected from the start of the page selected above. 

	//These groups of words will form the phrases that will be used in the artwork, as well as the basis for the arrangement parameters.
3. 
Starting at the first page, use the notepad to select every nth sentence (or "LengthofPhrase"), where n is the interval determined in step 2.

	//This will determine the position of the phrases within the artwork.
4. 
For each selected phrase, use the notepad to determine the alphanumerical qualities of the characters in the words in the phrase. Then, roll a single six-sided die to determine a direction (e.g. "up", "down", "left", "right") and use the number of words in the phrase and the die roll to determine the relative placement of the phrase in the artwork.
		For example, the letter "a" could correspond to the coordinate position (0.1, 0.1), while the letter "z" could correspond to the coordinate position (0.9, 0.9). Use these coordinates to determine the relative placement of the phrase in the artwork.

-


	5. //This will generate the artwork
Use the selected Bible phrases and their corresponding placement rolls to create the artwork. The phrases could be used as labels for different shapes or elements in the artwork, or they could be used to create a visual representation of the words themselves. 

	5a. //This will specify intensity and saturation
For each character in the phrases, use the notepad to assign a corresponding value for the intensity and saturation of the pixels in the artwork. For example, a character such as "a" could correspond to a low intensity and high saturation, while a character such as "z" could correspond to a high intensity and low saturation.

	5b. //This will determine the proportional area of coverage for each phrase
Calculate the ratio of the number of words in each selected phrase to the total number of words in all selected phrases. Use this ratio to determine the proportion of the image that will be controlled by each phrase.

	7. //This will define aspect ratio
Roll two six-sided dice to determine the aspect ratio of the final image. The aspect ratio will be equal to the sum of the two dice rolls divided by 10 (e.g. a roll of 4 and 6 would give an aspect ratio of 1.0, while a roll of 3 and 5 would give an aspect ratio of 0.8). The aspect ratio will determine the relative height and width of the final image.

6. //This will limit the colour range
Roll three six-sided dice to determine the maximum and minimum values for the red, green, and blue channels in the RGB color space. The minimum value for each channel will be equal to the sum of the two lowest dice rolls, while the maximum value for each channel will be equal to the sum of the two highest dice rolls.

	8. //This will select the colour pallettes
Use the notepad to randomly select colors that fall within the specified range for each channel in the RGB color space. These colors will be used in the final artwork.

	9. //Any other additional constraints
Roll two six-sided dice to determine quantity of any additional constraints or parameters that will be imposed on the artwork. 
		These could include things like a specific arrangement of shapes or elements, or any other creative constraints that the artist wants to impose. The specific constraints will be determined based on the sum of the dice rolls.

	10. //This will create a collection (ie. iterate)
Use the selected colors, Bible phrases, and their placement in the artwork, as well as any additional constraints, to create the final artwork. Use the ruleset to create multiple unique artworks, varying the selected Bible phrases, their placement, the selected colors, and the additional constraints in each iteration to produce a diverse collection of generative artworks.