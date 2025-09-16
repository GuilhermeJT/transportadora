    
document.addEventListener('DOMContentLoaded', () => {
    fetch('/pages/menu.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('menu-container').innerHTML = data;
        });
});