//defining variable
const selectButton = document.getElementById('select-button');

//button interactions + adding safe navigation
function addSafeNavigation(button, url,id){
    if(!button) return;

    button.addEventListener('click',e => {
        if(typeof gtag=='function'){
            gtag('event','button_click',{
                button_id: id || button.id || 'no-id',
                button_text: button.innerText || 'no-text',
            });
            console.log('GA event sent:',id || button.id);
            }
            e.preventDefault();
            setTimeout(()=>(window.location.href=url),100);
    });
}

addSafeNavigation(selectButton, 'menu.html', 'select-button');
