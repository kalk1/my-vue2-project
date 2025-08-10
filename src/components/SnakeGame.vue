<template>
  <div class="snake-game-container">
    <div class="game-header">
      <h1 class="game-title">🐍 炫酷贪吃蛇</h1>
      <div class="score-board">
        <div class="score-item">
          <span class="score-label">得分</span>
          <span class="score-value">{{ score }}</span>
        </div>
        <div class="score-item">
          <span class="score-label">最高分</span>
          <span class="score-value">{{ highScore }}</span>
        </div>
        <div class="score-item">
          <span class="score-label">等级</span>
          <span class="score-value">{{ level }}</span>
        </div>
      </div>
    </div>

    <div class="game-area">
      <div class="game-board-container">
        <canvas 
          ref="gameCanvas" 
          :width="canvasWidth" 
          :height="canvasHeight"
          class="game-canvas"
        ></canvas>
        
        <!-- 粒子效果容器 -->
        <div class="particles-container" ref="particlesContainer"></div>
        
        <!-- 游戏状态遮罩 -->
        <div v-if="gameState !== 'playing'" class="game-overlay">
          <div class="overlay-content">
            <h2 v-if="gameState === 'ready'" class="overlay-title">准备开始</h2>
            <h2 v-else-if="gameState === 'paused'" class="overlay-title">游戏暂停</h2>
            <h2 v-else-if="gameState === 'gameOver'" class="overlay-title">游戏结束</h2>
            
            <p v-if="gameState === 'gameOver'" class="final-score">最终得分: {{ score }}</p>
            
            <button @click="startGame" class="game-button">
              {{ gameState === 'ready' ? '开始游戏' : gameState === 'paused' ? '继续游戏' : '重新开始' }}
            </button>
          </div>
        </div>
      </div>

      <div class="game-controls">
        <div class="control-section">
          <h3>游戏控制</h3>
          <div class="control-buttons">
            <button @click="togglePause" class="control-btn" :disabled="gameState === 'ready' || gameState === 'gameOver'">
              {{ gameState === 'paused' ? '▶️' : '⏸️' }}
            </button>
            <button @click="resetGame" class="control-btn">🔄</button>
          </div>
        </div>

        <div class="settings-section">
          <h3>游戏设置</h3>
          <div class="setting-item">
            <label>速度:</label>
            <input type="range" v-model="gameSpeed" min="50" max="200" step="10">
            <span>{{ gameSpeed }}ms</span>
          </div>
          <div class="setting-item">
            <label>音效:</label>
            <input type="checkbox" v-model="soundEnabled">
          </div>
        </div>
      </div>
    </div>

    <!-- 特效开关 -->
    <div class="effects-toggle">
      <label>
        <input type="checkbox" v-model="effectsEnabled">
        特效模式
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SnakeGame',
  data() {
    return {
      // 游戏配置
      canvasWidth: 600,
      canvasHeight: 400,
      gridSize: 20,
      
      // 游戏状态
      gameState: 'ready', // ready, playing, paused, gameOver
      score: 0,
      highScore: localStorage.getItem('snakeHighScore') || 0,
      level: 1,
      
      // 蛇和食物
      snake: [],
      food: null,
      direction: 'right',
      nextDirection: 'right',
      
      // 游戏循环
      gameLoop: null,
      gameSpeed: 150,
      
      // 特效
      effectsEnabled: true,
      soundEnabled: true,
      particles: [],
      
      // 音效
      audioContext: null,
      sounds: {}
    }
  },
  
  mounted() {
    this.initGame();
    this.initAudio();
    this.setupKeyboardControls();
    this.loadHighScore();
  },
  
  beforeDestroy() {
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
    }
  },
  
  methods: {
    initGame() {
      this.canvas = this.$refs.gameCanvas;
      this.ctx = this.canvas.getContext('2d');
      
      // 初始化蛇
      this.snake = [
        { x: 5, y: 10 },
        { x: 4, y: 10 },
        { x: 3, y: 10 }
      ];
      
      this.generateFood();
      this.draw();
    },
    
    initAudio() {
      try {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // 创建音效
        this.sounds = {
          eat: this.createSound(800, 0.1, 0.1),
          move: this.createSound(400, 0.05, 0.05),
          gameOver: this.createSound(200, 0.3, 0.5),
          levelUp: this.createSound(600, 0.2, 0.2)
        };
      } catch (e) {
        console.log('音频初始化失败:', e);
      }
    },
    
    createSound(frequency, duration, volume) {
      return () => {
        if (!this.soundEnabled || !this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
      };
    },
    
    setupKeyboardControls() {
      window.addEventListener('keydown', (e) => {
        if (this.gameState !== 'playing') return;
        
        const keyMap = {
          'ArrowUp': 'up',
          'ArrowDown': 'down',
          'ArrowLeft': 'left',
          'ArrowRight': 'right',
          'w': 'up',
          's': 'down',
          'a': 'left',
          'd': 'right'
        };
        
        const newDirection = keyMap[e.key.toLowerCase()];
        if (newDirection) {
          e.preventDefault();
          
          // 防止反向移动
          const opposites = {
            'up': 'down',
            'down': 'up',
            'left': 'right',
            'right': 'left'
          };
          
          if (opposites[newDirection] !== this.direction) {
            this.nextDirection = newDirection;
          }
        }
        
        // 空格暂停
        if (e.key === ' ') {
          e.preventDefault();
          this.togglePause();
        }
      });
    },
    
    startGame() {
      this.gameState = 'playing';
      this.resetGame();
      this.gameLoop = setInterval(() => {
        this.update();
        this.draw();
      }, this.gameSpeed);
    },
    
    resetGame() {
      if (this.gameLoop) {
        clearInterval(this.gameLoop);
      }
      
      this.snake = [
        { x: 5, y: 10 },
        { x: 4, y: 10 },
        { x: 3, y: 10 }
      ];
      
      this.direction = 'right';
      this.nextDirection = 'right';
      this.score = 0;
      this.level = 1;
      this.gameSpeed = 150;
      
      this.generateFood();
      
      if (this.gameState === 'playing') {
        this.gameLoop = setInterval(() => {
          this.update();
          this.draw();
        }, this.gameSpeed);
      }
    },
    
    togglePause() {
      if (this.gameState === 'playing') {
        this.gameState = 'paused';
        clearInterval(this.gameLoop);
      } else if (this.gameState === 'paused') {
        this.gameState = 'playing';
        this.gameLoop = setInterval(() => {
          this.update();
          this.draw();
        }, this.gameSpeed);
      }
    },
    
    generateFood() {
      let newFood;
      do {
        newFood = {
          x: Math.floor(Math.random() * (this.canvasWidth / this.gridSize)),
          y: Math.floor(Math.random() * (this.canvasHeight / this.gridSize))
        };
      } while (this.snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
      
      this.food = newFood;
      
      // 生成食物特效
      if (this.effectsEnabled) {
        this.createFoodEffect(newFood);
      }
    },
    
    createFoodEffect(food) {
      const x = food.x * this.gridSize + this.gridSize / 2;
      const y = food.y * this.gridSize + this.gridSize / 2;
      
      for (let i = 0; i < 8; i++) {
        this.createParticle(x, y, '#ff6b6b');
      }
    },
    
    createParticle(x, y, color) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      particle.style.backgroundColor = color;
      
      const angle = Math.random() * Math.PI * 2;
      const velocity = 2 + Math.random() * 3;
      const lifetime = 1000 + Math.random() * 500;
      
      this.$refs.particlesContainer.appendChild(particle);
      
      let opacity = 1;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / lifetime;
        
        if (progress >= 1) {
          particle.remove();
          return;
        }
        
        const currentX = x + Math.cos(angle) * velocity * elapsed / 10;
        const currentY = y + Math.sin(angle) * velocity * elapsed / 10;
        
        opacity = 1 - progress;
        
        particle.style.left = currentX + 'px';
        particle.style.top = currentY + 'px';
        particle.style.opacity = opacity;
        
        requestAnimationFrame(animate);
      };
      
      animate();
    },
    
    update() {
      this.direction = this.nextDirection;
      
      const head = { ...this.snake[0] };
      
      switch (this.direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
      }
      
      // 检查碰撞
      if (this.checkCollision(head)) {
        this.gameOver();
        return;
      }
      
      this.snake.unshift(head);
      
      // 检查是否吃到食物
      if (head.x === this.food.x && head.y === this.food.y) {
        this.score += 10;
        this.generateFood();
        this.sounds.eat();
        
        // 升级检查
        if (this.score % 50 === 0) {
          this.level++;
          this.gameSpeed = Math.max(50, this.gameSpeed - 10);
          clearInterval(this.gameLoop);
          this.gameLoop = setInterval(() => {
            this.update();
            this.draw();
          }, this.gameSpeed);
          this.sounds.levelUp();
        }
        
        // 吃到食物特效
        if (this.effectsEnabled) {
          this.createEatEffect(head);
        }
      } else {
        this.snake.pop();
      }
      
      this.sounds.move();
    },
    
    checkCollision(head) {
      return (
        head.x < 0 ||
        head.x >= this.canvasWidth / this.gridSize ||
        head.y < 0 ||
        head.y >= this.canvasHeight / this.gridSize ||
        this.snake.some(segment => segment.x === head.x && segment.y === head.y)
      );
    },
    
    gameOver() {
      this.gameState = 'gameOver';
      clearInterval(this.gameLoop);
      this.sounds.gameOver();
      
      if (this.score > this.highScore) {
        this.highScore = this.score;
        localStorage.setItem('snakeHighScore', this.highScore);
      }
      
      // 游戏结束特效
      if (this.effectsEnabled) {
        this.createGameOverEffect();
      }
    },
    
    createEatEffect(position) {
      const x = position.x * this.gridSize + this.gridSize / 2;
      const y = position.y * this.gridSize + this.gridSize / 2;
      
      for (let i = 0; i < 12; i++) {
        this.createParticle(x, y, '#4ecdc4');
      }
    },
    
    createGameOverEffect() {
      const centerX = this.canvasWidth / 2;
      const centerY = this.canvasHeight / 2;
      
      for (let i = 0; i < 20; i++) {
        setTimeout(() => {
          this.createParticle(
            centerX + (Math.random() - 0.5) * 100,
            centerY + (Math.random() - 0.5) * 100,
            '#ff4757'
          );
        }, i * 50);
      }
    },
    
    draw() {
      // 清空画布
      this.ctx.fillStyle = '#1a1a2e';
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
      
      // 绘制网格
      this.drawGrid();
      
      // 绘制蛇
      this.drawSnake();
      
      // 绘制食物
      this.drawFood();
      
      // 绘制特效
      if (this.effectsEnabled) {
        this.drawEffects();
      }
    },
    
    drawGrid() {
      this.ctx.strokeStyle = '#16213e';
      this.ctx.lineWidth = 1;
      
      for (let x = 0; x <= this.canvasWidth; x += this.gridSize) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, this.canvasHeight);
        this.ctx.stroke();
      }
      
      for (let y = 0; y <= this.canvasHeight; y += this.gridSize) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, y);
        this.ctx.lineTo(this.canvasWidth, y);
        this.ctx.stroke();
      }
    },
    
    drawSnake() {
      this.snake.forEach((segment, index) => {
        const x = segment.x * this.gridSize;
        const y = segment.y * this.gridSize;
        
        // 蛇头
        if (index === 0) {
          const gradient = this.ctx.createRadialGradient(
            x + this.gridSize/2, y + this.gridSize/2, 0,
            x + this.gridSize/2, y + this.gridSize/2, this.gridSize/2
          );
          gradient.addColorStop(0, '#4ecdc4');
          gradient.addColorStop(1, '#44a3aa');
          
          this.ctx.fillStyle = gradient;
          this.ctx.fillRect(x + 1, y + 1, this.gridSize - 2, this.gridSize - 2);
          
          // 蛇眼睛
          this.ctx.fillStyle = '#fff';
          this.ctx.fillRect(x + 5, y + 5, 3, 3);
          this.ctx.fillRect(x + 12, y + 5, 3, 3);
        } else {
          // 蛇身
          const alpha = 1 - (index / this.snake.length) * 0.3;
          this.ctx.fillStyle = `rgba(78, 205, 196, ${alpha})`;
          this.ctx.fillRect(x + 2, y + 2, this.gridSize - 4, this.gridSize - 4);
        }
      });
    },
    
    drawFood() {
      if (!this.food) return;
      
      const x = this.food.x * this.gridSize;
      const y = this.food.y * this.gridSize;
      
      // 食物发光效果
      if (this.effectsEnabled) {
        this.ctx.shadowColor = '#ff6b6b';
        this.ctx.shadowBlur = 10;
      }
      
      const gradient = this.ctx.createRadialGradient(
        x + this.gridSize/2, y + this.gridSize/2, 0,
        x + this.gridSize/2, y + this.gridSize/2, this.gridSize/2
      );
      gradient.addColorStop(0, '#ff6b6b');
      gradient.addColorStop(1, '#ff4757');
      
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(x + 2, y + 2, this.gridSize - 4, this.gridSize - 4);
      
      // 重置阴影
      this.ctx.shadowBlur = 0;
    },
    
    drawEffects() {
      // 绘制额外的视觉效果
      const time = Date.now() * 0.005;
      
      // 动态边框效果
      this.ctx.strokeStyle = `hsl(${(time * 10) % 360}, 70%, 50%)`;
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(0, 0, this.canvasWidth, this.canvasHeight);
    },
    
    loadHighScore() {
      const saved = localStorage.getItem('snakeHighScore');
      if (saved) {
        this.highScore = parseInt(saved);
      }
    }
  }
}
</script>

