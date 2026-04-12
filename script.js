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
let isMoving = false, isDown = false, startX, scrollLeft, velX, momentumID;

if (container) {
    container.addEventListener('scroll', () => {
        if (isMoving) return;
        const cards = container.querySelectorAll('.prayer-card');
        const cardWidth = cards[0].offsetWidth + 15;
        
        if (container.scrollLeft <= 5) {
            isMoving = true;
            container.style.scrollSnapType = 'none';
            container.scrollLeft = cardWidth * 5;
            setTimeout(() => {
                container.style.scrollSnapType = 'x mandatory';
                isMoving = false;
            }, 50);
        } 
        else if (container.scrollLeft >= (container.scrollWidth - container.clientWidth - 5)) {
            isMoving = true;
            container.style.scrollSnapType = 'none';
            container.scrollLeft = cardWidth;
            setTimeout(() => {
                container.style.scrollSnapType = 'x mandatory';
                isMoving = false;
            }, 50);
        }
    });

    // 마우스 이벤트 (PC 전용으로 유지)
    container.addEventListener('mousedown', (e) => {
        isDown = true;
        container.style.scrollSnapType = 'none';
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
        cancelAnimationFrame(momentumID);
    });

    container.addEventListener('mouseleave', () => { 
        isDown = false; 
        container.style.scrollSnapType = 'x mandatory'; 
    });

    container.addEventListener('mouseup', () => { 
        isDown = false; 
        container.style.scrollSnapType = 'x mandatory'; 
        if (Math.abs(velX) > 5) beginMomentum(); // 속도가 어느 정도 있을 때만 관성 실행
    });

    container.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        // 드래그 배율을 2 -> 1.5로 낮춰서 PC에서도 조금 더 묵직하게 조절
        const walk = (x - startX) * 1.5; 
        const prev = container.scrollLeft;
        container.scrollLeft = scrollLeft - walk;
        velX = container.scrollLeft - prev;
    });

    // 관성 함수: 마찰력을 높여서 금방 멈추게 조절 (0.98 -> 0.92)
    function beginMomentum() {
        velX *= 0.92; 
        if (Math.abs(velX) > 1) {
            container.scrollLeft += velX;
            momentumID = requestAnimationFrame(beginMomentum);
        } else {
            container.style.scrollSnapType = 'x mandatory';
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
