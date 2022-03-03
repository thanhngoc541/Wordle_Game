const targetWords = [
  "proud",
  "squad",
  "laugh"
]
const dictionary = [
  "proud",
  "squad",
  "laugh"
]
const WORD_LENGTH = 5
const FLIP_ANIMATION_DURATION = 500
const DANCE_ANIMATION_DURATION = 500
const keyboard = document.querySelector("[data-keyboard]")
const alertContainer = document.querySelector("[data-alert-container]")
const guessGrid = document.querySelector("[data-guess-grid]")
const offsetFromDate = new Date(2022, 0, 1)
const msOffset = Date.now() - offsetFromDate
const dayOffset = msOffset / 1000 / 60 / 60 / 24
const attemptScores = [250, 200, 150, 100, 50, 25];
const speedScores = [{ second: 30, score: 500 },
{ second: 60, score: 450 },
{ second: 90, score: 400 },
{ second: 120, score: 350 },
{ second: 150, score: 300 },
{ second: 180, score: 250 },
{ second: 210, score: 200 },
{ second: 240, score: 150 },
{ second: 270, score: 100 },
{ second: 300, score: 50 },
{ second: Infinity, score: 10 },
]
var roundNum = 0
var targetWord = targetWords[roundNum]
var score = 0;
startInteraction()

function startInteraction() {
  document.addEventListener("click", handleMouseClick)
  document.addEventListener("keydown", handleKeyPress)
}

function stopInteraction() {
  document.removeEventListener("click", handleMouseClick)
  document.removeEventListener("keydown", handleKeyPress)
}

function handleMouseClick(e) {
  if (e.target.matches("[data-key]")) {
    pressKey(e.target.dataset.key)
    return
  }

  if (e.target.matches("[data-enter]")) {
    submitGuess()
    return
  }

  if (e.target.matches("[data-delete]")) {
    deleteKey()
    return
  }
}

function handleKeyPress(e) {
  if (e.key === "Enter") {
    submitGuess()
    return
  }

  if (e.key === "Backspace" || e.key === "Delete") {
    deleteKey()
    return
  }

  if (e.key.match(/^[a-z]$/)) {
    pressKey(e.key)
    return
  }
}

function pressKey(key) {
  const activeTiles = getActiveTiles()
  if (activeTiles.length >= WORD_LENGTH) return
  const nextTile = guessGrid.querySelector(":not([data-letter])")
  nextTile.dataset.letter = key.toLowerCase()
  nextTile.textContent = key
  nextTile.dataset.state = "active"
}

function deleteKey() {
  const activeTiles = getActiveTiles()
  const lastTile = activeTiles[activeTiles.length - 1]
  if (lastTile == null) return
  lastTile.textContent = ""
  delete lastTile.dataset.state
  delete lastTile.dataset.letter
}

function submitGuess() {
  const activeTiles = [...getActiveTiles()]
  if (activeTiles.length !== WORD_LENGTH) {
    showAlert("Not enough letters")
    shakeTiles(activeTiles)
    return
  }

  const guess = activeTiles.reduce((word, tile) => {
    return word + tile.dataset.letter
  }, "")

  // if (!dictionary.includes(guess)) {
  //   showAlert("Not in word list")
  //   shakeTiles(activeTiles)
  //   return
  // }

  stopInteraction()
  activeTiles.forEach((...params) => flipTile(...params, guess))
}

