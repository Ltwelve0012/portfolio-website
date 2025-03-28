document.addEventListener('DOMContentLoaded', function () {
    // Terminal text animation
    const terminalText = document.getElementById('terminal-text');
    const text = "Type 'menu' to see options or navigate using the menu above.";
    let i = 0;
    let userInput = "";
    let blinkInterval;
    let isBlinking = false;
    let currentSection = "about"; // Track the current active section
    let matrixAnimationInterval; // Store the animation interval ID
    let typingInProgress = true; // Flag to track if the initial typing animation is in progress

    // Dropdown menu functionality
    const dropdownButton = document.querySelector('.dropdown-button');
    const dropdownContent = document.querySelector('.dropdown-content');
    const regularMenu = document.querySelector('.menu');

    // Clone menu items to dropdown
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        const clone = item.cloneNode(true);
        dropdownContent.appendChild(clone);
    });

    // Toggle dropdown when button is clicked
    dropdownButton.addEventListener('click', function () {
        dropdownContent.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    window.addEventListener('click', function (event) {
        if (!event.target.matches('.dropdown-button') && !dropdownContent.contains(event.target)) {
            dropdownContent.classList.remove('show');
        }
    });

    // Update dropdown button text based on current section
    function updateDropdownButtonText(sectionName) {
        dropdownButton.textContent = sectionName;
    }

    // Function to check if section is in viewport
    function isSectionInViewport(section) {
        const rect = section.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    function typeWriter() {
        if (i < text.length) {
            terminalText.textContent = text.substring(0, i + 1);
            i++;
            setTimeout(typeWriter, 50);
        } else {
            // Typing animation complete
            typingInProgress = false;
            // Start blinking for the default section
            startBlinking("About");
            updateDropdownButtonText("About");
        }
    }

    typeWriter();

    // Function to handle blinking between two states
    function startBlinking(sectionName) {
        // Clear any existing blink interval
        if (blinkInterval) {
            clearInterval(blinkInterval);
        }

        isBlinking = true;
        let toggle = true;

        blinkInterval = setInterval(() => {
            if (toggle) {
                terminalText.textContent = `Selected: ${sectionName}`;
            } else {
                terminalText.textContent = `Type "menu" for commands or "exit" to exit`;
            }
            toggle = !toggle;
        }, 2000); // Switch every 2 seconds
    }

    function stopBlinking() {
        if (blinkInterval) {
            clearInterval(blinkInterval);
            isBlinking = false;
        }
    }

    // Navigation functionality
    const sections = document.querySelectorAll('.section');

    // Show About section by default
    document.getElementById('about').classList.add('active');
    document.querySelector('.menu-item[data-section="about"]').classList.add('active');

    // Apply active class to the cloned menu item in dropdown
    document.querySelector('.dropdown-content .menu-item[data-section="about"]').classList.add('active');

    // Function to scroll section into view with a smooth effect
    function scrollSectionIntoView(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            // Check if section is already in viewport
            if (!isSectionInViewport(section)) {
                // Scroll the section into view with smooth behavior
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }

    // Function to handle section navigation
    function navigateToSection(sectionId, displayName) {
        currentSection = sectionId;

        // Remove active class from all sections and menu items
        sections.forEach(section => section.classList.remove('active'));
        document.querySelectorAll('.menu-item').forEach(menuItem => menuItem.classList.remove('active'));

        // Add active class to current section
        document.getElementById(sectionId).classList.add('active');

        // Add active class to menu items in both regular menu and dropdown
        document.querySelectorAll(`.menu-item[data-section="${sectionId}"]`).forEach(item => {
            item.classList.add('active');
        });

        // Update dropdown button text
        updateDropdownButtonText(displayName);

        // Close dropdown after selection
        dropdownContent.classList.remove('show');

        // Scroll the section into view
        scrollSectionIntoView(sectionId);

        // Start blinking for the newly selected section
        startBlinking(displayName);
        userInput = "";
    }

    // Handle menu item clicks for both regular menu and dropdown
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function () {
            const sectionId = this.getAttribute('data-section');
            navigateToSection(sectionId, this.textContent);
        });
    });

    // Command line interface simulation
    document.addEventListener('keydown', function (e) {
        // Don't process key events when the user is typing in a form field
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
            return;
        }

        // If typing animation is in progress, stop it
        if (typingInProgress) {
            typingInProgress = false;
            i = text.length; // Set i to end of text to prevent further typing animation
            userInput = ""; // Clear any user input
        }

        // Stop blinking when user starts typing
        if (isBlinking && e.key.length === 1 || e.key === 'Backspace') {
            stopBlinking();
            terminalText.textContent = userInput || "";
        }

        if (e.key === 'Enter') {
            processCommand(userInput.trim().toLowerCase());
            userInput = "";
        } else if (e.key === 'Backspace') {
            // Remove last character on backspace
            userInput = userInput.slice(0, -1);
            terminalText.textContent = userInput;
            if (userInput === "") {
                terminalText.textContent = "_";
            }
        } else if (e.key.length === 1) {
            // Add character to terminal text if it's a single character
            userInput += e.key;
            terminalText.textContent = userInput;
        }
    });

    function processCommand(command) {
        console.log("Processing command:", command);

        if (command === 'menu') {
            stopBlinking();
            terminalText.textContent = 'Available commands: about, experience (exp), education (edu), projects (proj), skills, contact, exit';
        } else if (command === 'exit') {
            // Stop all animations and hide content
            stopBlinking();

            // Stop the matrix animation and clear the canvas
            stopMatrixAnimation();

            // Fill canvas with black color
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Hide everything except the container
            const elementsToHide = document.querySelectorAll('header, nav, main, footer');
            elementsToHide.forEach(element => {
                element.style.display = 'none';
            });

            // Show exit message
            const container = document.querySelector('.container');

            // Create exit message and restart button
            const exitDiv = document.createElement('div');
            exitDiv.className = 'exit-message';

            // Create h2 element
            const exitHeading = document.createElement('h2');
            exitHeading.style.textAlign = 'center';
            exitHeading.style.marginTop = '20%';
            exitHeading.style.color = 'var(--primary-color)';
            exitHeading.textContent = 'Thanks for visiting my portfolio website!';

            // Create button element
            const restartButton = document.createElement('button');
            restartButton.id = 'restart-button';
            restartButton.textContent = 'Re-enter';
            restartButton.style.display = 'block';
            restartButton.style.margin = '30px auto';
            restartButton.style.padding = '12px 24px';
            restartButton.style.backgroundColor = 'black';
            restartButton.style.color = 'var(--primary-color)';
            restartButton.style.border = '2px solid var(--primary-color)';
            restartButton.style.borderRadius = '4px';
            restartButton.style.fontSize = '18px';
            restartButton.style.cursor = 'pointer';
            restartButton.style.transition = 'all 0.3s ease';

            // Append elements
            exitDiv.appendChild(exitHeading);
            exitDiv.appendChild(restartButton);
            container.appendChild(exitDiv);

            // Add event listener to restart button
            restartButton.addEventListener('click', function () {
                // Remove the exit message
                exitDiv.remove();

                // Show all elements again
                elementsToHide.forEach(element => {
                    element.style.display = '';
                });

                // Reset to About section
                sections.forEach(section => section.classList.remove('active'));
                document.querySelectorAll('.menu-item').forEach(menuItem => menuItem.classList.remove('active'));

                document.getElementById('about').classList.add('active');
                document.querySelectorAll('.menu-item[data-section="about"]').forEach(item => {
                    item.classList.add('active');
                });

                // Update dropdown button text
                updateDropdownButtonText("About Me");

                // Reset terminal text and start blinking
                startBlinking("About Me");
                currentSection = "about";

                // Restart the matrix animation from scratch
                resetAndStartMatrixAnimation();
            });
        } else if (
            command === 'about' ||
            command === 'experience' || command === 'exp' ||
            command === 'education' || command === 'edu' ||
            command === 'projects' || command === 'proj' || 
            command === 'skills' ||
            command === 'contact'
        ) {
            // Map short forms to full section names
            let sectionName = command;
            if (command === 'exp') sectionName = 'experience';
            if (command === 'edu') sectionName = 'education';
            if (command === 'proj') sectionName = 'projects';

            // Get display name (capitalized)
            const displayName = sectionName.charAt(0).toUpperCase() + sectionName.slice(1);

            // Navigate to section
            navigateToSection(sectionName, displayName);
        } else {
            stopBlinking();
            terminalText.textContent = `Command not recognized. Type "menu" to see options.`;
            setTimeout(() => {
                // Resume blinking for the current section after showing the error message
                const currentElement = document.querySelector(`.menu-item[data-section="${currentSection}"]`);
                if (currentElement) {
                    startBlinking(currentElement.textContent);
                }
            }, 2000);
        }
    }

    // Handle terminal click to focus and start typing
    terminalText.parentElement.addEventListener('click', function () {
        // If typing animation is in progress, stop it
        if (typingInProgress) {
            typingInProgress = false;
            i = text.length; // Set i to end of text to prevent further typing animation
            userInput = ""; // Clear any user input
        }

        stopBlinking();
        terminalText.textContent = userInput || "_";
        document.activeElement.blur(); // Remove focus from any currently focused element
    });

    // Add a matrix-style background effect
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.05';  // Very subtle effect
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    // Matrix characters
    const characters = '01';
    const fontSize = 10;
    const columns = canvas.width / fontSize;
    let drops = [];

    // Initialize drops
    function initializeDrops() {
        drops = [];
        for (let i = 0; i < columns; i++) {
            // Start all drops at the top (position 1)
            drops[i] = 1;
        }
    }

    // Initial setup of drops
    initializeDrops();

    // Matrix rain drawing function
    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#00ff00';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = characters.charAt(Math.floor(Math.random() * characters.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }

            drops[i]++;
        }
    }

    // Function to start matrix animation
    function startMatrixAnimation() {
        if (!matrixAnimationInterval) {
            // First fill the canvas with black to clean any residual content
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            matrixAnimationInterval = setInterval(draw, 33);
            console.log("Matrix animation started");
        }
    }

    // Function to reset and start matrix animation from the beginning
    function resetAndStartMatrixAnimation() {
        // Stop any existing animation
        stopMatrixAnimation();

        // Fill canvas with black color
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Reset the drops array to start from the top
        initializeDrops();

        // Start animation
        matrixAnimationInterval = setInterval(draw, 33);
        console.log("Matrix animation reset and started");
    }

    // Function to stop matrix animation
    function stopMatrixAnimation() {
        if (matrixAnimationInterval) {
            clearInterval(matrixAnimationInterval);
            matrixAnimationInterval = null;
            console.log("Matrix animation stopped");
        }
    }

    // Start the animation initially
    startMatrixAnimation();

    // Handle window resize
    window.addEventListener('resize', function () {
        // Store the current animation state
        const wasRunning = !!matrixAnimationInterval;

        // Stop the animation if it's running
        stopMatrixAnimation();

        // Resize the canvas
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Reinitialize drops array for new dimensions
        initializeDrops();

        // If animation was running, restart it
        if (wasRunning) {
            startMatrixAnimation();
        } else {
            // Otherwise, keep the canvas black
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    });
});
