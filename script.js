// 1. 설정
const TARGET_DATE = "2026-08-15"; // 수련회 날짜

// 2. D-Day 계산 (시간 제외, 날짜만)
function updateDDay() {
    const now = new Date();
    const target = new Date(TARGET_DATE + "T00:00:00");
    
    // 날짜 차이 계산
    const diff = target.getTime() - now.getTime();
    const dDay = Math.ceil(diff / (1000 * 60 * 60 * 24));

    const timerEl = document.getElementById("dday-timer");
    
    if (dDay > 0) {
        timerEl.innerText = `D-${dDay}`;
    } else if (dDay === 0) {
        timerEl.innerText = "D-Day ✨";
    } else {
        timerEl.innerText = "수련회 중";
    }
}

// 3. 비디오 스크롤 감시 (자동 재생)
const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const iframe = document.getElementById('yt-player');
        if (entry.isIntersecting) {
            iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        } else {
            iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        }
    });
}, { threshold: 0.6 }); // 60% 이상 보일 때 재생

// 실행
window.onload = () => {
    AOS.init({ duration: 1000, once: true });
    updateDDay();
    
    const videoBox = document.querySelector('.video-box');
    videoObserver.observe(videoBox);
};