<style scoped>
.snake-game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  font-family: 'Arial', sans-serif;
}

.game-header {
  text-align: center;
  margin-bottom: 30px;
}

.game-title {
  font-size: 2.5em;
  color: #fff;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from { text-shadow: 2px 2px 4px rgba(0,0,0,0.3), 0 0 10px #fff; }
  to { text-shadow: 2px 2px 4px rgba(0,0,0,0.3), 0 0 20px #fff, 0 0 30px #fff; }
}

.score-board {
  display: flex;
  gap: 30px;
  justify-content: center;
}

.score-item {
  background: rgba(255,255,255,0.1);
  padding: 15px 25px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
}

.score-label {
  display: block;
  color: #fff;
  font-size: 0.9em;
  opacity: 0.8;
}

.score-value {
  display: block;
  color: #fff;
  font-size: 1.5em;
  font-weight: bold;
}

.game-area {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

.game-board-container {
  position: relative;
}

.game-canvas {
  border: 2px solid #fff;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  background: #1a1a2e;
}

.particles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  pointer-events: none;
}

.game-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
}

.overlay-content {
  text-align: center;
  color: #fff;
}

.overlay-title {
  font-size: 2em;
  margin-bottom: 20px;
}

.final-score {
  font-size: 1.5em;
  margin-bottom: 20px;
  color: #4ecdc4;
}

