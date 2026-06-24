// ==========================================
// 1. CONFIGURATION & APP STATE (VARIABLES)
// ==========================================
// Dimensions for the photostrip canvas
const WIDTH = 1176, 
      HEIGHT = 1470;

// Sticker state management
let stickers = [], dragOffset = { x: 0, y: 0 }, selectedSticker = null;


// ==========================================
// 2. DOM ELEMENT CACHING (THE SELECTORS)
// ==========================================
// Centralized object to reference HTML elements quickly without polluting global namespace
const elements = {
    canvas: document.getElementById('finalCanvas'),
    ctx: document.getElementById('finalCanvas').getContext('2d'),
    addStar1Btn: document.getElementById('addStar1'),
    addStar2Btn: document.getElementById('addStar2'),
    addStar3Btn: document.getElementById('addStar3'),
    addPitaBtn: document.getElementById('addPita'),
    addFlowerBtn: document.getElementById('addFlower'),
    addFlower2Btn: document.getElementById('addFlower2'),
    addHeartBtn: document.getElementById('addHeart'),
    addCloverBtn: document.getElementById('addClover'),
    addButtonBtn: document.getElementById('addButton'),
    addTomatoBtn: document.getElementById('addTomato'),
    resetBtn: document.getElementById('reset'),
    downloadBtn: document.getElementById('downloadBtn'),
    homeBtn: document.getElementById('homeBtn'),
    retakeBtn: document.getElementById('retakeBtn')
    
};

// ==========================================
// 3. CANVAS DRAWING & PHOTO LOADING
// ==========================================
// Load the photostrip from local storage
const finalImage = new Image();
const dataURL = localStorage.getItem('photoStrip');

if (dataURL) {
  finalImage.src = dataURL;
  finalImage.onload = drawCanvas;
  localStorage.removeItem('photoStrip');
} else {
  alert("No photo found! Please take a photo first.");
}

// Draws the canvas with photostrip background and all stickers
function drawCanvas() {
  const { ctx } = elements;
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.drawImage(finalImage, 0, 0, WIDTH, HEIGHT);
  stickers.forEach(s => ctx.drawImage(s.img, s.x, s.y, s.width, s.height));
}

// ==========================================
// 4. STICKER MANAGEMENT FUNCTIONS
// ==========================================
// Adds a new sticker to the canvas
function addSticker(src) {
  const img = new Image();
  img.src = src;
  img.onload = () => {
    stickers.push({
      img,
      x: WIDTH / 2 - img.width / 6,
      y: HEIGHT / 2 - img.height / 6,
      width: img.width / 2.5,
      height: img.height / 2.5,
      dragging: false
    });
    drawCanvas();
  };
}

// Gets pointer position relative to canvas (works for both mouse and touch)
function getPointerPos(e) {
  const { canvas } = elements;
  const rect = canvas.getBoundingClientRect(); 
  const scaleX = canvas.width / rect.width; 
  const scaleY = canvas.height / rect.height;
  const clientX = e.touches?.[0]?.clientX ?? e.clientX,
        clientY = e.touches?.[0]?.clientY ?? e.clientY;
  return { 
    x: (clientX - rect.left) * scaleX, 
    y: (clientY - rect.top) * scaleY };
}

// ==========================================
// 5. DRAG & DROP HANDLING (POINTER EVENTS)
// ==========================================
// Handles pointer down - selects sticker for dragging
function pointerDown(e) {
  const { x: mouseX, y: mouseY } = getPointerPos(e);
  for (let i = stickers.length - 1; i >= 0; i--) {
    const s = stickers[i];
    if (mouseX >= s.x && mouseX <= s.x + s.width && 
      mouseY >= s.y && mouseY <= s.y + s.height) {
      selectedSticker = s;
      s.dragging = true;
      dragOffset.x = mouseX - s.x;
      dragOffset.y = mouseY - s.y;
      stickers.splice(i, 1);
      stickers.push(s);
      drawCanvas();
      e.preventDefault();
      break;
    }
  }
}

// Handles pointer move - drags selected sticker
function pointerMove(e) {
  if (!selectedSticker?.dragging) return;
  const { x: mouseX, y: mouseY } = getPointerPos(e);
  selectedSticker.x = mouseX - dragOffset.x;
  selectedSticker.y = mouseY - dragOffset.y;
  drawCanvas();
  e.preventDefault();
}

// Handles pointer up - releases sticker
function pointerUp() {
  if (selectedSticker) {
    selectedSticker.dragging = false; 
    selectedSticker = null; 
  }
}

// ==========================================
// 6. EVENT LISTENERS & INTERACTION BINDINGS
// ==========================================
// Canvas pointer events (mouse)
const { 
  canvas, 
  ctx, 
  retakeBtn, 
  resetBtn, 
  downloadBtn, 
  homeBtn,
  addStar1Btn,
  addStar2Btn,
  addStar3Btn,
  addPitaBtn,
  addFlowerBtn,
  addFlower2Btn,
  addHeartBtn,
  addCloverBtn,
  addButtonBtn,
  addTomatoBtn
} = elements;

canvas.addEventListener('mousedown', pointerDown);
canvas.addEventListener('mousemove', pointerMove);
canvas.addEventListener('mouseup', pointerUp);
canvas.addEventListener('mouseleave', pointerUp);

// Canvas pointer events (touch)
canvas.addEventListener('touchstart', pointerDown);
canvas.addEventListener('touchmove', pointerMove);
canvas.addEventListener('touchend', pointerUp);
canvas.addEventListener('touchcancel', pointerUp);

// Retake button - Return to camera/upload page
retakeBtn.addEventListener('click', () => {
    const source = localStorage.getItem('photoSource') || 'camera.html';
    localStorage.removeItem('photoStrip');
    localStorage.removeItem('photoSource');
    window.location.href = source;
});

// Sticker buttons
    addStar1Btn.addEventListener('click', () => addSticker('Assets/sticker_star1.png'));
    addStar2Btn.addEventListener('click', () => addSticker('Assets/sticker_star2.png'));
    addStar3Btn.addEventListener('click', () => addSticker('Assets/sticker_star3.png'));
    addPitaBtn.addEventListener('click', () => addSticker('Assets/sticker_pita.png'));
    addFlowerBtn.addEventListener('click', () => addSticker('Assets/sticker_flower.png'));
    addFlower2Btn.addEventListener('click', () => addSticker('Assets/sticker_flower2.png'));
    addHeartBtn.addEventListener('click', () => addSticker('Assets/sticker_heart.png'));
    addCloverBtn.addEventListener('click', () => addSticker('Assets/sticker_clover.png'));
    addButtonBtn.addEventListener('click', () => addSticker('Assets/sticker_button.png'));
    addTomatoBtn.addEventListener('click', () => addSticker('Assets/sticker_tomato.png'));

// Reset button - Clear all stickers
resetBtn.addEventListener('click', () => { 
  stickers = []; 
  drawCanvas(); 
});

// Download button - Save final image
downloadBtn.addEventListener('click', () => {
  canvas.toBlob(blob => {
    const a = document.createElement('a'); 
    a.href = URL.createObjectURL(blob); 
    a.download = 'tomato-photobooth.png'; 
    a.click(); }, 
    'image/png');
});

// Home button - Navigate to landing page
homeBtn.addEventListener('click', () => window.location.href = 'index.html');

// ==========================================
// 7. DEVICE & PAGE INITIALIZATION
// ==========================================
// Log initialization status
console.log('Sticker editor initialized successfully!');
console.log('Stickers loaded:', stickers.length);
