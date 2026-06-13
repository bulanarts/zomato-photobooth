// Konstanta
const WIDTH = 1176, HEIGHT = 1470, HALF = HEIGHT / 2;

// Define currentFrame variable (BEFORE using it)
let currentFrame = '../Assets/tomatoframe-01.png';

// Define filter - Track current filter: 'none', 'sepia', 'bw'
let currentFilter = 'none'; // 

// Dom elements
const elements = {
    video: document.getElementById('liveVideo'),
    canvas: document.getElementById('finalCanvas'),
    ctx: document.getElementById('finalCanvas').getContext('2d'),
    takePhotoBtn: document.getElementById('takePhoto'),
    downloadBtn: document.getElementById('downloadBtn'),
    countdownEl: document.querySelector('.countdown-timer'),
    frameOverlay: document.querySelector('.frame-overlay')
};

// console countdown supaya di depan????
console.log('Countdown element:', elements.countdownEl);
console.log('Countdown display style:', window.getComputedStyle(elements.countdownEl).display);
let photoStage = 0;

// Move video to half-----------------------------------------------------------
const moveVideoToHalf = i => {
    const { video } = elements;
    video.style.display = 'block';
    video.style.top = i === 0 ? '0' : '50%';
    video.style.left = '0';
    video.style.width = '100%';
    video.style.height = '50%';
};
const applySepia = (ctx, x, y, w, h) => {
  const imageData = ctx.getImageData(x, y, w, h);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    let r = data[i], g = data[i+1], b = data[i+2];

    // sepia matrix
    let sr = (r * 0.393) + (g * 0.769) + (b * 0.189);
    let sg = (r * 0.349) + (g * 0.686) + (b * 0.168);
    let sb = (r * 0.272) + (g * 0.534) + (b * 0.131);

    // brightness 75%
    sr *= 0.75; sg *= 0.75; sb *= 0.75;

    // contrast 120%: (value - 128) * contrast + 128
    sr = (sr - 128) * 1.2 + 128;
    sg = (sg - 128) * 1.2 + 128;
    sb = (sb - 128) * 1.2 + 128;

    data[i]   = Math.min(255, Math.max(0, sr));
    data[i+1] = Math.min(255, Math.max(0, sg));
    data[i+2] = Math.min(255, Math.max(0, sb));
  }
  ctx.putImageData(imageData, x, y);
};

const applyGrayscale = (ctx, x, y, w, h) => {
  const imageData = ctx.getImageData(x, y, w, h);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i+1] + data[i+2]) / 3;
    data[i] = data[i+1] = data[i+2] = avg;
  }
  ctx.putImageData(imageData, x, y);
};

// Countdown-----------------------------------------------------------
const startCountdown = callback => {
    let count = 3;
    const { countdownEl } = elements;
    countdownEl.textContent = count;
    countdownEl.style.display = 'flex';
    const intervalid = setInterval(() => {
        count--;
        if (count > 0) countdownEl.textContent = count;
        else {
            clearInterval(intervalid);
            countdownEl.style.display = 'none';
            callback();
        }
    }, 1000);
};
// Filter -----------------------------------------------------------
const applyFilter = (filterType) => {
    const { video } = elements;
    
    // Remove existing filter classes
    video.classList.remove('filter-none', 'filter-sepia', 'filter-bw');
    
    // Apply new filter
    switch(filterType) {
        case 'sepia':
            video.classList.add('filter-sepia');
            currentFilter = 'sepia';
            console.log('Sepia filter applied');
            break;
        case 'bw':
            video.classList.add('filter-bw');
            currentFilter = 'bw';
            console.log('Black & White filter applied');
            break;
        default:
            video.classList.add('filter-none');
            currentFilter = 'none';
            console.log('No filter applied');
            break;
    }
};

const setupFilterButtons = () => {
    const filter1Btn = document.getElementById('filter1Btn'); // Sepia
    const filter2Btn = document.getElementById('filter2Btn'); // BW
    const filter0Btn = document.getElementById('filter0Btn'); // No Filter
    
    if (filter1Btn) {
        filter1Btn.addEventListener('click', () => {
            applyFilter('sepia');
        });
    }
    
    if (filter2Btn) {
        filter2Btn.addEventListener('click', () => {
            applyFilter('bw');
        });
    }
    
    if (filter0Btn) {
        filter0Btn.addEventListener('click', () => {
            applyFilter('none');
        });
    }
};

