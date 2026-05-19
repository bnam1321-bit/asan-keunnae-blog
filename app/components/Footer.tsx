'use client';

import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-stone-50 border-t border-stone-200 pt-16 pb-24 md:pb-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Brand & Info */}
                    <div className="col-span-1 lg:col-span-2">
                        <Link href="/" className="inline-flex items-center gap-2.5 no-underline mb-6">
                            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-white text-[10px] font-black tracking-tight leading-none"
                                style={{ backgroundColor: '#005b9f', letterSpacing: '-0.3px' }}>
                                <span style={{ fontSize: '8px', lineHeight: '1.2', textAlign: 'center' }}>ASAN<br/>KEUN</span>
                            </span>
                            <span className="text-xl font-black tracking-tight" style={{ color: '#005b9f' }}>
                                아산큰내과
                            </span>
                        </Link>
                        <p className="text-stone-600 mb-6 leading-relaxed">
                            인천 서구 검단 주민 여러분의 건강 주치의.<br />
                            정확한 진단과 따뜻한 진료로 함께하겠습니다.
                        </p>
                        <div className="space-y-3 text-sm text-stone-600">
                            <div className="flex items-start">
                                <span className="font-bold w-16 shrink-0 text-stone-700">주소</span>
                                <div>
                                    <span className="block">인천광역시 서구 검단로 469(왕길동) 4, 5층</span>
                                    <span className="block text-xs text-stone-500 mt-0.5">인천 2호선 검단 사거리역 1번출구 바로 앞 롯데리아 건물</span>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <span className="font-bold w-16 shrink-0 text-stone-700">전화</span>
                                <div className="flex flex-col gap-1">
                                    <a href="tel:032-563-2770" className="hover:text-accent transition-colors">032.563.2770 <span className="text-stone-400 text-xs">(외래진료)</span></a>
                                    <a href="tel:032-563-2780" className="hover:text-accent transition-colors">032.563.2780 <span className="text-stone-400 text-xs">(인공신장실)</span></a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Clinic Hours - ID for Scrolling */}
                    <div id="clinic-hours" className="col-span-1 lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
                        <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center">
                            <span className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center mr-2 text-stone-600 shadow-inner">🕒</span>
                            진료시간 안내
                        </h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex justify-between items-start border-b border-stone-100 pb-2">
                                <span className="font-bold text-stone-800 w-20">평일</span>
                                <div className="text-right text-stone-600">
                                    <span className="block"><span className="font-medium text-stone-900">외래진료</span> 08:00 - 18:00</span>
                                    <span className="block"><span className="font-medium text-stone-900">인공신장실</span> 07:00 - 16:00</span>
                                </div>
                            </li>
                            <li className="flex justify-between items-start border-b border-stone-100 pb-2">
                                <span className="font-bold text-accent w-20">토요일</span>
                                <div className="text-right text-stone-600">
                                    <span className="block"><span className="font-medium text-stone-900">외래진료</span> 08:00 - 13:00</span>
                                    <span className="block"><span className="font-medium text-stone-900">인공신장실</span> 07:00 - 12:00</span>
                                </div>
                            </li>
                            <li className="flex justify-between items-center border-b border-stone-100 pb-2">
                                <span className="font-bold text-stone-500 w-20">점심시간</span>
                                <div className="text-right">
                                    <span className="text-stone-600">13:00 - 14:00</span>
                                </div>
                            </li>
                            <li className="flex justify-between items-center border-b border-stone-100 pb-2">
                                <span className="font-bold text-stone-800 w-24">대체공휴일</span>
                                <div className="text-right">
                                    <span className="text-stone-600">08:00 - 13:00</span>
                                </div>
                            </li>
                            <li className="flex justify-between items-center pt-1">
                                <span className="font-bold text-red-500 w-20">일요일</span>
                                <div className="text-right">
                                    <span className="inline-block px-2 py-1 bg-red-50 text-red-600 rounded text-xs font-bold">휴진</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-stone-200 pt-8 text-center text-xs text-stone-400">
                    <p>&copy; 2026 아산큰내과. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
