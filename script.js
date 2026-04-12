const TARGET_DATE = "2026-04-30"; 

function updateDDay() {
    const now = new Date();
    const target = new Date(TARGET_DATE + "T00:00:00");
    const diff = target.getTime() - now.getTime();
    const dDay = Math.ceil(diff / (1000 * 60 * 60 * 24));
    const timerEl = document.getElementById("dday-timer");
    
    if (dDay > 0) {
        timerEl.innerText = `D-${dDay}`;
    } else if (dDay === 0) {
        timerEl.innerText = "D-Day ✨";
    } else {
        timerEl.innerText = "진행 중";
    }
}

const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const iframe = document.getElementById('yt-player');
        if (entry.isIntersecting) {
            iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        } else {
            iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        }
    });
}, { threshold: 0.6 });

const container = document.getElementById('swipeContainer');
let isMoving = false;

if (container) {
    container.addEventListener('scroll', () => {
        if (isMoving) return;
        const cards = container.querySelectorAll('.prayer-card');
        const cardWidth = cards[0].offsetWidth + 15;
        if (container.scrollLeft <= 0) {
            isMoving = true;
            container.scrollLeft = cardWidth * 5;
            setTimeout(() => { isMoving = false; }, 50);
        } else if (container.scrollLeft >= cardWidth * 6) {
            isMoving = true;
            container.scrollLeft = cardWidth;
            setTimeout(() => { isMoving = false; }, 50);
        }
    });
}

function scrollToVideo() {
    const videoSection = document.querySelector('.video-section');
    videoSection.scrollIntoView({ behavior: 'smooth' });
}

window.onload = () => {
    AOS.init({ duration: 1000, once: true });
    updateDDay();
    const videoBox = document.querySelector('.video-box');
    if (videoBox) videoObserver.observe(videoBox);

    const posterImg = document.querySelector('.poster img');
    if (posterImg.complete) {
        document.getElementById('dday-container').style.opacity = 1;
    } else {
        posterImg.addEventListener('load', () => {
            document.getElementById('dday-container').style.opacity = 1;
        });
    }

    if (container) {
        const cardWidth = container.querySelector('.prayer-card').offsetWidth + 15;
        container.scrollLeft = cardWidth;
    }
};
