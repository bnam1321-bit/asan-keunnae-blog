'use client';

import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-stone-50 border-t border-stone-200 pt-16 pb-24 md:pb-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Brand & Info */}
                    <div className="col-span-1 lg:col-span-2">
                        <Link href="/" className="inline-flex items-center gap-2 mb-6 no-underline">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 border border-blue-100">
                                <span className="text-lg">🏥</span>
                            </div>
                            <span className="text-xl font-black drop-shadow-sm" style={{ color: '#005b9f' }}>아산큰내과</span>
                        </Link>
                        <p className="text-stone-600 mb-6 leading-relaxed">
                            인천 서구 검단 주민 여러분의 건강 주치의.<br />
                            정확한 진단과 따뜻한 진료로 함께하겠습니다.
                        </p>
                        <div className="space-y-3 text-sm text-stone-600">
                            <div className="flex items-start">
                                <span className="font-bold w-16 shrink-0 text-stone-700">주소</span>
                                <span>인천 서구 검단로 469 4층, 5층</span>
                            </div>
                            <div className="flex items-start">
                                <span className="font-bold w-16 shrink-0 text-stone-700">전화</span>
                                <a href="tel:032-567-0750" className="hover:text-amber-700 transition-colors">032-567-0750</a>
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
                                    <span className="block font-medium text-stone-900">08:30 - 18:00</span>
                                    <span className="block text-xs font-bold text-amber-600 mt-0.5 mb-0.5">*26년 5월 1일부터 수요일 오후 휴진</span>
                                    <span className="text-xs text-stone-500">휴게시간 13:00 - 14:00</span>
                                </div>
                            </li>
                            <li className="flex justify-between items-start border-b border-stone-100 pb-2">
                                <span className="font-bold text-amber-700 w-20">토요일</span>
                                <div className="text-right text-stone-600">
                                    <span className="block font-medium text-stone-900">08:30 - 13:30</span>
                                    <span className="text-xs text-stone-500">휴게시간 없음</span>
                                </div>
                            </li>
                            <li className="flex justify-between items-center pt-1">
                                <span className="font-bold text-red-500 w-20">일/공휴일</span>
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
