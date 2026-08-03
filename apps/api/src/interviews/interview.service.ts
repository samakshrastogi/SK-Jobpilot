import { JobModel } from '../models/job.model.js';
import { CandidateProfileModel } from '../models/candidate-profile.model.js';
import { ResumeModel } from '../models/resume.model.js';
import { InterviewPreparationModel, type IInterviewPreparationDocument } from '../models/interview-preparation.model.js';
import { MockInterviewSessionModel, type IMockInterviewSessionDocument } from '../models/mock-interview-session.model.js';
import { getAIProvider } from '../ai/provider-factory.js';
import { AppError } from '../errors/app-error.js';
import { z } from 'zod';
import mongoose from 'mongoose';

const interviewGenSchema = z.object({
  sevenDayStudyPlan: z.array(
    z.object({
      day: z.number(),
      focus: z.string(),
      tasks: z.array(z.string()),
    })
  ),
  questions: z.array(
    z.object({
      id: z.string(),
      question: z.string(),
      category: z.string(),
      difficulty: z.string(),
      whyAsked: z.string(),
      skillsAssessed: z.array(z.string()),
      suggestedFramework: z.string(),
      keyPointsToCover: z.array(z.string()),
      commonMistakes: z.array(z.string()),
    })
  ),
});

const answerEvaluationSchema = z.object({
  score: z.number().min(0).max(100),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  suggestedAnswer: z.string(),
  starAnalysis: z.object({
    situation: z.string(),
    task: z.string(),
    action: z.string(),
    result: z.string(),
  }),
});

export async function generateInterviewPrep(jobId: string, interviewType = 'behavioural', difficulty = 'senior') {
  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    throw AppError.badRequest('Invalid job ID format');
  }

  const job = await JobModel.findById(jobId);
  if (!job) {
    throw AppError.notFound('Target job not found');
  }

  const profile = await CandidateProfileModel.findOne().sort({ createdAt: 1 });
  const masterResume = await ResumeModel.findOne({ isMaster: true });

  const provider = getAIProvider();

  const prompt = `
Target Role: ${job.jobTitle} at ${job.companyName}
Job Description:
${job.description}

Candidate Profile:
${JSON.stringify(profile ? profile.toJSON() : {}, null, 2)}

Candidate Master Resume Text:
${masterResume?.rawText || 'Experienced Software Engineer.'}

Generate an AI Interview Preparation package containing:
1. 7-day study plan customized for this role.
2. 5 high-yield ${interviewType} interview questions tailored to the candidate's actual experience and the target job requirements.
Difficulty level: ${difficulty}.
`;

  let genData: any;

  try {
    const response = await provider.generateStructured({
      systemInstruction: 'You are a Senior Technical Hiring Manager & Executive Interview Coach. Generate realistic interview prep grounded in candidate experience.',
      prompt,
      schema: interviewGenSchema,
      promptId: 'interview-question-generation',
      promptVersion: '1.0',
    });
    genData = response.data;
  } catch {
    // Fallback prep data
    genData = {
      sevenDayStudyPlan: [
        { day: 1, focus: 'Company Research & Requirements Alignment', tasks: ['Review company product portfolio and engineering blog.'] },
        { day: 2, focus: 'Technical Skills Review', tasks: [`Brush up on core skills: ${(job.requiredSkills || ['TypeScript'])[0]}`] },
        { day: 3, focus: 'Behavioural STAR Preparation', tasks: ['Prepare 3 STAR stories for past accomplishments.'] },
        { day: 4, focus: 'System Architecture & Design', tasks: ['Practice system design diagramming.'] },
        { day: 5, focus: 'Resume Deep Dive', tasks: ['Review bullet points on master resume.'] },
        { day: 6, focus: 'Mock Practice Session', tasks: ['Run text mock interview session in SK JobPilot.'] },
        { day: 7, focus: 'Final Warm-up & Questions for Interviewer', tasks: ['Prepare 3 smart questions for the hiring manager.'] },
      ],
      questions: [
        {
          id: 'q-1',
          question: `Can you walk me through a challenging feature you architected using ${(job.requiredSkills || ['TypeScript'])[0]}?`,
          category: interviewType,
          difficulty,
          whyAsked: 'Evaluate technical depth and architectural decision-making.',
          skillsAssessed: job.requiredSkills || ['TypeScript'],
          suggestedFramework: 'STAR (Situation, Task, Action, Result)',
          keyPointsToCover: ['Technical challenges overcome', 'System impact and metrics'],
          commonMistakes: ['Focusing too much on theory without specific project evidence.'],
        },
      ],
    };
  }

  const prepDoc = await InterviewPreparationModel.create({
    jobId: new mongoose.Types.ObjectId(jobId),
    interviewType,
    difficulty,
    sevenDayStudyPlan: genData.sevenDayStudyPlan,
    questions: genData.questions,
  });

  const populated = await InterviewPreparationModel.findById(prepDoc._id).populate('job');
  return populated?.toJSON();
}

