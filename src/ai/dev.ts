
import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-and-store-memory.ts';
import '@/ai/flows/analyze-image.ts';
// import '@/ai/flows/generate-voice-response.ts'; // Voice response removed
import '@/ai/flows/rewrite-financial-news.ts';
import '@/ai/flows/smart-memory.ts';
import '@/ai/flows/analyze-financial-news.ts';
// import '@/ai/flows/general-conversation-flow.ts'; // Removed, functionality merged into analyze-and-store-memory
import '@/ai/flows/analyze-financial-chart.ts';
import '@/ai/flows/translate-text-flow.ts';
