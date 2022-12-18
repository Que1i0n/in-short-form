
*Xander Merricks*
	In the following ruleset, what should happen if the iterations continue past the end of the book?
	1. Roll two six-sided dice to determine the number of phrases that will be used in the artwork. This number will be equal to the sum of the two dice rolls.
	2. Use the notepad to randomly select a page number from the Bible. Then, roll two six-sided dice to determine the number of words on the page. Multiply the page number by the number of words to obtain the total number of words in the Bible up to that point. Divide the total number of words by the number of phrases to be used in the artwork, and round down to the nearest whole number. This will give the interval at which the selected phrases will be spaced throughout the Bible.
	3. Starting at the beginning of the Bible, use the notepad to select every nth group of words, where n is the interval determined in step 2. These groups of words will form the phrases that will be used in the artwork, as well as the basis for the arrangement parameters.

*ChatGPT*
	If the iterations continue past the end of the book, the selected phrases will not be found and the process will need to be repeated with new dice rolls and a new page number. It is important to ensure that the selected page number and interval do not exceed the number of pages and words in the Bible.

*Xander Merricks*
	In the following altered ruleset, what should be included to protect against the iterations continuing past the end of the book?
	
	This will determine the number of phrases that will be used in the artwork.
	1. Roll two six-sided dice and sum the two dice rolls.
	
	This will give the interval at which the selected phrases will be spaced throughout the Bible.
	2. Roll two six-sided dice, use the notepad to record this roll. Then randomly select a page number from the Bible, divide the page number by the dice roll, and round down to the nearest whole number. This will give the interval at which the pages the selected phrases will be selected from will be spaced throughout the Bible
	   Divide the total number by the number of phrases to be used in the artwork, and round down to the nearest whole number. This will give the distance at which the selected phrases will be selected from the start of the page selected above.  
	
	These groups of words will form the phrases that will be used in the artwork, as well as the basis for the arrangement parameters.
	3. Starting at the beginning of the Bible, use the notepad to select every nth group of words, where n is the interval determined in step 2.

*ChatGPT*
	To protect against the iterations continuing past the end of the book, it would be necessary to include a check to ensure that the selected page number and interval do not exceed the number of pages and words in the Bible. This could be done by adding a condition in step 2 to limit the page number and interval to the number of pages and words in the Bible. Additionally, it may be useful to include a check in step 3 to ensure that the selected phrases are actually present in the Bible before using them in the artwork.

*Xander Merricks*
	can you provide an example for a condition in step 2 described above?

*ChatGPT*
	Yes, an example of a condition that could be added in step 2 to limit the page number and interval to the number of pages and words in the Bible would be:
	
		// Ensure that the selected page number and interval do not exceed the number of pages and words in the Bible
		if (pageNumber > totalPages || interval > totalWords) {
		  // Repeat the process with new dice rolls and a new page number
		  // Alternatively, choose a new page number and interval that is within the range of the Bible
		}
	
	This condition checks if the selected page number or interval is greater than the total number of pages or words in the Bible, respectively. If either of these conditions is true, the process is repeated with new dice rolls and a new page number, or a new page number and interval are chosen that is within the range of the Bible. This ensures that the selected phrases will be found in the Bible and can be used in the artwork.


---

Following this, I manually went through the phrase selection part of the algorithm and edited it as follows:
	
	1. This will determine the number of phrases that will be used in the artwork.
	   Roll two six-sided dice and sum the two dice rolls, use the notepad to record this roll as "NumberofPhrases".
	   Roll a number of dice equal to the result of a single die roll, use the notepad to record this roll as "LengthofPhrase"
	
	2. This will give the interval at which the selected phrases will be spaced throughout the Bible.
	   Roll two six-sided dice, use the notepad to record this roll as "IterationSeed". 
	   
	   Then limit the page range.
	      "totalPage"/"NumberofPhrases", use the notepad to record this as "pageRange" 
	   
	   Then randomly select a page number from the within the "pageRange", divide the page number by the "IterationSeed", and round down to the nearest whole number, record this number as "pageInterval". This will give the interval at which the pages the selected phrases will be selected from will be spaced throughout the Bible
	   
	   Divide the "pageInterval" by the "NumberofPhrases", and round down to the nearest whole number, use the notepad to record this as "phraseInterval". This will give the distance at which the selected phrases will be selected from the start of the page selected above. 
	
	3. These groups of words will form the phrases that will be used in the artwork, as well as the basis for the arrangement parameters.
	   
	   Starting at the first page, use the notepad to select every nth sentence (or "LengthofPhrase"), where n is the interval determined in step 2.

At which point, I returned to chat GPT to ask it "Can you simplify the expression of this ruleset?"

Which gave me a farm more detailed response than I was expecting:

![chatGPT Response](11-12-2022--03-59-21-951-PM.png)


*However, there are errors which I'm going to fix manually to speed up the process as I think given the earlier history of getting to actually testing it out took quite a while.*

