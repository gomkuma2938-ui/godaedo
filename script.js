const TARGET_DATE = "2026-04-30"; 

function updateDDay() {
    const now = new Date();
    const target = new Date(TARGET_DATE + "T00:00:00");
    const diff = target.getTime() - now.getTime();
    const dDay = Math.ceil(diff / (1000 * 60 * 60 * 24));
    const timerEl = document.getElementById("dday-timer");
    if (dDay > 0) timerEl.innerText = `D-${dDay}`;
    else if (dDay === 0) timerEl.innerText = "D-Day ✨";
    else timerEl.innerText = "진행 중";
}

const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const iframe = document.getElementById('yt-player');
        if (entry.isIntersecting) iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        else iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
    });
}, { threshold: 0.6 });

const container = document.getElementById('swipeContainer');
let isMoving = false;
let isDown = false;
let startX, scrollLeft, velX, momentumID;

if (container) {
    // 무한 루프 체크
    container.addEventListener('scroll', () => {
        if (isMoving) return;
        const cards = container.querySelectorAll('.prayer-card');
        const cardWidth = cards[0].offsetWidth + 15;
        if (container.scrollLeft <= 0) {
            isMoving = true;
            container.scrollLeft = cardWidth * 5;
            setTimeout(() => isMoving = false, 50);
        } else if (container.scrollLeft >= (container.scrollWidth - container.clientWidth - 5)) {
            isMoving = true;
            container.scrollLeft = cardWidth;
            setTimeout(() => isMoving = false, 50);
        }
    });

    // 드래그 시작
    container.addEventListener('mousedown', (e) => {
        isDown = true;
        container.classList.add('active');
        container.style.scrollSnapType = 'none'; // 드래그 중엔 자석 효과 끔
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
        cancelAnimationFrame(momentumID); // 이전 관성 중지
    });

    container.addEventListener('mouseleave', () => {
        isDown = false;
        container.style.scrollSnapType = 'x mandatory';
    });

    container.addEventListener('mouseup', () => {
        isDown = false;
        container.style.scrollSnapType = 'x mandatory'; // 마우스 떼면 자석 효과 다시 켬
        beginMomentum(); // 관성 시작
    });

    container.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        const prevScrollLeft = container.scrollLeft;
        container.scrollLeft = scrollLeft - walk;
        velX = container.scrollLeft - prevScrollLeft; // 속도 계산
    });

    // 부드러운 관성 이동 함수
    function beginMomentum() {
        velX *= 0.95; // 마찰력 (숫자가 클수록 더 멀리 감)
        if (Math.abs(velX) > 0.5) {
            container.scrollLeft += velX;
            momentumID = requestAnimationFrame(beginMomentum);
        }
    }
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
    if (posterImg && posterImg.complete) document.getElementById('dday-container').style.opacity = 1;
    else if(posterImg) posterImg.addEventListener('load', () => document.getElementById('dday-container').style.opacity = 1);

    if (container) {
        const cardWidth = container.querySelector('.prayer-card').offsetWidth + 15;
        container.scrollLeft = cardWidth;
    }
};
