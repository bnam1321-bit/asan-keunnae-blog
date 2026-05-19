'use client';

import Link from 'next/link';

export default function Header() {
    return (
        <header className="site-header">
            <div className="header-container">
                {/* Logo - Brand colors: teal + orange matching clinic identity */}
                <Link href="/" className="logo flex items-center gap-2.5 no-underline">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-white text-xs font-black tracking-tight leading-none"
                        style={{ backgroundColor: '#005b9f', letterSpacing: '-0.3px' }}>
                        <span style={{ fontSize: '9px', lineHeight: '1.2', textAlign: 'center' }}>ASAN<br/>KEUN</span>
                    </span>
                    <span className="text-xl font-black tracking-tight" style={{ color: '#005b9f' }}>
                        아산큰내과
                    </span>
                </Link>

                {/* Navigation */}
                <nav className="main-nav">
                    <Link href="/blog" className="nav-link">건강정보</Link>
                    <a href="https://map.naver.com/p/search/아산큰내과의원" target="_blank" rel="noopener noreferrer" className="nav-link">오시는 길</a>
                </nav>
            </div>
        </header>
    );
}
