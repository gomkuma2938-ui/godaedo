const TARGET_DATE = "2026-04-30"; 

// 1. 페이지 로드 시 실행 (D-Day는 선언하자마자 실행해서 속도 확보)
updateDDay();

function updateDDay() {
    const now = new Date();
    const target = new Date(TARGET_DATE + "T00:00:00");
    const diff = target.getTime() - now.getTime();
    const dDay = Math.ceil(diff / (1000 * 60 * 60 * 24));
    const timerEl = document.getElementById("dday-timer");
    
    if (timerEl) {
        if (dDay > 0) timerEl.innerText = `D-${dDay}`;
        else if (dDay === 0) timerEl.innerText = "D-Day ✨";
        else timerEl.innerText = "진행 중";
    }
}

// 2. 유튜브 자동 재생 Observer
const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const iframe = document.getElementById('yt-player');
        if (!iframe) return;
        if (entry.isIntersecting) {
            iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        } else {
            iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        }
    });
}, { threshold: 0.6 });

// 3. 페이지 리소스 로드 후 초기화
window.onload = () => {
    // AOS 초기화
    AOS.init({ duration: 1000, once: true });
    
    // 디데이 컨테이너 즉시 표시
    const ddayCont = document.getElementById('dday-container');
    if (ddayCont) ddayCont.style.opacity = 1;

    // Swiper 초기화 (무한 루프 & 깜빡임 해결사)
    const swiper = new Swiper('#swipeContainer', {
        loop: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        spaceBetween: 15,
        grabCursor: true,
        speed: 400,
        touchRatio: 1.2,
        resistance: false,
        // 가끔 루프 시 복제본 클릭 안되는 버그 방지
        observer: true,
        observeParents: true,
    });

    // 유튜브 감시 시작
    const videoBox = document.querySelector('.video-box');
    if (videoBox) videoObserver.observe(videoBox);
};

// 4. 스크롤 이동 함수
function scrollToVideo() {
    const videoSection = document.querySelector('.video-section');
    if (videoSection) videoSection.scrollIntoView({ behavior: 'smooth' });
}
