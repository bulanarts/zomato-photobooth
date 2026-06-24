// ==========================================
// 1. PAGE INITIALIZATION (THE TRIGGER)
// ==========================================

// Waits until the browser has completely loaded the HTML structure before running any JS.
document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 2. CAMERA BUTTON EVENT
    // ==========================================
    // Grab the camera button element from the HTML
    const cameraBtn = document.getElementById('menu-camera-button');
    
    // Guard Check: Only run code if the camera button actually exists on this page
    if (cameraBtn) {
        cameraBtn.addEventListener('click', () => {
            window.location.href = 'camera.html';
        });
    }
    
    // ==========================================
    // 3. UPLOAD BUTTON EVENT
    // ==========================================
    // Grab the upload button element from the HTML
    const uploadBtn = document.getElementById('menu-upload-button');
    
    // Guard Check: Only run code if the upload button actually exists on this page
    if (uploadBtn) {
        uploadBtn.addEventListener('click', () => {
            // Redirects the user directly to the upload page
            window.location.href = 'upload.html';
        });
    }
});
