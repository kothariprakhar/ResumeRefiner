import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeResume = async (
  resumeBase64: string,
  jobDescription: string,
  isUrl: boolean = false
): Promise<AnalysisResult> => {
  const modelId = "gemini-2.5-flash"; // Efficient for text/document analysis

  // Define the output schema for structured response
  const schema = {
    type: Type.OBJECT,
    properties: {
      matchScore: {
        type: Type.INTEGER,
        description: "A score from 0 to 100 indicating how well the resume matches the job description.",
      },
      summary: {
        type: Type.STRING,
        description: "A concise executive summary of the candidate's fit for this specific role, acting as a recruiter.",
      },
      missingKeywords: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "List of critical keywords or skills found in the JD but missing or weak in the resume.",
      },
      culturalFitAnalysis: {
        type: Type.STRING,
        description: "Analysis of how well the candidate's tone and experience align with the company culture implied in the JD.",
      },
      improvements: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            section: { type: Type.STRING, description: "The section of the resume (e.g., Experience, Skills, Summary)." },
            originalConcept: { type: Type.STRING, description: "A brief description of the current content or a specific weak phrase." },
            improvedRewrite: { type: Type.STRING, description: "A rewritten, impactful version using action verbs and metrics." },
            whyItWorks: { type: Type.STRING, description: "Explanation of why this change improves the candidate's chances." },
          },
        },
        description: "A list of specific, actionable suggestions to tailor the resume.",
      },
    },
    required: ["matchScore", "summary", "missingKeywords", "improvements", "culturalFitAnalysis"],
  };

  const systemPrompt = `
    You are an expert technical recruiter and hiring manager at a top-tier tech company. 
    You have analyzed thousands of resumes and know exactly what gets a candidate past the ATS (Applicant Tracking System) and into an interview.
    
    Your goal is to analyze the provided Resume (PDF) against the Job Description.
    You must be critical but constructive. Focus on:
    1. Quantifiable impact (metrics).
    2. Alignment with the specific language and requirements of the JD.
    3. Formatting and clarity (inferred from text).
    4. Missing keywords that are crucial for this role.
    
    Provide a JSON response with a match score, summary, missing keywords, cultural fit note, and a list of specific improvements.
    For the "improvements", suggest concrete rewrites of bullet points or summary sections to sound more impressive and aligned with the role.
  `;

  let jdContent = jobDescription;
  
  // Prepare contents
  // We send the PDF as a part with inlineData
  const parts: any[] = [
    {
      inlineData: {
        mimeType: "application/pdf",
        data: resumeBase64,
      },
    },
    {
        text: `Here is the Job Description:
        ---
        ${jdContent}
        ---
        
        Analyze the fit.`
    }
  ];
  
  // If the user provided a URL, we might want to use search grounding if it was a real browsing agent,
  // but for 2.5 flash in this context, we will treat the input as text provided by the user (or assume the user pasted the content).
  // If 'isUrl' is true, the user pasted a URL. We can try to ask Gemini to extract insights from it if we had a browsing tool enabled,
  // but standard practice here for reliability is asking the user to paste text. 
  // However, if we must handle URL, we can try to use the googleSearch tool if the model supports it, 
  // but 'gemini-2.5-flash' handles text context best. 
  // *Self-correction*: The prompt implies "link or text". If link, we rely on the user having pasted the link text or we simply pass the URL and hope the model knows it (unlikely for specific JDs) or used a tool.
  // For this implementation, we will assume the string passed in 'jobDescription' is what we want to analyze. 
  // If it's a URL, we'll prefix it with a prompt instruction.
  
  let tools = undefined;
  if (isUrl) {
      parts[1] = {
          text: `The user has provided a link to the job description: ${jobDescription}. 
          Please try to infer the role requirements from the known context of this company or URL if possible, 
          but if not, provide general advice for a role at this company based on the URL structure.
          Better yet, assume the user pasted the text if it looks like text.`
      };
      // Note: A robust production app would scrape the URL server-side. 
      // Here we will rely on Gemini's general knowledge or the user pasting text.
      // We will stick to the 'text' assumption for the main logic as it's most reliable for a purely frontend app without a proxy.
  }

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: { parts },
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Analysis failed", error);
    throw error;
  }
};
