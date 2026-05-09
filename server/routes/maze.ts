export default defineEventHandler(() => 
`
<html lang="en-GB">
    <head>
      <meta charset="utf-8">
      <style>
        $menuHeight: 65px+10px;
    @mixin transition {
        transition-property: background-color opacity;
        transition-duration: 0.2s;
        transition-timing-function: ease-in-out;
    }
    
    html,
    body {
        width: 100vw;
        height: 100vh;
        position: fixed;
        padding: 0;
        margin: 0;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }
    
    #mazeContainer {
        transition-property: opacity;
        transition-duration: 1s;
        transition-timing-function: linear;
        top: $menuHeight;
        opacity: 0;
        display: inline-block;
        background-color: rgba(0, 0, 0, 0.30);
        margin: auto;
    
        #mazeCanvas {
            margin: 0;
            display: block;
            border: solid 1px black;
        }
    }
    
    input,
    select {
        @include transition;
        cursor: pointer;
        background-color: rgba(0, 0, 0, 0.30);
        height: 45px;
        width: 150px;
        padding: 10px;
        border: none;
        border-radius: 5px;
        color: white;
        display: inline-block;
        font-size: 15px;
        text-align: center;
        text-decoration: none;
        appearance: none;
        &:hover {
            background-color: rgba(0, 0, 0, 0.70);
        }
        &:active {
            background-color: black;
        }
        &:focus {
            outline: none;
        }
    }
    
    
    .custom-select {
        display: inline-block;
        select {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAh0lEQVQ4T93TMQrCUAzG8V9x8QziiYSuXdzFC7h4AcELOPQAdXYovZCHEATlgQV5GFTe1ozJlz/kS1IpjKqw3wQBVyy++JI0y1GTe7DCBbMAckeNIQKk/BanALBB+16LtnDELoMcsM/BESDlz2heDR3WePwKSLo5eoxz3z6NNcFD+vu3ij14Aqz/DxGbKB7CAAAAAElFTkSuQmCC');
            background-repeat: no-repeat;
            background-position: 125px center;
        }
    }
    
    #Message-Container {
        visibility: hidden;
        color: white;
        display: block;
        width: 100vw;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background-color: rgba(0, 0, 0, 0.30);
        z-index: 1;
        #message {
            width: 300px;
            height: 300px;
            position: fixed;
            top: 50%;
            left: 50%;
            margin-left: -150px;
            margin-top: -150px;
        }
    }
    
    #page {
        font-family: "Segoe UI", Arial, sans-serif;
        text-align: center;
        height: auto;
        width: auto;
        margin: auto;
        #menu {
            margin: auto;
            padding: 10px;
            height: 65px;
            box-sizing: border-box;
            h1 {
                margin: 0;
                margin-bottom: 10px;
                font-weight: 600;
                font-size: 3.2rem;
            }
        }
        #view {
            position: absolute;
            top:65px;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            height: auto;
               
        }
    }
    
    .border {
        border: 1px black solid;
        border-radius: 5px;
    }
    
    
    
    #gradient {
        z-index: -1;
        position: fixed;
        top: 0;
        bottom: 0;
        width: 100vw;
        height: 100vh;
        color: #fff;
        background: linear-gradient(-45deg, #EE7752, #E73C7E, #23A6D5, #23D5AB);
        background-size: 400% 400%;
        animation: Gradient 15s ease infinite;
    }
    
    @keyframes Gradient {
        0% {
            background-position: 0% 50%
        }
        50% {
            background-position: 100% 50%
        }
        100% {
            background-position: 0% 50%
        }
    }
    
     /* Extra small devices (phones, 600px and down) */
     @media only screen and (max-width: 400px) {
         input, select{
             width: 120px;
         }
     }
    
      </style>
      <body>
        <div id="gradient"></div>
        <div id="page">
          <div id="Message-Container">
            <div id="message">
              <h1>Congratulations!</h1>
              <p>You are done.</p>
              <p id="moves"></p>
              <input id="okBtn" type="button" onclick="toggleVisablity('Message-Container')" value="Cool!" />
            </div>
          </div>
          <div id="menu">
            <div class="custom-select">
              <select id="diffSelect">
                        <option value="10">Easy</option>
                        <option value="15">Medium</option>
                        <option value="25">Hard</option>
                        <option value="38">Extreme</option>                                      
                    </select>
            </div>
            <input id="startMazeBtn" type="button" onclick="makeMaze()" value="Start" />
          </div>
          <div id="view">
            <div id="mazeContainer">
              <canvas id="mazeCanvas" class="border" height="1100" width="1100"></canvas>
            </div>
          </div>
        </div>
        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery.touchswipe/1.6.18/jquery.touchSwipe.min.js"></script>
        <script>
var MazeApp = MazeApp || {};
(function(app) {
  "use strict";

  var _canvas, _ctx, _sprite, _finishSprite, _currentMaze, _draw, _player, _cellSize, _difficulty;

  function rand(max) {
    return Math.floor(Math.random() * max);
  }

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = a[i];
      a[i] = a[j];
      a[j] = temp;
    }
    return a;
  }

  function changeBrightness(factor, img) {
    var virtCanvas = document.createElement("canvas");
    virtCanvas.width = 500;
    virtCanvas.height = 500;
    var context = virtCanvas.getContext("2d");
    context.drawImage(img, 0, 0, 500, 500);
    var imgData = context.getImageData(0, 0, 500, 500);
    for (var i = 0; i < imgData.data.length; i += 4) {
      imgData.data[i] = imgData.data[i] * factor;
      imgData.data[i + 1] = imgData.data[i + 1] * factor;
      imgData.data[i + 2] = imgData.data[i + 2] * factor;
    }
    context.putImageData(imgData, 0, 0);
    var spriteOutput = new Image();
    spriteOutput.src = virtCanvas.toDataURL();
    virtCanvas.remove();
    return spriteOutput;
  }

  function displayVictoryMess(moveCount) {
    document.getElementById("moves").innerHTML = "You Moved " + moveCount + " Steps.";
    app.toggleVisablity("Message-Container");
  }

  app.toggleVisablity = function(id) {
    var el = document.getElementById(id);
    if (el.style.visibility === "visible") {
      el.style.visibility = "hidden";
    } else {
      el.style.visibility = "visible";
    }
  };

  function MazeGen(w, h) {
    var _map;
    var _width = w;
    var _height = h;
    var _startCoord, _endCoord;
    var _dirs = ["n", "s", "e", "w"];
    var _modDir = {
      n: { y: -1, x: 0, o: "s" },
      s: { y: 1, x: 0, o: "n" },
      e: { y: 0, x: 1, o: "w" },
      w: { y: 0, x: -1, o: "e" }
    };

    this.map = function() { return _map; };
    this.startCoord = function() { return _startCoord; };
    this.endCoord = function() { return _endCoord; };

    function genMap() {
      _map = new Array(_height);
      for (var y = 0; y < _height; y++) {
        _map[y] = new Array(_width);
        for (var x = 0; x < _width; ++x) {
          _map[y][x] = { n: false, s: false, e: false, w: false, visited: false, priorPos: null };
        }
      }
    }

    function defineMazePath() {
      var isComp = false;
      var move = false;
      var cellsVisited = 1;
      var numLoops = 0;
      var maxLoops = 0;
      var pos = { x: 0, y: 0 };
      var numCells = _width * _height;

      while (!isComp) {
        move = false;
        _map[pos.x][pos.y].visited = true;

        if (numLoops >= maxLoops) {
          shuffle(_dirs);
          maxLoops = Math.round(rand(_height / 8));
          numLoops = 0;
        }
        numLoops++;

        for (var idx = 0; idx < _dirs.length; idx++) {
          var direction = _dirs[idx];
          var nx = pos.x + _modDir[direction].x;
          var ny = pos.y + _modDir[direction].y;

          if (nx >= 0 && nx < _width && ny >= 0 && ny < _height) {
            if (!_map[nx][ny].visited) {
              _map[pos.x][pos.y][direction] = true;
              _map[nx][ny][_modDir[direction].o] = true;
              _map[nx][ny].priorPos = pos;
              pos = { x: nx, y: ny };
              cellsVisited++;
              move = true;
              break;
            }
          }
        }

        if (!move) {
          pos = _map[pos.x][pos.y].priorPos;
        }
        if (numCells === cellsVisited) {
          isComp = true;
        }
      }
    }

    function defineStartEnd() {
      switch (rand(4)) {
        case 0:
          _startCoord = { x: 0, y: 0 };
          _endCoord = { x: _height - 1, y: _width - 1 };
          break;
        case 1:
          _startCoord = { x: 0, y: _width - 1 };
          _endCoord = { x: _height - 1, y: 0 };
          break;
        case 2:
          _startCoord = { x: _height - 1, y: 0 };
          _endCoord = { x: 0, y: _width - 1 };
          break;
        case 3:
          _startCoord = { x: _height - 1, y: _width - 1 };
          _endCoord = { x: 0, y: 0 };
          break;
      }
    }

    genMap();
    defineStartEnd();
    defineMazePath();
  }

  function MazeDrawer(mazeInst, ctx, cellsize, endSprite) {
    var _mapData = mazeInst.map();
    var _size = cellsize;
    var _drawEndMethod;
    ctx.lineWidth = _size / 40;

    this.redrawMaze = function(size) {
      _size = size;
      ctx.lineWidth = _size / 50;
      drawMap();
      _drawEndMethod();
    };

    function drawCell(xCord, yCord, cell) {
      var xPos = xCord * _size;
      var yPos = yCord * _size;

      if (cell.n === false) {
        ctx.beginPath();
        ctx.moveTo(xPos, yPos);
        ctx.lineTo(xPos + _size, yPos);
        ctx.stroke();
      }
      if (cell.s === false) {
        ctx.beginPath();
        ctx.moveTo(xPos, yPos + _size);
        ctx.lineTo(xPos + _size, yPos + _size);
        ctx.stroke();
      }
      if (cell.e === false) {
        ctx.beginPath();
        ctx.moveTo(xPos + _size, yPos);
        ctx.lineTo(xPos + _size, yPos + _size);
        ctx.stroke();
      }
      if (cell.w === false) {
        ctx.beginPath();
        ctx.moveTo(xPos, yPos);
        ctx.lineTo(xPos, yPos + _size);
        ctx.stroke();
      }
    }

    function drawMap() {
      for (var x = 0; x < _mapData.length; x++) {
        for (var y = 0; y < _mapData[x].length; y++) {
          drawCell(x, y, _mapData[x][y]);
        }
      }
    }

    function drawEndFlag() {
      var coord = mazeInst.endCoord();
      var gridSize = 4;
      var fraction = _size / gridSize - 2;
      var colorSwap = true;
      for (var y = 0; y < gridSize; y++) {
        if (gridSize % 2 === 0) {
          colorSwap = !colorSwap;
        }
        for (var x = 0; x < gridSize; x++) {
          ctx.beginPath();
          ctx.rect(
            coord.x * _size + x * fraction + 4.5,
            coord.y * _size + y * fraction + 4.5,
            fraction,
            fraction
          );
          ctx.fillStyle = colorSwap ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.8)";
          ctx.fill();
          colorSwap = !colorSwap;
        }
      }
    }

    function drawEndSprite() {
      var offsetLeft = _size / 50;
      var offsetRight = _size / 25;
      var coord = mazeInst.endCoord();
      ctx.drawImage(
        endSprite,
        2, 2,
        endSprite.width, endSprite.height,
        coord.x * _size + offsetLeft,
        coord.y * _size + offsetLeft,
        _size - offsetRight,
        _size - offsetRight
      );
    }

    function clear() {
      var canvasSize = _size * _mapData.length;
      ctx.clearRect(0, 0, canvasSize, canvasSize);
    }

    _drawEndMethod = endSprite ? drawEndSprite : drawEndFlag;
    clear();
    drawMap();
    _drawEndMethod();
  }

  function PlayerController(mazeInst, canvasEl, cellsize, onComplete, spriteImg) {
    var ctx = canvasEl.getContext("2d");
    var _moves = 0;
    var _self = this;
    var _mapData = mazeInst.map();
    var _cellCoords = { x: mazeInst.startCoord().x, y: mazeInst.startCoord().y };
    var _size = cellsize;
    var _halfSize = _size / 2;
    var _drawSprite = spriteImg ? drawSpriteImg : drawSpriteCircle;

    this.redrawPlayer = function(cellsize) {
      _size = cellsize;
      drawSpriteImg(_cellCoords);
    };

    function drawSpriteCircle(coord) {
      ctx.beginPath();
      ctx.fillStyle = "yellow";
      ctx.arc(
        (coord.x + 1) * _size - _halfSize,
        (coord.y + 1) * _size - _halfSize,
        _halfSize - 2,
        0,
        2 * Math.PI
      );
      ctx.fill();
      if (coord.x === mazeInst.endCoord().x && coord.y === mazeInst.endCoord().y) {
        onComplete(_moves);
        _self.unbindKeyDown();
      }
    }

    function drawSpriteImg(coord) {
      var offsetLeft = _size / 50;
      var offsetRight = _size / 25;
      ctx.drawImage(
        spriteImg,
        0, 0,
        spriteImg.width, spriteImg.height,
        coord.x * _size + offsetLeft,
        coord.y * _size + offsetLeft,
        _size - offsetRight,
        _size - offsetRight
      );
      if (coord.x === mazeInst.endCoord().x && coord.y === mazeInst.endCoord().y) {
        onComplete(_moves);
        _self.unbindKeyDown();
      }
    }

    function removeSprite(coord) {
      var offsetLeft = _size / 50;
      var offsetRight = _size / 25;
      ctx.clearRect(
        coord.x * _size + offsetLeft,
        coord.y * _size + offsetLeft,
        _size - offsetRight,
        _size - offsetRight
      );
    }

    function check(e) {
      var cell = _mapData[_cellCoords.x][_cellCoords.y];
      _moves++;
      switch (e.keyCode) {
        case 65:
        case 37:
          if (cell.w === true) {
            removeSprite(_cellCoords);
            _cellCoords = { x: _cellCoords.x - 1, y: _cellCoords.y };
            _drawSprite(_cellCoords);
          }
          break;
        case 87:
        case 38:
          if (cell.n === true) {
            removeSprite(_cellCoords);
            _cellCoords = { x: _cellCoords.x, y: _cellCoords.y - 1 };
            _drawSprite(_cellCoords);
          }
          break;
        case 68:
        case 39:
          if (cell.e === true) {
            removeSprite(_cellCoords);
            _cellCoords = { x: _cellCoords.x + 1, y: _cellCoords.y };
            _drawSprite(_cellCoords);
          }
          break;
        case 83:
        case 40:
          if (cell.s === true) {
            removeSprite(_cellCoords);
            _cellCoords = { x: _cellCoords.x, y: _cellCoords.y + 1 };
            _drawSprite(_cellCoords);
          }
          break;
      }
    }

    this.bindKeyDown = function() {
      window.addEventListener("keydown", check, false);
      jQuery("#view").swipe({
        swipe: function(event, direction) {
          switch (direction) {
            case "up": check({ keyCode: 38 }); break;
            case "down": check({ keyCode: 40 }); break;
            case "left": check({ keyCode: 37 }); break;
            case "right": check({ keyCode: 39 }); break;
          }
        },
        threshold: 0
      });
    };

    this.unbindKeyDown = function() {
      window.removeEventListener("keydown", check, false);
      jQuery("#view").swipe("destroy");
    };

    _drawSprite(mazeInst.startCoord());
    this.bindKeyDown();
  }

  app.makeMaze = function() {
    if (_player) {
      _player.unbindKeyDown();
      _player = null;
    }
    var selectEl = document.getElementById("diffSelect");
    _difficulty = selectEl.options[selectEl.selectedIndex].value;
    _cellSize = _canvas.width / _difficulty;
    _currentMaze = new MazeGen(_difficulty, _difficulty);
    _draw = new MazeDrawer(_currentMaze, _ctx, _cellSize, _finishSprite);
    _player = new PlayerController(_currentMaze, _canvas, _cellSize, displayVictoryMess, _sprite);
    document.getElementById("mazeContainer").style.opacity = "100";
  };

  app.init = function() {
    _canvas = document.getElementById("mazeCanvas");
    _ctx = _canvas.getContext("2d");

    var viewWidth = jQuery("#view").width();
    var viewHeight = jQuery("#view").height();
    if (viewHeight < viewWidth) {
      _ctx.canvas.width = viewHeight - viewHeight / 100;
      _ctx.canvas.height = viewHeight - viewHeight / 100;
    } else {
      _ctx.canvas.width = viewWidth - viewWidth / 100;
      _ctx.canvas.height = viewWidth - viewWidth / 100;
    }

    var completeOne = false;
    var completeTwo = false;
    var isComplete = function() {
      if (completeOne && completeTwo) {
        setTimeout(function() { app.makeMaze(); }, 500);
      }
    };

    _sprite = new Image();
    _sprite.src = "https://i.imgur.com/PfRWr3X.png?" + new Date().getTime();
    _sprite.setAttribute("crossOrigin", " ");
    _sprite.onload = function() {
      _sprite = changeBrightness(1.2, _sprite);
      completeOne = true;
      isComplete();
    };

    _finishSprite = new Image();
    _finishSprite.src = "https://i.imgur.com/iQ7mU25.png?" + new Date().getTime();
    _finishSprite.setAttribute("crossOrigin", " ");
    _finishSprite.onload = function() {
      _finishSprite = changeBrightness(1.1, _finishSprite);
      completeTwo = true;
      isComplete();
    };
  };

  app.resize = function() {
    var viewWidth = jQuery("#view").width();
    var viewHeight = jQuery("#view").height();
    if (viewHeight < viewWidth) {
      _ctx.canvas.width = viewHeight - viewHeight / 100;
      _ctx.canvas.height = viewHeight - viewHeight / 100;
    } else {
      _ctx.canvas.width = viewWidth - viewWidth / 100;
      _ctx.canvas.height = viewWidth - viewWidth / 100;
    }
    _cellSize = _canvas.width / _difficulty;
    if (_player) {
      _draw.redrawMaze(_cellSize);
      _player.redrawPlayer(_cellSize);
    }
  };

  window.onload = app.init;
  window.onresize = app.resize;

})(MazeApp);

function makeMaze() { MazeApp.makeMaze(); }
function toggleVisablity(id) { MazeApp.toggleVisablity(id); }
        </script>
      </body>
    </html>
    `)