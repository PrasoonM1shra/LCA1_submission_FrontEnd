// ===== DOCUMENT READY =====
document.addEventListener('DOMContentLoaded', function() {
    // Add CSS animations first
    addKeyframes();
    
    // Initialize all functionality
    setupMobileMenu();
    setupDarkMode();
    setupLightbox();
    setupSmoothScrolling();
    setupAnimations();
    setupPdfViewer();
    sortSkillTags();
});

// ===== MOBILE MENU =====
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (!hamburger || !navLinks) return;
    
    const toggleMenu = () => {
        const isActive = navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
        document.body.style.overflow = isActive ? 'hidden' : 'auto';
    };
    
    hamburger.addEventListener('click', toggleMenu);
    
    // Close menu when clicking links (mobile)
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
}

// ===== DARK MODE TOGGLE =====
function setupDarkMode() {
    const toggle = document.getElementById('darkModeToggle');
    if (!toggle) return;
    
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check saved preference or system preference
    const currentMode = localStorage.getItem('darkMode');
    if (currentMode === 'true' || (currentMode === null && prefersDark.matches)) {
        document.body.classList.add('dark-mode');
    }
    
    // Toggle handler
    toggle.addEventListener('click', () => {
        const isDark = !document.body.classList.contains('dark-mode');
        document.body.classList.toggle('dark-mode', isDark);
        localStorage.setItem('darkMode', isDark);
        
        // Force reflow for smooth transitions
        void document.body.offsetHeight;
    });
    
    // Watch for system preference changes
    prefersDark.addEventListener('change', e => {
        if (localStorage.getItem('darkMode') === null) {
            document.body.classList.toggle('dark-mode', e.matches);
        }
    });
    
    // Pulse animation for first-time visitors
    if (!localStorage.getItem('darkMode')) {
        toggle.style.animation = 'pulse 2s 2';
    }
}

// ===== LIGHTBOX =====
function setupLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.querySelector('.lightbox-content img');
    const caption = document.querySelector('.caption');
    
    if (!lightbox) return;
    
    // Open lightbox when clicking project images
    document.querySelectorAll('.case-card img').forEach(img => {
        img.addEventListener('click', function() {
            lightbox.style.display = 'block';
            if (lightboxImg) lightboxImg.src = this.src;
            if (caption) caption.textContent = this.alt;
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close lightbox
    const closeLightbox = () => {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    };
    
    document.querySelector('.lightbox .close')?.addEventListener('click', closeLightbox);
    
    // Close when clicking outside image
    lightbox.addEventListener('click', function(e) {
        if (e.target === this) closeLightbox();
    });
    
    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.style.display === 'block') {
            closeLightbox();
        }
    });
}

// ===== PDF VIEWER =====
function setupPdfViewer() {
    const modal = document.getElementById('pdf-modal');
    if (!modal) return;
    
    window.openPdfViewer = function(pdfPath) {
        const viewer = document.getElementById('pdf-viewer');
        if (!viewer) return;
        
        viewer.src = encodeURI(pdfPath) + '#toolbar=0&navpanes=0&scrollbar=1';
        modal.style.display = "block";
        document.body.style.overflow = "hidden";
    };
    
    window.closePdfViewer = function() {
        modal.style.display = "none";
        const viewer = document.getElementById('pdf-viewer');
        if (viewer) viewer.src = "";
        document.body.style.overflow = "auto";
    };
    
    // Close when clicking outside content
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closePdfViewer();
        }
    });
}

// ===== SMOOTH SCROLLING =====
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '#!') return;
            
            e.preventDefault();
            const target = document.querySelector(targetId);
            if (target) {
                const headerHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    location.hash = targetId;
                }
            }
        });
    });
}

// ===== ANIMATIONS =====
function setupAnimations() {
    const animateElements = () => {
        const elements = document.querySelectorAll('.service-card, .case-card, .point-card');
        const screenPosition = window.innerHeight / 1.2;
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial state
    document.querySelectorAll('.service-card, .case-card, .point-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Run on load and scroll
    window.addEventListener('load', animateElements);
    window.addEventListener('scroll', animateElements);
}

// ===== SKILL TAGS SORTING =====
function sortSkillTags() {
    document.querySelectorAll('.skills-container').forEach(container => {
        const tags = Array.from(container.children);
        tags.sort((a, b) => a.textContent.length - b.textContent.length);
        container.innerHTML = ''; // Clear container
        tags.forEach(tag => container.appendChild(tag));
    });
}

// ===== HELPER: ADD CSS ANIMATION =====
function addKeyframes() {
    if (document.querySelector('style[data-keyframes="pulse"]')) return;
    
    const style = document.createElement('style');
    style.setAttribute('data-keyframes', 'pulse');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
}
// Form Submission Handling
document.querySelector('.collaboration-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = e.target.querySelector('textarea').value;
    
    // Replace with actual backend integration (e.g., Formspree, EmailJS, or fetch API)
    console.log('Message sent:', message); 
    alert("Thanks for your message! I'll get back to you soon.");
    
    e.target.reset(); // Clear the form
  });