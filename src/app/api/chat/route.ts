import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const lowerMsg = message.toLowerCase();
    
    let reply = "I'm here for you. Can you tell me more about that?";
    
    // Mock empathetic rule-based responses
    if (lowerMsg.includes('sad') || lowerMsg.includes('cry') || lowerMsg.includes('depress')) {
      reply = "I'm so sorry you're feeling sad. It's completely okay to feel this way. Remember that your feelings are valid. I'm here to listen.";
    } else if (lowerMsg.includes('stress') || lowerMsg.includes('overwhelm') || lowerMsg.includes('anxious')) {
      reply = "It sounds like you have a lot on your plate right now. Take a deep breath. You don't have to figure everything out at once.";
    } else if (lowerMsg.includes('angry') || lowerMsg.includes('mad')) {
      reply = "It's natural to feel angry sometimes. Taking a few deep breaths or stepping away for a moment might help. I'm right here if you want to vent.";
    } else if (lowerMsg.includes('happy') || lowerMsg.includes('good') || lowerMsg.includes('great')) {
      reply = "That's wonderful to hear! I'm so glad you're having a good day.";
    } else if (lowerMsg.includes('lonely') || lowerMsg.includes('alone')) {
      reply = "I hear you. Feeling lonely is really tough, but you are not alone. There are people who care, and I am here for you right now.";
    }

    // Simulate network delay for realism
    await new Promise(resolve => setTimeout(resolve, 800));

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
  }
}
