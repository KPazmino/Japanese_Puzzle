"use strict";

/*
   New Perspectives on HTML5, CSS3, and JavaScript 6th Edition
   Tutorial 11
   Tutorial Case

   Author: 
   Date:   

   Global Variables
   ================
   
   puzzleCells
      References the TD cells within the Hanjie table grid.
   
   cellBackground
      Stores the current background color of the puzzle
      cells during the mouseover event.
      
      
   Function List
   =============

   init()
      Run when the web page is loaded; displays puzzle 1
      and loads the event handlers for the web page buttons.
      
   setupPuzzle()
      Sets up a new puzzle, adding the event handlers for
      every puzzle cell.      

   swapPuzzle(e)
      Swaps one puzzle for another based on the button being clicked
      by the user. Confirms the change before swapping in the
      new puzzle.

   setBackground(e)
      Sets the background color of the puzzle cells during the mousedown
      event

   extendBackground(e)
      Extends the background color of the original puzzle cell during
      the mouseenter event.
      
   endBackground()
      Ends the action of extending the cell backgrounds in response to the
      mouseup event.

   drawPuzzle(hint, rating, puzzle)
      Returns a text string of the HTML code to
      display a hanjie Web table based on the contents of
      multi-dimensional array, puzzle.
   
*/

// Run the init() function when page loads
window.onload = init;

// Global variables to store the array of ALL the puzzle's cells and the current background color of the cells
let puzzleCells;
let cellBackground;

// Definition of the init() function
function init() {
   // Insert the title for the first puzzle
   document.getElementById("puzzleTitle").innerHTML = "Puzzle 1";

   // Insert the HTML code for the first puzzle table
   document.getElementById("puzzle").innerHTML = drawPuzzle(puzzle1Hint, puzzle1Rating, puzzle1);

   // Add event handlers for the green puzzle buttons
   let puzzleButtons = document.getElementsByClassName("puzzles");
   for(let i = 0; i < puzzleButtons.length; i++) {
      // Add the onclick event handler to each puzzle button in the array
      puzzleButtons[i].onclick = swapPuzzle;
   }

   setupPuzzle();

   // Add an event listener for the mouseup event
   document.addEventListener("mouseup", endBackground);

   // Add an event listener with an anonymous function to the Show Solution button
   document.getElementById("solve").addEventListener("click", function() {
         // Remove the inline backgroundColor from each cell
      for(let i = 0; i < puzzleCells.length; i++) {
         puzzleCells[i].style.backgroundColor = "";
      }
   });

} // end of the init() function

// Definition of the swapPuzzle() function
function swapPuzzle(e) {
   console.log(e);
   let puzzleID = e.target.id;
   let puzzleTitle = e.target.value;

   // Use the target value as the new puzzle title
   document.getElementById("puzzleTitle").innerHTML = puzzleTitle;

   // SWITCH statement to handle the logic of which puzzle should be drawn on screen
   switch(puzzleID) {
      case "puzzle1":
         document.getElementById("puzzle").innerHTML = drawPuzzle(puzzle1Hint, puzzle1Rating, puzzle1);
         break;
      case "puzzle2":
         document.getElementById("puzzle").innerHTML = drawPuzzle(puzzle2Hint, puzzle2Rating, puzzle2);
         break;
      case "puzzle3":
         document.getElementById("puzzle").innerHTML = drawPuzzle(puzzle3Hint, puzzle3Rating, puzzle3);
         break;
   }

   setupPuzzle();
} // end of the swapPuzzle() function

// Definition of the setupPuzzle() function
function setupPuzzle() {
   // Create an array out of all the table data cells in the puzzle
   puzzleCells = document.querySelectorAll("table#hanjieGrid td");

   // Loop through the array changing the initial color of every cell to gold
   for(let i = 0; i < puzzleCells.length; i++) {
      puzzleCells[i].style.backgroundColor = "rgb(233, 207, 29)";
      puzzleCells[i].onmousedown = setBackground;
      puzzleCells[i].style.cursor = "url(jpf_pencil.png), pointer";
   }

   //create arrays of the cells with the class 'filled' and the class 'empty'
   let filled = document.querySelectorAll("table#hanjieGrid td.filled");
   let empty = document.querySelectorAll("table#hanjieGrid td.empty");

   // create and event listener to highlight incorrect cells
   document.getElementById("peek").addEventListener("click", function(){
    //Display incorrect whitecells in pink 
    for(let i = 0; i < filled.length; i++) {
      if(filled[i].style.backgroundColor === "rgb(255, 255, 255)") {
         filled[i].style.backgroundColor = "rgb(255, 211, 211)";
      }
    }  
   for(let i = 0; i < empty.length; i++) {
      if(empty[i].style.backgroundColor === "rgb(101, 101, 101)") {
         empty[i].style.backgroundColor = "rgb(255, 101, 101)";
      }
    } 
   });
} // end of setupPuzzle()