*So, follows an incomplete updated algorithm for selecting phrases within the bounds of the book, also generalised to prevent ChatGPT getting caught by Bible references.*

	var numberOfPhrases
	var iterationSeed
	var bookLength
	
	
	1. This will determine the number of phrases that will be used in the artwork
	   
	   Roll two six-sided dice and sum the two dice rolls. Use the notepad to record this roll as "numberOfPhrases".
	
	2. This will give the interval at which the selected phrases will be spaced throughout the Bible
	   Roll two six-sided dice and use the notepad to record this roll as "iterationSeed".
	   
	   Use the notepad to record the total number of pages in the book as "bookLength".
	
	3. This will give the page interval phrases are selected from, and the phrase interval the phrases are selected on the page.
	   
	   Randomly select a page number from the Bible, divide the page number by the "iterationSeed", and round down to the nearest whole number.
	   
	   Use the notepad to record this number as "pageInterval".
	   
	   Divide the "pageInterval" by the "numberOfPhrases", and round down to the nearest whole number. Use the notepad to record this as "phraseInterval".
	   
	   4. Check the default process will stay within the book


*I couldn't quite work out how to get a check that'd work instantly, so i decideced to go back to ChatGPT to see if it could complete it if I just asked "can you finish this phrase selection algorithm please?" (this is in a new thread).*

	
	// Check if the "pageInterval" is within the range of pages in the book
	If "pageInterval" is greater than or equal to "bookLength", go back to step 3 and select a new page number.
	
	// This will determine the starting page for the phrase selection process
	Multiply the "pageInterval" by the "iterationSeed" to get the starting page number. Use the notepad to record this as "startingPage".
	
	// This will determine the first phrase to be selected
	Starting on the "startingPage", select every "phraseInterval"th phrase until "numberOfPhrases" phrases have been selected. Use the notepad to record these phrases.
	
	// The phrase selection process is now complete
	The selected phrases can now be used in the artwork.


Interestingly ChatGPT had no commentary on this one whatsoever - I'd noticed up to this point it would effectively repeat the question followed by a response but not in this case.


I thought I'd try a different tact:

Please can you write a step 3a. for this process?
	
	1. 
		// This will determine the number of phrases that will be used in the artwork
	Roll two six-sided dice and sum the two dice rolls. Use the notepad to record this roll as "numberOfPhrases".
	
	2. 
		// This will give the interval at which the selected phrases will be spaced throughout the Bible
	Roll two six-sided dice and use the notepad to record this roll as "iterationSeed".
	
	2a. 
	Use the notepad to record the total number of pages in the book as "bookLength".
	
	3.	
		// This will give the page interval phrases are selected from, and the phrase interval the phrases are selected on the page.
	Randomly select a page number from the Bible, divide the page number by the "iterationSeed", and round down to the nearest whole number.
	
	Use the notepad to record this number as "pageInterval".
	
	Divide the "pageInterval" by the "numberOfPhrases", and round down to the nearest whole number. Use the notepad to record this as "phraseInterval".

	
	3a. 
		//Check the default process will stay within the book
	3a.
	// Check if the "pageInterval" and "phraseInterval" selected in step 3 will keep the process within the bounds of the book
	
	If the "pageInterval" multiplied by the "numberOfPhrases" is greater than the "bookLength", go back to step 3 and randomly select a new "pageInterval" and "phraseInterval" until the resulting values are within the bounds of the book. Use the notepad to record the new values.

	Is there a better way of doing it with an intermediate step to check whether the result will be out of bounds, and manipulate the result by scaling it to be within the bounds? Even if there's not, could you provide an example of the above algorithm altered in the described manner?

	One way to check if the "pageInterval" and "phraseInterval" will be within the bounds of the book is to first calculate the total number of pages that will be used in the process by multiplying the "pageInterval" by the "numberOfPhrases". Then, compare this number to the "bookLength" to determine if the values are within the bounds of the book. If the resulting values are not within the bounds, you can scale the "pageInterval" and "phraseInterval" by dividing them by a suitable scaling factor to bring them within the bounds of the book. Here is an example of this modified algorithm:
	
	// This will determine the number of phrases that will be used in the artwork
	Roll two six-sided dice and sum the two dice rolls. Use the notepad to record this roll as "numberOfPhrases".
	
	// This will give the interval at which the selected phrases will be spaced throughout the Bible
	Roll two six-sided dice and use the notepad to record this roll as "iterationSeed".
	
	2a. // Record the total number of pages in the book
	Use the notepad to record the total number of pages in the book as "bookLength".
	
	// This will give the page interval phrases are selected from, and the phrase interval the phrases are selected on the page.
	Randomly select a page number from the Bible, divide the page number by the "iterationSeed", and round down to the nearest whole number.
	Use the notepad to record this number as "pageInterval".
	
	// Check if the "pageInterval" and "phraseInterval" selected in step 3 will keep the process within the bounds of the book
	Calculate the total number of pages that will be used in the process by multiplying the "pageInterval" by the "numberOfPhrases".
	If this number is greater than the "bookLength", go back to step 3 and randomly select a new "pageInterval" and "phraseInterval" until the resulting values are within the bounds of the book.
	
	// Calculate the "phraseInterval"
	Divide the "pageInterval" by the "numberOfPhrases", and round down to the nearest whole number.
	Use the notepad to record this as "phraseInterval".
	
	// Scale the "pageInterval" and "phraseInterval" if necessary
	If the total number of pages used in the process is greater than the "bookLength", divide the "pageInterval" and "phraseInterval" by a suitable scaling factor to bring them within the 

---
and then it stopped, I'm not sure why, but the blinking dots is like watching paint dry. but I think it can just finish "range." but I'm not sure we'll see.

let's see what happens in any case.

This is Algorithm - 1.0

[back](history.md) to the history.