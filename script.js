const TARGET_DATE = "2026-04-30"; 

// 1. 페이지 로드 시 실행 (D-Day는 선언하자마자 실행해서 속도 확보)
updateDDay();

function updateDDay() {
    const now = new Date();
    const target = new Date(TARGET_DATE + "T00:00:00");
    const diff = target.getTime() - now.getTime();
    const dDay = Math.ceil(diff / (1000 * 60 * 60 * 24)); // 님의 원본 Math.ceil 복구
    const timerEl = document.getElementById("dday-timer");
    
    if (timerEl) {
        if (dDay > 0) timerEl.innerText = `D-${dDay}`;
        else if (dDay === 0) timerEl.innerText = "D-Day ✨";
        else timerEl.innerText = "진행 중";
    }
}

// 2. 유튜브 자동 재생 Observer (님의 원본 코드)
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

// 2-1. 추가: 소리 토글 함수 (이것만 하단에 추가)
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
        icon.innerText = '🔊';
        text.innerText = 'ON';
        btn.classList.add('on'); // CSS의 .on 스타일 적용 (흰 배경 / 검정 글씨)
    } else {
        player.mute();
        icon.innerText = '🔈';
        text.innerText = 'OFF';
        btn.classList.remove('on'); // 원래 스타일로 복구 (반투명 검정 배경 / 흰 글씨)
    }
}

// 3. 페이지 리소스 로드 후 초기화 (님의 원본 코드)
window.onload = () => {
    // AOS 초기화
    AOS.init({ duration: 1000, once: true });
    
    // 디데이 컨테이너 즉시 표시
    const ddayCont = document.getElementById('dday-container');
    if (ddayCont) ddayCont.style.opacity = 1;

    // Swiper 초기화 (님의 설정 그대로 복구)
    const swiper = new Swiper('#swipeContainer', {
        loop: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        spaceBetween: 15,
        grabCursor: true,
        speed: 400,
        touchRatio: 1.2,
        resistance: false,
        observer: true,
        observeParents: true,
    });

    // 유튜브 감시 시작
    const videoBox = document.querySelector('.video-box');
    if (videoBox) videoObserver.observe(videoBox);
};

// 4. 스크롤 이동 함수 (님의 원본 코드)
function scrollToVideo() {
    const videoSection = document.querySelector('.video-section');
    if (videoSection) videoSection.scrollIntoView({ behavior: 'smooth' });
}
