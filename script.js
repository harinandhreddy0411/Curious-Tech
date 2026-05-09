let currentUser = null; 

document.addEventListener('DOMContentLoaded', () => {
    const views = document.querySelectorAll('.view-section');
    const navLoginBtn = document.getElementById('nav-login-btn');
    const navLogoutBtn = document.getElementById('nav-logout-btn');
    const userGreeting = document.getElementById('user-greeting');
    const sysModal = document.getElementById('sys-modal');
    const modalMsg = document.getElementById('modal-msg');
    const modalClose = document.getElementById('modal-close-btn');

    function showModal(msg) {
        modalMsg.innerText = msg;
        sysModal.classList.remove('hidden');
    }
    
    modalClose.addEventListener('click', () => {
        sysModal.classList.add('hidden');
    });

    function updateAuthState() {
        if (currentUser) {
            navLoginBtn.classList.add('hidden');
            userGreeting.innerText = `HI, ${currentUser.name}`;
            userGreeting.classList.remove('hidden');
            navLogoutBtn.classList.remove('hidden');

            document.querySelectorAll('.locked-item').forEach(card => {
                card.classList.remove('locked-item');
                const badge = card.querySelector('.status-badge');
                if (badge) {
                    badge.innerText = "UNLOCKED";
                    badge.style.background = "gold"; 
                    badge.style.color = "black";
                }
            });
        } else {
            navLoginBtn.classList.remove('hidden');
            userGreeting.classList.add('hidden');
            navLogoutBtn.classList.add('hidden');
        }
    }

    function navigateTo(targetId) {
        if ((targetId === 'quiz-page' || document.getElementById(targetId)?.classList.contains('locked-item')) && !currentUser) {
            showModal("SYSTEM HALT: Authorization Required to access this module.");
            targetId = 'login-page';
        }

        document.querySelectorAll('.nav-items a').forEach(l => l.classList.remove('active-link'));
        const activeLink = document.querySelector(`[data-target="${targetId}"]`);
        if (activeLink) activeLink.classList.add('active-link');

        views.forEach(view => view.classList.remove('active-view'));
        const targetView = document.getElementById(targetId);
        if (targetView) targetView.classList.add('active-view');
        
        window.scrollTo(0,0);
    }

    document.querySelectorAll('[data-target]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(link.getAttribute('data-target'));
        });
    });

    document.getElementById('home-logo').addEventListener('click', () => navigateTo('projects-page'));

    const btnShowLogin = document.getElementById('show-login');
    const btnShowReg = document.getElementById('show-register');
    const loginForm = document.getElementById('login-form');
    const regForm = document.getElementById('register-form');

    btnShowLogin.addEventListener('click', () => {
        btnShowLogin.classList.add('active-switcher');
        btnShowReg.classList.remove('active-switcher');
        loginForm.classList.remove('hidden');
        regForm.classList.add('hidden');
    });

    btnShowReg.addEventListener('click', () => {
        btnShowReg.classList.add('active-switcher');
        btnShowLogin.classList.remove('active-switcher');
        regForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('login-email').value;
        const passInput = document.getElementById('login-pass').value;
        
        const users = JSON.parse(localStorage.getItem('ct_users')) || {};
        
        if (!users[emailInput]) {
            showModal("USER NOT FOUND. PLEASE REGISTER.");
            return;
        }
        
        if (users[emailInput].password !== passInput) {
            showModal("INVALID PASSWORD.");
            return;
        }
        
        currentUser = { name: users[emailInput].name };
        updateAuthState();
        showModal(`AUTHENTICATION SUCCESSFUL. WELCOME BACK, ${users[emailInput].name}!`);
        loginForm.reset();
        navigateTo('projects-page');
    });

    regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('reg-name').value.toUpperCase();
        const emailInput = document.getElementById('reg-email').value;
        const passInput = document.getElementById('reg-pass').value;
        
        const users = JSON.parse(localStorage.getItem('ct_users')) || {};
        
        if (users[emailInput]) {
            showModal("USER ALREADY EXISTS. PLEASE SIGN IN.");
            return;
        }
        
        users[emailInput] = { name: nameInput, password: passInput };
        localStorage.setItem('ct_users', JSON.stringify(users));
        
        currentUser = { name: nameInput };
        updateAuthState();
        showModal(`REGISTRATION COMPLETE. ACCESS GRANTED, ${nameInput}!`);
        regForm.reset();
        navigateTo('projects-page');
    });

    navLogoutBtn.addEventListener('click', () => {
        currentUser = null;
        updateAuthState();
        showModal("SESSION TERMINATED.");
        setTimeout(() => { location.reload(); }, 1500); 
    });

    const projectData = {
        "project-1": { 
            title: "Neural Interface UI", 
            content: "<h3>System Overview</h3><p>Open-source frontend components built specifically for Brain-Computer Interface (BCI) systems.</p><h3>Technical Specifications</h3><ul><li>Framework: React.js & Three.js</li><li>Data Handling: Real-time WebSocket streaming</li><li>Latency target: &lt; 15ms</li></ul><p>This module features high-contrast shaders and low-latency feedback loops designed for medical and technical neural telemetry visualization.</p>" 
        },
        "project-2": { 
            title: "Quantum Crypto Sim", 
            content: "<h3>Simulation Parameters</h3><p>A comprehensive browser-based simulation of secure Quantum Key Distribution (QKD) protocols.</p><ul><li>Protocol: BB84 Implementation</li><li>Visualization: Real-time photon polarization</li><li>Security: Active eavesdropping detection matrices</li></ul><p>Users can initialize key distribution sequences and visualize how quantum entanglement prevents third-party data interception.</p>" 
        },
        "project-3": { 
            title: "Daily Challenges App", 
            content: "<h3>Application Core</h3><p>An Android-native mobile application designed to deliver rigorous algorithmic puzzles directly to students.</p><ul><li>Architecture: Kotlin & Jetpack Compose</li><li>Backend: Firebase real-time database</li><li>Features: Daily push notifications, global leaderboards, and a custom UI.</li></ul><p>Perfect for maintaining competitive coding skills on the go.</p>" 
        }
    };

    document.querySelectorAll('.detail-trigger').forEach(btn => btn.addEventListener('click', () => {
        if (btn.classList.contains('requires-auth-btn') && !currentUser) {
            showModal("SYSTEM HALT: Authorization Required to access Premium Projects.");
            navigateTo('login-page');
            return;
        }
        const id = btn.getAttribute('data-id');
        const data = projectData[id];
        document.getElementById('detail-title').innerText = data.title;
        document.getElementById('detail-content').innerHTML = data.content; 
        document.getElementById('detail-img').src = `proj-${id.split('-')[1]}.jpg`;
        navigateTo('project-detail-page');
    }));

    document.getElementById('back-to-projects').addEventListener('click', () => navigateTo('projects-page'));
    
    const blogData = {
        "blog-1": { 
            title: "01. Quantum Supremacy", 
            content: "<h3>Breaking the Classical Barrier</h3><p>Quantum computers do not process data linearly. By leveraging superposition and entanglement, qubits process vast multidimensional computational spaces simultaneously.</p><p>This transmission analyzes the recent breakthroughs in error correction algorithms that are finally making quantum supremacy a stable reality rather than just a theoretical concept.</p>" 
        },
        "blog-2": { 
            title: "02. CSS Neo-Brutalism", 
            content: "<h3>Embracing the Chaos</h3><p>The Neo-Brutalist aesthetic combines harsh architectural borders, stark primary colors, and hard offset shadows to create user interfaces that demand attention.</p><p>In this guide, we break down how to utilize pure CSS variables, text-shadow manipulation, and precise z-index layering to build a graphic interface from scratch.</p>" 
        },
        "blog-3": { 
            title: "03. Agentic AI", 
            content: "<h3>Beyond Chatbots</h3><p>Standard Large Language Models are passive; they wait for prompts and return text. Agentic AI is active.</p><p>By providing an LLM with access to local terminal commands, API keys, and browser automation tools, we cross the threshold from conversational agents to autonomous digital employees capable of executing complex, multi-step web tasks without human oversight.</p>" 
        },
        "blog-4": { 
            title: "04. Kernel Level Dev", 
            content: "<h3>Close to the Metal</h3><p>Writing drivers for modern Linux distributions requires a deep, fundamental understanding of memory management, hardware interrupts, and concurrency.</p><p>This transmission dives into the C architecture underlying the Linux Kernel, exploring how to safely write and deploy custom character device drivers.</p>" 
        }
    };
    
    document.querySelectorAll('.read-trigger').forEach(btn => btn.addEventListener('click', () => {
        if (btn.classList.contains('requires-auth-btn') && !currentUser) {
            showModal("SYSTEM HALT: Authorization Required to access secure transmissions.");
            navigateTo('login-page');
            return;
        }
        const id = btn.getAttribute('data-blog');
        const data = blogData[id];
        document.getElementById('blog-title').innerText = data.title;
        document.getElementById('blog-content').innerHTML = data.content; 
        navigateTo('blog-detail-page');
    }));
    
    document.getElementById('back-to-blogs').addEventListener('click', () => navigateTo('blog-page'));

    updateAuthState();
});