function flipTile(tile, index, array, guess) {
  const letter = tile.dataset.letter
  // const key = keyboard.querySelector(`[data-key="${letter}"i]`)
  setTimeout(() => {
    tile.classList.add("flip")
  }, (index * FLIP_ANIMATION_DURATION) / 2)

  tile.addEventListener(
    "transitionend",
    () => {
      tile.classList.remove("flip")
      if (targetWord[index] === letter) {
        tile.dataset.state = "correct"
        // key.classList.add("correct")
      } else if (targetWord.includes(letter)) {
        tile.dataset.state = "wrong-location"
        // key.classList.add("wrong-location")
      } else {
        tile.dataset.state = "wrong"
        // key.classList.add("wrong")
      }

      if (index === array.length - 1) {
        tile.addEventListener(
          "transitionend",
          () => {
            startInteraction()
            checkWinLose(guess, array)
          },
          { once: true }
        )
      }
    },
    { once: true }
  )
}
function getDataLetters() {
  return guessGrid.querySelectorAll('[data-letter]');
}
function remmoveDataLetter() {
  var dataLetters = getDataLetters();
  dataLetters.forEach(div => {
    div.removeAttribute('data-letter')
    div.removeAttribute('data-state')
    div.innerHTML = "";
  });
}
function getActiveTiles() {
  return guessGrid.querySelectorAll('[data-state="active"]')
}
var popupStatus = 0;
var popup = [document.getElementById("popup0"), document.getElementById("popup1"), document.getElementById("popup2")];
function showInfo() {
  popup[popupStatus].classList.toggle("show");
  popupStatus = (popupStatus + 1) % 3;
  popup[popupStatus].classList.toggle("show");
}

function closeInfo() {
  popupStatus = 0;
  for (var i = 0; i < popup.length; i++) {
    popup[i].classList.remove("show");
  }
}

function showAlert(message, duration = 1000) {
  const alert = document.createElement("div")
  alert.textContent = message
  alert.classList.add("alert")
  alertContainer.prepend(alert)
  if (duration == null) return

  setTimeout(() => {
    alert.classList.add("hide")
    alert.addEventListener("transitionend", () => {
      alert.remove()
    })
  }, duration)
}

function shakeTiles(tiles) {
  tiles.forEach(tile => {
    tile.classList.add("shake")
    tile.addEventListener(
      "animationend",
      () => {
        tile.classList.remove("shake")
      },
      { once: true }
    )
  })
}
function getScoreOnTime() {
  for (var i = 0; i < speedScores.length; i++) {
    if (speedScores[i].second > totalSeconds) return speedScores[i].score;
  }
}
var scoreLabels = document.getElementsByClassName('score');

function finishRound() {
  score += attemptScores[Math.fround(getDataLetters().length / 5) - 1];
  score += getScoreOnTime();
  console.log(scoreLabels)
  for (var i = 0; i < scoreLabels.length; i++) {
    scoreLabels[i].innerHTML = `Score: ${score}`
  }
  if (roundNum == targetWords.length - 1) {
    document.getElementById('popup3').classList.toggle('show');
    return stopInteraction();
  }
  endRound();
}
var endRoundScreen = document.getElementById('end-round');
function endRound() {
  endRoundScreen.classList.toggle('show');
}
function startRound() {
  endRoundScreen.classList.remove('show');
  console.log("start round")
  setRound(++roundNum);
  remmoveDataLetter();
}


var roundLabels = document.getElementsByClassName('round-text')

function setRound(round) {
  totalSeconds = 0;
  targetWord = targetWords[round];
  console.log(roundLabels)
  for (var i = 0; i < roundLabels.length; i++)
    roundLabels[i].innerHTML = `ROUND ${round + 1}`
}

function checkWinLose(guess, tiles) {
  if (guess === targetWord) {
    showAlert("You Win", 1000)
    danceTiles(tiles)
    finishRound();
    return
  }

  const remainingTiles = guessGrid.querySelectorAll(":not([data-letter])")
  if (remainingTiles.length === 0) {
    showAlert(targetWord.toUpperCase(), null)
    stopInteraction()
  }
}

function danceTiles(tiles) {
  tiles.forEach((tile, index) => {
    setTimeout(() => {
      tile.classList.add("dance")
      tile.addEventListener(
        "animationend",
        () => {
          tile.classList.remove("dance")
        },
        { once: true }
      )
    }, (index * DANCE_ANIMATION_DURATION) / 5)
  })
}

var timer = document.getElementById("timer");
var totalSeconds = 0;
setInterval(setTime, 1000);

function setTime() {
  ++totalSeconds;
  var seconds = pad(totalSeconds % 60);
  var minutes = pad(parseInt(totalSeconds / 60))
  timer.innerHTML = `${minutes}:${seconds}`
}

function pad(val) {
  var valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}
