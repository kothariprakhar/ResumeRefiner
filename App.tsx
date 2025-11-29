import React, { useState } from 'react';
import { Briefcase, ChevronRight, Loader2, Sparkles } from 'lucide-react';
import ResumeUploader from './components/ResumeUploader';
import JobDescriptionInput from './components/JobDescriptionInput';
import AnalysisResultView from './components/AnalysisResultView';
import { analyzeResume } from './services/geminiService';
import { AnalysisResult, AppStep, JobDescriptionState } from './types';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.INPUT);
  const [resumeBase64, setResumeBase64] = useState<string | null>(null);
  const [resumeFilename, setResumeFilename] = useState<string | null>(null);
  const [jobDesc, setJobDesc] = useState<JobDescriptionState>({ text: '', url: '', mode: 'text' });
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (base64: string, filename: string) => {
    setResumeBase64(base64);
    setResumeFilename(filename);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!resumeBase64) {
      setError("Please upload your resume.");
      return;
    }
    const jdContent = jobDesc.mode === 'text' ? jobDesc.text : jobDesc.url;
    if (!jdContent.trim()) {
      setError("Please provide a job description or URL.");
      return;
    }

    setStep(AppStep.ANALYZING);
    setError(null);

    try {
      const result = await analyzeResume(resumeBase64, jdContent, jobDesc.mode === 'url');
      setAnalysisResult(result);
      setStep(AppStep.RESULTS);
    } catch (err: any) {
      setError(err.message || "Something went wrong during analysis. Please try again.");
      setStep(AppStep.INPUT);
    }
  };

  const handleReset = () => {
    setStep(AppStep.INPUT);
    setAnalysisResult(null);
    setResumeBase64(null);
    setResumeFilename(null);
    setJobDesc({ text: '', url: '', mode: 'text' });
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30">
      {/* Navbar */}
      <nav className="w-full bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">Recruiter<span className="text-indigo-600">AI</span></span>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600">
            <span className={step === AppStep.INPUT ? 'text-indigo-600' : ''}>1. Input Details</span>
            <ChevronRight className="w-4 h-4 text-slate-300" />
            <span className={step === AppStep.ANALYZING ? 'text-indigo-600' : ''}>2. Analysis</span>
            <ChevronRight className="w-4 h-4 text-slate-300" />
            <span className={step === AppStep.RESULTS ? 'text-indigo-600' : ''}>3. Results</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-12">
        {step === AppStep.INPUT && (
          <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                Tailor Your Resume Like a <span className="text-indigo-600">Pro</span>
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Upload your resume and the job description. Our AI agent will analyze keyword gaps and suggest bullet-point rewrites to beat the ATS and impress recruiters.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-10"></div>
              <div className="p-6 md:p-8 space-y-8">
                
                <ResumeUploader 
                  onFileSelect={handleFileSelect} 
                  selectedFilename={resumeFilename} 
                />

                <div className="border-t border-slate-100"></div>

                <JobDescriptionInput 
                  value={jobDesc} 
                  onChange={setJobDesc} 
                />

                {error && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm flex items-center animate-in slide-in-from-top-2">
                    <span className="mr-2">⚠️</span> {error}
                  </div>
                )}

                <button
                  onClick={handleAnalyze}
                  disabled={!resumeBase64 || !(jobDesc.mode === 'text' ? jobDesc.text : jobDesc.url)}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-lg shadow-lg shadow-indigo-200 transition-all transform hover:scale-[1.01] flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Analyze My Fit</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {step === AppStep.ANALYZING && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] animate-in fade-in duration-700">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-white p-6 rounded-2xl shadow-lg border border-indigo-50">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
              </div>
            </div>
            <h2 className="mt-8 text-2xl font-bold text-slate-900">Reviewing Application...</h2>
            <p className="mt-2 text-slate-500 text-center max-w-md">
              The AI Recruiter is reading your resume, comparing it against the job requirements, and identifying competitive gaps.
            </p>
            <div className="mt-8 flex space-x-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}

        {step === AppStep.RESULTS && analysisResult && (
          <AnalysisResultView 
            result={analysisResult} 
            onReset={handleReset} 
          />
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} RecruiterAI. Powered by Gemini 2.5 Flash.</p>
      </footer>
    </div>
  );
};

export default App;
