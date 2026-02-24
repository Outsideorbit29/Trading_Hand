import { GoogleGenAI, Type } from "@google/genai";
import { Trade, BotDecisionStep } from '../types';

// Helper to resolve the API key from multiple environments (Vite dev or Node).
const resolveApiKey = (): string | undefined => {
  try {
    // Vite exposes vars starting with VITE_ on import.meta.env in the browser during dev/build
    if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.VITE_GEMINI_API_KEY) {
      return (import.meta as any).env.VITE_GEMINI_API_KEY;
    }
  } catch (_) {}

  // Fallback for Node server-side usage
  if (typeof process !== 'undefined' && process.env && process.env.GEMINI_API_KEY) {
    return process.env.GEMINI_API_KEY;
  }
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    return process.env.API_KEY;
  }
  return undefined;
};
const createTradePrompt = (trade: Trade): string => {
  const { symbol, direction, entryPrice, exitPrice, pnl, status } = trade;
  const outcome = pnl !== undefined ? (pnl > 0 ? 'profitable' : 'losing') : 'ongoing';
  
  return `Analyze the following trade as an expert trading analyst and instructor. The trade is for ${symbol}.
- Direction: ${direction.toUpperCase()}
- Entry Price: $${entryPrice.toFixed(2)}
- Status: ${status}
${exitPrice ? `- Exit Price: $${exitPrice.toFixed(2)}` : ''}
${pnl !== undefined ? `- Profit/Loss: $${pnl.toFixed(2)} (${outcome})` : ''}

Explain the trade using common technical-analysis concepts and practical teaching points. Specifically address (briefly):
 - Price action (structure, swing highs/lows, trend)
 - Support / resistance levels and their role here
 - Liquidity (e.g., liquidity grabs or stops run)
 - Smart money concept (where institutional flow may have influenced price)
 - Orderflow or execution quality if relevant
 - Risk management and position sizing

Provide:
1) A short verdict (one sentence).
2) 3 concise bullet points explaining the trade using the concepts above.
3) One actionable suggestion to improve entries/exits or risk control.

Keep the analysis human-readable and aim for ~80-150 words. Use plain language and concrete recommendations.`;
};


export const analyzeTradeWithGemini = async (trade: Trade): Promise<string> => {
  try {
    const apiKey = resolveApiKey();
    if (!apiKey) throw new Error('Gemini API key not set. Add VITE_GEMINI_API_KEY to .env (dev) or GEMINI_API_KEY/API_KEY to the environment.');

    const ai = new GoogleGenAI({ apiKey });
    const prompt = createTradePrompt(trade);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error analyzing trade with Gemini:", error);
    if (error instanceof Error) {
        return `An error occurred during analysis: ${error.message}`;
    }
    return "An unknown error occurred during analysis.";
  }
};

export const analyzeTradeWithQuestion = async (trade: Trade, question: string): Promise<string> => {
  try {
    const apiKey = resolveApiKey();
    if (!apiKey) throw new Error('Gemini API key not set. Add VITE_GEMINI_API_KEY to .env (dev) or GEMINI_API_KEY/API_KEY to the environment.');

    const ai = new GoogleGenAI({ apiKey });
    // Build a prompt that includes trade context and the user's question
    const tradeContext = createTradePrompt(trade);
    const prompt = `${tradeContext}\n\nUser question: ${question}\nAnswer concisely.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error analyzing trade with Gemini (question):", error);
    if (error instanceof Error) {
      return `An error occurred during analysis: ${error.message}`;
    }
    return "An unknown error occurred during analysis.";
  }
};


const botDecisionSchema = {
  type: Type.OBJECT,
  properties: {
    insight: {
      type: Type.STRING,
      description: "A concise text analysis under 100 words evaluating the bot's execution and suggesting one refinement."
    },
    decisionPath: {
      type: Type.ARRAY,
      description: "A plausible, step-by-step timeline of the bot's decision-making process, containing 3 to 5 steps.",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "A short, descriptive title for the step (e.g., 'Market Scan', 'Bullish Signal', 'Execute Buy')." },
          description: { type: Type.STRING, description: "A one-sentence explanation of this step in the process." },
          indicator: { type: Type.STRING, description: "Optional. The specific data or indicator value that triggered this step, e.g., 'RSI < 30' or 'Price > 50-day MA'." },
          type: { type: Type.STRING, description: "The category of the step. Must be one of: 'market_condition', 'signal', or 'action'." },
        },
        required: ["title", "description", "type"],
      },
    },
  },
  required: ["insight", "decisionPath"],
};

const createBotVisualizationPrompt = (trade: Trade): string => {
  const { symbol, direction, entryPrice, exitPrice, pnl } = trade;
  const outcome = pnl !== undefined ? (pnl > 0 ? 'profitable' : 'losing') : 'ongoing';
  return `
Analyze the following automated stock trade for ${symbol}. The bot executed a ${direction.toUpperCase()} trade which resulted in a ${outcome} outcome.
- Entry Price: $${entryPrice.toFixed(2)}
- Exit Price: $${exitPrice?.toFixed(2)}
- Profit/Loss: $${pnl?.toFixed(2)}

First, construct a plausible step-by-step decision path that the bot might have followed (3-5 steps). For each step, include a short title and one-sentence description, and note any specific indicator or threshold that plausibly triggered the step (e.g., "EMA5 crossed EMA20", "RSI < 30").

Then, provide a concise instructor-style analysis that explains the trade outcome using technical-analysis teaching points. Briefly cover:
 - Price action and market structure (trend, support/resistance)
 - Liquidity considerations (possible liquidity grab or stop-run)
 - Smart money / institutional flow hypotheses where relevant
 - Execution quality and risk management observations

Finally, suggest one concrete refinement to the bot's logic to improve future performance.

Return the result in JSON format according to the provided schema.`;
};

export const analyzeBotTradeForVisualization = async (trade: Trade): Promise<{ insight: string; decisionPath: BotDecisionStep[] }> => {
  try {
    const apiKey = resolveApiKey();
    if (!apiKey) throw new Error('Gemini API key not set. Add VITE_GEMINI_API_KEY to .env (dev) or GEMINI_API_KEY/API_KEY to the environment.');

    const ai = new GoogleGenAI({ apiKey });
    const prompt = createBotVisualizationPrompt(trade);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: botDecisionSchema,
      },
    });
    
    // FIX: Trim whitespace from JSON response before parsing.
    const jsonResponse = JSON.parse(response.text.trim());

    if (!jsonResponse.insight || !Array.isArray(jsonResponse.decisionPath)) {
      throw new Error("Invalid JSON structure received from API.");
    }
    return jsonResponse;
  } catch (error) {
    console.error("Error analyzing bot trade with Gemini:", error);
    if (error instanceof Error) {
        throw new Error(`An error occurred during bot trade analysis: ${error.message}`);
    }
    throw new Error("An unknown error occurred during bot trade analysis.");
  }
};