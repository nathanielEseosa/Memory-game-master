// An array that holds all the card symbols

var cardNames = ["fa fa-diamond", "fa fa-paper-plane-o", "fa fa-anchor", "fa fa-bolt", "fa fa-cube", "fa fa-anchor", "fa fa-leaf",
"fa fa-bicycle", "fa fa-diamond", "fa fa-bomb", "fa fa-leaf", "fa fa-bomb", "fa fa-bolt", "fa fa-bicycle", "fa fa-paper-plane-o", "fa fa-cube"];

/*
 * Display the cards on the page

 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

/*  
* Assign the symbols to the cards
* - randomly add symbols to cards 
*/
function assignCards() {
  $(".card").children().each(function(index) {
    $(this).addClass(cardNames[index]);
  });
};

// An array that store two cards for comparation purpose
var selectedCards = [];

// A variable that is use as a "switch" to make sure the timer only trigger once per game
var timerReader = 0;

// This variable stores the result of the timer interval and is used as the ID for the clearInterval method to stop the timer from running
var theTimer;


 /* 
 * Trigger functions whenever the user click on a card
 * - show the symbol of the card
 * - store two cards in an array
 * - start timer
 * - open a congratulation window
 */
$(".card").click(function() {
  if (!$(this).hasClass("show")) {
    flipCard(this);
    storeCards($(this));
    if (timerReader < 1) {
      startTimer();
    }
    timerReader++;
  };
  gameWon();
}); 


 /* 
 * Reveals the symbols assigned to the cards on the HTML page
 */
function flipCard(clickedCard) {
  $(clickedCard).addClass("open show");
};

 /* 
 * Store two cards in an array
 * - check if at least two cards has been clicked
 * - start counting player moves
 * - rate player perfomance with stars
 */
function storeCards(card) {
  selectedCards.push(card);
  if (selectedCards.length === 2) {
    countMoves();
    starsRating();
    compareCards();
  };
};

 /* 
 * Compare two cards that are stored in an array
 * - keep identical cards open
 * - turn cards to back if they are not identical
 */
function compareCards() {
  var card1 = selectedCards[0].find(">:first-child");
  var card2 = selectedCards[1].find(">:first-child");

  if (card1.attr("class") === card2.attr("class")) {
    $(card1).addClass("staySelected");
    $(card2).addClass("staySelected");
    $(card1).removeClass("unmatched");
    $(card2).removeClass("unmatched");
    emptyselectedCards();
  } else {
    setTimeout(function(){
      $("i:not(.staySelected)").parent().removeClass("open show");
    }, 500);
    emptyselectedCards();
  };
};

 /* 
 * Remove the two cards stored in an array after they have been compared
 */
function emptyselectedCards() {
  selectedCards.length = 0;
};

 /* 
 * Reset the game
 */
function restartGame() {
    $("li").removeClass("open show");
    $("i").removeClass("staySelected");
    $("i").addClass("unmatched");
    $(".moves").html(0);
    resetTimer();
    resetStars();
    resettimerReader();
    emptyselectedCards();
};

 /* 
 * Open modal after winning the game
 * - a modal appears to congratulate the player
 * - tells the user how much time it took to win the game, and what the star rating was
 */
function gameWon() {
  if ($(".unmatched").length === 0) {
    setTimeout(function(){
      $(".modal-wrapper").toggleClass("open");
      $(".page-wrapper").toggleClass("blur-it");
      $("p.performance-data").html("It took you" + " " + $("i.min").html() + "." + $("i.sec").html() + " " + "Minutes," + " " + $(".moves").html() + " " + "Moves and" + " " + $(".fa-star").length + " " + "Star(s).");
      stopTimer();
      resettimerReader();
    }, 1000);
  };
};

 /* 
 * Count player moves
 */
function countMoves() {
  if (selectedCards.length === 2) {
    $('.moves').html(function(i, val) {return val * 1 + 1});
  };
};

 /* 
 * Remove stars after the player reaches a certain amount of moves
 */
function starsRating() {
  if ($(".moves").html() === "14") {
    $("i.star3").removeClass("fa-star");
    $("i.star3").addClass("fa-star-o");
  } else if ($(".moves").html() === "18") {
    $("i.star2").removeClass("fa-star");
    $("i.star2").addClass("fa-star-o");
  }
};

 /* 
 * Reset (fill) stars
 */
function resetStars() {
  $("i.star1").removeClass("fa-star-o");
  $("i.star2").removeClass("fa-star-o");
  $("i.star3").removeClass("fa-star-o");
  $("i.star1").addClass("fa-star");
  $("i.star2").addClass("fa-star");
  $("i.star3").addClass("fa-star");
};

 /* 
 * Start the game timer
 */
function startTimer() {
  theTimer = setInterval(function(){
    $(".sec").html(function(i, val) {
      return val * 1 + 1;
    });
    if ($(".sec").html() == 61) {
      $(".sec").html(0);
      $(".min").html(function(i, val) {
        return val * 1 + 1;
      });
    } 
  }, 1000);
}

 /* 
 * Reset the game timer
 */
function resetTimer() {
  clearInterval(theTimer);
  $(".min").html(0);
  $(".sec").html(0);
};

 /* 
 * Freeze the game timer
 */
function stopTimer() {
  clearInterval(theTimer);
};

 /* 
 * Reset the switch that makes the timer triggers once per game 
 */
function resettimerReader() {
  timerReader = 0;
}

 /* 
 * When page is ready:
 * - shuffle the cards
 * - assign the symbols to the cards
 * - reset button resets the game
 * - modal will be closed and the game will be reset whenever the player click on the "Play Again" button on the modal window  
 */
$(document).ready(function() {
  shuffle(cardNames);
  assignCards();
  $(".restart, .play-again").click(function(){
    restartGame();
  });
  $(".trigger").on("click", function() {
    $(".modal-wrapper").toggleClass("open");
    $(".page-wrapper").toggleClass("blur-it");
     return false;
  });
});


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

