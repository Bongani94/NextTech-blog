// Search bar
const toggleSearchButton = document.getElementById('toggle-search-button');
const searchField = document.getElementById('search-field')
toggleSearchButton.addEventListener('click', () => {
    searchField.classList.toggle('hidden');
    if (!searchField.classList.contains('hidden')) {
        searchField.focus();
    }
});

// Responsive navigation menu
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Active link
const currentPath = window.location.pathname;
const links = document.querySelectorAll('.nav-link');
links.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (currentPath === linkPath) {
        link.classList.add('active-link');
    }
});