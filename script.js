const TARGET_DATE = "2026-04-30"; 

// 1. D-Day 로직 (님 원본 Math.ceil)
updateDDay();
function updateDDay() {
    const now = new Date();
    const target = new Date(TARGET_DATE + "T00:00:00");
    
    // 종료 기준일: 5월 3일 00:00:00 (이때부터 사라짐)
    const expiryDate = new Date("2026-05-03T00:00:00");
    
    const diff = target.getTime() - now.getTime();
    const dDay = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    const timerEl = document.getElementById("dday-timer");
    if (!timerEl) return;

    if (now >= expiryDate) {
        // 1. 5월 3일부터는 아무것도 표시 안 함
        timerEl.innerText = ""; 
    } else if (dDay > 0) {
        // 2. 4월 30일 이전까지는 D-1, D-2... 표시
        timerEl.innerText = `D-${dDay}`;
    } else {
        // 3. 4월 30일, 5월 1일, 5월 2일 모두 "D-Day ✨"로 표시
        timerEl.innerText = "D-Day ✨";
    }
}

// 2. 유튜브 소리 제어 (흰색/검정 반전 로직)
let player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('yt-player', {
        events: { 'onReady': (e) => { e.target.mute(); } }
    });
}
function toggleMute() {
    const btn = document.getElementById('mute-btn');
    const icon = document.getElementById('mute-icon');
    const text = document.getElementById('mute-text');
    if (player.isMuted()) {
        player.unMute();
        icon.innerText = '🔊'; text.innerText = 'ON';
        btn.classList.add('on');
    } else {
        player.mute();
        icon.innerText = '🔈'; text.innerText = 'OFF';
        btn.classList.remove('on');
    }
}

// 3. 페이지 리소스 로드 후 초기화 (IntersectionObserver 포함)
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

window.onload = () => {
    // AOS 초기화 (사라졌던 애니메이션 복구)
    AOS.init({ duration: 1000, once: true });
    
    const ddayCont = document.getElementById('dday-container');
    if (ddayCont) ddayCont.style.opacity = 1;

    const swiper = new Swiper('#swipeContainer', {
        loop: true, centeredSlides: true, slidesPerView: 'auto', spaceBetween: 15,
        grabCursor: true, speed: 400, touchRatio: 1.2, resistance: false,
        observer: true, observeParents: true,
    });

    const videoBox = document.querySelector('.video-box');
    if (videoBox) videoObserver.observe(videoBox);
};

function scrollToVideo() {
    const videoSection = document.querySelector('.video-section');
    if (videoSection) videoSection.scrollIntoView({ behavior: 'smooth' });
}

//테이블
const bodyScroll = document.getElementById('bodyScroll');
const headerInner = document.querySelector('.header-inner');

bodyScroll.addEventListener('scroll', () => {
    headerInner.style.transform = `translateX(-${bodyScroll.scrollLeft}px)`;
});
