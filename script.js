const TARGET_DATE = "2026-04-30"; 

updateDDay();

// 1. D-Day 업데이트
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

// 2. 유튜브 자동 재생 Observer
const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const iframe = document.getElementById('yt-player');
        if (!iframe) return;
        if (entry.isIntersecting) iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        else iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
    });
}, { threshold: 0.6 });

// 3. 기도 카드 무한 루프 & 드래그 로직
const container = document.getElementById('swipeContainer');
let isMoving = false, isDown = false, startX, scrollLeft, velX, momentumID;

if (container) {
    // 무한 루프 핵심: 복사본을 활용한 위치 재설정
container.addEventListener('scroll', () => {
    if (isMoving) return;
    
    const cards = container.querySelectorAll('.prayer-card');
    const cardWidth = cards[0].offsetWidth + 15;
    const maxScroll = container.scrollWidth - container.clientWidth;

    // 1. 오른쪽 끝 처리
    if (container.scrollLeft >= maxScroll - 5) {
        isMoving = true;
        container.style.scrollSnapType = 'none';
        container.style.scrollBehavior = 'auto';
        
        // 브라우저가 다음 프레임을 그리기 전에 위치를 먼저 옮김
        requestAnimationFrame(() => {
            container.scrollLeft = cardWidth;
            // 위치 이동 후 아주 짧은 시간 뒤에 스냅 복구
            setTimeout(() => {
                container.style.scrollSnapType = 'x mandatory';
                isMoving = false;
            }, 60); // 50ms보다 살짝 넉넉히 줘서 안정화
        });
    } 
    
    // 2. 왼쪽 끝 처리
    else if (container.scrollLeft <= 5) {
        isMoving = true;
        container.style.scrollSnapType = 'none';
        container.style.scrollBehavior = 'auto';
        
        requestAnimationFrame(() => {
            container.scrollLeft = cardWidth * 5;
            setTimeout(() => {
                container.style.scrollSnapType = 'x mandatory';
                isMoving = false;
            }, 60);
        });
    }
});

    // 마우스 드래그 (PC 전용)
    container.addEventListener('mousedown', (e) => {
        isDown = true;
        container.style.scrollSnapType = 'none';
        container.style.scrollBehavior = 'auto'; // 드래그 시 즉각 반응
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
        cancelAnimationFrame(momentumID);
    });

    container.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 1.5; 
        const prev = container.scrollLeft;
        container.scrollLeft = scrollLeft - walk;
        velX = container.scrollLeft - prev;
    });

    const endDragging = () => {
        if (!isDown) return;
        isDown = false;
        container.style.scrollSnapType = 'x mandatory';
        if (Math.abs(velX) > 5) beginMomentum();
    };

    container.addEventListener('mouseup', endDragging);
    container.addEventListener('mouseleave', endDragging);

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
    if(videoSection) videoSection.scrollIntoView({ behavior: 'smooth' });
}

window.onload = () => {
    AOS.init({ duration: 1000, once: true });
    
    const videoBox = document.querySelector('.video-box');
    if (videoBox) videoObserver.observe(videoBox);

    const posterImg = document.querySelector('.poster img');
    if (posterImg && posterImg.complete) document.getElementById('dday-container').style.opacity = 1;
    else if(posterImg) posterImg.addEventListener('load', () => document.getElementById('dday-container').style.opacity = 1);

    // 초기 위치를 '진짜 1번' 카드(두 번째 카드)로 설정
    if (container) {
        const firstCard = container.querySelector('.prayer-card');
        if (firstCard) {
            const cardWidth = firstCard.offsetWidth + 15;
            container.scrollLeft = cardWidth;
        }
    }
};
