import React from 'react';
import type { RestorationMode, Gender } from '../types';
import { SparklesIcon } from './icons';

interface ControlPanelProps {
    onRestore: () => void;
    isRestoring: boolean;
    imageLoaded: boolean;
    activeMode: RestorationMode;
    setActiveMode: (mode: RestorationMode) => void;
    customPrompt: string;
    setCustomPrompt: (prompt: string) => void;
    gender: Gender;
    setGender: (gender: Gender) => void;
}

const modes: { id: RestorationMode; name: string }[] = [
    { id: 'comprehensive', name: 'Phục chế toàn diện' },
    { id: 'repair', name: 'Sửa chữa & Khử nhiễu' },
    { id: 'enhance', name: 'Tăng cường chi tiết' },
    { id: 'colorize', name: 'Tô màu' },
];

const genders: { id: Gender; name: string }[] = [
    { id: 'female', name: 'Nữ' },
    { id: 'male', name: 'Nam' },
];

const ControlPanel: React.FC<ControlPanelProps> = ({
    onRestore,
    isRestoring,
    imageLoaded,
    activeMode,
    setActiveMode,
    customPrompt,
    setCustomPrompt,
    gender,
    setGender
}) => {
    return (
        <div className="bg-gray-800 rounded-lg p-4 shadow-md border border-gray-700 flex flex-col gap-4">
            <div>
                <h2 className="text-lg font-semibold mb-3 text-cyan-400">2. Chế độ phục chế</h2>
                <div className="grid grid-cols-2 gap-2">
                    {modes.map((mode) => (
                        <button
                            key={mode.id}
                            onClick={() => setActiveMode(mode.id)}
                            className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 ${
                                activeMode === mode.id
                                    ? 'bg-cyan-600 text-white shadow'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            {mode.name}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <h2 className="text-lg font-semibold mb-3 text-cyan-400">3. Giới tính đối tượng</h2>
                <div className="grid grid-cols-2 gap-2">
                    {genders.map((gen) => (
                        <button
                            key={gen.id}
                            onClick={() => setGender(gen.id)}
                            className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 ${
                                gender === gen.id
                                    ? 'bg-cyan-600 text-white shadow'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            {gen.name}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                 <h3 className="text-md font-semibold mb-2 text-gray-300">Hoặc yêu cầu tùy chỉnh</h3>
                 <textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="VD: Xóa vết xước ở góc trên bên phải và làm cho màu sắc sống động hơn..."
                    className="w-full h-24 p-2 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors text-sm"
                    disabled={isRestoring}
                 />
            </div>

            <button
                onClick={onRestore}
                disabled={!imageLoaded || isRestoring}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 px-4 rounded-md transition-all duration-300 ease-in-out hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-700 transform hover:scale-105"
            >
                {isRestoring ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang xử lý...
                    </>
                ) : (
                    <>
                        <SparklesIcon className="w-5 h-5" />
                        Phục chế ảnh
                    </>
                )}
            </button>
        </div>
    );
};

export default ControlPanel;
