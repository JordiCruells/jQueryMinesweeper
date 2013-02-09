$(document).ready(function(){
		
			var board, clock;
			
			
			$("#messages").fadeOut(0);
			$("#board").fadeOut(0);
			
			//$('#btnStart button').vibrate();
						
			// Initialize jQuery sliders
			$(function() {
		           $("#sliderSize").slider({
		        	min: 5,
		        	max: 15,
		        	value: 15,
					slide: function(event,ui) {
		        	   $(this).next().val(ui.value);
					   $(this).next().next().html(" x " + ui.value);
					   
			      	},
		        	change: function(event,ui) {
						$(this).next().val(ui.value);
		         	}		        	
		           });

			});		
			
			$(function() {
		           $("#sliderDifficulty ").slider({
		        	min: 1,
		        	max: 5,
		        	value: 3,
					slide: function(event,ui) {
						var text, color;
						switch(ui.value) {
							case 1: text = "muy fácil"; color="#237304"; break;
							case 2: text = "fácil";	color="#237304"; break;
							case 3: text = "normal"; color="#333";	break;
							case 4: text = "difícil";color="#c30";break;
							case 5: text = "muy difícil";color="#c30";	break;
						}
		        	   $(this).next().html(text);
					   $(this).next().css("color", color);
			      	},
		        	change: function(event,ui) {
						var text, color;
						switch(ui.value) {
							case 1: text = "muy fácil"; color="#237304"; break;
							case 2: text = "fácil";	color="#237304"; break;
							case 3: text = "normal"; color="#333";	break;
							case 4: text = "difícil";color="#c30";break;
							case 5: text = "muy difícil";color="#c30";	break;
						}
		        	   $(this).next().html(text);
					   $(this).next().css("color", color);
			      	}	        	
		           });

			});	
			
			$(function() {
		           $("#sliderTime ").slider({
		        	min: 1,
		        	max: 5,
		        	value: 3,
					slide: function(event,ui) {
					   $(this).next().val(ui.value);
			      	},
		        	change: function(event,ui) {
					   $(this).next().val(ui.value);
			      	}	        	
		           });

			});	
			
			
			$("#size").change(function(){
				var size = $(this).val();
				$("#sliderSize").slider({
		        	value: size
				});
				$(this).next().html("x " + size);
			});
			
			
			$("#size").mouseup(function(){
				var size = $(this).val();
				$("#sliderSize").slider({
		        	value: size
				});
				$(this).next().html("x " + size);
			});
			
			$("#time").change(function(){
				var time = $(this).val();
				$("#sliderTime").slider({
		        	value: time
				});
			});
			
			$("#time").mouseup(function(){
				var time = $(this).val();
				$("#sliderTime").slider({
		        	value: time
				});
			});
			
			
			
			
			$("#controls input").click(function(){
				$(this).select();
			});	
			
			$("#controls input").focusout(function(){
				$(this).unselect();
			});	
			
			
			$("#btnStart").click(function(){
				
				// Stops previous timer if it's running
				if (clock != null) clock.stop();
				
				// Fade out the board 				
					$("#board").fadeOut(500);
					$("#score div").css("width", "0%");
					//$("#board").delay(2000);
				
				
				var numRows = $("#size").val();
				var numCols = $("#size").val();
				var numMines = Math.floor($("#sliderDifficulty").slider("value") * numRows * numCols * 0.04);
				var minutes = $("#time").val();
				var board = new Board(numRows,numCols,numMines);
				
								
				board.toHTML();
				
				// Reposition the board in the center
				var margin = -(board.numRows - 15) * 12;
				$("#board table").css({margin: margin + "px auto"});
					
				// Fade in the board again and start the timer
				$("#board").fadeIn(500);
				$("#messages").fadeOut(1000);
				$("#score span").html("0% del territorio explorado");
					
				clock = new Timer(minutes,0,$("#timer"));
				clock.start();
			
				  
				
			});
			
			
			$('#messages')
				.bind('endTime', function() {
				  $(this).html("Se te acabó el tiempo, pero no importa, aun puedes jugar otra partida");
				  $("#messages").fadeIn(1000,
				  
				  
				  function() {$(this).effect( "pulsate",{times:3}, 1500 );	}
				  
				  
				  				  
				  
				  );
				})
				.bind('boardCompleted', function() {
				  $(this).html("Enhorabuena, ganaste!!");
				  $("#messages").fadeIn(1000, 
					  
					  
					 function() {$(this).effect( "pulsate",{times:3}, 1500 );	} 
					  
					  
					  );
				 
				  clearInterval(clock.interval);
				})
				.bind('mineExploded', function() {
				  $(this).css("background-position", "-200px 0");
				  $(this).html("Acabas de morir, pero no importa, aun puedes jugar otra partida");
				  $("#messages").fadeIn(1000,
				  
				  
				  function() {$(this).effect( "pulsate",{times:3}, 1500 );	} 
				  
				  );
				  clearInterval(clock.interval);
				});
		       
		});
		
		
		// CLASSES
		//------------------------------------------------
		
		//BOARD: Main class for the game
		function Board(numRows, numCols, numMines) {
			
			var numRows, numCols, numMines, cells;
			this.numRows = numRows;
			this.numCols = numCols;
			this.numMines = numMines;
			this.isLocked = false; // The board gets locked after the user has won or lost
			this.cells = new Array();
			this.cellsClicked = 0;
			
					
			// Initialize array of cells to default values
			var row = 0;
			var col = 0;
			for (row =0; row < this.numRows; row++) {
				for (col =0; col < this.numCols; col++) {
					if (!this.cells[row]) this.cells[row] = new Array();
					this.cells[row][col] = new Cell();
				}
			}
			
			var rand, randRow, randCol;
			
			// Put random mines in the board
			for (var n = 0; n < this.numMines; n++) {
				
				
				rand = Math.floor(Math.random() * this.numCols * this.numRows);
				randRow = Math.floor(rand / this.numRows);
				randCol = rand % this.numCols;
				
				// Iterate until a cell with no mine is found
				while (this.cells[randRow][randCol].hasMine()) {
					rand = Math.floor(Math.random() * this.numCols * this.numRows);
					randRow = Math.floor(rand / this.numRows);
					randCol = rand % this.numCols;					
				}
				
				// Put the mine in the cell 
				this.cells[randRow][randCol].setMine();
				
				// Count this mine in the neighbourgh cells
				for (var i = -1; i <=1; i++) {
					for (var j=-1; j<=1; j++) {
						var row = randRow + i;
						var col = randCol + j;
						
						if ((row < 0 || row >= this.numRows) || // Ignore cells out of the Board
						    (col < 0 || col >= this.numCols) ||
							(i == 0 && j == 0)) {     // Ignore the original cell
								continue;
						} else {
							this.cells[row][col].newAdjacent(); 
						}
					}
				}
								
			}	
			
			// This function creates a HTML table for the board
			this.toHTML = function() {
				var table, tr, td, img;
				$("#board").html("");
				table = $("<table></table>");
				table.attr("cellspacing","0").attr("cellpadding","0");
				table.appendTo("#board"); //document.createElement("table");
				
				for (var i=0; i < this.numRows; i++)  {
					tr = $("<tr></tr>");
					tr.appendTo(table); 
				
					for (var j=0; j < this.numCols; j++)  {
						td = $("<td></td>");
						$(td).attr("data-row",i).attr("data-col",j);
						
						var board = this; // To keep a reference to the board instance inside the click function
						$(td).click(function(){
							
								if (!board.isLocked) {
									var row = parseInt($(this).attr("data-row"));
									var col = parseInt($(this).attr("data-col"));
									board.cells[row][col].setClicked();
									board.cellsClicked++;
									
									if (board.cells[row][col].hasMine()) {
										board.explodeMines();
										board.isLocked = true;
										$(this).css("background-position","-330px 0px");
										$("#messages").trigger("mineExploded");
										
									} else {
										if (board.cells[row][col].getAdjacents() == 0) {
											$(this).css("background-position","0px 0px");
											board.iterateZeroes(row, col);	
										} else {
											var x = - board.cells[row][col].getAdjacents() * 30;
											$(this).css("background-position",x + "px 0px");
											if (board.checkCompleted()) {
												board.explodeMines();
												board.isLocked = true;
												$("#messages").trigger("boardCompleted");
											}
										}
									}
								}
								
								var percentageCompleted = Math.floor(100 * board.cellsClicked/(board.numRows*board.numCols - board.numMines));
								$("#score div").animate({
									width: percentageCompleted + "%"
								}, 500);
								$("#score span").html(percentageCompleted + "% del territorio explorado");
								
						});
						td.appendTo(tr);
					}
				}
			}
			
			
			this.checkCompleted = function() {
				var completed = false;
				
				if ((this.cellsClicked + this.numMines) == (this.numRows * this.numCols)) {
					completed = true;	
				}
				return completed;
			}
			
			// Show all the mines when the user has clicked on one
			this.explodeMines = function() {
				var row = 0;
				var col = 0;
				var cell;
				for (row =0; row < this.numRows; row++) {
					for (col =0; col < this.numCols; col++) {
						if (this.cells[row][col].hasMine()) {
							cell = $("#board table tr:eq(" + row + ") td:eq(" + col + ")");
							cell.css("background-position","-300px 0px");
						}
					}
				}
			}
			
			
			// This function searchs for zeroes in the neighbourgh cells. This function is called recursively
			// until all neighbourg cells with 0 mines are discovered.
			this.iterateZeroes = function(row,col) {
				
				for (var i = -1; i <=1; i++) {
					for (var j=-1; j<=1; j++) {
						
						if (i*j != 0) continue; // Not to search in diagonals for zero mines
						
						var newRow = row + i;
						var newCol = col + j;
						
						if ( ! ( (newRow < 0 || newRow >= this.numRows) || // Ignore cells out of the Board
						         (newCol < 0 || newCol >= this.numCols) ||
							     (i == 0 && j == 0) ) ){     // Ignore the original cell
								 var cell;
								if (this.cells[newRow][newCol].getAdjacents() == 0 && !this.cells[newRow][newCol].isClicked()) {
									
									this.cells[newRow][newCol].setClicked();
									this.cellsClicked++;
									cell = $("#board table tr:eq(" + newRow + ") td:eq(" + newCol + ")");
									cell.css("background-position","0px 0px");
									if (this.checkCompleted()) {
										this.explodeMines();
										this.isLocked = true;
										$("#messages").trigger("boardCompleted");
									}
									
									this.iterateZeroes(newRow, newCol);
									
								}
								
						}
					}
				}
			}
			
		}
		
		//CELL: each one of the cells of the board
		function Cell() {
			
			var mine, adjacents, clicked;
			
			this.mine = false;  // true when the cell has a mine or false if not
			this.adjacents = 0; // number of mines in the adjacents cells
			this.clicked = false; // true when this cells has been clicked or false when not
			
						
			this.setMine = function() {
				this.mine = true;
			};
			this.hasMine = function() {
				return this.mine;
			};			
			this.newAdjacent = function() {
				this.adjacents++;
			};			
			this.getAdjacents = function() {
				return this.adjacents;
			};	
			
			this.isClicked = function() {
				return this.clicked;	
			}
			
			this.setClicked = function() {
				this.clicked = true;	
			}
		}
		
		
		//TIMER:this class controls the clock
		function Timer(minute, second, container) {
			
			this.minute = minute;
			this.second = second;
			this.container = container;
			this.interval = null;
			var timer = this;			
			
			this.start = function() {
				timer.updateClock();
				timer.downSecond(); 
				timer.interval = setInterval(function() {
					timer.updateClock();
					timer.downSecond();	
				} ,1000);		
			};
			
			this.stop = function() {
				clearInterval(timer.interval);
			}
			
			this.updateClock = function() {
					var time = new Array();
					time[0] = Math.floor(this.minute/10);
					time[1] = this.minute%10;
					time[2] = Math.floor(this.second/10);
					time[3] = this.second%10;
					
					$(this.container).find("input").each(function(index, domElement){
						$(this).val(time[index]);
					});
			}
			
			this.downSecond = function() {
				if (this.second > 0) {
						this.second--;	
				} else {
					if (this.minute > 0) {
						this.second = 59;
						this.minute--;						
					} else {
						clearInterval(this.interval);
						$("#messages").trigger("endTime");
						
					}				
				}	
				
			}
			
			
				
		}