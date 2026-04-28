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

//시간표 회색처리
function markPastEvents() {
    const now = new Date();
    const today = now.getDay(); // 0=일, 1=월 ... 4=목, 5=금, 6=토
    const hour = now.getHours();

    // 목=4월30일, 금=5월1일, 토=5월2일
    const dayMap = { 4: 0, 5: 1, 6: 2 }; // 요일 → 컬럼 인덱스
    const columns = document.querySelectorAll('.data-column');

    columns.forEach((col, colIndex) => {
        let accumulatedHour = 6; // 표가 06시부터 시작
        col.querySelectorAll('.event-block').forEach(block => {
            const blockHeight = block.offsetHeight;
            const blockHours = blockHeight / 50; // --cell-height: 50px
            const blockEndHour = accumulatedHour + blockHours;

            // 이미 지난 날짜 컬럼은 전부 회색
            if (dayMap[today] !== undefined && colIndex < dayMap[today]) {
                block.classList.add('past');
            }
            // 오늘 컬럼은 현재 시간 지난 칸만 회색
            else if (colIndex === dayMap[today] && blockEndHour <= hour) {
                block.classList.add('past');
            }

            accumulatedHour = blockEndHour;
        });
    });
}

markPastEvents();

// 이미지 핀치줌
document.querySelectorAll('details img').forEach(img => {
    let startDist = 0, startScale = 1, currentScale = 1;

    img.addEventListener('touchstart', e => {
        if (e.touches.length === 2) {
            startDist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            startScale = currentScale;
        }
    });

    img.addEventListener('touchmove', e => {
        if (e.touches.length === 2) {
            e.preventDefault();
            const dist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            currentScale = Math.min(Math.max(startScale * (dist / startDist), 1), 4);
            img.style.transform = `scale(${currentScale})`;
            img.style.transition = 'none';
        }
    }, { passive: false });

    img.addEventListener('touchend', e => {
        if (e.touches.length < 2 && currentScale < 1.05) {
            currentScale = 1;
            img.style.transform = 'scale(1)';
            img.style.transition = 'transform 0.3s ease';
        }
    });
});
