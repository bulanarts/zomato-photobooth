// ==========================================
// 1. CONFIGURATION & APP STATE (VARIABLES)
// ==========================================
// Clear local storage on page load to start fresh
window.addEventListener ('DOMContentLoaded',() => localStorage.removeItem('photoStrip'));

// Dimensions specifically tuned to output a standard 4x6 photostrip ratio
const WIDTH = 1176, 
HEIGHT = 1470, 
HALF = HEIGHT / 2; // Dividing point between photo slot 1 (top) and slot 2 (bottom)
let photoStage = 0; // 0 = Top slot empty, 1 = Bottom slot empty, 2 = Both photos taken

// ==========================================
// 2. DOM ELEMENT CACHING (THE SELECTORS)
// ==========================================
// Centralized object to reference HTML elements quickly without polluting global namespace
const elements = {
    canvas: document.getElementById('finalCanvas'),
    ctx: document.getElementById('finalCanvas').getContext('2d'),
    uploadInput:document.getElementById('uploadPhotoInput'),
    uploadBtn:document.getElementById('uploadPhoto'),
    readyBtn:document.getElementById('readyButton'),
    downloadBtn:document.getElementById('downloadBtn')
};


// ==========================================
// 3. CORE PHOTO PROCESSING FUNCTIONS
// ==========================================
// Draws uploaded image onto canvas with proper aspect ratio cropping
const drawPhoto = img => {
    const {ctx} = elements;
    const yOffset = photoStage === 0 ? 0 : HALF;
    const imgAspect = img.width / img.height, targetAspect = WIDTH / HALF;
    let sx, sy, sw, sh;

    // Auto aspect-ratio boxing calculation to prevent image stretching
    if (imgAspect > targetAspect) {
        sh = img.height; 
        sw = img.height*targetAspect;
        sx = (img.width-sw)/2;
        sy = 0;
    }
    else{
        sw = img.width;
        sh = img.width/targetAspect;
        sx = 0;
        sy = (img.height-sh)/2;
    }
    ctx.drawImage (img, sx, sy, sw, sh, 0, yOffset, WIDTH, HALF);
    photoStage++;
    if (photoStage === 2) finalizePhotoStrip ();
};
// Merges photos with decorative border frame
const finalizePhotoStrip = () => {
const {ctx, readyBtn, downloadBtn, uploadBtn} = elements;
const frame = new Image ();
frame.onload = () => {
ctx.drawImage(frame,0,0,WIDTH,HEIGHT);
uploadBtn.style.display = 'none';
readyBtn.style.display = 'inline-block';
readyBtn.disabled = false;
downloadBtn.style.display = 'inline-block';
    };
frame.src='../Assets/tomatoframe-01.png';
};

// Packs current canvas maps into standard raw Binary Large Object files for physical browser downloading
const downloadPhoto = () => {
    const {canvas} = elements;
    canvas.toBlob (blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'Zomato-photostrip.png';
        a.click();
    },'image/png');
};

// ==========================================
// 4. EVENT LISTENERS & INTERACTION BINDINGS
// ==========================================
// Ready button - Saves photo to local storage and navigates to finish page
//ready button
elements.readyBtn.addEventListener('click',() => {
localStorage.setItem('photoStrip',elements.canvas.toDataURL('image/png'));
localStorage.setItem('photoSource', 'upload.html');
window.location.href = 'finish.html';
});

// Upload button - Triggers hidden file input
elements.uploadBtn.addEventListener('click',() => elements.uploadInput.click());

// Upload input - Handles file selection and triggers photo drawing
elements.uploadInput.addEventListener('change',e=>{
    const file = e.target.files[0];
    if(!file) return;
    const img = new Image ();
    img.onload = () => drawPhoto(img);
    img.src = URL.createObjectURL(file);
    elements.uploadInput.value='';
});

// Download button - Downloads the photostrip as PNG
elements.downloadBtn.addEventListener('click',downloadPhoto);

// ==========================================
// 5. DEVICE & PAGE INITIALIZATION
// ==========================================
// Log initialization status (optional debug)
console.log('Upload page initialized successfully!');
console.log('Photo stage:', photoStage);
