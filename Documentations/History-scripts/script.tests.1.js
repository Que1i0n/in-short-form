function getStringLengths(strings) {
  // total number of words in all strings
  const totalWords = strings.reduce((sum, str) => sum + str.split(" ").length, 0);

  // array of each string's length as a proportion of totalWords
  return strings.map(str => str.split(" ").length / totalWords);
}

const phrases = ["This is a phrase", "This is another phrase", "This is yet another phrase"];

const lengths = getStringLengths(phrases);
console.log(lengths); // [0.25, 0.375, 0.375]

//Actual [    0.3076923076923077, 0.3076923076923077,    0.38461538461538464]