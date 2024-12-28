// Load components into the page// Load components into the page
function loadComponents() {
    // Load Navbar
    fetch('assets/components/navbar.html')
        .then((response) => response.text())
        .then((data) => {
            document.querySelector('header').innerHTML = data;

            // Set the active page based on the document title
            const pageTitle = document.title;
            document.getElementById('active-page').textContent = pageTitle;

            // Hamburger menu toggle
            const hamburger = document.getElementById('hamburger');
            const navLinks = document.getElementById('nav-links');

            hamburger.addEventListener('click', function () {
                if (navLinks.style.display === 'flex') {
                    navLinks.style.display = 'none';
                } else {
                    navLinks.style.display = 'flex';
                }
            });
        })
        .catch((error) => console.error('Error loading navbar:', error));

    // Sticky Navbar Script
    window.addEventListener('load', () => {
        const navbar = document.getElementById('navbar');
        const navbarSpacer = document.createElement('div'); // Create a spacer element
        navbarSpacer.classList.add('navbar-spacer');

        window.addEventListener('scroll', () => {
            if (window.scrollY > 0) {
                if (!navbar.classList.contains('sticky')) {
                    navbar.classList.add('sticky');
                    navbar.parentNode.insertBefore(navbarSpacer, navbar.nextSibling); // Add the spacer below the navbar
                }
            } else {
                if (navbar.classList.contains('sticky')) {
                    navbar.classList.remove('sticky');
                    if (navbarSpacer.parentNode) {
                        navbarSpacer.parentNode.removeChild(navbarSpacer); // Remove the spacer
                    }
                }
            }
        });
    });

    fetch('assets/components/footer.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector('footer').innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));
}

document.addEventListener('DOMContentLoaded', loadComponents);


document.addEventListener("DOMContentLoaded", () => {
    const activePageElement = document.getElementById("active-page");

    // Example: Change active page based on URL or navigation logic
    const path = window.location.pathname;
    if (path.includes("home")) {
        activePageElement.textContent = "Home";
    } else if (path.includes("about")) {
        activePageElement.textContent = "About Us";
    } else if (path.includes("services")) {
        activePageElement.textContent = "Services";
    }
    // Add more logic for other pages if needed
});

