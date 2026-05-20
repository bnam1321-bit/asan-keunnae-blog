'use client';

import Link from 'next/link';

export default function Header() {
    return (
        <header className="site-header">
            <div className="header-container">
                {/* Logo - Brand colors: teal + orange matching clinic identity */}
                <Link href="/" className="logo flex items-center no-underline">
                    <img 
                        src="/images/logo.png" 
                        alt="아산큰내과 로고" 
                        className="h-10 sm:h-12 w-auto object-contain" 
                        style={{ maxHeight: '48px' }} 
                    />
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
