import React from 'react';
import { Link, AlignLeft } from 'lucide-react';
import { JobDescriptionState } from '../types';

interface JobDescriptionInputProps {
  value: JobDescriptionState;
  onChange: (newState: JobDescriptionState) => void;
}

const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({ value, onChange }) => {
  return (
    <div className="w-full h-full flex flex-col">
      <label className="block text-sm font-medium text-slate-700 mb-2">
        2. Job Description
      </label>
      
      <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg mb-3 w-fit">
        <button
          onClick={() => onChange({ ...value, mode: 'text' })}
          className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center space-x-1.5 transition-all
            ${value.mode === 'text' 
              ? 'bg-white text-slate-900 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700'}`}
        >
          <AlignLeft className="w-3.5 h-3.5" />
          <span>Paste Text</span>
        </button>
        <button
          onClick={() => onChange({ ...value, mode: 'url' })}
          className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center space-x-1.5 transition-all
            ${value.mode === 'url' 
              ? 'bg-white text-slate-900 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Link className="w-3.5 h-3.5" />
          <span>Job Link</span>
        </button>
      </div>

      <div className="relative flex-grow">
        {value.mode === 'text' ? (
          <textarea
            className="w-full h-48 md:h-full min-h-[12rem] p-4 text-sm text-slate-800 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-shadow"
            placeholder="Paste the full job description here (Requirements, Responsibilities, etc.)"
            value={value.text}
            onChange={(e) => onChange({ ...value, text: e.target.value })}
          />
        ) : (
          <div className="flex flex-col space-y-2">
             <input
              type="url"
              className="w-full p-4 text-sm text-slate-800 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
              placeholder="https://linkedin.com/jobs/..."
              value={value.url}
              onChange={(e) => onChange({ ...value, url: e.target.value })}
            />
            <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                Note: For the most accurate analysis, we recommend pasting the text directly, as some job boards (like LinkedIn) block automated readers.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDescriptionInput;
