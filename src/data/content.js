import { Heart, HeartHandshake, Briefcase, Building2, Users, Home, Compass } from 'lucide-react';

export const SPECIALIZATIONS = ['Love', 'Marriage', 'Career', 'Business', 'Finance', 'Relationship', 'Family'];
export const LANGUAGES = ['Hindi', 'English', 'Punjabi', 'Gujarati', 'Marathi', 'Bengali', 'Tamil'];

export const SERVICES = [
  { title: 'Love Consultation', spec: 'Love', icon: Heart, desc: 'Clarity on feelings, compatibility and the right time to move forward in love.' },
  { title: 'Marriage Guidance', spec: 'Marriage', icon: HeartHandshake, desc: 'Timing, compatibility and concerns around marriage, discussed calmly.' },
  { title: 'Career Guidance', spec: 'Career', icon: Briefcase, desc: 'Job changes, promotions and direction, read against your birth chart.' },
  { title: 'Business Guidance', spec: 'Business', icon: Building2, desc: 'Launch dates, partnerships and growth cycles for your venture.' },
  { title: 'Relationship Guidance', spec: 'Relationship', icon: Users, desc: 'Work through conflict and trust with friends, partners or colleagues.' },
  { title: 'Family Guidance', spec: 'Family', icon: Home, desc: 'Harmony at home, parenting worries and family decisions.' },
  { title: 'Life Guidance', spec: '', icon: Compass, desc: 'Big-picture questions about purpose, timing and next steps.' },
];

export const FAQS = [
  { q: 'How does online consultation work?', a: 'Pick an astrologer, choose chat or call, select a 10, 30 or 60 minute plan and pay securely. Your session starts straight after payment and ends automatically when your time is up.' },
  { q: 'How do I chat with an astrologer?', a: 'Open an astrologer who shows as Online, tap Chat Now, log in if asked, choose your duration and pay. You land directly in a private chat room with a live timer.' },
  { q: 'How do I call an astrologer?', a: 'Tap Call Now on an online astrologer and complete payment. The call runs in your browser, so there is no app to install. Allow microphone access when your browser asks.' },
  { q: 'Is payment secure?', a: 'Yes. Payments are processed by Razorpay. Our server verifies every payment signature before your consultation is unlocked, and we never see or store your card details.' },
  { q: 'What happens after my consultation expires?', a: 'The chat or call closes automatically, the message box is disabled and the session is marked completed. You can then rate the astrologer and book again whenever you like.' },
  { q: 'Can I book another consultation?', a: 'Absolutely. Return to the astrologer, pick a new plan and pay again. Each consultation is a separate purchase.' },
];

export const TESTIMONIALS = [
  { name: 'Sneha K.', image: 'https://randomuser.me/api/portraits/women/12.jpg', rating: 5, review: 'I was unsure about a job offer. A 30-minute chat gave me a clear way to weigh it. Worth every rupee.' },
  { name: 'Vikram P.', image: 'https://randomuser.me/api/portraits/men/22.jpg', rating: 5, review: 'The call connected instantly and the astrologer was patient and specific. No pressure to buy anything else.' },
  { name: 'Meera D.', image: 'https://randomuser.me/api/portraits/women/65.jpg', rating: 4, review: 'Simple to book, fair pricing and a timer that keeps things focused. I booked a second session the next week.' },
  { name: 'Arjun S.', image: 'https://randomuser.me/api/portraits/men/41.jpg', rating: 5, review: 'Clear guidance on timing for my business launch. Chat history stayed on screen so I could re-read it.' },
];
