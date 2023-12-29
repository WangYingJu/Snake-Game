const canvas = document.getElementById("myCanvas");
// getContext() 會回傳 canvas 的 drawing context ，可在 canvas 內繪製 2d
const ctx = canvas.getContext("2d");
// 設定 canvas 內畫布格數單位大小
const unit = 20;
// 設定 canvas 內畫布的格數
const row = canvas.height / unit; // 320 / 16 = 20
const column = canvas.width / unit; // 320 / 16 = 20

// 設定蛇
let snake = [];
function setSnake() {
  snake[0] = {
    x: 80,
    y: 0,
  };
  
  snake[1] = {
    x: 60,
    y: 0,
  };
  
  snake[2] = {
    x: 40,
    y: 0,
  };
  snake[3] = {
    x: 20,
    y: 0,
  };
}

// 設定果實
class Fruit {
  // 果實隨機出現的位置
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }
  // 果實的樣式
  drawFruit() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, unit, unit);
  }
  // 果實重新選定的新位置
  pickALocation() {
    let overlapping = false;
    let new_x;
    let new_y;
    // 檢查果實新位置有沒有跟蛇重疊
    function checkLocation(new_x, new_y) {
      for(let i = 0; i < snake.length; i++) {
        if(new_x == snake[i].x && new_y == snake[i].y) {
          overlapping = true;
          return;
        }else {
          overlapping = false;
        }
      }
    }

    do {
      new_x = Math.floor(Math.random() * column) * unit;
      new_y = Math.floor(Math.random() * row) * unit;
      checkLocation(new_x, new_y);
    }while(overlapping);

    this.x = new_x;
    this.y = new_y;

  }
}

// 初始設定蛇
setSnake();

// 初始設定果實
let myFruit = new Fruit();

// 初始設定蛇移動方向
let direction = "Right";

// 控制蛇移動方向
window.addEventListener("keydown", changeDirection);
function changeDirection(e) {
  if(e.key == "ArrowRight" && direction != "Left") {
    direction = "Right";
  }else if(e.key == "ArrowLeft" && direction != "Right") {
    direction = "Left";
  }else if(e.key == "ArrowUp" && direction != "Down") {
    direction = "Up";
  }else if(e.key == "ArrowDown" && direction != "Up") {
    direction = "Down";
  }

  // 在每100毫秒之間
  // 會因連續按鍵導致蛇產生邏輯上的自殺
  // 例如： direction = "Right" > direction = "Up" > direction = "Left"
  // 會產生180度的原地迴轉自殺
  // 所以要設定在下一楨之前停止任何案件發生
  window.removeEventListener("keydown", changeDirection);
}

// 初始設定分數
let highestScore;
loadHighestScore();
let score = 0;
document.getElementById("myScore").innerHTML = `遊戲分數：${score}`;
document.getElementById("myScore2").innerHTML = `最高分數：${highestScore}`;

function draw() {
  // 每次畫圖前，確認蛇有沒有咬到自己
  for(let i = 1; i < snake.length; i++) {
    if(snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
      // console.log("蛇自殺了");
      clearInterval(myGame);
      alert("遊戲結束");
      return;
    }
  }

  // 重新讓 canvase 畫布設定為黑色
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 畫出果實
  myFruit.drawFruit();

  // 蛇的樣式
  for(let i = 0; i < snake.length; i++) {
    // 填色樣式
    if(i == 0) {
      ctx.fillStyle = "lightgreen"; // 蛇頭
    }else {
      ctx.fillStyle = "lightblue"; // 蛇身
    }
    // 外框樣式
    ctx.strokeStyle = "white";
    
    // 蛇穿牆功能
    if(snake[i].x >= canvas.width) {
      snake[i].x = 0;
    }
    if(snake[i].x < 0) {
      snake[i].x = canvas.width - unit;
    }
    if(snake[i].y >= canvas.height) {
      snake[i].y = 0;
    }
    if(snake[i].y < 0) {
      snake[i].y = canvas.height - unit;
    }
    
    // 填色區塊(x, y, width, height)
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
    // 外框區塊(x, y, width, height)
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
    
  }

  // 取一開始蛇頭的位置
  // 以目前的d變數方向，來決定蛇的下一幀要放在哪個座標
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;
  
  // 讓蛇移動
  if(direction == "Left") {
    snakeX -= unit;
  }else if(direction == "Up") {
    snakeY -= unit;
  }else if(direction == "Down") {
    snakeY += unit;
  }else if(direction == "Right") {
    snakeX += unit;
  }
  
  // 新繪製的蛇頭
  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  // 判斷是否有吃到果實
  // 有吃到果實的狀態
  if(snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
    // 步驟一：重新選定果實的位置
    myFruit.pickALocation();
    // 步驟二：果實重繪
    // myFruit.drawFruit(); // 可以不用寫，因為最後面有寫let myGame = setInterval(draw, 100);
    // 步驟三：更新分數
    score ++;
    setHighestScore(score);
    document.getElementById("myScore").innerHTML = `遊戲分數：${score}`;
    document.getElementById("myScore2").innerHTML = `最高分數：${highestScore}`;
  }else {
    // 沒吃到果實的狀態
    snake.pop();
  }
  // 新增蛇頭
  snake.unshift(newHead);
  // 恢復啟用keydown
  window.addEventListener("keydown", changeDirection);
}

// 每100毫秒重新繪製
let myGame = setInterval(draw, 100);

// 取最高分數
function loadHighestScore() {
  if(localStorage.getItem("highestScore") == null) {
    highestScore = 0;
  }else {
    highestScore = Number(localStorage.getItem("highestScore"));
  }
}

// 更新最高分數
function setHighestScore(score) {
  if(score > highestScore) {
    localStorage.getItem("highestScore", score);
    highestScore = score;
  }
}