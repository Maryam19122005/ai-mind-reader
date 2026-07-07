import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function callGeminiWithRetry(model: any, userMessage: string, retries = 2): Promise<string> {
  for (let i = 0; i <= retries; i++) {
    try {
      const result = await model.generateContent(userMessage);
      return result.response.text();
    } catch (error: any) {
      if (i === retries) throw error; // last try failed, give up
      await new Promise((resolve) => setTimeout(resolve, 1000)); // wait 1 second
    }
  }
  throw new Error('Failed after retries');
}

export async function POST(req: NextRequest) {
  try {
    const { taskText } = await req.json();

    const systemPrompt = `You are a helpful assistant that converts a student's casual task description into a structured task.

Extract the following from the user's text:
- title: short clear task name
- subject: the subject/course (if mentioned, otherwise "General")
- dueDate: the deadline in YYYY-MM-DD format (if a day is mentioned like "Monday", calculate the next occurring Monday from today's date; if no date mentioned, use null)
- priority: "low", "medium", or "high" (guess based on urgency words like "urgent", "exam", or how soon the deadline is)

Respond ONLY in this exact JSON format, nothing else, no markdown, no backticks:
{"title": "...", "subject": "...", "dueDate": "...", "priority": "..."}`;

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: systemPrompt,
    });

    const today = new Date().toISOString().split('T')[0];
    const userMessage = `Today's date is ${today}. Student's task: "${taskText}"`;

    const rawText = await callGeminiWithRetry(model, userMessage);

    const cleaned = rawText.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Something went wrong, try again!' },
      { status: 500 }
    );
  }
}