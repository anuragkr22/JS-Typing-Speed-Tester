const testWrapper = document.querySelector(".test-wrapper");
const testArea = document.querySelector("#test-area");
const originText = document.querySelector("#origin-text p").innerHTML;
const resetButton = document.querySelector("#reset");
const theTimer = document.querySelector(".timer");
const wpm = document.querySelector("#wpm-data");
const accuracy = document.querySelector("#accuracy-data");

var timer = [0, 0, 0, 0]; // minutes, seconds, 100th of seconds, 1000th of seconds
var interval;
var timerRunning = false;
var totalTypedWords = 0;
const totalWords = originText.length;

// Add leading zero to numbers 9 or below (purely for aesthetics):
function leadingZero(time) {
  if (time <= 9) {
    time = "0" + time;
  }
  return time;
}

// Run a standard minute/second/hundredths timer:
function runTimer() {
  let currentTime = `${leadingZero(timer[0])}:${leadingZero(
    timer[1]
  )}:${leadingZero(timer[2])}`;
  theTimer.innerHTML = currentTime;
  timer[3]++;

  timer[0] = Math.floor(timer[3] / 100 / 60);
  timer[1] = Math.floor(timer[3] / 100 - timer[0] * 60);
  timer[2] = Math.floor(timer[3] - timer[1] * 100 - timer[0] * 6000);
}

// Calculate number of words in the give para
function countWords(paragraph) {
  paragraph = paragraph.trim();

  if (paragraph === "") {
    return 0;
  }

  let words = paragraph.split(/\s+/);

  words = words.filter(function (word) {
    return word.length > 0;
  });

  return words.length;
}

// Calculate the accuracy in %
function findAccuracy() {
  // Accuracy (%)=(Number of Correct Characters / Total Number of Typed Characters)×100
  let accuracy = Math.floor((totalWords / totalTypedWords) * 100);
  return accuracy;
}

// Match the text entered with the provided text on the page:
function spellCheck() {
  let textEntered = testArea.value;

  let originTextMatch = originText.substring(0, textEntered.length);

  if (textEntered == originText) {
    clearInterval(interval);
    testWrapper.style.borderColor = "lightgreen";
    wpm.innerHTML = Math.floor(
      countWords(originText) / (timer[1] / 60 + timer[0])
    );
    accuracy.innerHTML = findAccuracy() + "%";
    console.log("Number of words:", countWords(originText));
  } else {
    if (textEntered == originTextMatch) {
      testWrapper.style.borderColor = "#65CCF3";
    } else {
      testWrapper.style.borderColor = "#E95D0F";
    }
  }
}

// Start the timer:
function start() {
  let textEnteredLength = testArea.value.length;
  totalTypedWords++;
  if (textEnteredLength === 0 && !timerRunning) {
    timerRunning = true;
    interval = setInterval(runTimer, 10);
  }
}

// Reset everything:
function reset() {
  clearInterval(interval);
  interval = null;
  timer = [0, 0, 0, 0];
  timerRunning = false;

  testArea.value = "";
  theTimer.innerHTML = "00:00:00";
  testWrapper.style.borderColor = "grey";
  wpm.innerHTML = "0";
  accuracy.innerHTML = "0%";
  totalTypedWords = 0;
}

// Event listeners for keyboard input and the reset button:
testArea.addEventListener("keypress", start, false);

testArea.addEventListener("keyup", spellCheck, false);

testArea.addEventListener("paste", function (e) {
  e.preventDefault();
});

resetButton.addEventListener("click", reset, false);