// Definition of the setBackground() function
function setBackground(e) {
   let cursorType;
   // Set the background color based on if a keyboard key was used or not
   if(e.shiftKey) {
      cellBackground = "rgb(233, 207, 29)";
      cursorType = "url(jpf_eraser.png), cell";
   } else if(e.altKey) {
      cellBackground = "rgb(255, 255, 255)";
      cursorType = "url(jpf_cross.png), crosshair";
   } else {
      cellBackground = "rgb(101, 101, 101)";
      cursorType = "url(jpf_pencil.png), pointer";
   }

   e.target.style.backgroundColor = cellBackground;

   // Loop through all the puzzle cells and add a NEW event listener for moving the mouse
   for(let i = 0; i < puzzleCells.length; i++){
      puzzleCells[i].addEventListener("mouseenter", extendBackground);
      puzzleCells[i].style.cursor = cursorType;
   }

   // Prevent the default action of selecting table text
   e.preventDefault();
} // end of setBackground()


// Definition of the extendBackground() function
function extendBackground(e) {
   e.target.style.backgroundColor = cellBackground;
}

// Defintion of the endBackground() function
function endBackground() {
   // Remove the mouseenter event listener for every puzzle cell
   for(let i = 0; i < puzzleCells.length; i++) {
      puzzleCells[i].removeEventListener("mouseenter", extendBackground);
      puzzleCells[i].style.cursor = "url(jpf_pencil.png), pointer";
   }
} // end of endBackground()

         
/* ================================================================= */

function drawPuzzle(hint, rating, puzzle) {
   
   /* Initial HTML String for the Hanjie Puzzle */
   var htmlString = "";

   /* puzzle is a multidimensional array containing the
      Hanjie puzzle layout. Marked cells are indicated by
      the # character. Empty cells are indicated by an
      empty text string. First, determine the number of rows
      and columns in the puzzle */

   var totalRows = puzzle.length;
   var totalCols = puzzle[0].length;

   /* Loop through the rows to create the rowCount array
      containing the totals for each row in the puzzle */

   var rowCount = [];
   var spaceCount;
   for (var i = 0; i < totalRows; i++) {
      rowCount[i]="";
      spaceCount = 0;

      for (var j = 0; j < totalCols; j++) {
         if (puzzle[i][j] === "#") {
            spaceCount++;
            if (j === totalCols-1) {
               rowCount[i] += spaceCount + "&nbsp;&nbsp;";
            }
         } else {
            if (spaceCount > 0) {
               rowCount[i] += spaceCount + "&nbsp;&nbsp;";
               spaceCount = 0;
            } 
         }    
      }

   }

   /* Loop through the columns to create the colCount array
      containing the totals for each column in the puzzle */

   var colCount = [];
   for (var j = 0; j < totalCols; j++) {
      colCount[j]="";
      spaceCount = 0;

      for (var i = 0; i < totalRows; i++) {
         if (puzzle[i][j] === "#") {
            spaceCount++;
            if (i === totalRows-1) {
               colCount[j] += spaceCount + "<br />";
            }
         } else {
            if (spaceCount > 0) {
               colCount[j] += spaceCount + "<br />";
               spaceCount = 0;
            } 
         }    
      }

   }

   /* Create a Web table with the id, hanjieGrid, containing
      headers with the row and column totals.
      Each marked cell has the class name, marked; each
      empty cell has the class name, empty */

   htmlString = "<table id='hanjieGrid'>";
   htmlString += "<caption>" + hint + " (" + rating + ")</caption>";
   htmlString += "<tr><th></th>";

   for (var j = 0; j < totalCols; j++) {
      htmlString += "<th class='cols'>" + colCount[j] + "</th>";
   }
   htmlString += "</tr>";

   for (var i = 0; i < totalRows; i++) {
      htmlString += "<tr><th class='rows'>&nbsp;" + rowCount[i]+"</th>";

      for (var j = 0; j<totalCols; j++) {
         if (puzzle[i][j] === "#") {
            htmlString += "<td  class='filled'></td>";
         }
         else {
            htmlString += "<td class='empty'></td>";
         }
      }

      htmlString += "</tr>";
   }

   htmlString += "</table>";

   return htmlString;
}