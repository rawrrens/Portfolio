// Theme Toggle Functionality
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const body = document.body;

// Get saved theme from memory (not localStorage since it's not supported)
let currentTheme = 'light';

// Theme management functions
function updateThemeToggle(theme) {
    themeIcon.textContent = theme === 'dark' ? 'DARK' : 'LIGHT';
}

function applyTheme(theme) {
    body.setAttribute('data-theme', theme);
    currentTheme = theme;
    updateThemeToggle(theme);
    
    // Add transition class temporarily
    body.classList.add('theme-transitioning');
    setTimeout(() => {
        body.classList.remove('theme-transitioning');
    }, 300);
}

// Initialize theme
applyTheme(currentTheme);

// Theme toggle event listener
themeToggle.addEventListener('click', () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    
    // Add a subtle scale effect to the button
    themeToggle.style.transform = 'scale(0.95)';
    setTimeout(() => {
        themeToggle.style.transform = 'scale(1)';
    }, 150);
});

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (navMenu.classList.contains('active')) {
        body.style.overflow = 'hidden';
    } else {
        body.style.overflow = 'auto';
    }
});

// Close mobile menu when clicking on nav links
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        body.style.overflow = 'auto';
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        body.style.overflow = 'auto';
    }
});

// Smooth scrolling for navigation links with offset
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const headerOffset = 80; // Account for fixed navbar
            const elementPosition = targetSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Active navigation highlighting
function updateActiveNav() {
    const sections = document.querySelectorAll('section');
    const scrollPos = window.scrollY + 100;
    
    let activeSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            activeSection = sectionId;
        }
    });
    
    // Remove active class from all links
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Add active class to current section link
    if (activeSection) {
        const activeLink = document.querySelector(`a[href="#${activeSection}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
}

// Enhanced navbar scroll effects
let lastScrollTop = 0;
let scrollTimeout;

function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add enhanced backdrop blur on scroll
    if (currentScroll > 50) {
        navbar.style.backdropFilter = 'blur(20px) saturate(180%)';
        navbar.style.boxShadow = '0 1px 20px rgba(0, 0, 0, 0.05)';
    } else {
        navbar.style.backdropFilter = 'blur(20px) saturate(180%)';
        navbar.style.boxShadow = 'none';
    }
    
    // Hide/show navbar on scroll
    if (currentScroll > lastScrollTop && currentScroll > 200) {
        // Scrolling down
        navbar.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
}

// Throttled scroll event listeners
window.addEventListener('scroll', () => {
    // Clear existing timeout
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    
    // Set a new timeout
    scrollTimeout = setTimeout(() => {
        updateActiveNav();
        handleNavbarScroll();
    }, 10);
});

// Enhanced intersection observer for skill cards animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const skillCardsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Stagger the animation
            setTimeout(() => {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            }, index * 100);
        }
    });
}, observerOptions);

// Observe all skill cards
document.addEventListener('DOMContentLoaded', () => {
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach(card => {
        skillCardsObserver.observe(card);
    });
});

// Enhanced button hover effects
function createMinimalParticle(element) {
    const particle = document.createElement('div');
    const rect = element.getBoundingClientRect();
    
    // Random position within button bounds
    const startX = rect.left + Math.random() * rect.width;
    const startY = rect.top + Math.random() * rect.height;
    
    particle.style.cssText = `
        position: fixed;
        width: 3px;
        height: 3px;
        background: rgba(255, 107, 157, 0.6);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        left: ${startX}px;
        top: ${startY}px;
        animation: floatUp 1.5s ease-out forwards;
        opacity: 0.8;
    `;
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
        if (particle.parentNode) {
            particle.remove();
        }
    }, 1500);
}

// Enhanced button interactions
document.querySelectorAll('.btn, .social-btn, .theme-btn').forEach(button => {
    let particleInterval;
    
    button.addEventListener('mouseenter', function() {
        // Create occasional particles while hovering
        particleInterval = setInterval(() => {
            if (Math.random() > 0.7) { // Only sometimes create particles
                createMinimalParticle(this);
            }
        }, 200);
    });
    
    button.addEventListener('mouseleave', function() {
        // Stop creating particles
        if (particleInterval) {
            clearInterval(particleInterval);
        }
    });
    
    // Click ripple effect
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.5s linear;
            pointer-events: none;
        `;
        
        // Ensure button has relative positioning
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.remove();
            }
        }, 500);
    });
});

// Professional typing effect for hero title
function typeWriter(element, text, speed = 80, callback) {
    let i = 0;
    element.innerHTML = '';
    element.style.borderRight = '2px solid rgba(255, 107, 157, 0.7)';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed + Math.random() * 40);
        } else {
            // Remove cursor after typing
            setTimeout(() => {
                element.style.borderRight = 'none';
                if (callback) callback();
            }, 800);
        }
    }
    type();
}

// Logo animation
function animateLogo() {
    const logoImg = document.querySelector('.logo-img');
    
    // Add rotation animation on load
    logoImg.style.transform = 'rotate(360deg) scale(1.1)';
    setTimeout(() => {
        logoImg.style.transform = 'rotate(0deg) scale(1)';
    }, 800);
    
    // Add click animation
    logoImg.addEventListener('click', () => {
        logoImg.style.transform = 'rotate(180deg) scale(0.9)';
        setTimeout(() => {
            logoImg.style.transform = 'rotate(0deg) scale(1)';
        }, 300);
    });
}

