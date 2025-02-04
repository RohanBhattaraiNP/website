// Physics Constants and Equations for Background
const PHYSICS_EQUATIONS = [
    "\\( F = ma \\)", // Starting with simpler equations
    "\\( E = mc^2 \\)",
    "\\( PV = nRT \\)",
    "\\( E = h\\nu \\)",
    "\\( c = \\lambda f \\)",
    "\\( F = G\\frac{m_1m_2}{r^2} \\)",
    "\\( E = \\frac{1}{2}mv^2 \\)",
    "\\( p = \\frac{h}{\\lambda} \\)",
    "\\( \\Delta S \\geq 0 \\)",
    "\\( F = -kx \\)"
];

// Create floating equations background
class EquationParticle {
    constructor(delay = 0) {
        this.equation = PHYSICS_EQUATIONS[Math.floor(Math.random() * PHYSICS_EQUATIONS.length)];
        this.x = Math.random() * window.innerWidth;
        this.y = window.innerHeight + 100;
        this.speed = 0.3 + Math.random() * 0.3; // Slower speed
        this.angle = (Math.random() * Math.PI / 6) - Math.PI / 12; // Smaller angle range
        this.size = 14 + Math.random() * 6;
        this.element = document.createElement('div');
        this.element.className = 'equation';
        this.element.style.position = 'fixed';
        this.element.innerHTML = this.equation;

        // Set initial position
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';

        // Add delay to animation
        this.element.style.animationDelay = `${delay}s`;

        document.querySelector('.equation-background').appendChild(this.element);

        // Render equation with MathJax
        if (window.MathJax) {
            MathJax.typesetPromise([this.element]).catch((err) => console.log(err));
        }
    }

    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y -= this.speed;

        if (this.y < -100) {
            this.y = window.innerHeight + 100;
            this.x = Math.random() * window.innerWidth;
        }

        this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
    }
}

// Wait for both DOM and MathJax to be ready
document.addEventListener('DOMContentLoaded', () => {
    // Create background container if it doesn't exist
    if (!document.querySelector('.equation-background')) {
        const background = document.createElement('div');
        background.className = 'equation-background';
        document.body.appendChild(background);
    }

    // Wait for MathJax to be ready
    function initEquations() {
        if (window.MathJax && window.MathJax.typesetPromise) {
            const numEquations = 10; // Reduced number
            const equations = [];

            // Create equations with staggered delays
            for (let i = 0; i < numEquations; i++) {
                const delay = i * 2; // 2-second delay between each
                equations.push(new EquationParticle(delay));
            }

            // Animation loop
            function animate() {
                equations.forEach(eq => eq.update());
                requestAnimationFrame(animate);
            }
            animate();
        } else {
            // If MathJax isn't ready yet, wait a bit and try again
            setTimeout(initEquations, 1000);
        }
    }

    initEquations();
});

// Quantum Field Visualization
class QuantumField {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.zIndex = '-2';
        this.canvas.style.opacity = '0.3';
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.points = [];
        this.time = 0;
        this.createPoints();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createPoints() {
        const density = 50;
        const spacing = Math.min(this.canvas.width, this.canvas.height) / density;

        for (let x = 0; x < this.canvas.width; x += spacing) {
            for (let y = 0; y < this.canvas.height; y += spacing) {
                this.points.push({ x, y, baseX: x, baseY: y });
            }
        }
    }

    update() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.time += 0.01;

        this.points.forEach(point => {
            // Quantum wave function simulation
            const angle = this.time + (point.baseX + point.baseY) * 0.01;
            point.x = point.baseX + Math.sin(angle) * 15;
            point.y = point.baseY + Math.cos(angle) * 15;

            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, 1, 0, Math.PI * 2);
            this.ctx.fillStyle = '#00f3ff';
            this.ctx.fill();
        });
    }
}

// Interactive Particles System
class ParticleSystem {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.opacity = '0.5';
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.createParticles();
        this.bindEvents();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        for (let i = 0; i < 100; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 3 + 1
            });
        }
    }

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    update() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            // Apply forces
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 200) {
                const force = (200 - dist) * 0.02;
                particle.vx -= (dx / dist) * force;
                particle.vy -= (dy / dist) * force;
            }

            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Boundary checking
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -0.9;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -0.9;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = '#9d00ff';
            this.ctx.fill();

            // Draw connections
            this.particles.forEach(other => {
                const dx = other.x - particle.x;
                const dy = other.y - particle.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.strokeStyle = `rgba(157, 0, 255, ${0.2 * (1 - dist / 100)})`;
                    this.ctx.stroke();
                }
            });
        });
    }
}

// Initialize all systems
document.addEventListener('DOMContentLoaded', () => {
    const numEquations = 15; // Reduced number of equations
    const equations = [];

    // Create equations with staggered delays
    for (let i = 0; i < numEquations; i++) {
        const delay = (i * 2); // 2-second delay between each equation
        equations.push(new EquationParticle(delay));
    }

    const quantumField = new QuantumField();
    const particleSystem = new ParticleSystem();

    // Animation loop
    function animate() {
        equations.forEach(eq => eq.update());
        quantumField.update();
        particleSystem.update();
        requestAnimationFrame(animate);
    }
    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        quantumField.resize();
        particleSystem.resize();
    });
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Scroll Animation for Project Cards
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.transform = 'translateY(0)';
            entry.target.style.opacity = '1';
        }
    });
}, observerOptions);

document.querySelectorAll('.project-card, .blog-card').forEach(card => {
    card.style.transform = 'translateY(50px)';
    card.style.opacity = '0';
    card.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(card);
});

// Matrix Rain Effect
class MatrixRain {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.zIndex = '-3';
        this.canvas.style.opacity = '0.1';
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%";
        this.drops = [];
        this.createDrops();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createDrops() {
        const columns = this.canvas.width / 20;
        for (let i = 0; i < columns; i++) {
            this.drops[i] = Math.random() * -100;
        }
    }

    update() {
        this.ctx.fillStyle = 'rgba(10, 11, 15, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#00f3ff';
        this.ctx.font = '15px monospace';

        for (let i = 0; i < this.drops.length; i++) {
            const text = this.characters[Math.floor(Math.random() * this.characters.length)];
            this.ctx.fillText(text, i * 20, this.drops[i] * 20);

            if (this.drops[i] * 20 > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }
    }
}

// Initialize Matrix Rain
const matrixRain = new MatrixRain();
function animateMatrix() {
    matrixRain.update();
    requestAnimationFrame(animateMatrix);
}
animateMatrix();

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function () {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Contact Form Handling
document.querySelector('.contact-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const message = this.querySelector('textarea').value;

    // Create email content
    const mailtoLink = `mailto:karneltimes@gmail.com?subject=Contact Form Submission from ${name}&body=Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${message}`;

    // Open default email client
    window.location.href = mailtoLink;

    // Reset form
    this.reset();
});

// Particle Effect
particlesJS('particles-js', {
    particles: {
        number: {
            value: 80,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: '#1a80e2'
        },
        shape: {
            type: 'circle'
        },
        opacity: {
            value: 0.5,
            random: false
        },
        size: {
            value: 3,
            random: true
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#1a80e2',
            opacity: 0.2,
            width: 1
        },
        move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: true,
                mode: 'grab'
            },
            onclick: {
                enable: true,
                mode: 'push'
            },
            resize: true
        }
    },
    retina_detect: true
});