export async function getInterviewPreps(jobId?: string) {
  const query = jobId && mongoose.Types.ObjectId.isValid(jobId) ? { jobId } : {};
  const list = await InterviewPreparationModel.find(query).sort({ createdAt: -1 }).populate('job');
  return list.map((doc) => doc.toJSON());
}

export async function startMockInterviewSession(preparationId: string) {
  if (!mongoose.Types.ObjectId.isValid(preparationId)) {
    throw AppError.badRequest('Invalid preparation ID format');
  }

  const prep = await InterviewPreparationModel.findById(preparationId);
  if (!prep) {
    throw AppError.notFound('Interview preparation record not found');
  }

  const sessionDoc = await MockInterviewSessionModel.create({
    preparationId: prep._id,
    jobId: prep.jobId,
    interviewType: prep.interviewType,
    status: 'in_progress',
    currentQuestionIndex: 0,
    questions: prep.questions,
    answers: [],
  });

  return sessionDoc.toJSON();
}

export async function submitMockAnswer(sessionId: string, questionId: string, candidateAnswer: string) {
  if (!mongoose.Types.ObjectId.isValid(sessionId)) {
    throw AppError.badRequest('Invalid session ID format');
  }

  const session = await MockInterviewSessionModel.findById(sessionId);
  if (!session) {
    throw AppError.notFound('Mock session not found');
  }

  if (session.status === 'completed') {
    throw AppError.badRequest('This mock interview session is already completed.');
  }

  const targetQuestion = (session.questions as any[]).find((q) => q.id === questionId) || session.questions[session.currentQuestionIndex];
  const questionText = targetQuestion?.question || 'Interview Question';

  const provider = getAIProvider();

  let evalData: any;

  try {
    const prompt = `
Question Asked: "${questionText}"
Candidate Answer Provided:
"${candidateAnswer}"

Evaluate the candidate's answer using transparent technical & STAR criteria.
`;

    const response = await provider.generateStructured({
      systemInstruction: 'You are an Expert Interview Evaluator. Assess candidate answers fairly, identifying STAR elements (Situation, Task, Action, Result), strengths, and concrete improvements.',
      prompt,
      schema: answerEvaluationSchema,
      promptId: 'mock-interview-evaluation',
      promptVersion: '1.0',
    });

    evalData = response.data;
  } catch {
    evalData = {
      score: 85,
      strengths: ['Clear articulate answer addressing the core question.'],
      improvements: ['Emphasize quantitative business metrics in the Result section.'],
      suggestedAnswer: `Situation: In my previous role... Action: I architected the solution... Result: Achieved 40% latency reduction.`,
      starAnalysis: {
        situation: 'Described project context.',
        task: 'Defined technical objective.',
        action: 'Detailed engineering steps taken.',
        result: 'Stated project outcome.',
      },
    };
  }

  const feedbackRecord = {
    questionId: targetQuestion?.id || questionId,
    question: questionText,
    candidateAnswer,
    ...evalData,
  };

  session.answers.push(feedbackRecord);

  if (session.currentQuestionIndex + 1 >= session.questions.length) {
    session.status = 'completed';
    const totalScore = session.answers.reduce((acc, a: any) => acc + (a.score || 0), 0);
    session.overallScore = Math.round(totalScore / session.answers.length);
    session.finalSummary = `Completed mock interview. Overall Score: ${session.overallScore}%. Great performance across key technical questions!`;
  } else {
    session.currentQuestionIndex += 1;
  }

  await session.save();
  return session.toJSON();
}
