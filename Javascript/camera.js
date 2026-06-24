// ==========================================
// 1. CONFIGURATION & APP STATE (VARIABLES)
// ==========================================
// Dimensions specifically tuned to output a standard 4x6 photostrip ratio
const WIDTH = 1176, 
HEIGHT = 1470, 
HALF = HEIGHT / 2; // Dividing point between photo slot 1 (top) and slot 2 (bottom)

let currentFrame = 'Assets/tomatoframe-01.png';     // Tracks current selected frame asset
let currentFilter = 'none';                         // State tracker for live filters: 'none', 'sepia', 'bw'
let photoStage = 0;                                 // 0 = Empty, 1 = First photo taken, 2 = Both photos taken

// ==========================================
// 2. DOM ELEMENT CACHING (THE SELECTORS)
// ==========================================
// Centralized object to reference HTML elements quickly without polluting global namespace
const elements = {
    video: document.getElementById('liveVideo'),
    canvas: document.getElementById('finalCanvas'),
    ctx: document.getElementById('finalCanvas').getContext('2d'),
    takePhotoBtn: document.getElementById('takePhoto'),
    downloadBtn: document.getElementById('downloadBtn'),
    countdownEl: document.querySelector('.countdown-timer'),
    frameOverlay: document.querySelector('.frame-overlay')
};

// Debug tools: Check layout/rendering layer priority before initializing script loops
console.log('Countdown element:', elements.countdownEl);
console.log('Countdown display style:', window.getComputedStyle(elements.countdownEl).display);

// ==========================================
// 3. IMAGE PIXEL FILTER PROCESSORS (THE MATHEMATICS)
// ==========================================
// Heavy pixel-by-pixel color array manipulation using RGB channels    
const applySepia = (ctx, x, y, w, h) => {
const imageData = ctx.getImageData(x, y, w, h); // Flat array structure: [R, G, B, A, R, G, B, A...]
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    let r = data[i], g = data[i+1], b = data[i+2];

    // 1. Official studio sepia tint matrix conversion formulas
    let sr = (r * 0.393) + (g * 0.769) + (b * 0.189);
    let sg = (r * 0.349) + (g * 0.686) + (b * 0.168);
    let sb = (r * 0.272) + (g * 0.534) + (b * 0.131);


    // 2. Contrast adjustment formula: (Value - Midpoint) * ContrastLevel + Midpoint
    sr *= 0.75; sg *= 0.75; sb *= 0.75;
    sg = (sg - 128) * 1.2 + 128;
    sb = (sb - 128) * 1.2 + 128;
    // 3. Clamping parameters to ensure math never outputs numbers outside valid 0-255 RG
    data[i]   = Math.min(255, Math.max(0, sr));
    data[i+1] = Math.min(255, Math.max(0, sg));
    data[i+2] = Math.min(255, Math.max(0, sb));
  }
  ctx.putImageData(imageData, x, y);// Write altered array back onto canvas surface
};

// Combines all color values evenly to create standard true monotone contrast
const applyGrayscale = (ctx, x, y, w, h) => {
  const imageData = ctx.getImageData(x, y, w, h);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i+1] + data[i+2]) / 3;
    data[i] = data[i+1] = data[i+2] = avg; // Setting R, G, and B to the exact same average values drops
  }
  ctx.putImageData(imageData, x, y);
};

// ==========================================
// 4. WEBCAM INTERFACE & CANVAS DRAWING LOGIC
// ==========================================
// Shifts positions of webcam live output window on the UI layout depending on track stage 
const moveVideoToHalf = i => {
const { video } = elements;
    video.style.display = 'block';
    video.style.top = i === 0 ? '0' : '50%';
    video.style.left = '0';
    video.style.width = '100%';
    video.style.height = '50%';
};

// Captures video stream frame, centers/crops it aspect-wise, and renders it onto HTML5 canvas drawing layers
const capturePhoto = () => {
    const { video, ctx, takePhotoBtn } = elements;
    const yOffset = photoStage === 0 ? 0 : HALF;
    const vW = video.videoWidth, vH = video.videoHeight;
    const targetAspect = WIDTH / HALF, vAspect = vW / vH;
    let sx, sy, sw, sh;

    // Auto aspect-ratio boxing calculation to prevent webcam image stretching
    if (vAspect > targetAspect) { sh = vH; sw = vH * targetAspect; sx = (vW - sw) / 2; sy = 0; }
    else { sw = vW; sh = vW / targetAspect; sx = 0; sy = (vH - sh) / 2; }

    // Canvas mirroring trick so photos feel natural like looking into a true reflection mirror
    ctx.save();
    ctx.translate(WIDTH, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, sx, sy, sw, sh, 0, yOffset, WIDTH, HALF);
    ctx.restore();

    // Process specific software pixel filters right over top of the newly captured frame
    if (currentFilter === 'sepia') {
        applySepia(ctx, 0, yOffset, WIDTH, HALF);
    } else if (currentFilter === 'bw') {
        applyGrayscale(ctx, 0, yOffset, WIDTH, HALF);
    }

    // Advance photo booth sequence counter tracking states
    photoStage++;
    if (photoStage === 1) 
        { moveVideoToHalf(1); // Relocate video window down to prepare user for shot #2
            takePhotoBtn.disabled = false; }
    else if (photoStage === 2) 
        finalizePhotoStrip(); // Wrap up operations when both slots are occupied
};

