
import React, { useCallback, useState } from 'react';
import type { FileDetails } from '../types';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
    onImageUpload: (file: File) => void;
    originalImage: FileDetails | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, originalImage }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onImageUpload(e.target.files[0]);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onImageUpload(e.dataTransfer.files[0]);
        }
    }, [onImageUpload]);

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    return (
        <div className="bg-gray-800 rounded-lg p-4 shadow-md border border-gray-700">
            <h2 className="text-lg font-semibold mb-3 text-cyan-400">1. Tải ảnh lên</h2>
            <div className="relative w-full h-64">
                {originalImage ? (
                    <img src={originalImage.dataUrl} alt="Original" className="w-full h-full object-contain rounded-md" />
                ) : (
                    <label
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        className={`w-full h-full flex flex-col items-center justify-center border-2 border-dashed rounded-md cursor-pointer transition-colors ${
                            isDragging ? 'border-cyan-400 bg-gray-700/50' : 'border-gray-600 hover:border-cyan-500 hover:bg-gray-700/30'
                        }`}
                    >
                        <UploadIcon className="w-10 h-10 text-gray-500 mb-2" />
                        <p className="text-sm text-gray-400 text-center">
                            Kéo và thả ảnh vào đây
                            <br /> hoặc
                        </p>
                    </label>
                )}
            </div>
             <input type="file" id="file-upload" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
             <label htmlFor="file-upload" className="mt-4 w-full inline-block text-center bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md cursor-pointer transition-colors">
                 Chọn từ thiết bị
             </label>
        </div>
    );
};

export default ImageUploader;
