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
// 스크롤 정지 감지 및 위치 재설정
container.addEventListener('scrollend', () => {
    const cards = container.querySelectorAll('.prayer-card');
    const cardWidth = cards[0].offsetWidth + 15;
    const maxScroll = container.scrollWidth - container.clientWidth;

    // 1. 오른쪽 끝(복사본 1번)에 안착했을 때 -> 진짜 1번으로 몰래 이동
    if (container.scrollLeft >= maxScroll - 5) {
        container.style.scrollSnapType = 'none'; // 잠시 자석 끄기
        container.scrollLeft = cardWidth;        // 진짜 1번 위치로
        container.style.scrollSnapType = 'x mandatory'; // 다시 자석 켜기
    } 
    
    // 2. 왼쪽 끝(복사본 5번)에 안착했을 때 -> 진짜 5번으로 몰래 이동
    else if (container.scrollLeft <= 5) {
        container.style.scrollSnapType = 'none';
        container.scrollLeft = cardWidth * 5;     // 진짜 5번 위치로
        container.style.scrollSnapType = 'x mandatory';
    }
});

// 만약 브라우저가 scrollend를 지원하지 않는 경우를 대비한 하위 호환 로직 (선택사항)
let isScrolling;
container.addEventListener('scroll', () => {
    window.clearTimeout(isScrolling);
    isScrolling = setTimeout(() => {
        // 여기에 위의 scrollend 로직을 동일하게 넣어도 됩니다.
    }, 100); 
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

    // [변경] 이미지 완료를 기다리지 말고, 그냥 페이지 열리자마자 숫자를 보여줍니다.
    // 어차피 텍스트가 이미지보다 훨씬 빨리 뜨기 때문에 사용자 눈엔 포스터 위에 착 붙어서 보입니다.
    const ddayContainer = document.getElementById('dday-container');
    if (ddayContainer) {
        ddayContainer.style.opacity = 1;
    }

    // 초기 카드 위치 설정
    if (container) {
        const firstCard = container.querySelector('.prayer-card');
        if (firstCard) {
            const cardWidth = firstCard.offsetWidth + 15;
            container.scrollLeft = cardWidth;
        }
    }
};