//capture photo-----------------------------------------------------------
const capturePhoto = () => {
    const { video, ctx, takePhotoBtn } = elements;
    const yOffset = photoStage === 0 ? 0 : HALF;
    const vW = video.videoWidth, vH = video.videoHeight;
    const targetAspect = WIDTH / HALF, vAspect = vW / vH;
    let sx, sy, sw, sh;
    if (vAspect > targetAspect) { sh = vH; sw = vH * targetAspect; sx = (vW - sw) / 2; sy = 0; }
    else { sw = vW; sh = vW / targetAspect; sx = 0; sy = (vH - sh) / 2; }

    ctx.save();
    ctx.translate(WIDTH, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, sx, sy, sw, sh, 0, yOffset, WIDTH, HALF);
    ctx.restore();

    // apply filter to the just-drawn region
    if (currentFilter === 'sepia') {
        applySepia(ctx, 0, yOffset, WIDTH, HALF);
    } else if (currentFilter === 'bw') {
        applyGrayscale(ctx, 0, yOffset, WIDTH, HALF);
    }

    photoStage++;
    if (photoStage === 1) { moveVideoToHalf(1); takePhotoBtn.disabled = false; }
    else if (photoStage === 2) finalizePhotoStrip();
};

const retakePhoto = () => {
  photoStage = 0;
  elements.ctx.clearRect(0, 0, WIDTH, HEIGHT);
  moveVideoToHalf(0);
  elements.takePhotoBtn.disabled = false;
};

document.getElementById('retakeBtn').addEventListener('click', retakePhoto);

// frame -----------------------------------------------------------
const showFramePreview = (frameFileName) => {
    const { frameOverlay } = elements;
    if (frameOverlay) {
        frameOverlay.src = `../Assets/${frameFileName}`;
        frameOverlay.style.display = 'block';
        console.log('Preview showing:', `Assets/${frameFileName}`); // Debug
    } else {
        console.log('frameOverlay element not found!');
    }
};

const changeFrame = (frameFileName) => {
    currentFrame = `../Assets/${frameFileName}`;
    
    // Show preview overlay
    if (photoStage === 0) {
        showFramePreview(frameFileName);
    }
    
    console.log('Frame changed to:', currentFrame);
};

const setupFrameButtons = () => {
    const frame1Btn = document.getElementById('frame1Btn');
    const frame2Btn = document.getElementById('frame2Btn');
    
    console.log('Frame buttons found:', !!frame1Btn, !!frame2Btn); // Debug
    
    if (frame1Btn) {
        frame1Btn.addEventListener('click', () => {
            console.log('Frame 1 clicked');
            changeFrame('tomatoframe-01.png');
        });
    }
    
    if (frame2Btn) {
        frame2Btn.addEventListener('click', () => {
            console.log('Frame 2 clicked');
            changeFrame('tomatoframe-02.png'); // Make sure this file exists
        });
    }
};

//finalize photo strip -----------------------------------------------------------
const finalizePhotoStrip = () => {
    const { video, ctx, canvas } = elements;
    video.style.display = 'none';
    const frame = new Image();
    frame.src = currentFrame;
    frame.onload = () => {
        ctx.drawImage(frame, 0, 0, WIDTH, HEIGHT);
        localStorage.setItem('photoStrip', canvas.toDataURL('image/png'));
        setTimeout(() => window.location.href = 'finish.html', 50);
    };
    frame.onerror = () => {
        console.error('Failed to load frame:', currentFrame);
    };
    frame.complete && frame.onload();
};

//download photo -----------------------------------------------------------
const downloadPhoto = () => {
    elements.canvas.toBlob(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'Zomato-photostrip.png';
        a.click();
    }, 'image/png');
};

//setup camera -----------------------------------------------------------
const setupCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 2560 }, height: { ideal: 1440 }, facingMode: 'user' }, audio: false })
        .then(stream => { elements.video.srcObject = stream; moveVideoToHalf(0); })
        .catch(err => alert('Camera access failed:' + err));
};

//setup events -----------------------------------------------------------
const setupEventListeners = () => {
    const { takePhotoBtn, downloadBtn } = elements;

    takePhotoBtn.addEventListener('click', () => {
        if (photoStage > 1) return;
        takePhotoBtn.disabled = true;
        startCountdown(capturePhoto);
    });

    if (downloadBtn) downloadBtn.addEventListener('click', downloadPhoto);
    window.addEventListener('resize', () => {
        if (photoStage === 0) moveVideoToHalf(0);
        else if (photoStage === 1) moveVideoToHalf(1);
    });
};

// initialize photo booth -----------------------------------------------------------
const initPhotoBooth = () => {
    setupCamera();
    setupEventListeners();
    setupFrameButtons(); // Now this works because function is defined above
    setupFilterButtons();
    const defaultFrameFile = currentFrame.split('/').pop();
    setTimeout(() => showFramePreview('tomatoframe-01.png'), 500);
};
initPhotoBooth();
