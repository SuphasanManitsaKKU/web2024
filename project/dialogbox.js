document.addEventListener('DOMContentLoaded', () => {
    const dialogBox = document.querySelector('#dialog-box');
    const characterName = document.querySelector('#character-name');
    const dialogText = document.querySelector('#dialog-text');

    // Add click event listener to each interactive entity
    document.querySelectorAll('.interactive').forEach(entity => {
        entity.addEventListener('click', function () {
            // Get the name and message from data attributes
            const name = entity.getAttribute('data-name');
            const message = entity.getAttribute('data-message');

            // Update and show the dialog box
            characterName.textContent = name;
            dialogText.textContent = message;
            dialogBox.style.display = 'block';

            // Auto-hide the dialog box after 3 seconds
            setTimeout(() => {
                dialogBox.style.display = 'none';
            }, 2000);
        });
    });
});
