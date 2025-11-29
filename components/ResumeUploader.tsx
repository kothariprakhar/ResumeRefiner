import React, { useCallback, useState } from 'react';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';

interface ResumeUploaderProps {
  onFileSelect: (base64: string, filename: string) => void;
  selectedFilename: string | null;
}

const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onFileSelect, selectedFilename }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('File size exceeds 5MB limit.');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      // Extract base64 part (remove "data:application/pdf;base64,")
      const base64 = result.split(',')[1];
      onFileSelect(base64, file.name);
    };
    reader.readAsDataURL(file);
  }, [onFileSelect]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    onFileSelect('', '');
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-700 mb-2">
        1. Upload Resume (PDF)
      </label>
      
      {!selectedFilename ? (
        <div
          className={`relative flex flex-col items-center justify-center w-full h-48 rounded-xl border-2 border-dashed transition-all duration-200 ease-in-out
            ${dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-white hover:bg-slate-50'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <div className={`p-3 rounded-full mb-3 ${dragActive ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                <Upload className="w-6 h-6" />
            </div>
            <p className="mb-2 text-sm text-slate-600">
              <span className="font-semibold text-indigo-600">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-slate-500">PDF up to 5MB</p>
          </div>
          <input 
            type="file" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept="application/pdf"
            onChange={handleChange}
          />
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 bg-white border border-indigo-100 rounded-xl shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900 truncate max-w-[200px]">{selectedFilename}</p>
              <p className="text-xs text-emerald-600 flex items-center mt-0.5">
                <CheckCircle className="w-3 h-3 mr-1" /> Ready for analysis
              </p>
            </div>
          </div>
          <button 
            onClick={clearFile}
            className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-500 animate-pulse">
          {error}
        </p>
      )}
    </div>
  );
};

export default ResumeUploader;
