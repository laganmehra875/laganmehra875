/**
 * Lalit Mehra | Pro Data Scientist Portfolio - Main JS
 * Features: Permanent Global Navbar, 2-Stage Preloader, GSAP Orchestration
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Cinematic Rocket Preloader Orchestration
    const rocketAudio = new Audio('rocket.wav');
    rocketAudio.volume = 0.6;

    // Start paused to await user interaction (fixes audio autoplay policy)
    const tlLoader = gsap.timeline({ paused: true });
    document.body.style.overflow = 'hidden';

    const launchBtn = document.getElementById('launch-btn');
    if (launchBtn) {
        launchBtn.addEventListener('click', () => {
            rocketAudio.play().catch(e => console.log("Audio still blocked", e));
            launchBtn.style.display = 'none';
            tlLoader.play();
        });
    }

    const percentEl = document.querySelector('.percent');
    const statusEl = document.getElementById('loader-status');
    const asteroidField = document.querySelector('.asteroid-field');
    const rock = document.querySelector('.rocket');
    const preloader = document.getElementById('preloader');

    let loadData = { val: 0 };
    let hasReachedSpace = false;
    let hasReachedJupiter = false;

    tlLoader.to(loadData, {
        val: 100,
        duration: 4.5, // increased duration to allow enjoying the flight
        ease: "none",
        onUpdate: () => {
            const currentVal = Math.floor(loadData.val);
            if (percentEl) percentEl.textContent = currentVal;

            if (currentVal >= 30 && !hasReachedSpace) {
                hasReachedSpace = true;
                preloader.classList.add('deep-space');
                if (statusEl) statusEl.textContent = "Entering Deep Space...";
                rock.classList.add('shaking');
                gsap.to(".earth", { y: 1200, scale: 0.4, opacity: 0, duration: 4, ease: "power2.in" });
                gsap.to(".sky-background", { opacity: 1, backgroundColor: "#000", duration: 3 });

                // Show floating lonely astronaut
                gsap.to(".lonely-astronaut", {
                    opacity: 1,
                    x: -200,
                    y: -100,
                    rotation: -45,
                    duration: 10,
                    ease: "sine.inOut",
                    yoyo: true,
                    repeat: -1
                });
            }

            if (currentVal >= 80 && !hasReachedJupiter) {
                hasReachedJupiter = true;
                if (statusEl) statusEl.textContent = "Landing on Jupiter...";

                // Show Jupiter
                gsap.to(".jupiter", { y: -450, opacity: 1, duration: 2.5, ease: "power2.out" });

                // Stop shaking and target center
                rock.classList.remove('shaking');
                gsap.to(rock, { x: 0, rotation: 0, scale: 0.5, y: -50, duration: 1.5, ease: "power2.inOut" });
            }

            if (currentVal > 30 && currentVal < 80) {
                if (currentVal % 2 === 0) spawnAsteroid();

                // Smooth sinusoidal flight (left and right)
                const driftX = Math.sin(currentVal * 0.25) * 120;
                gsap.to(rock, {
                    x: driftX,
                    rotation: driftX * 0.1,
                    duration: 0.5,
                    ease: "sine.inOut"
                });

                // Parallax Space Drift
                gsap.to([".stars-layer-1", ".stars-layer-2", ".asteroid-field"], {
                    x: -driftX * 0.2,
                    duration: 0.8,
                    ease: "sine.out"
                });
            }

            if (currentVal === 95) {
                if (statusEl) statusEl.textContent = "Touchdown Successful";
                gsap.to(".exhaust-flame", { opacity: 0, duration: 0.5 }); // turn off engine
            }
        },
        onComplete: () => {
            gsap.to("#preloader", {
                opacity: 0,
                duration: 0.8,
                delay: 0.2,
                ease: "power2.inOut",
                onComplete: () => {
                    if (preloader) preloader.style.display = 'none';
                    document.body.style.overflow = 'auto';
                    startMainAnimations();
                }
            });
        }
    });

    // Persistent Flame Animation
    gsap.to(".exhaust-flame", {
        height: 180,
        opacity: 1,
        duration: 0.1,
        repeat: -1,
        yoyo: true,
        ease: "none"
    });

    function spawnAsteroid() {
        if (!asteroidField) return;
        const ast = document.createElement('div');
        const startX = Math.random() * window.innerWidth;
        ast.style.left = startX + 'px';
        ast.style.top = '-100px';

        ast.className = 'asteroid';
        const size = 15 + Math.random() * 70;
        ast.style.width = size + 'px';
        ast.style.height = size + 'px';

        asteroidField.appendChild(ast);

        gsap.to(ast, {
            y: window.innerHeight + 200,
            x: startX + (Math.random() - 0.5) * 800,
            rotation: Math.random() * 1080,
            duration: 0.7 + Math.random() * 1.5,
            ease: "none",
            onComplete: () => ast.remove()
        });
    }

    const cursorDot = document.querySelector(".cursor-dot");
    const cursorOutline = document.querySelector(".cursor-outline");

    if (cursorDot && cursorOutline) {
        gsap.set(cursorDot, { xPercent: -50, yPercent: -50 });
        gsap.set(cursorOutline, { xPercent: -50, yPercent: -50 });
        
        const dotX = gsap.quickTo(cursorDot, "x", { duration: 0.1, ease: "power2.out" });
        const dotY = gsap.quickTo(cursorDot, "y", { duration: 0.1, ease: "power2.out" });
        const outX = gsap.quickTo(cursorOutline, "x", { duration: 0.5, ease: "power2.out" });
        const outY = gsap.quickTo(cursorOutline, "y", { duration: 0.5, ease: "power2.out" });

        window.addEventListener("mousemove", (e) => {
            dotX(e.clientX);
            dotY(e.clientY);
            outX(e.clientX);
            outY(e.clientY);
        });

        const interactables = document.querySelectorAll("a, button, .filter-btn, .row, .skill-item, .nexus-orbiter, .achievement-card, .flux-link, .nexus-btn, .resume-btn, .nav-btn-alt, .nav-btn");
        interactables.forEach(el => {
            el.addEventListener("mouseenter", () => {
                gsap.to(cursorOutline, { width: 60, height: 60, borderColor: "var(--accent-color)", duration: 0.3 });
                gsap.to(cursorDot, { scale: 4, duration: 0.3 });
            });
            el.addEventListener("mouseleave", () => {
                gsap.to(cursorOutline, { width: 40, height: 40, borderColor: "var(--main-color)", duration: 0.3 });
                gsap.to(cursorDot, { scale: 1, duration: 0.3 });
            });
        });
    }

    // 7. Dancing UFO Logic (Defined early for access)
    const ufo = document.querySelector('.ufo-container');
    function roam() {
        if (!ufo) return;
        const maxX = window.innerWidth - 120;
        const maxY = window.innerHeight - 80;
        const newX = Math.random() * maxX;
        const newY = Math.random() * maxY;
        const duration = 3 + Math.random() * 4;

        const currentX = gsap.getProperty(ufo, "x") || 0;
        const tilt = (newX > currentX) ? 15 : -15;

        gsap.to(ufo, {
            x: newX,
            y: newY,
            rotation: tilt,
            duration: duration,
            ease: "sine.inOut",
            onComplete: () => {
                gsap.to(ufo, { rotation: 0, duration: 0.8 });
                setTimeout(roam, Math.random() * 2000);
            }
        });
    }

    if (ufo) {
        ufo.addEventListener('mouseenter', () => {
            gsap.to(ufo, {
                scale: 1.4,
                duration: 0.3,
                overwrite: true,
                onComplete: () => {
                    const escapeX = Math.random() * (window.innerWidth - 120);
                    const escapeY = Math.random() * (window.innerHeight - 80);
                    gsap.to(ufo, { x: escapeX, y: escapeY, scale: 1, rotation: Math.random() * 360, duration: 0.8, ease: "back.out(2)" });
                }
            });
        });
    }

    // 3. Main Content Reveal Logic
    function startMainAnimations() {
        gsap.registerPlugin(ScrollTrigger);

        const tlEntrance = gsap.timeline();

        // Use autoAlpha for better visibility management
        tlEntrance.from(".header", { y: -100, autoAlpha: 0, duration: 1, ease: "power4.out" })
            .from(".logo", { scale: 0.5, autoAlpha: 0, duration: 0.8, ease: "back.out(1.7)" }, "-=0.6")
            .from(".home-content h3", { x: -50, autoAlpha: 0, duration: 1, ease: "power4.out" }, "-=0.4")
            .from(".home-content h1", { x: -50, autoAlpha: 0, duration: 1, ease: "power4.out" }, "-=0.8")
            .from(".home-content p", { y: 20, autoAlpha: 0, duration: 1, ease: "power4.out" }, "-=0.6")
            .from(".hero-action-area", { y: 30, autoAlpha: 0, duration: 0.8, ease: "power3.out" }, "-=0.4")
            .from(".home-sci a", { scale: 0, autoAlpha: 0, duration: 0.6, stagger: 0.1, ease: "back.out(1.7)" }, "-=0.4")
            .from(".home-btns .btn-box", { y: 20, autoAlpha: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }, "-=0.4")
            .from(".saturn-container", { scale: 0, autoAlpha: 0, duration: 1, ease: "back.out(1.2)" }, "-=0.8")
            .from(".alien-container", { x: 50, autoAlpha: 0, duration: 1.2, ease: "power4.out" }, "-=1")
            .from(".career-tag", { scale: 0, autoAlpha: 0, duration: 0.6, stagger: 0.1, ease: "back.out(1.5)" }, "-=0.8")
            .from(".ufo-container", {
                scale: 0,
                autoAlpha: 0,
                duration: 1.5,
                x: 200,
                y: 100,
                ease: "power2.out",
                onComplete: () => {
                    if (typeof roam === 'function') roam();
                }
            }, "-=1");


        document.querySelectorAll(".reveal").forEach(section => {
            gsap.from(section, {
                scrollTrigger: {
                    trigger: section,
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                y: 80,
                opacity: 0,
                duration: 1.2,
                ease: "power4.out"
            });
        });

        if (document.querySelector(".text")) {
            new Typed(".text", {
                strings: ["ML Enthusiast", "Analytics Pro", "Insight Builder"],
                typeSpeed: 90,
                backSpeed: 60,
                backDelay: 1500,
                loop: true
            });
        }

        if (document.querySelector(".auto-quote")) {
            const authors = [
                "— W. Edwards Deming",
                "— Clive Humby",
                "— Carly Fiorina",
                "— Charles Babbage",
                "— Ronald Coase"
            ];
            const authorEl = document.querySelector('.quote-author');

            new Typed(".auto-quote", {
                strings: [
                    "In God we trust, all others must bring <span class='glow-text'>Data.</span>",
                    "Data is the new <span class='glow-text'>oil.</span>",
                    "The goal is to turn data into information, and information into <span class='glow-text'>insight.</span>",
                    "Errors using inadequate data are much less than those using <span class='glow-text'>no data at all.</span>",
                    "Torture the data, and it will <span class='glow-text'>confess to anything.</span>"
                ],
                typeSpeed: 40,
                fadeOut: true, // Swaps the backspace effect for a clean fade out!
                fadeOutDelay: 500,
                backDelay: 20000, // 20 seconds wait (standard for websites so you can actually read the changing quotes)
                loop: true,
                preStringTyped: (arrayPos, self) => {
                    if (authorEl) {
                        gsap.to(authorEl, {
                            opacity: 0, duration: 0.3, onComplete: () => {
                                authorEl.textContent = authors[arrayPos];
                                gsap.to(authorEl, { opacity: 1, duration: 0.3 });
                            }
                        });
                    }
                }
            });
        }

        VanillaTilt.init(document.querySelectorAll(".row, .skill-item, .about-img img, .saturn-planet"), {
            max: 15,
            speed: 400,
            glare: true,
            "max-glare": 0.3
        });

        // JOURNEY TIMELINE ANIMATIONS
        gsap.to(".timeline-progress-bar", {
            height: "100%",
            scrollTrigger: {
                trigger: ".timeline",
                start: "top 80%",
                end: "bottom 80%",
                scrub: 1
            }
        });

        document.querySelectorAll(".timeline-item").forEach((item, index) => {
            const isLeft = item.classList.contains("left");
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                x: isLeft ? -100 : 100,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            });

            gsap.from(item.querySelector(".timeline-dot"), {
                scrollTrigger: {
                    trigger: item,
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                scale: 0,
                duration: 0.6,
                delay: 0.3,
                ease: "back.out(1.7)"
            });
        });
    }

    // 4. Permanent Sticky Header Toggle
    window.addEventListener("scroll", () => {
        const header = document.querySelector(".header");
        if (header) {
            header.classList.toggle("sticky", window.scrollY > 50);
        }
    });

    // 5. Mobile Menu
    const menuToggle = document.getElementById('menu-toggle');
    const navbar = document.getElementById('navbar');
    if (menuToggle && navbar) {
        menuToggle.addEventListener('click', () => {
            navbar.classList.toggle('open');
            menuToggle.querySelector('i').classList.toggle('bx-menu');
            menuToggle.querySelector('i').classList.toggle('bx-x');
        });
    }

    // 6. Particles
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        function initParticles() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particles = [];
            const pCount = window.innerWidth < 768 ? 20 : 45;
            for (let i = 0; i < pCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    size: Math.random() * 2 + 0.5
                });
            }
        }
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#00f2ff";
            particles.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                    if (dist < 150) {
                        ctx.strokeStyle = `rgba(0, 242, 255, ${1 - dist / 150})`;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(animate);
        }
        initParticles();
        animate();
        window.addEventListener("resize", initParticles);
    }

    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectRows = document.querySelectorAll('.portfolio-content .row');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            gsap.to(".portfolio-content .row", {
                opacity: 0,
                scale: 0.9,
                duration: 0.3,
                onComplete: () => {
                    projectRows.forEach(row => {
                        row.style.display = (filter === 'all' || row.dataset.category === filter) ? 'block' : 'none';
                    });
                    gsap.to(".portfolio-content .row", { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1 });
                }
            });
        });
    });

    // UFO logic moved to top for scope visibility


    // 8. Scroll Progress Handler
    const progressBar = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (progressBar) progressBar.style.width = scrolled + "%";
    });

    // 9. Generative AI Engine
    const nexusContainer = document.getElementById('nexus-orbitals');
    if (nexusContainer) {
        const skillsData = [
            { name: "OpenAI", icon: "bx-analyse" },
            { name: "Hugging Face", icon: "bx-smile" },
            { name: "Gemini", icon: "bx-star" },
            { name: "Mistral AI", icon: "bx-wind" },
            { name: "LLMs", icon: "bx-brain" },
            { name: "Grok", icon: "bx-message-square-detail" },
            { name: "BERT", icon: "bx-network-chart" },
            { name: "Perplexity", icon: "bx-search-alt" },
            { name: "Llama 3", icon: "bx-infinite" },
            { name: "Anthropic", icon: "bx-shape-polygon" },
            { name: "YouTube Research", icon: "bx-git-merge" }
        ];

        const orbiters = [];
        skillsData.forEach((skill, i) => {
            const el = document.createElement('div');
            el.className = 'nexus-orbiter';
            el.innerHTML = `<i class='bx ${skill.icon}'></i> ${skill.name}`;
            nexusContainer.appendChild(el);

            orbiters.push({
                el: el,
                angle: (i / skillsData.length) * Math.PI * 2,
                radius: 180 + Math.random() * 120,
                speed: 0.004 + Math.random() * 0.008,
                floatOffset: Math.random() * 50
            });
        });

        function updateNexus() {
            const time = Date.now() * 0.001;
            orbiters.forEach(orb => {
                orb.angle += orb.speed;
                const x = Math.cos(orb.angle) * orb.radius;
                const y = Math.sin(orb.angle) * (orb.radius * 0.4) + Math.sin(time + orb.floatOffset) * 15;

                // 3D Perspective Simulation
                const sinA = Math.sin(orb.angle);
                const depth = gsap.utils.mapRange(-1, 1, 0.7, 1.3, sinA);

                gsap.set(orb.el, {
                    x: x,
                    y: y,
                    opacity: gsap.utils.mapRange(-1, 1, 0.3, 1, sinA),
                    scale: depth,
                    zIndex: Math.floor(gsap.utils.mapRange(-1, 1, 5, 25, sinA)),
                    filter: `blur(${gsap.utils.mapRange(-1, 1, 3, 0, sinA)}px)`
                });
            });
            requestAnimationFrame(updateNexus);
        }
        updateNexus();

        // Mouse Parallax for Nexus
        const nexusWrapper = document.querySelector(".nexus-wrapper");
        if (nexusWrapper) {
            const nexusX = gsap.quickTo(nexusWrapper, "x", { duration: 1.5, ease: "power2.out" });
            const nexusY = gsap.quickTo(nexusWrapper, "y", { duration: 1.5, ease: "power2.out" });
            const nexusRotX = gsap.quickTo(nexusWrapper, "rotateX", { duration: 1.5, ease: "power2.out" });
            const nexusRotY = gsap.quickTo(nexusWrapper, "rotateY", { duration: 1.5, ease: "power2.out" });
            
            window.addEventListener('mousemove', (e) => {
                const moveX = (e.clientX - window.innerWidth / 2) * 0.03;
                const moveY = (e.clientY - window.innerHeight / 2) * 0.03;
                nexusX(moveX);
                nexusY(moveY);
                nexusRotX(-moveY * 0.1);
                nexusRotY(moveX * 0.1);
            });
        }
    }

    // 10. Cybernetic Box Stream Generator
    const streams = document.querySelectorAll('.box-stream');
    if (streams.length > 0) {
        function spawnBox(stream) {
            const box = document.createElement('div');
            box.className = 'cyber-box';

            const size = 10 + Math.random() * 30;
            const startX = Math.random() * 80; // Keep within stream width
            const duration = 5 + Math.random() * 8;

            box.style.width = `${size}px`;
            box.style.height = `${size}px`;
            box.style.left = `${startX}%`;
            box.style.top = '110%'; // Start below

            stream.appendChild(box);

            gsap.to(box, {
                top: '-20%',
                rotationX: Math.random() * 720,
                rotationY: Math.random() * 720,
                duration: duration,
                ease: "none",
                onComplete: () => box.remove()
            });
        }

        // Periodic Spawning (Optimized Frequency)
        setInterval(() => {
            streams.forEach(stream => {
                if (Math.random() > 0.6) spawnBox(stream);
            });
        }, 2500);
    }

    // 11. Extra & Contact Staggered Reveals
    gsap.from(".achievement-card", {
        scrollTrigger: {
            trigger: ".extra",
            start: "top 80%",
        },
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out"
    });

    gsap.from(".contact-container", {
        scrollTrigger: {
            trigger: ".contact",
            start: "top 80%",
        },
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out"
    });

    // 12. Cyber-Stats Count-Up Animation
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        gsap.to(stat, {
            scrollTrigger: {
                trigger: ".extra",
                start: "top 85%",
            },
            innerText: target,
            duration: 2.5,
            snap: { innerText: 1 },
            ease: "power2.out",
            onUpdate: function () {
                stat.innerText = Math.ceil(stat.innerText) + "+";
            }
        });
    });

    // 13. Rocket Return (Back to Top) Logic
    const rocketTop = document.getElementById('rocketTop');
    if (rocketTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                rocketTop.classList.add('active');
            } else {
                rocketTop.classList.remove('active');
            }
        });

        rocketTop.addEventListener('click', () => {
            // Launch animation effect
            gsap.to(rocketTop, {
                y: -150,
                opacity: 0,
                duration: 0.6,
                ease: "power2.in",
                onComplete: () => {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                    // Reset for next use
                    setTimeout(() => {
                        gsap.set(rocketTop, { y: 0 });
                    }, 1000);
                }
            });
        });
    }
});
