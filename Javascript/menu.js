// menu.js - For the menu page only
document.addEventListener('DOMContentLoaded', () => {
    const cameraBtn = document.getElementById('menu-camera-button');
    if (cameraBtn) {
        cameraBtn.addEventListener('click', () => {
            window.location.href = 'camera.html';
        });
    }
    
    const uploadBtn = document.getElementById('menu-upload-button');
    if (uploadBtn) {
        uploadBtn.addEventListener('click', () => {
            window.location.href = 'upload.html';
        });
    }
});