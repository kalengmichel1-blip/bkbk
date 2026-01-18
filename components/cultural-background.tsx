import React from 'react';

export function CulturalBackground() {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-white">
            {/* 
                Parallax Background Layer 
                - Using a subtle scale animation or fixed attachment for depth
                - Blend mode applied for the "drawn on paper" look
            */}
            <div
                className="absolute inset-0 w-full h-full opacity-[0.4] mix-blend-multiply"
                style={{
                    backgroundImage: 'url("/images/drc-map-bg.png")',
                    backgroundRepeat: 'repeat',
                    backgroundSize: '400px', // Adjusted size for detail visibility
                    backgroundAttachment: 'fixed', // Simple CSS-only parallax effect
                }}
            />

            {/* Optional: Add a subtle overlay to soften the texture if needed */}
            <div className="absolute inset-0 bg-white/20" />
        </div>
    );
}
