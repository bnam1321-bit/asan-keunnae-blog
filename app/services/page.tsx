

export default function ServicesPage() {
    return (
        <div className="min-h-screen bg-stone-50 py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-black text-stone-900 mb-6 drop-shadow-sm">진료 안내</h1>
                    <p className="text-xl text-stone-600 font-medium">아산큰내과는 다음과 같은 서비스를 제공합니다</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {/* 위내시경 / 대장내시경 */}
                    <div className="bg-white rounded-3xl p-8 shadow-md hover-lift border border-stone-100">
                        <div className="w-16 h-16 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-3xl mb-6 shadow-sm">
                            🔬
                        </div>
                        <h3 className="text-2xl font-bold text-stone-900 mb-4 tracking-tight">위내시경 / 대장내시경</h3>
                        <p className="text-stone-600 leading-relaxed">
                            여성소화기내과 및 신장내과 전문의의 정확한 내시경 검사
                        </p>
                    </div>

                    {/* 건강검진 */}
                    <div className="bg-white rounded-3xl p-8 shadow-md hover-lift border border-stone-100">
                        <div className="w-16 h-16 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-3xl mb-6 shadow-sm">
                            🏥
                        </div>
                        <h3 className="text-2xl font-bold text-stone-900 mb-4 tracking-tight">건강검진</h3>
                        <p className="text-stone-600 leading-relaxed">
                            채용검진 및 일반 건강검진
                        </p>
                    </div>

                    {/* 만성질환 관리 */}
                    <div className="bg-white rounded-3xl p-8 shadow-md hover-lift border border-stone-100">
                        <div className="w-16 h-16 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-3xl mb-6 shadow-sm">
                            💊
                        </div>
                        <h3 className="text-2xl font-bold text-stone-900 mb-4 tracking-tight">만성질환 관리</h3>
                        <p className="text-stone-600 leading-relaxed">
                            고혈압, 당뇨, 고지혈증 등 체계적 관리
                        </p>
                    </div>

                    {/* 초음파 진료 */}
                    <div className="bg-white rounded-3xl p-8 shadow-md hover-lift border border-stone-100">
                        <div className="w-16 h-16 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-3xl mb-6 shadow-sm">
                            📡
                        </div>
                        <h3 className="text-2xl font-bold text-stone-900 mb-4 tracking-tight">초음파 클리닉</h3>
                        <p className="text-stone-600 leading-relaxed">
                            복부, 갑상선 등 정밀 초음파 검사
                        </p>
                    </div>

                    {/* 수액 치료 */}
                    <div className="bg-white rounded-3xl p-8 shadow-md hover-lift border border-stone-100">
                        <div className="w-16 h-16 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-3xl mb-6 shadow-sm">
                            💉
                        </div>
                        <h3 className="text-2xl font-bold text-stone-900 mb-4 tracking-tight">수액 치료</h3>
                        <p className="text-stone-600 leading-relaxed">
                            피로회복, 영양보충을 위한 수액 치료
                        </p>
                    </div>


                </div>

                {/* 진료 시간 */}
                <div className="bg-white rounded-3xl p-12 shadow-xl border border-stone-100">
                    <h2 className="text-3xl font-bold text-stone-900 mb-8 text-center tracking-tight">진료 시간</h2>
                    <div className="max-w-2xl mx-auto space-y-4">
                        <div className="flex justify-between py-3 border-b border-stone-100">
                            <span className="font-semibold text-stone-700">평일 (월,화,목,금)</span>
                            <span className="text-stone-600">08:30 ~ 18:00</span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-stone-100">
                            <span className="font-semibold text-stone-700">수요일</span>
                            <span className="text-stone-600">08:30 ~ 18:00 <br/><span className="text-amber-600 text-sm font-bold">*26.5.1부터 오후 휴진</span></span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-stone-100">
                            <span className="font-semibold text-stone-700">휴게시간 (월~금)</span>
                            <span className="text-stone-600">13:00 ~ 14:00</span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-stone-100">
                            <span className="font-semibold text-amber-700">토요일</span>
                            <span className="text-stone-600">08:30 ~ 13:30</span>
                        </div>
                        <div className="flex justify-between py-3">
                            <span className="font-semibold text-red-500">일/공휴일</span>
                            <span className="text-red-500 font-bold">휴진</span>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-stone-500 mb-6">
                            ※진료 시간은 사정에 따라 변경될 수 있습니다. 내원 전 문의 바랍니다.
                        </p>
                        <a
                            href="tel:032-567-0750"
                            className="inline-flex items-center px-8 py-4 bg-stone-800 text-white rounded-full font-bold hover:bg-stone-900 transition-all hover:scale-105 shadow-md"
                        >
                            📞 전화 문의하기
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
