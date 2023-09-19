const showSearchButton = document.getElementById('show-search-button');
const searchContainer = document.getElementById('search-container');

showSearchButton.addEventListener('click', () => {
    searchContainer.classList.toggle('hidden-search');
});

// Responsive navigation menu
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

// Toggle mobile menu visibility when the button is clicked
mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});