// Skill icons animation on hover
function initSkillIconAnimations() {
    const skillCards = document.querySelectorAll('.skill-card');
    
    skillCards.forEach(card => {
        const icon = card.querySelector('.skill-icon');
        
        card.addEventListener('mouseenter', () => {
            icon.style.animation = 'bounce 0.6s ease-in-out';
        });
        
        card.addEventListener('mouseleave', () => {
            icon.style.animation = '';
        });
    });
}

// Add bounce animation keyframe via JavaScript
function addBounceAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes bounce {
            0%, 20%, 53%, 80%, 100% {
                animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
                transform: translate3d(0,0,0);
            }
            40%, 43% {
                animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
                transform: translate3d(0, -8px, 0);
            }
            70% {
                animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
                transform: translate3d(0, -4px, 0);
            }
            90% {
                transform: translate3d(0,-2px,0);
            }
        }
    `;
    document.head.appendChild(style);
}

// Avatar Image Upload Functionality
function initAvatarUpload() {
    const avatarImg = document.getElementById('avatar-placeholder');
    
    if (avatarImg) {
        // Create file input for avatar upload
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);
        
        // Add click handler to avatar
        avatarImg.addEventListener('click', () => {
            if (avatarImg.src.includes('placeholder')) {
                fileInput.click();
            }
        });
        
        // Handle file selection
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    avatarImg.src = e.target.result;
                    avatarImg.removeAttribute('id');
                };
                reader.readAsDataURL(file);
            }
        });
        
        // Add animation to avatar
        avatarImg.addEventListener('mouseenter', () => {
            avatarImg.style.transform = 'scale(1.05) rotate(2deg)';
        });
        
        avatarImg.addEventListener('mouseleave', () => {
            avatarImg.style.transform = 'scale(1) rotate(0deg)';
        });
    }
}

// Enhanced hero animations with new layout
function initHeroAnimations() {
    const heroTitle = document.querySelector('.hero-title');
    const heroBrand = document.querySelector('.hero-brand');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroDescription = document.querySelector('.hero-description');
    const heroButtons = document.querySelector('.hero-buttons');
    const heroAvatar = document.querySelector('.avatar-img');
    
    if (heroTitle) {
        // Animate avatar first
        if (heroAvatar) {
            heroAvatar.style.opacity = '0';
            heroAvatar.style.transform = 'scale(0.8)';
            setTimeout(() => {
                heroAvatar.style.transition = 'all 0.8s ease';
                heroAvatar.style.opacity = '1';
                heroAvatar.style.transform = 'scale(1)';
            }, 200);
        }
        
        // Then animate text content
        const originalText = heroTitle.textContent;
        
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 80, () => {
                // Fade in brand
                if (heroBrand) {
                    heroBrand.style.animation = 'fadeInUp 0.6s ease forwards';
                }
                
                // Fade in subtitle
                setTimeout(() => {
                    if (heroSubtitle) {
                        heroSubtitle.style.animation = 'fadeInUp 0.6s ease forwards';
                    }
                }, 200);
                
                // Fade in description
                setTimeout(() => {
                    if (heroDescription) {
                        heroDescription.style.animation = 'fadeInUp 0.6s ease forwards';
                    }
                }, 400);
                
                // Fade in buttons
                setTimeout(() => {
                    if (heroButtons) {
                        heroButtons.style.animation = 'fadeInUp 0.6s ease forwards';
                    }
                }, 600);
            });
        }, 800);
    }
}

// Subtle parallax effect for hero background
function updateParallax() {
    const scrolled = window.pageYOffset;
    const heroImages = document.querySelector('.hero-bg-images');
    
    if (heroImages && scrolled < window.innerHeight) {
        const rate = scrolled * -0.3;
        heroImages.style.transform = `translateY(${rate}px)`;
    }
}

// Add parallax to scroll event
window.addEventListener('scroll', () => {
    requestAnimationFrame(updateParallax);
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu on escape
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        body.style.overflow = 'auto';
    }
});

// Resize handler for mobile menu
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        body.style.overflow = 'auto';
    }
});

// Performance optimization: debounce scroll events
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

// Apply debouncing to scroll-heavy functions
const debouncedUpdateActiveNav = debounce(updateActiveNav, 10);
const debouncedHandleNavbarScroll = debounce(handleNavbarScroll, 10);

// Replace the existing scroll event listener with optimized version
window.addEventListener('scroll', () => {
    debouncedUpdateActiveNav();
    debouncedHandleNavbarScroll();
    requestAnimationFrame(updateParallax);
});

// Add loading animation
window.addEventListener('load', () => {
    // Remove any loading screens or add entrance animations
    document.body.classList.add('loaded');
    
    // Trigger initial subtle animations
    const elementsToAnimate = document.querySelectorAll('.hero-content > *');
    elementsToAnimate.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '0';
            el.style.animation = `fadeInUp 0.6s ease forwards ${index * 0.1}s`;
        }, 100);
    });
});

// Professional console message
console.log('Lawrence C. Timkang Portfolio - Loaded Successfully');
console.log('Built with modern web technologies and professional design principles');