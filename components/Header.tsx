
import React from 'react';
import { CameraIcon } from './icons';

const Header: React.FC = () => {
    return (
        <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 shadow-lg sticky top-0 z-10">
            <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <CameraIcon className="w-10 h-10 text-cyan-400" />
                    <div className="text-center">
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                           PHỤC CHẾ ẢNH CŨ
                        </h1>
                        <p className="text-sm text-gray-400">phát triển bởi thầy Giới 0972300864</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;