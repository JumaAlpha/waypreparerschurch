// Typing Text Effect
const typingText = document.getElementById('typing-text');
const text = "The Way Preparers Church";
let index = 0;

function typeText() {
    if (index < text.length) {
        typingText.textContent += text[index];
        index++;
        setTimeout(typeText, 150);
    }
}
typeText();

// Run the function once the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', loadComponents);


document.addEventListener("DOMContentLoaded", function () {
    // Select all the count-text elements
    const counters = document.querySelectorAll('.count-text');
    
    // Function to animate the counting
    function animateCounting(counter) {
        const target = +counter.getAttribute('data-target'); // Get the target number
        const speed = 9000; // Time taken for counting to complete (in ms)
        const increment = target / (speed / 100); // Increment value every 100ms

        let count = 0;

        const interval = setInterval(() => {
            count += increment;
            if (count >= target) {
                clearInterval(interval);
                counter.innerText = `${target}+ ${counter.innerText.split('+')[1].trim()}`; // Final count with text
            } else {
                counter.innerText = `${Math.ceil(count)}+ ${counter.innerText.split('+')[1].trim()}`; // Update with the counting value
            }
        }, 100);
    }

    // Intersection Observer Callback Function
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // If the element is visible, start the counting animation
                const counter = entry.target;
                animateCounting(counter);
                // Stop observing once the animation has started
                observer.unobserve(counter);
            }
        });
    };

    // Set up the Intersection Observer
    const observer = new IntersectionObserver(observerCallback, {
        threshold: 0.5 // Trigger when 50% of the element is in the viewport
    });

    // Start observing all the counters
    counters.forEach(counter => {
        observer.observe(counter);
    });
});

// Toggle the active class on the aside when the button is clicked
function toggleAside() {
    const aside = document.querySelector('aside');
    aside.classList.toggle('active');
}
