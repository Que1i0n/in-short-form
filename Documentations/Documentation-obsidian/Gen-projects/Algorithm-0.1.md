1. 
	// This will determine the number of phrases that will be used in the artwork
Roll two six-sided dice and sum the two dice rolls. Use the notepad to record this roll as "numberOfPhrases".

2. 
	// This will give the interval at which the selected phrases will be spaced throughout the Bible
Roll two six-sided dice and use the notepad to record this roll as "iterationSeed".

2a. 
	// Record the total number of pages in the book
Use the notepad to record the total number of pages in the book as "bookLength".

3. 
	// This will give the page interval phrases are selected from, and the phrase interval the phrases are selected on the page.
Randomly select a page number from the Bible, divide the page number by the "iterationSeed", and round down to the nearest whole number.
Use the notepad to record this number as "pageInterval".

4. 
	// Check if the "pageInterval" and "phraseInterval" selected in step 3 will keep the process within the bounds of the book
Calculate the total number of pages that will be used in the process by multiplying the "pageInterval" by the "numberOfPhrases".
If this number is greater than the "bookLength", go back to step 3 and randomly select a new "pageInterval" and "phraseInterval" until the resulting values are within the bounds of the book.

5. 
	// Calculate the "phraseInterval"
Divide the "pageInterval" by the "numberOfPhrases", and round down to the nearest whole number.
Use the notepad to record this as "phraseInterval".

6. 
	// Scale the "pageInterval" and "phraseInterval" if necessary
If the total number of pages used in the process is greater than the "bookLength", divide the "pageInterval" and "phraseInterval" by a suitable scaling factor to bring them within the range.

7. 
	//These groups of words will form the phrases that will be used in the artwork, as well as the basis for the arrangement parameters.
Starting at the "PageInterval", use the notepad to select every nth sentence (or "LengthofPhrase"), where n is the "IterationSeed"th sentence for each nth "PageInterval".


8. 
	//This will determine the position of the phrases within the artwork.
For each selected phrase, use the number of in the words in the phrase. Then, roll two six-sided dice to determine the rotational degree (e.g. 1=30 degrees, 6=360 degrees), use the notebook to record these values for each phrase.

 and use the number of words, and number of characters in the phrase and the die roll to determine the relative placement of the phrase in the artwork.
		
-

9. 
	//This will generate the artwork
Use the selected Bible phrases and their corresponding placement rolls to create the artwork. The phrases could be used as labels for different shapes or elements in the artwork, or they could be used to create a visual representation of the words themselves. 

10. 
	//This will specify intensity and saturation
For each character in the phrases, assign a corresponding value for the intensity and saturation of the pixels in the artwork. 

11. 
	//This will determine the proportional area of coverage for each phrase
Calculate the ratio of the number of words in each selected phrase to the total number of words in all selected phrases. Use this ratio to determine the proportion of the image that will be controlled by each phrase.

12. 
	//This will define aspect ratio
Roll two six-sided dice to determine the aspect ratio of the final image. The aspect ratio will be equal to the sum of the two dice rolls divided by 10 (e.g. a roll of 4 and 6 would give an aspect ratio of 1.0, while a roll of 3 and 5 would give an aspect ratio of 0.8). The aspect ratio will determine the relative height and width of the final image.

I like this, but I think it's better to just do two dice rolls and the ratio is dice roll 1:dice roll 2

13. 
	//This will limit the colour range
Roll three six-sided dice to determine the maximum and minimum values for the red, green, and blue channels in the RGB color space. The minimum value for each channel will be equal to the sum of the two lowest dice rolls, while the maximum value for each channel will be equal to the sum of the two highest dice rolls.

14. 
	//This will select the colour pallettes
Use the notepad to randomly select colors that fall within the specified range for each channel in the RGB color space. These colors will be used in the final artwork.

15. 
	//Any other additional constraints
Roll two six-sided dice to determine quantity of any additional constraints or parameters that will be imposed on the artwork. 
		These could include things like a specific arrangement of shapes or elements, or any other creative constraints that the artist wants to impose. The specific constraints will be determined based on the sum of the dice rolls.

16. 
	//This will create a collection (ie. iterate)
Use the selected colors, Bible phrases, and their placement in the artwork, as well as any additional constraints, to create the final artwork. Use the ruleset to create multiple unique artworks, varying the selected Bible phrases, their placement, the selected colors, and the additional constraints in each iteration to produce a diverse collection of generative artworks.