// Clear drawing maps to drop app state parameters back to original launch baselines
const retakePhoto = () => {
  photoStage = 0;
  elements.ctx.clearRect(0, 0, WIDTH, HEIGHT);
  moveVideoToHalf(0);
  elements.takePhotoBtn.disabled = false;
};

// ==========================================
// 5. APPLIED FILTERS AND DECORATIVE FRAME MANAGEMENT
// ==========================================
// Updates CSS visibility classes assigned to web video tags to alter active live viewing monitors
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
// Shows visual design framework previews on current overlay layers
const showFramePreview = (frameFileName) => {
    const { frameOverlay } = elements;
    if (frameOverlay) {
        frameOverlay.src = `Assets/${frameFileName}`;
        frameOverlay.style.display = 'block';
        console.log('Preview showing:', `Assets/${frameFileName}`); // Debug
    } else {
        console.log('frameOverlay element not found!');
    }
};
// Assigns selected image templates as active assets to stamp upon image outputs
const changeFrame = (frameFileName) => {
    currentFrame = `Assets/${frameFileName}`;
    
    // Show preview overlay
    if (photoStage === 0) {
        showFramePreview(frameFileName);
    }
    
    console.log('Frame changed to:', currentFrame);
};


// ==========================================
// 6. ASSET COMPOSITING, STORAGE, & REDIRECTION
// ==========================================
// Merges photos with borders, builds raw base64 data strings, updates storage keys, routes workflows away
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
// Packs current canvas maps into standard raw Binary Large Object files for physical browser downloading
const downloadPhoto = () => {
    elements.canvas.toBlob(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'Zomato-photostrip.png';
        a.click();
    }, 'image/png');
};

// ==========================================
// 7. ASYNCHRONOUS TIMERS AND INTERACTION BINDINGS
// ==========================================
// Standard 3-second intervals sequence timing framework loops
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

//Sets up click tracking actions for filter button options
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
// Sets up click tracking actions for photostrip frames options
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
// Manages core trigger buttons (Taking snapshot, downloading, browser resizing)
const setupEventListeners = () => {
    const { takePhotoBtn, downloadBtn } = elements;

    takePhotoBtn.addEventListener('click', () => {
        if (photoStage > 1) return;
        takePhotoBtn.disabled = true;
        startCountdown(capturePhoto);
    });

    if (downloadBtn) downloadBtn.addEventListener('click', downloadPhoto);
    
    const retakeBtn = document.getElementById('retakeBtn');
    if (retakeBtn) {
    retakeBtn.addEventListener('click', retakePhoto);
    }
    
    window.addEventListener('resize', () => {
        if (photoStage === 0) moveVideoToHalf(0);
        else if (photoStage === 1) moveVideoToHalf(1);
    });
};

// ==========================================
// 8. DEVICE DRIVER INITIALIZATION
// ==========================================
// This handles capturing operating system hardware access points (Webcams/Cameras)
const setupCamera = () => {
    navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 2560 }, height: { ideal: 1440 }, facingMode: 'user' }, 
        audio: false
    })
        .then(stream => {
            elements.video.srcObject = stream; moveVideoToHalf(0); })
        .catch(err => {
            console.error('Camera access failed:', err);
});
};

// MASTER INITIALIZER: Starts the camera and attaches all event modules in order
const initPhotoBooth = () => {
    setupCamera();          // 1. Ask for webcam permission
    setupEventListeners();  // 2. Listen for clicks on snapshot/download buttons
    setupFrameButtons();    // 3. Listen for clicks on custom borders
    setupFilterButtons();    // 4. Listen for clicks on Sepia/BW filters
    const defaultFrameFile = currentFrame.split('/').pop();
    // Set up a tiny delay to inject the starting graphic overlay template smoothly
    setTimeout(() => {
        showFramePreview('tomatoframe-01.png');
        }, 500);
};
// RUN APPLICATION: Kicks off execution the second the browser loads this JavaScript file
initPhotoBooth();
