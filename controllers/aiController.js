const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `You are MediGo AI Pharmacy Assistant — a friendly, knowledgeable virtual pharmacist for MediGo, an Egyptian online pharmacy.

Your role:
- Answer questions about medications, dosages, side effects, interactions
- Give health tips for common conditions (cold, fever, headache, pain, etc.)
- Help with order tracking, delivery, payment questions
- Guide users to the right product category (Pain, Vitamins, Skin, Baby, Cold, Hair, Beauty)
- Answer in the SAME LANGUAGE the user writes in (Arabic → Arabic, English → English)
- Keep responses concise, friendly, and professional
- Always recommend consulting a doctor for serious conditions
- For MediGo-specific questions: email is medigo.pharmancy@gmail.com

Important rules:
- Never give dangerous or harmful medical advice
- Always add a safety disclaimer for prescription medicines
- Be warm and helpful like a real pharmacist
- Use emojis occasionally to make responses friendly
- Keep replies under 150 words unless more detail is truly needed`;

exports.chat = async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ message: 'Please enter a message' });
  }

  // If no API key, fall back to smart rule-based
  if (!GEMINI_API_KEY) {
    return res.json({ reply: fallback(message) });
  }

  try {
    const response = await axios.post(GEMINI_URL, {
      system_instruction: {
        parts: [{ text: SYSTEM_PROMPT }]
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: message.trim() }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 300
      }
    }, {
      timeout: 10000
    });

    const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) throw new Error('Empty response from Gemini');

    res.json({ reply });

  } catch (error) {
    console.error('Gemini AI error:', error.message);
    // Fallback to rule-based if API fails
    res.json({ reply: fallback(message) });
  }
};

// Fallback rule-based responses (used if no API key or API fails)
function fallback(msg) {
  const lower = (msg || '').toLowerCase();

  if (/hello|hi|hey|مرحبا|سلام|أهلا/.test(lower))
    return '👋 Hello! I\'m MediGo AI Pharmacist. Ask me about medications, health tips, orders, or anything pharmacy-related!';

  if (/headache|pain|panadol|paracetamol|fever|صداع|ألم|حمى/.test(lower))
    return '💊 For headache/fever: Paracetamol 500mg — 1-2 tablets every 4-6 hours (max 8/day). Ibuprofen 400mg with food for pain. ⚠️ See a doctor if fever exceeds 39°C.';

  if (/cold|flu|cough|برد|كحة|إنفلونزا/.test(lower))
    return '🤒 For cold & flu: rest, drink water, Paracetamol for fever, cough syrup for cough, Vitamin C for immunity. ⚠️ See a doctor if symptoms last over 7 days.';

  if (/vitamin|supplement|فيتامين/.test(lower))
    return '🍋 Vitamins: C (1000mg/day for immunity), D3 (1000-2000 IU), Zinc (immunity). Check our Vitamins section!';

  if (/order|delivery|توصيل|طلب/.test(lower))
    return '📦 Track orders in the Orders section. Delivery: Cairo 50 EGP, outside Cairo 60 EGP. Contact: medigo.pharmancy@gmail.com';

  if (/thank|شكرا/.test(lower))
    return '😊 You\'re welcome! Stay healthy! 💚';

  return '🤔 I can help with medications, health advice, orders, and delivery. For more help: medigo.pharmancy@gmail.com';
}

exports.healthScore = async (req, res, next) => {
  try {
    const { age, weight, water, exercise } = req.body;

    const numAge = Number(age);
    const numWeight = Number(weight);
    const numWater = Number(water);
    const numExercise = Number(exercise);

    if (isNaN(numAge) || isNaN(numWeight) || isNaN(numWater) || isNaN(numExercise)) {
      return res.status(400).json({ message: 'All fields must be valid numbers' });
    }

    // Programmatic/Fallback Calculation
    let score = 70;
    const tips = [];

    // Water intake scoring
    if (numWater < 1.5) {
      score -= 10;
      tips.push(req.body.lang === 'ar' ? 'اشرب المزيد من الماء، هدفك هو 2.5 لتر على الأقل يومياً.' : 'Increase water intake: Aim for at least 2.5-3 liters daily.');
    } else if (numWater >= 2.5) {
      score += 10;
      tips.push(req.body.lang === 'ar' ? 'رائع! استمر في شرب كميات كافية من الماء للحفاظ على رطوبة جسمك.' : 'Great job on hydration! Keep drinking water consistently.');
    } else {
      score += 5;
      tips.push(req.body.lang === 'ar' ? 'حاول زيادة شرب الماء قليلاً لتصل إلى 3 لتر يومياً.' : 'Try to slightly increase water intake closer to 3 liters daily.');
    }

    // Exercise scoring
    if (numExercise < 2) {
      score -= 10;
      tips.push(req.body.lang === 'ar' ? 'مارس الرياضة أكثر: استهدف 150 دقيقة على الأقل أسبوعياً.' : 'Exercise more: Aim for at least 150 minutes of moderate exercise weekly.');
    } else if (numExercise >= 5) {
      score += 15;
      tips.push(req.body.lang === 'ar' ? 'ممتاز! مستوى نشاطك البدني رائع ويقوي مناعتك.' : 'Excellent physical activity level! It boosts your metabolism and immunity.');
    } else {
      score += 5;
      tips.push(req.body.lang === 'ar' ? 'حاول إضافة تمرين رياضي إضافي أسبوعياً لزيادة مستوى اللياقة.' : 'Try adding one more exercise session weekly to increase cardiovascular fitness.');
    }

    // Age / Weight factor check (simplistic)
    if (numWeight > 100) {
      score -= 5;
      tips.push(req.body.lang === 'ar' ? 'استشر أخصائي تغذية لتنظيم الوجبات وتقليل الوزن الزائد.' : 'Consult a dietitian to optimize nutrition and support a healthy weight.');
    } else if (numWeight < 50 && numAge > 18) {
      score -= 3;
      tips.push(req.body.lang === 'ar' ? 'تأكد من تناول وجبات كافية غنية بالبروتينات لزيادة كتلة العضلات.' : 'Ensure adequate protein and calorie intake to maintain healthy muscle mass.');
    } else {
      score += 5;
    }

    // Sleep/general tip
    tips.push(req.body.lang === 'ar' ? 'احرص على النوم لمدة 7-8 ساعات يومياً لتجديد طاقة جسمك.' : 'Prioritize getting 7-8 hours of quality sleep nightly for cell recovery.');

    // Clamp score
    score = Math.min(Math.max(score, 20), 100);

    if (GEMINI_API_KEY) {
      try {
        const prompt = `Calculate a Health Score out of 100 and provide personalized tips based on these metrics:
Age: ${numAge} years old
Weight: ${numWeight} kg
Water intake: ${numWater} liters/day
Exercise: ${numExercise} hours/week

You MUST respond strictly in the following JSON format:
{
  "score": 82,
  "tips": ["Tip 1", "Tip 2", "Tip 3"]
}`;

        const response = await axios.post(GEMINI_URL, {
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 200
          }
        }, { timeout: 8000 });

        const replyText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (replyText) {
          // Find JSON content block
          const jsonMatch = replyText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const data = JSON.parse(jsonMatch[0]);
            if (typeof data.score === 'number' && Array.isArray(data.tips)) {
              return res.json({ score: data.score, tips: data.tips });
            }
          }
        }
      } catch (err) {
        console.error('Gemini health score error, using rule-based fallback:', err.message);
      }
    }

    // Return the calculated/fallback score and tips
    res.json({ score, tips });
  } catch (error) {
    next(error);
  }
};
