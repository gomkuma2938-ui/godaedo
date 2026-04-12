// 1. 설정 (수련회 시작 날짜: 2026-04-30 반영)
const TARGET_DATE = "2026-04-30"; 

// 2. D-Day 계산
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

// 3. 비디오 자동 재생 감시
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

// 4. 무한 스와이프 로직
const container = document.getElementById('swipeContainer');
let isMoving = false;

if (container) {
    container.addEventListener('scroll', () => {
        if (isMoving) return;
        const cards = container.querySelectorAll('.prayer-card');
        if (cards.length === 0) return;
        const cardWidth = cards[0].offsetWidth + 15;
        
        if (container.scrollLeft <= 0) {
            isMoving = true;
            container.scrollLeft = cardWidth * 5;
            setTimeout(() => { isMoving = false; }, 50);
        } 
        else if (container.scrollLeft >= cardWidth * 6) {
            isMoving = true;
            container.scrollLeft = cardWidth;
            setTimeout(() => { isMoving = false; }, 50);
        }
    });
}

// 5. 화살표 클릭 시 비디오 섹션으로 이동
function scrollToVideo() {
    const videoSection = document.querySelector('.video-section');
    videoSection.scrollIntoView({ behavior: 'smooth' });
}

// 초기 실행
window.onload = () => {
    AOS.init({ duration: 1000, once: true });
    updateDDay();
    
    const videoBox = document.querySelector('.video-box');
    if (videoBox) videoObserver.observe(videoBox);

    // D-Day 표시 (이미지 로딩 완료 시)
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
