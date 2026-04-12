// 1. 설정
const TARGET_DATE = "2026-04-30"; // 수련회 시작 날짜

// 2. D-Day 로직 (날짜만 계산)
function updateDDay() {
    const now = new Date();
    const target = new Date(TARGET_DATE + "T00:00:00");
    
    // 시간차를 일 단위로 환산
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

// 화살표 클릭 시 비디오 섹션으로 부드럽게 이동
function scrollToVideo() {
    const videoSection = document.querySelector('.video-section');
    videoSection.scrollIntoView({ behavior: 'smooth' });
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

container.addEventListener('scroll', () => {
    if (isMoving) return;

    const cards = container.querySelectorAll('.prayer-card');
    const cardWidth = cards[0].offsetWidth + 15; // 카드 너비 + gap
    
    // 왼쪽 끝(복제본)에 도달하면 실제 마지막 카드로 이동
    if (container.scrollLeft <= 0) {
        isMoving = true;
        container.scrollLeft = cardWidth * 5;
        setTimeout(() => { isMoving = false; }, 50);
    } 
    // 오른쪽 끝(복제본)에 도달하면 실제 첫 번째 카드로 이동
    else if (container.scrollLeft >= cardWidth * 6) {
        isMoving = true;
        container.scrollLeft = cardWidth;
        setTimeout(() => { isMoving = false; }, 50);
    }
});

// 초기 실행
window.onload = () => {
    AOS.init({ duration: 1000, once: true });
    updateDDay();
    
    // 영상 감시 시작
    const videoBox = document.querySelector('.video-box');
    videoObserver.observe(videoBox);

    // 스와이프 초기 위치 설정 (복제본이 아닌 실제 1번 카드가 보이도록)
    const cardWidth = container.querySelector('.prayer-card').offsetWidth + 15;
    container.scrollLeft = cardWidth;
};
