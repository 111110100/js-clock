const daysArr = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
const monthsArr = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const dowsArr = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function buildArchedRing(id, items) {
    const container = document.getElementById(id);
    const angleStep = 360 / items.length;
    items.forEach((item, i) => {
        const itemWrapper = document.createElement('div');
        itemWrapper.className = 'ring-item';
        itemWrapper.style.transform = `translate(-50%, -50%) rotate(${i * angleStep}deg)`;
        const chars = item.split('');
        const charSpread = id === 'day-ring' ? 3.5 : 4; 
        const offset = ((chars.length - 1) * charSpread) / 2;
        chars.forEach((char, charIndex) => {
            const span = document.createElement('span');
            span.innerText = char;
            const charRotate = (charIndex * charSpread) - offset;
            span.style.transform = `translateX(-50%) rotate(${charRotate}deg)`;
            itemWrapper.appendChild(span);
        });
        container.appendChild(itemWrapper);
    });
}

function addArabicNumerals() {
    const face = document.querySelector('.analog-face');
    for (let i = 1; i <= 12; i++) {
        const num = document.createElement('div');
        num.className = 'hour-num';
        num.innerText = i;
        const angle = (i * 30) - 90;
        const radius = 95; 
        const x = Math.cos(angle * (Math.PI / 180)) * radius;
        const y = Math.sin(angle * (Math.PI / 180)) * radius;
        num.style.transform = `translate(${x}px, ${y}px)`;
        face.appendChild(num);
    }
}

function add24HourNumerals() {
    const face = document.querySelector('.analog-face');
    for (let i = 13; i <= 24; i++) {
        const num = document.createElement('div');
        num.className = 'hour-num-24';
        num.innerText = i;
        const angle = ((i - 12) * 30) - 90;
        const radius = 50; 
        const x = Math.cos(angle * (Math.PI / 180)) * radius;
        const y = Math.sin(angle * (Math.PI / 180)) * radius;
        num.style.transform = `translate(${x}px, ${y}px)`;
        face.appendChild(num);
    }
}

function updateCalendarRings() {
    const now = new Date();
    syncRing('day-ring', now.getDate() - 1, 31, 'active-day');
    setTimeout(() => syncRing('month-ring', now.getMonth(), 12, 'active-month'), 400);
    setTimeout(() => syncRing('dow-ring', now.getDay(), 7, 'active-dow'), 800);
}

function syncRing(id, index, total, activeClass) {
    const ring = document.getElementById(id);
    ring.style.transform = `rotate(${-index * (360 / total)}deg)`;
    const items = ring.getElementsByClassName('ring-item');
    for (let i = 0; i < items.length; i++) {
        items[i].classList.toggle(activeClass, i === index);
    }
}

function updateHands() {
    const now = new Date();
    const ms = now.getMilliseconds();
    const s = now.getSeconds() + ms / 1000;
    const m = now.getMinutes() + s / 60;
    const h = now.getHours() + m / 60;
    
    document.getElementById('second').style.transform = `rotate(${s * 6}deg)`;
    document.getElementById('minute').style.transform = `rotate(${m * 6}deg)`;
    document.getElementById('hour').style.transform = `rotate(${(h % 12) * 30}deg)`;
}

document.addEventListener('DOMContentLoaded', () => {
    addArabicNumerals();
    add24HourNumerals();
    buildArchedRing('day-ring', daysArr);
    buildArchedRing('month-ring', monthsArr);
    buildArchedRing('dow-ring', dowsArr);

    // Initial Startup Sweep
    setTimeout(() => {
        updateCalendarRings();
        updateHands();
        
        // After 2.5s (when transition finishes), switch to standard ticking logic
        setTimeout(() => {
            document.querySelectorAll('.hand').forEach(hand => {
                hand.style.transition = 'none'; // Prevents snap-back when reaching 0 degrees
            });
            setInterval(updateHands, 50);
        }, 2500);
        
    }, 100);

    // Ensure rings stay updated
    setInterval(updateCalendarRings, 1000 * 60 * 60); 
});
