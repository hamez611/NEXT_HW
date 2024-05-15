document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.button');
    const banner = document.getElementById('banner');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const content = button.getAttribute('data-content');
            const color = button.getAttribute('data-color');
            banner.textContent = content;
            banner.style.backgroundColor = color;
        });
    });
});
