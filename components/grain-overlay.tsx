export function GrainOverlay() {
    return (
        <div
            className="pointer-events-none fixed inset-0 z-[100] h-full w-full opacity-20 mix-blend-overlay"
            style={{
                backgroundImage: "url('/noise.png')",
                backgroundRepeat: 'repeat',
                backgroundSize: '128px 128px' // Match the generated image size
            }}
        />
    );
}
