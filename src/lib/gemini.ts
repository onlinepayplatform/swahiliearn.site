import { GoogleGenAI } from '@google/genai';
import { ForeignLearner, ChatMessage } from '../types';

// Client-side Gemini initializer if user supplies key, or handles simulated authentic replies
const apiKey =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) ||
  (typeof process !== 'undefined' && typeof process.env !== 'undefined' && process.env?.GEMINI_API_KEY) ||
  '';

let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch {
    aiClient = null;
  }
}

/**
 * Generate a realistic foreign learner conversational response
 */
export async function generateLearnerResponse(
  learner: ForeignLearner,
  userMessage: string,
  history: ChatMessage[]
): Promise<{ text: string; translation?: string }> {
  // If backend API or Gemini is configured, try it
  if (aiClient) {
    try {
      const conversationHistory = history
        .slice(-6)
        .map(m => `${m.sender === 'user' ? 'Native Swahili Tutor' : learner.name}: ${m.text}`)
        .join('\n');

      const prompt = `You are roleplaying as ${learner.name}, a foreign visitor learning Swahili in East Africa.
Details about you:
- Age: ${learner.age}
- Country: ${learner.country} (${learner.flag})
- Profession: ${learner.profession}
- Current Goal: ${learner.learningGoal}
- Bio: ${learner.bio}
- Swahili Level: Beginner learner trying to speak simple Swahili mixed with English.

Recent conversation:
${conversationHistory}
Native Swahili Tutor said: "${userMessage}"

Respond naturally in 1 to 2 short sentences as ${learner.name}. Express gratitude, ask a clarifying question about Swahili vocabulary or culture, or try to repeat what they said in Swahili. Don't be robotic. Be warm, friendly and curious.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt
      });

      const text = response.text ? response.text.trim() : '';
      if (text) {
        return { text };
      }
    } catch {
      // Fallback to simulated persona logic below
    }
  }

  // Simulated fallback responses customized to learner's profession and context
  return getSimulatedLearnerResponse(learner, userMessage, history.length);
}

function getSimulatedLearnerResponse(
  learner: ForeignLearner,
  userMessage: string,
  turnCount: number
): { text: string; translation?: string } {
  const lower = userMessage.toLowerCase();

  if (lower.includes('jambo') || lower.includes('habari') || lower.includes('hujambo') || lower.includes('mambo')) {
    return {
      text: `Sijambo sana! Habari za leo? Asante kwa kunikaribisha. Ninafurahi sana kufanya mazoezi ya Kiswahili na wewe leo!`,
      translation: `I am very fine! How are you today? Thank you for welcoming me. I am very happy to practice Swahili with you today!`
    };
  }

  if (lower.includes('asante') || lower.includes('karibu')) {
    return {
      text: `Asante sana pia! Je, neno "Karibu tena" linamaanisha "You are welcome again"? Napenda jinsi lugha ya Kiswahili inavyotamkwa kwa ukarimu!`,
      translation: `Thank you very much too! Does "Karibu tena" mean "You are welcome again"? I love how hospitable Swahili sounds!`
    };
  }

  if (lower.includes('kazi') || lower.includes('daktari') || lower.includes('hospitali') || lower.includes('mgonjwa')) {
    return {
      text: `Vizuri sana! Kama ${learner.profession}, ninajaribu kujifunza maneno ya kusaidia watu. Je, unaweza kunifundisha jinsi ya kusema "Usiogope, utapona haraka"?`,
      translation: `Very good! As a ${learner.profession}, I try to learn words to help people. Can you teach me how to say "Don't worry, you will recover quickly"?`
    };
  }

  if (lower.includes('pesa') || lower.includes('bei') || lower.includes('shilingi') || lower.includes('duka') || lower.includes('soko')) {
    return {
      text: `Oh yes! Jana sokoni nilitaka kununua zawadi. Nikitaka kusema "Hii bei ni ghali sana, punguza kidogo tafadhali", ninasema hivyo hivyo?`,
      translation: `Oh yes! Yesterday at the market I wanted to buy gifts. If I want to say "This price is too expensive, please lower it a bit", do I say it like that?`
    };
  }

  if (lower.includes('chakula') || lower.includes('ugali') || lower.includes('wali') || lower.includes('chai') || lower.includes('samaki') || lower.includes('nyama')) {
    return {
      text: `Mmmh, chakula cha Tanzania ni kitamu sana! Nilikula ugali na samaki wa kukaanga. Je, unaagizaje chai ya rangi au kahawa asubuhi?`,
      translation: `Mmmh, Tanzanian food is delicious! I ate ugali and fried fish. How do you order black tea or coffee in the morning?`
    };
  }

  // Persona-specific rotational pool
  const pools: Record<string, string[]> = {
    'eliza-usa': [
      `Aha, nimeelewa vizuri sasa! Wakati wa safari kule Serengeti, nataka kuwasalimia madereva kwa heshima. Je, neno "Habari za asubuhi kaka" linatosha?`,
      `Asante mwalimu wangu! Je, wanyama kama simba, tembo, na twiga wanatamkwaje kwa sauti safi? Nataka niwataje bila kukosea.`,
      `Hiyo ni nzuri sana. Nitaandika neno hili kwenye kitabu changu cha safari. Unaweza kunitajia neno jingine la kueleza shukrani?`,
      `Wow, Kiswahili ni rahisi kujifunza ukiwa na mwalimu makini kama wewe! Nitaendelea na dakika zetu za mazungumzo.`
    ],
    'mark-uk': [
      `Thank you very much! Katika kazi yangu ya udaktari kule hospitalini, napenda kuwafariji wagonjwa. Ninasemaje "Kunywa maji mengi na pumzika"?`,
      `Hiyo inanisaidia sana katika mawasiliano ya kila siku na wauguzi. Je, kuna tofauti kati ya "Ugonjwa" na "Maumivu"?`,
      `Safi sana mwalimu! Kila siku ninajisikia mwenye furaha kuongea na wazawa wa hapa Moshi. Ufafanuzi wako ni wazi sana.`
    ],
    'sarah-poland': [
      `Napenda sana misemo ya kwenye Khanga za pwani! Je, unafahamu methali yoyote maarufu ya Kiswahili unayoweza kunifundisha maana yake?`,
      `Mambo ya kitamaduni ya Bagamoyo na visiwa vya Zanzibar yananivutia sana. Asante kwa kunielekeza matamshi sahihi!`,
      `Nitasimulia marafiki zangu kule chuo kikuu jinsi Kiswahili kilivyo na heshima kubwa. Unaonaje tukiendelea na sentensi nyingine?`
    ]
  };

  const pool = pools[learner.id] || [
    `Aha, nimeelewa vizuri sasa! Asante kwa kunifundisha neno hilo. Je, ninaweza kulitunga kwenye sentensi nyingine?`,
    `Kiswahili ni lugha nzuri sana. Uelekezaji wako unanisaidia kuelewa haraka. Unaweza kunipa mfano mwingine?`,
    `Nimefurahi sana kuzungumza nawe. Kila dakika ninayoongea hapa ninaona uwezo wangu wa kuongea Kiswahili unakua!`
  ];

  const selected = pool[turnCount % pool.length];
  return {
    text: selected,
    translation: `I understood clearly! Thank you for teaching me this. Your explanation helps me improve rapidly.`
  };
}

/**
 * Quick bilingual Swahili ↔ English translator
 */
export async function translateText(text: string, direction: 'sw-to-en' | 'en-to-sw'): Promise<string> {
  if (!text.trim()) return '';

  if (aiClient) {
    try {
      const prompt = direction === 'sw-to-en'
        ? `Translate this Swahili text to natural English accurately and concisely:\n"${text}"`
        : `Translate this English text to natural modern Swahili as spoken in East Africa:\n"${text}"`;

      const res = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt
      });
      return res.text ? res.text.trim() : '';
    } catch {
      // Fallback
    }
  }

  // Quick dictionary fallback
  const commonDict: Record<string, string> = {
    'habari': 'how are you / news',
    'hujambo': 'hello',
    'sijambo': 'I am fine',
    'asante': 'thank you',
    'asante sana': 'thank you very much',
    'karibu': 'welcome',
    'kwaheri': 'goodbye',
    'shikamoo': 'respectful greeting to elders',
    'marahaba': 'response to shikamoo',
    'jambo': 'hello',
    'chakula': 'food',
    'maji': 'water',
    'pesa': 'money',
    'bei gani': 'how much is it',
    'wapi': 'where',
    'leo': 'today',
    'kesho': 'tomorrow',
    'ndiyo': 'yes',
    'hapana': 'no',
    'tafadhali': 'please'
  };

  const q = text.toLowerCase().trim();
  if (commonDict[q]) {
    return direction === 'sw-to-en' ? commonDict[q] : q;
  }

  return direction === 'sw-to-en'
    ? `Translation: "${text}" (Swahili conversational expression)`
    : `Tafsiri: "${text}" (Tafsiri ya Kiswahili)`;
}
