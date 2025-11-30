const canvas = document.getElementById('networkCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const particles = [];
const particleCount = 80;
const connectionDistance = 150;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#3498db';
        ctx.fill();
    }
}

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(44, 62, 80, ${1 - distance / connectionDistance})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(animate);
}

animate();

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Close mobile menu if open
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                navbarCollapse.classList.remove('show');
            }
        }
    });
});

const quizForm = document.getElementById('quizForm');
const quizResults = document.getElementById('quizResults');

const correctAnswers = {
    q1: 'a',
    q2: 'b',
    q3: 'b',
    q4: 'c',
    q5: 'b',
    q6: 'b',
    q7: 'b',
    q8: 'b',
    q9: 'b',
    q10: 'b'
};

const correctExplanations = {
    q1: 'HTML signifie HyperText Markup Language',
    q2: 'La balise <a> (anchor) est utilisée pour créer des liens hypertextes',
    q3: 'CSS (Cascading Style Sheets) est le langage de style pour le web',
    q4: 'La propriété CSS "color" change la couleur du texte',
    q5: 'let est la façon moderne de déclarer une variable en JavaScript',
    q6: 'Bootstrap est le framework CSS utilisé pour ce site',
    q7: 'La balise <nav> est une balise sémantique HTML5 pour la navigation',
    q8: 'Le symbole # est utilisé pour sélectionner un élément par son ID',
    q9: 'onclick est l\'événement JavaScript déclenché lors d\'un clic',
    q10: 'Responsive design signifie un design qui s\'adapte à toutes les tailles d\'écran'
};

quizForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    let score = 0;
    let totalQuestions = 10;
    let resultsHTML = '<div class="quiz-result">';
    
    for (let i = 1; i <= totalQuestions; i++) {
        const answer = document.querySelector(`input[name="q${i}"]:checked`);
        if (answer && answer.value === correctAnswers[`q${i}`]) {
            score++;
        }
    }
    
    const percentage = (score / totalQuestions) * 100;
    let message = '';
    let badgeClass = '';
    
    if (percentage >= 80) {
        message = 'Excellent ! 🎉';
        badgeClass = 'bg-success';
    } else if (percentage >= 60) {
        message = 'Bien joué ! 👍';
        badgeClass = 'bg-primary';
    } else if (percentage >= 40) {
        message = 'Pas mal, continuez ! 💪';
        badgeClass = 'bg-warning';
    } else {
        message = 'Continuez à apprendre ! 📚';
        badgeClass = 'bg-danger';
    }
    
    resultsHTML += `
        <h3>${message}</h3>
        <h2 class="mt-3">Votre score : ${score}/${totalQuestions}</h2>
        <div class="progress mt-3" style="height: 30px;">
            <div class="progress-bar ${badgeClass}" role="progressbar" 
                    style="width: ${percentage}%" aria-valuenow="${percentage}" 
                    aria-valuemin="0" aria-valuemax="100">
                ${percentage.toFixed(0)}%
            </div>
        </div>
    </div>`;
    
    resultsHTML += '<div class="mt-4 bg-white p-4 rounded">';
    resultsHTML += '<h4 class="text-dark mb-3"><i class="fas fa-check-circle text-success"></i> Réponses correctes :</h4>';
    resultsHTML += '<ol class="text-start text-dark">';
    
    for (let i = 1; i <= totalQuestions; i++) {
        const userAnswer = document.querySelector(`input[name="q${i}"]:checked`);
        const isCorrect = userAnswer && userAnswer.value === correctAnswers[`q${i}`];
        const icon = isCorrect ? '<i class="fas fa-check text-success"></i>' : '<i class="fas fa-times text-danger"></i>';
        
        resultsHTML += `<li class="mb-2">${icon} ${correctExplanations[`q${i}`]}</li>`;
    }
    
    resultsHTML += '</ol></div>';
    
    quizResults.innerHTML = resultsHTML;
    quizResults.classList.remove('hidden');
    
    quizResults.scrollIntoView({ behavior: 'smooth' });
});


window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.card, .timeline-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});
