function setupTheme() {
    let themeBtn = document.getElementById("theme-toggle");
    let htmlTag = document.documentElement;

    let currentHour = new Date().getHours();
    let defaultTheme = "dark";
    if (currentHour >= 7 && currentHour < 21) {
        defaultTheme = "light";
    }

    let savedTheme = localStorage.getItem("userTheme");
    let activeTheme = savedTheme ? savedTheme : defaultTheme;
    
    htmlTag.setAttribute("data-theme", activeTheme);
    if (activeTheme === "dark" && themeBtn) {
        themeBtn.textContent = "☀️ Змінити тему";
    }

    if (themeBtn) {
        themeBtn.onclick = function() {
            let current = htmlTag.getAttribute("data-theme");
            let nextTheme = current === "dark" ? "light" : "dark";
            
            htmlTag.setAttribute("data-theme", nextTheme);
            themeBtn.textContent = nextTheme === "dark" ? "☀️ Змінити тему" : "🌙 Змінити тему";
            
            localStorage.setItem("userTheme", nextTheme);
        };
    }
}

function saveAndDisplayBrowserInfo() {
    let os = navigator.platform;
    let browser = navigator.userAgent;
    let screenRes = screen.width + "x" + screen.height;

    localStorage.setItem("user_os", os);
    localStorage.setItem("user_browser", browser);
    localStorage.setItem("user_screen", screenRes);

    let footerData = document.getElementById("footer-info");
    if (footerData) {
        footerData.innerHTML = `
            <p>Система: <b>${localStorage.getItem("user_os")}</b></p>
            <p>Браузер: <b>${localStorage.getItem("user_browser")}</b></p>
            <p>Розширення екрану: <b>${localStorage.getItem("user_screen")}</b></p>
        `;
    }
}

function loadReviews() {
    let myVariant = 24;
    let commentsContainer = document.getElementById("comments-container");
    
    if (!commentsContainer) return;

    commentsContainer.innerHTML = "Завантаження відгуків...";

    fetch("https://jsonplaceholder.typicode.com/posts/" + myVariant + "/comments")
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            commentsContainer.innerHTML = "";
            
            for (let i = 0; i < data.length; i++) {
                let comment = data[i];
                let div = document.createElement("div");
                div.className = "comment-box";
                div.innerHTML = `
                    <h4>${comment.name}</h4>
                    <a href="mailto:${comment.email}" style="color: var(--accent-color);">${comment.email}</a>
                    <p style="margin-top: 10px;">${comment.body}</p>
                `;
                commentsContainer.appendChild(div);
            }
        })
        .catch(function(error) {
            console.log("Помилка:", error);
            commentsContainer.innerHTML = "Не вдалося завантажити відгуки.";
        });
}

function setupModal() {
    let modal = document.getElementById("feedback-modal");
    let closeBtn = document.getElementById("close-modal");

    if (!modal) return;

    setTimeout(function() {
        modal.style.display = "block";
    }, 60000);

    if (closeBtn) {
        closeBtn.onclick = function() {
            modal.style.display = "none";
        };
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}

function initThreeJS() {
    let container = document.getElementById("threejs-canvas-container");
    if (!container) return;

    let scene = new THREE.Scene();
    
    let camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    
    let renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    let geometry = new THREE.TorusKnotGeometry(10, 2.5, 100, 16);
    
    let material = new THREE.MeshBasicMaterial({ 
        color: 0x3498db, 
        wireframe: true,
        transparent: true,
        opacity: 0.3 
    });
    
    let torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);

    camera.position.z = 30;

    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener("mousemove", function(event) {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    function animate() {
        requestAnimationFrame(animate);

        torusKnot.rotation.x += 0.005;
        torusKnot.rotation.y += 0.01;

        torusKnot.rotation.x += mouseY * 0.05;
        torusKnot.rotation.y += mouseX * 0.05;

        renderer.render(scene, camera);
    }
    
    animate();

    window.addEventListener("resize", function() {
        let width = container.clientWidth;
        let height = container.clientHeight;
        
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });
}

function setupTypingEffect() {
    let textElement = document.getElementById("typing-text");
    if (!textElement) return;
    
    let texts = ["Junior Frontend Developer", "Cybersecurity Student", "Tech Enthusiast"];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        let currentText = texts[textIndex];
        
        if (isDeleting) {
            textElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            textElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let typingSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentText.length) {
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500;
        }

        setTimeout(type, typingSpeed);
    }
    
    type();
}

function setupScrollAnimations() {
    let reveals = document.querySelectorAll(".reveal");
    
    let observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    }, { threshold: 0.15 });

    reveals.forEach(function(reveal) {
        observer.observe(reveal);
    });
}

document.addEventListener("DOMContentLoaded", function() {
    setupTheme();
    saveAndDisplayBrowserInfo();
    loadReviews();
    setupModal();
    initThreeJS();
    setupTypingEffect();
    setupScrollAnimations();
});