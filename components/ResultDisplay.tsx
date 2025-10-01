import React, { useState, useRef, useEffect } from 'react';
import { DownloadIcon } from './icons';

interface ResultDisplayProps {
    originalImage: string | null;
    restoredImage: string | null;
    isLoading: boolean;
    loadingMessage: string;
    error: string | null;
}

const LoadingSimulator: React.FC<{ image: string; message: string }> = ({ image, message }) => {
    return (
        <div className="relative w-full h-full overflow-hidden rounded-lg bg-gray-900 flex flex-col items-center justify-center">
            <img src={image} alt="Processing" className="absolute inset-0 w-full h-full object-contain filter blur-md scale-105" />
            <div className="absolute inset-0 bg-black/60"></div>
            <div className="relative z-10 text-center p-4">
                <div className="relative w-24 h-24 mx-auto mb-4">
                     <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full"></div>
                     <div className="absolute inset-0 border-t-4 border-cyan-500 rounded-full animate-spin"></div>
                </div>
                <p className="text-xl font-semibold text-white animate-pulse">{message}</p>
                <p className="text-sm text-gray-300 mt-2">AI đang làm việc, vui lòng chờ trong giây lát...</p>
            </div>
            <div className="absolute top-0 left-0 w-1 h-full bg-white/20 animate-scan-line"></div>
            {/* FIX: Replaced unsupported `style jsx` with a standard `style` tag. The `jsx` attribute is specific to frameworks like Next.js and was causing a type error. */}
            <style>{`
                @keyframes scan-line {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(2000%); }
                }
                .animate-scan-line {
                    animation: scan-line 3s linear infinite;
                }
            `}</style>
        </div>
    );
};


const BeforeAfterSlider: React.FC<{ before: string; after: string }> = ({ before, after }) => {
    const [sliderPos, setSliderPos] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    const handleMove = (clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        let newPos = ((clientX - rect.left) / rect.width) * 100;
        newPos = Math.max(0, Math.min(100, newPos));
        setSliderPos(newPos);
    };

    const handleMouseDown = () => { isDragging.current = true; };
    const handleMouseUp = () => { isDragging.current = false; };
    const handleMouseLeave = () => { isDragging.current = false; };

    const onMouseMove = (e: MouseEvent) => {
        if (!isDragging.current) return;
        handleMove(e.clientX);
    };

    const onTouchMove = (e: TouchEvent) => {
        if (!isDragging.current) return;
        handleMove(e.touches[0].clientX);
    };

    useEffect(() => {
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchmove', onTouchMove);
        document.addEventListener('touchend', handleMouseUp);
        
        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchmove', onTouchMove);
            document.removeEventListener('touchend', handleMouseUp);
        };
    }, []);

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = after;
        link.download = 'restored-photo.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    return (
        <div ref={containerRef} className="relative w-full h-full overflow-hidden rounded-lg select-none" onMouseLeave={handleMouseLeave}>
            <img src={after} alt="Restored" className="absolute inset-0 w-full h-full object-contain" />
            <div className="absolute inset-0 w-full h-full" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
                <img src={before} alt="Original" className="absolute inset-0 w-full h-full object-contain" />
            </div>
            <div
                className="absolute top-0 h-full w-1 bg-white/80 cursor-ew-resize"
                style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
            >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-full h-10 w-10 flex items-center justify-center shadow-2xl">
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>
                </div>
            </div>
             <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">Ảnh gốc</div>
             <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">Kết quả</div>
            <button
                onClick={handleDownload}
                className="absolute bottom-4 right-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold p-3 rounded-full shadow-lg transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 z-20"
                aria-label="Tải ảnh đã phục chế"
            >
                <DownloadIcon className="w-6 h-6" />
            </button>
        </div>
    );
};

const ResultDisplay: React.FC<ResultDisplayProps> = ({ originalImage, restoredImage, isLoading, loadingMessage, error }) => {
    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg shadow-inner w-full h-[75vh] flex items-center justify-center p-4">
            {isLoading && originalImage && (
                <LoadingSimulator image={originalImage} message={loadingMessage} />
            )}
            {!isLoading && error && (
                <div className="text-center text-red-400">
                    <h3 className="text-xl font-bold mb-2">Đã xảy ra lỗi</h3>
                    <p>{error}</p>
                </div>
            )}
            {!isLoading && !error && restoredImage && originalImage && (
                <BeforeAfterSlider before={originalImage} after={restoredImage} />
            )}
             {!isLoading && !error && !restoredImage && (
                 <div className="text-center text-gray-500">
                    <h3 className="text-2xl font-semibold">Kết quả sẽ hiển thị ở đây</h3>
                    <p className="mt-2">Tải ảnh lên và bắt đầu quá trình phục chế để xem điều kỳ diệu.</p>
                </div>
             )}
        </div>
    );
};

export default ResultDisplay;
