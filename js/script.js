document.addEventListener('DOMContentLoaded', () => {
    
    // ============================================
    // 0. THEME TOGGLE (Dark/Light Mode)
    // ============================================
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'light' || (!savedTheme && !systemPrefersDark)) {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
    }
    
    themeToggle?.addEventListener('click', () => {
        body.classList.toggle('light-theme');
        body.classList.toggle('dark-theme');
        
        const isLight = body.classList.contains('light-theme');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        
        // Reinitialize icons after theme change
        if (window.lucide) lucide.createIcons();
    });

    // ============================================
    // 1. CUSTOM CURSOR GLOW EFFECT
    // ============================================
    const cursorGlow = document.getElementById('cursorGlow');
    if (cursorGlow) {
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        // Smooth cursor follow
        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;
            cursorGlow.style.left = cursorX + 'px';
            cursorGlow.style.top = cursorY + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();
        
        // Hide on mobile
        if ('ontouchstart' in window) {
            cursorGlow.style.display = 'none';
        }
    }

    // ============================================
    // 1.5. 3D TILT EFFECT ON CARDS
    // ============================================
    const cards3D = document.querySelectorAll('.bento-card, .use-case-card, .stat-card');
    
    cards3D.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // ============================================
    // 1.6. PARALLAX EFFECT ON SCROLL
    // ============================================
    const parallaxElements = document.querySelectorAll('.phone-mockup, .hero-text');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        parallaxElements.forEach((el, index) => {
            const speed = index === 0 ? 0.3 : 0.1;
            el.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });

    // ============================================
    // 2. SCROLL PROGRESS BAR
    // ============================================
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            scrollProgress.style.width = progress + '%';
        });
    }

    // ============================================
    // 3. MOBILE MENU TOGGLE
    // ============================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-content a');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
            mobileMenuBtn.classList.add('active');
        });

        mobileMenuClose?.addEventListener('click', closeMobileMenu);
        
        // Close on link click
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
        
        // Close on overlay click
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) closeMobileMenu();
        });
    }

    function closeMobileMenu() {
        mobileMenu?.classList.remove('active');
        document.body.style.overflow = '';
        mobileMenuBtn?.classList.remove('active');
    }

    // ============================================
    // 4. PARTICLE CANVAS ANIMATION
    // ============================================
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 50;
        
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        class Particle {
            constructor() {
                this.reset();
            }
            
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.2;
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(34, 211, 238, ${this.opacity})`;
                ctx.fill();
            }
        }
        
        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
        
        // Draw connections
        function connectParticles() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 150) {
                        const opacity = (1 - distance / 150) * 0.2;
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(34, 211, 238, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }
        
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            connectParticles();
            requestAnimationFrame(animateParticles);
        }
        
        animateParticles();
    }

    // ============================================
    // 5. ANIMATED COUNTERS
    // ============================================
    const statNumbers = document.querySelectorAll('.stat-number');
    
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const suffix = element.getAttribute('data-suffix') || '';
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString('es-CO') + suffix;
        }, 16);
    }
    
    // Observe stats section
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    statNumbers.forEach(num => animateCounter(num));
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        statsObserver.observe(statsSection);
    }

    // ============================================
    // 6. FAQ ACCORDION
    // ============================================
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question?.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all others
            faqItems.forEach(faq => faq.classList.remove('active'));
            
            // Toggle current
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // ============================================
    // 7. CHAT DEMO SIMULATION (Enhanced)
    // ============================================
    const chatDemo = document.getElementById('chat-demo');
    const scenarios = [
        {
            user: "¿Cuál fue la eficiencia de Natalia ayer?",
            bot: [
                "Analizando registros de Producción.xlsx... 📂",
                "<strong>Reporte para Natalia G:</strong><br>• Eficiencia: <span class='text-green'>102%</span><br>• Piezas: 450<br>• Incentivo: $12.500 COP"
            ]
        },
        {
            user: "Calcular nómina Lote 405",
            bot: [
                "Procesando SAM vs Tiempos Reales... ⏳",
                "<strong>Lote 405 Completado:</strong><br>• Total a pagar: $850.000 COP<br>• Ahorro detectado: 15% vs mes anterior."
            ]
        },
        {
            user: "¿Quién tuvo mejor desempeño esta semana?",
            bot: [
                "Consultando métricas semanales... 📊",
                "<strong>Top 3 Operarias:</strong><br>1. 🥇 María L. - 108%<br>2. 🥈 Carmen P. - 105%<br>3. 🥉 Ana R. - 103%"
            ]
        }
    ];

    let currentScenario = 0;

    function createBubble(text, type) {
        const bubble = document.createElement('div');
        bubble.className = `bubble ${type}`;
        bubble.innerHTML = text;
        return bubble;
    }

    async function runChatSimulation() {
        if (!chatDemo) return;
        
        const scenario = scenarios[currentScenario];
        chatDemo.innerHTML = '';

        await delay(1000);
        
        // User message with typing effect
        const userBubble = createBubble(scenario.user, 'user');
        userBubble.style.opacity = '0';
        userBubble.style.transform = 'translateY(10px)';
        chatDemo.appendChild(userBubble);
        
        requestAnimationFrame(() => {
            userBubble.style.transition = 'all 0.3s ease';
            userBubble.style.opacity = '1';
            userBubble.style.transform = 'translateY(0)';
        });
        scrollToBottom();

        await delay(1500);
        
        // Typing indicator
        const typingIndicator = createBubble('<span class="typing-dots"><span></span><span></span><span></span></span>', 'bot');
        chatDemo.appendChild(typingIndicator);
        scrollToBottom();

        await delay(1500);
        typingIndicator.remove();
        
        // Bot response 1
        const botBubble1 = createBubble(scenario.bot[0], 'bot');
        botBubble1.style.opacity = '0';
        chatDemo.appendChild(botBubble1);
        requestAnimationFrame(() => {
            botBubble1.style.transition = 'opacity 0.3s ease';
            botBubble1.style.opacity = '1';
        });
        scrollToBottom();

        await delay(1200);
        
        // Bot response 2 with chart
        const resultBubble = createBubble(scenario.bot[1], 'bot');
        resultBubble.style.opacity = '0';
        
        const chartDiv = document.createElement('div');
        chartDiv.className = 'chat-chart';
        for(let i = 0; i < 10; i++) {
            const bar = document.createElement('div');
            bar.className = 'bar';
            bar.style.height = Math.floor(Math.random() * 80 + 20) + '%';
            bar.style.animationDelay = (i * 0.1) + 's';
            chartDiv.appendChild(bar);
        }
        resultBubble.appendChild(chartDiv);
        
        chatDemo.appendChild(resultBubble);
        requestAnimationFrame(() => {
            resultBubble.style.transition = 'opacity 0.3s ease';
            resultBubble.style.opacity = '1';
        });
        scrollToBottom();

        currentScenario = (currentScenario + 1) % scenarios.length;
        setTimeout(runChatSimulation, 6000);
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function scrollToBottom() {
        if (chatDemo) {
            chatDemo.scrollTop = chatDemo.scrollHeight;
        }
    }

    runChatSimulation();

    // ============================================
    // 8. SCROLL REVEAL ANIMATIONS
    // ============================================
    const revealElements = document.querySelectorAll('.step, .bento-card, .roi-box, .comparison-grid > div, .use-case-card, .stat-card, .reveal-on-scroll');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });
    
    revealElements.forEach((el, index) => {
        el.style.transitionDelay = (index % 4) * 0.1 + 's';
        revealObserver.observe(el);
    });

    // ============================================
    // 9. MODAL LOGIC (Enhanced)
    // ============================================
    const modal = document.getElementById('lead-modal');
    const modalTriggers = document.querySelectorAll('.trigger-modal');
    const closeBtn = document.querySelector('.close-modal');

    modalTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });

    closeBtn?.addEventListener('click', closeModal);

    modal?.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    function openModal() {
        modal?.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus first input
        setTimeout(() => {
            modal?.querySelector('input')?.focus();
        }, 300);
    }

    function closeModal() {
        modal?.classList.remove('active');
        document.body.style.overflow = '';
    }

    // ============================================
    // 10. FORM HANDLING (Enhanced)
    // ============================================
    const form = document.getElementById('lead-form');
    
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = form.querySelector('button[type="submit"]');
        const originalHTML = btn.innerHTML;
        
        // Loading state
        btn.innerHTML = '<span class="spinner"></span> Enviando...';
        btn.disabled = true;
        btn.style.opacity = '0.7';

        // Simulate API call
        await delay(2000);
        
        // Success state
        btn.innerHTML = '<i data-lucide="check-circle"></i> ¡Enviado!';
        btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        
        if (window.lucide) lucide.createIcons();
        
        await delay(1500);
        
        // Show success message
        showNotification('¡Solicitud recibida! Te contactaremos por WhatsApp en breve.', 'success');
        
        closeModal();
        form.reset();
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.style.background = '';
        
        if (window.lucide) lucide.createIcons();
    });

    // ============================================
    // 11. NOTIFICATION SYSTEM
    // ============================================
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i data-lucide="${type === 'success' ? 'check-circle' : 'info'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        if (window.lucide) lucide.createIcons();
        
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    // ============================================
    // 12. NAVBAR SCROLL BEHAVIOR
    // ============================================
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        if (currentScroll > 100) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
        
        // Hide/show on scroll direction
        if (currentScroll > lastScroll && currentScroll > 300) {
            navbar?.classList.add('hidden');
        } else {
            navbar?.classList.remove('hidden');
        }
        
        lastScroll = currentScroll;
    });

    // ============================================
    // 13. SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const navHeight = navbar?.offsetHeight || 80;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // 14. SCROLL TO TOP BUTTON
    // ============================================
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopBtn?.classList.add('visible');
        } else {
            scrollTopBtn?.classList.remove('visible');
        }
    });
    
    scrollTopBtn?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ============================================
    // 15. KEYBOARD ACCESSIBILITY
    // ============================================
    document.addEventListener('keydown', (e) => {
        // Escape closes modals/menus
        if (e.key === 'Escape') {
            closeModal();
            closeMobileMenu();
        }
    });

    // ============================================
    // 16. INITIALIZE LUCIDE ICONS
    // ============================================
    if (window.lucide) {
        lucide.createIcons();
    }

    // ============================================
    // 17. PRELOADER (Optional - if HTML has preloader)
    // ============================================
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.classList.add('hidden');
            setTimeout(() => preloader.remove(), 500);
        });
    }

    console.log('🚀 ProdAI Supervisor - Landing Page Initialized');
});
