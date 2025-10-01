import React, { useState, useCallback, useEffect } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import type { FileDetails, RestorationMode, Gender } from './types';
import { PRESET_PROMPTS } from './constants';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ControlPanel from './components/ControlPanel';
import ResultDisplay from './components/ResultDisplay';
import { restoreImage } from './services/geminiService';

const App: React.FC = () => {
    const [originalImage, setOriginalImage] = useState<FileDetails | null>(null);
    const [restoredImage, setRestoredImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [customPrompt, setCustomPrompt] = useState<string>('');
    const [activeMode, setActiveMode] = useState<RestorationMode>('comprehensive');
    const [gender, setGender] = useState<Gender>('female');

    const handleImageUpload = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setOriginalImage({
                base64: (reader.result as string).split(',')[1],
                dataUrl: reader.result as string,
                mimeType: file.type,
            });
            setRestoredImage(null);
            setError(null);
        };
        reader.onerror = () => {
            setError('Đã xảy ra lỗi khi đọc tệp. Vui lòng thử lại.');
        };
        reader.readAsDataURL(file);
    };
    
    const handleRestore = useCallback(async () => {
        if (!originalImage) {
            setError('Vui lòng tải ảnh lên trước khi phục chế.');
            return;
        }

        setIsLoading(true);
        setRestoredImage(null);
        setError(null);

        const loadingMessages = [
            "Phân tích cấu trúc ảnh...",
            "Tái tạo các chi tiết bị mất...",
            "Áp dụng thuật toán khử nhiễu...",
            "Hiệu chỉnh màu sắc thông minh...",
            "Tăng cường độ sắc nét...",
            "Hoàn tất các bước cuối cùng..."
        ];
        
        let messageIndex = 0;
        setLoadingMessage(loadingMessages[messageIndex]);
        const intervalId = setInterval(() => {
            messageIndex = (messageIndex + 1) % loadingMessages.length;
            setLoadingMessage(loadingMessages[messageIndex]);
        }, 2500);

        try {
            let prompt: string;
            if (customPrompt.trim() !== '') {
                prompt = customPrompt;
            } else if (activeMode === 'comprehensive') {
                prompt = gender === 'male' 
                    ? PRESET_PROMPTS.comprehensive_male 
                    : PRESET_PROMPTS.comprehensive_female;
            } else {
                prompt = PRESET_PROMPTS[activeMode];
            }

            const resultBase64 = await restoreImage(originalImage.base64, originalImage.mimeType, prompt);
            setRestoredImage(`data:image/png;base64,${resultBase64}`);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'Một lỗi không xác định đã xảy ra. Vui lòng kiểm tra API key và thử lại.');
        } finally {
            clearInterval(intervalId);
            setIsLoading(false);
            setLoadingMessage('');
        }
    }, [originalImage, customPrompt, activeMode, gender]);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
                    <ImageUploader onImageUpload={handleImageUpload} originalImage={originalImage} />
                    <ControlPanel
                        onRestore={handleRestore}
                        isRestoring={isLoading}
                        imageLoaded={!!originalImage}
                        activeMode={activeMode}
                        setActiveMode={setActiveMode}
                        customPrompt={customPrompt}
                        setCustomPrompt={setCustomPrompt}
                        gender={gender}
                        setGender={setGender}
                    />
                </div>
                <div className="lg:col-span-8 xl:col-span-9">
                    <ResultDisplay 
                        originalImage={originalImage?.dataUrl ?? null}
                        restoredImage={restoredImage}
                        isLoading={isLoading}
                        loadingMessage={loadingMessage}
                        error={error}
                    />
                </div>
            </main>
        </div>
    );
};

export default App;