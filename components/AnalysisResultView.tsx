import React from 'react';
import { AnalysisResult, Improvement } from '../types';
import { CheckCircle2, AlertCircle, ArrowRight, Star, Copy, XCircle, TrendingUp } from 'lucide-react';

interface AnalysisResultViewProps {
  result: AnalysisResult;
  onReset: () => void;
}

const ScoreCard: React.FC<{ score: number }> = ({ score }) => {
  let colorClass = 'text-red-600 bg-red-50 border-red-100';
  let label = 'Low Match';
  if (score >= 70) {
    colorClass = 'text-emerald-600 bg-emerald-50 border-emerald-100';
    label = 'Strong Match';
  } else if (score >= 40) {
    colorClass = 'text-amber-600 bg-amber-50 border-amber-100';
    label = 'Potential Match';
  }

  return (
    <div className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 ${colorClass}`}>
      <span className="text-4xl font-bold mb-1">{score}%</span>
      <span className="text-sm font-semibold uppercase tracking-wider opacity-90">{label}</span>
    </div>
  );
};

const ImprovementCard: React.FC<{ item: Improvement }> = ({ item }) => {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(item.improvedRewrite);
    };

    return (
        <div className="group bg-white rounded-xl border border-slate-200 p-5 hover:border-indigo-300 transition-all shadow-sm hover:shadow-md">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md uppercase tracking-wide">
                        {item.section}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-800">Optimized Rewrite</span>
                </div>
                <button onClick={copyToClipboard} className="text-slate-400 hover:text-indigo-600 transition-colors" title="Copy Suggestion">
                    <Copy className="w-4 h-4" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-50/50 p-3 rounded-lg border border-red-100/50">
                    <p className="text-xs font-semibold text-red-600 mb-1 flex items-center">
                        <XCircle className="w-3 h-3 mr-1" /> Current Weakness
                    </p>
                    <p className="text-sm text-slate-600 italic">"{item.originalConcept}"</p>
                </div>
                <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100/50 relative">
                    <p className="text-xs font-semibold text-emerald-600 mb-1 flex items-center">
                         <CheckCircle2 className="w-3 h-3 mr-1" /> Recommended
                    </p>
                    <p className="text-sm text-slate-800 font-medium">{item.improvedRewrite}</p>
                </div>
            </div>
            
            <div className="mt-3 flex items-start space-x-2 text-xs text-slate-500">
                <TrendingUp className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <span><span className="font-medium text-indigo-600">Recruiter Insight:</span> {item.whyItWorks}</span>
            </div>
        </div>
    )
}

const AnalysisResultView: React.FC<AnalysisResultViewProps> = ({ result, onReset }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Analysis Report</h2>
                <p className="text-slate-600 text-sm leading-relaxed border-l-4 border-indigo-500 pl-4 py-1 bg-slate-50/50 rounded-r-lg">
                    {result.summary}
                </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                 <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center">
                    <Star className="w-4 h-4 text-amber-500 mr-2" />
                    Missing Keywords
                 </h3>
                 <div className="flex flex-wrap gap-2">
                    {result.missingKeywords.map((kw, idx) => (
                        <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full border border-slate-200">
                            {kw}
                        </span>
                    ))}
                    {result.missingKeywords.length === 0 && (
                        <span className="text-xs text-emerald-600 flex items-center">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Great keyword coverage!
                        </span>
                    )}
                 </div>
            </div>
        </div>
        <div className="md:col-span-1">
            <ScoreCard score={result.matchScore} />
             <div className="mt-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <h3 className="text-xs font-bold text-indigo-800 uppercase tracking-wide mb-2">Cultural Fit</h3>
                <p className="text-xs text-indigo-700 leading-relaxed">
                    {result.culturalFitAnalysis}
                </p>
            </div>
        </div>
      </div>

      <div className="border-t border-slate-200 my-8"></div>

      {/* Improvements Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center">
                <AlertCircle className="w-6 h-6 text-indigo-600 mr-2" />
                Suggested Improvements
            </h2>
            <span className="text-sm text-slate-500">
                {result.improvements.length} high-impact tweaks found
            </span>
        </div>

        <div className="space-y-4">
            {result.improvements.map((item, index) => (
                <ImprovementCard key={index} item={item} />
            ))}
        </div>
      </div>

      <div className="flex justify-center pt-8 pb-12">
        <button
            onClick={onReset}
            className="px-8 py-3 bg-white border border-slate-300 text-slate-700 font-medium rounded-full hover:bg-slate-50 hover:border-slate-400 transition-all shadow-sm"
        >
            Analyze Another Role
        </button>
      </div>
    </div>
  );
};

export default AnalysisResultView;
