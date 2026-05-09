'use client';

export default function FloatingBar() {
    return (
        <div className="floating-bar">
            <a href="tel:032-567-0750" className="floating-item">
                <div className="floating-icon">📞</div>
                <div className="floating-label">전화</div>
            </a>

            <button
                onClick={() => {
                    const hours = document.getElementById('clinic-hours');
                    if (hours) hours.scrollIntoView({ behavior: 'smooth' });
                }}
                className="floating-item"
            >
                <div className="floating-icon">🕐</div>
                <div className="floating-label">진료시간</div>
            </button>

            <a
                href="https://map.naver.com/p/search/아산큰내과의원"
                target="_blank"
                rel="noopener noreferrer"
                className="floating-item"
            >
                <div className="floating-icon">📍</div>
                <div className="floating-label">오시는길</div>
            </a>


        </div>
    );
}
