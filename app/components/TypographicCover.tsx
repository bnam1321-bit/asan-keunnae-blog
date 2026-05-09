import React from 'react';

interface TypographicCoverProps {
    title: string;
    tags?: string[];
    slug: string; // Used for consistent gradient generation
    className?: string;
    showTags?: boolean;
}

export default function TypographicCover({
    title,
    tags,
    slug,
    className = '',
    showTags = true,
}: TypographicCoverProps) {
    // 1. Deterministic Gradient Generation based on slug
    const getGradient = (id: string) => {
        const gradients = [
            'from-stone-500 via-stone-400 to-stone-500',   // Warm Stone
            'from-stone-600 via-stone-500 to-amber-700',   // Deep Stone/Amber
            'from-amber-700 via-amber-600 to-orange-500',  // Warm Amber
            'from-stone-400 via-stone-300 to-stone-400',   // Light Stone
            'from-orange-500 via-amber-600 to-stone-500',  // Mixed Warm
            'from-stone-500 via-stone-600 to-stone-500',   // Deep Neutral
            'from-amber-600 via-stone-400 to-stone-500',   // Amber/Stone Soft
            'from-zinc-500 via-stone-400 to-stone-500',    // Muted Zinc/Stone
        ];

        // Check if slug is defined and is a string
        if (!id || typeof id !== 'string') {
            return gradients[0];
        }

        // Simple hash function
        let hash = 0;
        for (let i = 0; i < id.length; i++) {
            hash = id.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % gradients.length;
        return gradients[index];
    };

    const gradientClass = getGradient(slug);

    return (
        <div
            className={`relative w-full h-full overflow-hidden bg-gradient-to-br ${gradientClass} ${className}`}
        >
            {/* Background Pattern (Subtle Medical Crosses or Dots) */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `radial-gradient(circle, #ffffff 2px, transparent 2px)`,
                    backgroundSize: '24px 24px'
                }}
            ></div>

            {/* Glassmorphism Overlay */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"></div>

            {/* Content Container */}
            <div className="relative h-full flex flex-col justify-between p-6 sm:p-8">

                {/* Top: Category Tag */}
                <div className="flex items-start justify-between">
                    {showTags && tags && tags.length > 0 && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-md border border-white/30 shadow-sm">
                            {tags[0]}
                        </span>
                    )}
                    {/* Decorative Icon */}
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                        <span className="text-lg">✚</span>
                    </div>
                </div>

                {/* Center: Main Title */}
                <div className="mt-auto mb-auto">
                    <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight drop-shadow-md break-keep line-clamp-3">
                        {title}
                    </h2>
                </div>

                {/* Bottom: Decoration Line */}
                <div className="mt-4 w-12 h-1 bg-white/50 rounded-full"></div>
            </div>
        </div>
    );
}
