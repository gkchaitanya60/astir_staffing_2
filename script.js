// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (href && href !== '#') {
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Mobile navbar collapse on link click
document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    link.addEventListener('click', function() {
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        
        if (window.getComputedStyle(navbarToggler).display !== 'none') {
            navbarCollapse.classList.remove('show');
        }
    });
});

// Video error handling and optimization
document.addEventListener('DOMContentLoaded', function() {
    const video = document.querySelector('.bg-video');
    if (video) {
        // Handle video loading errors
        video.addEventListener('error', function() {
            console.log('Video failed to load, using fallback background');
            const heroSection = document.querySelector('.hero-section');
            heroSection.style.background = 'linear-gradient(135deg, #1e293b 0%, #10b981 100%)';
        });
        
        // Ensure video plays on mobile devices
        video.addEventListener('loadeddata', function() {
            video.play().catch(function(error) {
                console.log('Video autoplay failed:', error);
            });
        });
        
        // Optimize video loading
        video.addEventListener('loadstart', function() {
            console.log('Video loading started');
        });
        
        video.addEventListener('canplay', function() {
            console.log('Video can start playing');
        });
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Initialize fade-in animations
document.addEventListener('DOMContentLoaded', function() {
    const fadeElements = document.querySelectorAll('.industry-block, .recruitment-block, .blog-post, .award-item');
    fadeElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

// Enhanced button hover effects
document.querySelectorAll('.btn-primary-custom, .btn-outline-custom, .btn-light-custom').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Hamburger menu animation
document.querySelector('.navbar-toggler').addEventListener('click', function() {
    const lines = this.querySelectorAll('.menu-icon span');
    const isCollapsed = this.classList.contains('collapsed');
    
    lines.forEach((line, index) => {
        if (!isCollapsed) {
            line.style.transform = index === 0 ? 'rotate(45deg) translate(5px, 5px)' :
                index === 1 ? 'opacity(0)' :
                'rotate(-45deg) translate(7px, -6px)';
        } else {
            line.style.transform = 'none';
            line.style.opacity = '1';
        }
    });
});

// Form validation helper (for future contact forms)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('is-invalid');
        } else if (input.type === 'email' && !validateEmail(input.value)) {
            isValid = false;
            input.classList.add('is-invalid');
        } else {
            input.classList.remove('is-invalid');
        }
    });
    
    return isValid;
}

// Contact Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                // Show success message (you can integrate with your backend here)
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<i class="fas fa-check me-2"></i>Message Sent!';
                submitBtn.disabled = true;
                submitBtn.style.background = 'var(--success-color)';
                
                // Reset form after 3 seconds
                setTimeout(() => {
                    this.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                }, 3000);
            }
        });
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.hasAttribute('required') && !this.value.trim()) {
                    this.classList.add('is-invalid');
                } else if (this.type === 'email' && this.value && !validateEmail(this.value)) {
                    this.classList.add('is-invalid');
                } else {
                    this.classList.remove('is-invalid');
                }
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    if (this.value.trim() && (this.type !== 'email' || validateEmail(this.value))) {
                        this.classList.remove('is-invalid');
                    }
                }
            });
        });
    }
});

// Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Navbar scroll effect
const debouncedScrollHandler = debounce(function() {
    const navbar = document.querySelector('.light-nav');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link:not(.cta-btn)');
    const menuIcon = document.querySelectorAll('.menu-icon span');
    
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
        // Change text color to dark when scrolled
        navLinks.forEach(link => {
            link.style.color = 'var(--text-primary)';
        });
        menuIcon.forEach(span => {
            span.style.background = 'var(--text-primary)';
        });
    } else {
        navbar.classList.remove('scrolled');
        // Change text color to white when at top
        navLinks.forEach(link => {
            link.style.color = 'var(--white)';
        });
        menuIcon.forEach(span => {
            span.style.background = 'var(--white)';
        });
    }
}, 10);

// Parallax effect for background images
const debouncedParallaxHandler = debounce(function() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.section-background img');
    
    parallaxElements.forEach(element => {
        const speed = scrolled * 0.2;
        element.style.transform = `translateY(${speed}px)`;
    });
}, 16);

window.addEventListener('scroll', debouncedScrollHandler);
window.addEventListener('scroll', debouncedParallaxHandler);

// Preload critical images
document.addEventListener('DOMContentLoaded', function() {
    const criticalImages = [
        'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
        'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&dpr=1'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
});

// Add loading states for better UX
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Handle reduced motion preferences
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.scrollBehavior = 'auto';
    
    // Disable animations for users who prefer reduced motion
    const style = document.createElement('style');
    style.textContent = `
        *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    `;
    document.head.appendChild(style);
}

// Enhanced image loading with error handling
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            console.log('Image failed to load:', this.src);
            // You could add a placeholder image here if needed
        });
    });
});

// Smooth reveal animations for sections
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(section);
    });
});