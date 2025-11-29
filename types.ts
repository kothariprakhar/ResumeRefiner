export interface Improvement {
  section: string;
  originalConcept: string;
  improvedRewrite: string;
  whyItWorks: string;
}

export interface AnalysisResult {
  matchScore: number;
  summary: string;
  missingKeywords: string[];
  improvements: Improvement[];
  culturalFitAnalysis: string;
}

export interface JobDescriptionState {
  text: string;
  url: string;
  mode: 'text' | 'url';
}

export enum AppStep {
  INPUT = 0,
  ANALYZING = 1,
  RESULTS = 2,
}
