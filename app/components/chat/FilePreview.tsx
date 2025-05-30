import React from 'react';

interface FilePreviewProps {
  files: File[];
  imageDataList: string[];
  onRemove: (index: number) => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ files, imageDataList, onRemove }) => {
  if (!files || files.length === 0) {
    return null;
  }

  const isPDF = (file: File) => {
    return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  };

  return (
    <div className="flex flex-row overflow-x-auto -mt-2 mb-2">
      {files.map((file, index) => (
        <div key={file.name + file.size} className="mr-2 relative">
          <div className="relative pt-4 pr-4">
            {isPDF(file) ? (
              <div className="flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 rounded p-4 h-20 min-w-[80px]">
                <div className="i-ph:file-pdf text-2xl text-red-600 dark:text-red-400 mb-1" />
                <span className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-[70px]" title={file.name}>
                  {file.name}
                </span>
              </div>
            ) : (
              imageDataList[index] &&
              !imageDataList[index].includes('[Attached PDF:') && (
                <img src={imageDataList[index]} alt={file.name} className="max-h-20" />
              )
            )}
            <button
              onClick={() => onRemove(index)}
              className="absolute top-1 right-1 z-10 bg-black rounded-full w-5 h-5 shadow-md hover:bg-gray-900 transition-colors flex items-center justify-center"
            >
              <div className="i-ph:x w-3 h-3 text-gray-200" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FilePreview;
