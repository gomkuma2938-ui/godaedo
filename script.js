// 1. 수련회 시작 날짜 설정 (YYYY-MM-DD 형식)
const TARGET_DATE = "2026-04-30"; 

// 2. D-Day 카운트다운 로직
function updateTimer() {
    const now = new Date();
    const target = new Date(TARGET_DATE + "T00:00:00");
    const diff = target - now;

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    const timerEl = document.getElementById("dday-timer");
    if (diff > 0) {
        timerEl.innerText = `D-${d} ${h < 10 ? '0'+h : h}:${m < 10 ? '0'+m : m}:${s < 10 ? '0'+s : s}`;
    } else {
        timerEl.innerText = "수련회 진행 중 ✨";
    }
}

// 3. 유튜브 자동 재생 (스크롤 감시)
const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const iframe = document.getElementById('yt-player');
        if (entry.isIntersecting) {
            // 화면에 보이면 재생
            iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        } else {
            // 화면 밖으로 나가면 일시정지
            iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        }
    });
}, { threshold: 0.5 });

// 초기화
window.onload = () => {
    AOS.init({ duration: 1000, once: true });
    setInterval(updateTimer, 1000);
    updateTimer();
    
    const videoSection = document.querySelector('.video-box');
    videoObserver.observe(videoSection);
};