.game-button {
  padding: 15px 30px;
  font-size: 1.2em;
  background: linear-gradient(45deg, #4ecdc4, #44a3aa);
  color: #fff;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.game-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.game-controls {
  background: rgba(255,255,255,0.1);
  padding: 20px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  color: #fff;
  min-width: 200px;
}

.control-section, .settings-section {
  margin-bottom: 20px;
}

.control-section h3, .settings-section h3 {
  margin-bottom: 10px;
  color: #fff;
}

.control-buttons {
  display: flex;
  gap: 10px;
}

.control-btn {
  padding: 10px 15px;
  background: rgba(255,255,255,0.2);
  border: none;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  font-size: 1.2em;
  transition: all 0.3s ease;
}

.control-btn:hover:not(:disabled) {
  background: rgba(255,255,255,0.3);
  transform: scale(1.1);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.setting-item label {
  color: #fff;
  min-width: 50px;
}

.setting-item input[type="range"] {
  flex: 1;
}

.setting-item span {
  color: #fff;
  font-size: 0.9em;
  min-width: 50px;
}

.effects-toggle {
  margin-top: 20px;
}

.effects-toggle label {
  color: #fff;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.effects-toggle input[type="checkbox"] {
  transform: scale(1.2);
}

@media (max-width: 768px) {
  .game-area {
    flex-direction: column;
    align-items: center;
  }
  
  .game-canvas {
    width: 100%;
    max-width: 400px;
    height: auto;
  }
  
  .score-board {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
