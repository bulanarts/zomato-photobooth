// ==========================================
// 1. DOM SELECTORS (GRABBING HTML ELEMENTS)
// ==========================================
// This grabs your HTML button so JavaScript can interact with it.
const selectButton = document.getElementById('select-button');

// ==========================================
// 2. CORE LOGIC FUNCTIONS (THE "DOERS")
// ==========================================
function addSafeNavigation(button, url,id){
    
    // Guard Clause: Stops the code from running/crashing if the HTML button doesn't exist on the page
    if(!button) return;

    button.addEventListener('click',e => {
        // Prevents the browser from instantly loading the new page so the tracking code has time to run
        e.preventDefault();


        // Check if Google Analytics (gtag) is installed and active on the website
        if(typeof gtag=='function'){
            gtag('event','button_click',{
                button_id: id || button.id || 'no-id',
                button_text: button.innerText || 'no-text',
            });
            console.log('GA event sent:',id || button.id);
            }
            // Delay the redirection by 100 milliseconds to guarantee the GA tracker logs the event first
            setTimeout(()=>{
                window.location.href = url;
            }, 100);
    });
}

// ==========================================
// 3. EXECUTION & INITIALIZATION (THE TRIGGERS)
// ==========================================
// This activates the logic by passing your select button, destination file, and tracking ID.
addSafeNavigation(selectButton, 'menu.html', 'select-button');