const totalQuestions = 3;

function calculateQuiz() {
    let score = 0;
    let allAnswered = true;

    for (let i = 1; i <= totalQuestions; i++) {
        if (!document.querySelector(`input[name="q${i}"]:checked`)) {
            allAnswered = false;
        }
    }

    if (!allAnswered) { 
        document.getElementById('modal-msg').innerText = "ERROR: Complete all parameters.";
        document.getElementById('sys-modal').classList.remove('hidden');
        return; 
    }
    
    for (let i = 1; i <= totalQuestions; i++) {
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        const questionDiv = document.getElementById(`question-${i}`);
        const feedbackSpan = document.getElementById(`feedback-${i}`);

        if (selected.value === 'correct') {
            score++;
            questionDiv.classList.add('correct-border');
            feedbackSpan.textContent = "STATUS: Optimal";
            feedbackSpan.className = "response-msg correct-text";
        } else {
            questionDiv.classList.add('wrong-border');
            feedbackSpan.textContent = "STATUS: Sub-optimal";
            feedbackSpan.className = "response-msg wrong-text";
        }
        document.querySelectorAll(`input[name="q${i}"]`).forEach(input => input.disabled = true);
    }
    
    document.getElementById('submit-quiz-btn').classList.add('hidden');
    document.getElementById('retry-quiz-btn').classList.remove('hidden');
    const res = document.getElementById('quiz-result');
    res.classList.remove('hidden');
    
    res.innerHTML = `EVALUATION COMPLETE: ${score}/${totalQuestions}. ` + (score === totalQuestions ? "Perfect Score." : "Review errors.");
    res.style.backgroundColor = score === totalQuestions ? 'lightgreen' : 'crimson';
    res.style.color = score === totalQuestions ? 'black' : 'white';
}

function resetQuiz() {
    document.getElementById('quiz-form').reset();
    
    for (let i = 1; i <= totalQuestions; i++) {
        const questionDiv = document.getElementById(`question-${i}`);
        const feedbackSpan = document.getElementById(`feedback-${i}`);
        questionDiv.classList.remove('correct-border', 'wrong-border');
        feedbackSpan.textContent = "";
        document.querySelectorAll(`input[name="q${i}"]`).forEach(input => input.disabled = false);
    }
    
    document.getElementById('submit-quiz-btn').classList.remove('hidden');
    document.getElementById('retry-quiz-btn').classList.add('hidden');
    document.getElementById('quiz-result').classList.add('hidden');
}
