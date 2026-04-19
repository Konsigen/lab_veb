
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

function BrowserInfo() {
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
    let myVar = 24;
    let commentsContainer = document.getElementById("comments-container");
    
    if (!commentsContainer) return;

    commentsContainer.innerHTML = "Завантаження відгуків...";

    fetch("https://jsonplaceholder.typicode.com/posts/" + myVar + "/comments")
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

document.addEventListener("DOMContentLoaded", function() {
    setupTheme();
    BrowserInfo();
    loadReviews();
    setupModal();
});