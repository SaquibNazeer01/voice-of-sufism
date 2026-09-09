import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  Sparkles,
  RotateCcw,
  ExternalLink
} from 'lucide-react';

import { HERITAGE_SITES_DATA } from '../data/heritageSites';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  link?: { label: string; url?: string; action?: () => void };
}

interface SufiChatbotWidgetProps {
  onNavigateTab?: (tab: string) => void;
  onOpenSearch?: () => void;
}

/**
 * FormattedMessage: Parses bold (**text**), italic (*text*), links ([label](url)),
 * bullet points, and numbered lists into clean, elegant typography without raw asterisks.
 */
const FormattedMessage: React.FC<{ content: string; isUser: boolean }> = ({ content, isUser }) => {
  if (isUser) {
    return <p className="whitespace-pre-wrap font-medium">{content}</p>;
  }

  const renderInlineFormatted = (text: string): React.ReactNode => {
    // Matches ***bold-italic***, **bold**, *italic*, and [link](url)
    const regex = /(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      const token = match[0];
      if (token.startsWith('***') && token.endsWith('***')) {
        parts.push(
          <strong key={match.index} className="font-bold italic text-amber-300">
            {token.slice(3, -3)}
          </strong>
        );
      } else if (token.startsWith('**') && token.endsWith('**')) {
        parts.push(
          <strong key={match.index} className="font-bold text-white tracking-wide">
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith('*') && token.endsWith('*')) {
        parts.push(
          <em key={match.index} className="italic text-amber-200/90 font-serif">
            {token.slice(1, -1)}
          </em>
        );
      } else if (token.startsWith('[') && token.includes('](')) {
        const linkLabel = token.slice(1, token.indexOf(']('));
        const linkUrl = token.slice(token.indexOf('](') + 2, -1);
        parts.push(
          <a
            key={match.index}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400 hover:text-amber-300 underline font-semibold transition-colors"
          >
            {linkLabel}
          </a>
        );
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  const paragraphs = content.split('\n\n');

  return (
    <div className="space-y-2.5 text-xs leading-relaxed text-slate-200 font-sans">
      {paragraphs.map((para, pIdx) => {
        const lines = para.split('\n');
        return (
          <div key={pIdx} className="space-y-1.5">
            {lines.map((line, lIdx) => {
              const trimmed = line.trim();
              if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
                const cleanItem = trimmed.replace(/^[•\-]\s*/, '');
                return (
                  <div key={lIdx} className="flex items-start gap-2 pl-0.5 py-0.5 text-slate-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                    <div className="flex-1 leading-relaxed">
                      {renderInlineFormatted(cleanItem)}
                    </div>
                  </div>
                );
              }

              // Check if it starts with numbered item e.g. "1. " or "2. "
              const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
              if (numMatch) {
                return (
                  <div key={lIdx} className="flex items-start gap-2 pl-0.5 py-0.5 text-slate-200">
                    <span className="text-[11px] font-bold text-amber-400 flex-shrink-0 min-w-[14px]">
                      {numMatch[1]}.
                    </span>
                    <div className="flex-1 leading-relaxed">
                      {renderInlineFormatted(numMatch[2])}
                    </div>
                  </div>
                );
              }

              return (
                <p key={lIdx} className="leading-relaxed">
                  {renderInlineFormatted(line)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export const SufiChatbotWidget: React.FC<SufiChatbotWidgetProps> = ({
  onNavigateTab,
  onOpenSearch
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialMessages: ChatMessage[] = [
    {
      id: 'msg-welcome',
      sender: 'bot',
      text: "Assalamu Alaikum & Welcome to Voice of Sufism (صداۓ تصوف) 🕊️\n\nI am your digital heritage assistant. You can ask me about:\n• **Kashmiri Sufi Saints & Reshis** (Sheikh-ul-Alam, Lal Ded, Shah-e-Hamadan, Makhdoom Sahib)\n• **Historic Ziyarats & Architecture** (Charar-i-Sharief, Hazratbal, Khanqah-e-Moula, Aishmuqam)\n• **Poetry Treasury** (Vakhs, Shruks, Sufiana Kalam)\n• **Founder (Bhat Sahil) & Leadership**\n• **Lead Engineer (Saquib Nazeer) & Tech Services**\n• **MSME Registration & Submissions**\n\nHow may I assist your inquiry today?",
      timestamp: 'Just now'
    }
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem('voice_of_sufism_chat_history');
      return saved ? JSON.parse(saved) : initialMessages;
    } catch {
      return initialMessages;
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem('voice_of_sufism_chat_history', JSON.stringify(messages));
    } catch { }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickQuestions = [
    "About Voice of Sufism",
    "Founder (Bhat Sahil)",
    "Developer & Services",
    "Sheikh-ul-Alam & Shruks",
    "Hazratbal & Holy Relic",
    "Shah-e-Hamadan & Crafts",
    "Vakhs & Poetry Treasury",
    "MSME Registration",
    "Shrine Etiquette"
  ];

  const getBotResponse = (query: string): { text: string; link?: { label: string; url?: string; action?: () => void } } => {
    const q = query.toLowerCase().trim();

    // ─────────────────────────────────────────────────────────────
    // 1. GREETINGS & COURTESIES
    // ─────────────────────────────────────────────────────────────
    if (
      q === 'hi' ||
      q === 'hello' ||
      q === 'hey' ||
      q.includes('assalam') ||
      q.includes('asalam') ||
      q.includes('salaam') ||
      q.includes('salam') ||
      q.includes('adab') ||
      q.includes('khyer') ||
      q.includes('good morning') ||
      q.includes('good evening') ||
      q.includes('good afternoon')
    ) {
      return {
        text: "Hey! 🕊️\n\nWelcome to **Voice of Sufism (صداۓ تصوف)**. I am your dedicated digital archive assistant.\n\nHow may I assist you today? You can inquire about:\n• Kashmiri Sufi luminaries and Reshi masters\n• Historical shrines, architecture, and sacred relics\n• Vakhs, Shruks, and classical Sufiana poetry\n• Founder Bhat Sahil & Lead Engineer Saquib Nazeer\n• MSME legal credentials, services, or contact details."
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 2. GRATITUDE & CLOSING
    // ─────────────────────────────────────────────────────────────
    if (
      q.includes('thank') ||
      q.includes('shukriya') ||
      q.includes('jazakallah') ||
      q.includes('jazaak') ||
      q.includes('appreciate') ||
      q.includes('bye') ||
      q.includes('allah hafiz') ||
      q.includes('khuda hafiz')
    ) {
      return {
        text: "You are most welcome! May peace, light, and blessings illuminate your path. 🕊️\n\nFeel free to explore our living digital archive or ask any further questions whenever you return."
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 3. LEAD SOFTWARE ENGINEER & ARCHITECT (Saquib Nazeer)
    // ─────────────────────────────────────────────────────────────
    if (
      q.includes('developer') ||
      q.includes('developed') ||
      q.includes('engineer') ||
      q.includes('programmer') ||
      q.includes('coder') ||
      q.includes('saquib') ||
      q.includes('saakib') ||
      q.includes('who made this') ||
      q.includes('who built this') ||
      q.includes('tech stack') ||
      q.includes('technologies') ||
      q.includes('frontend') ||
      q.includes('services') ||
      q.includes('hire')
    ) {
      if (q.includes('service') || q.includes('hire') || q.includes('offer') || q.includes('portfolio') || q.includes('work')) {
        return {
          text: "**Saquib Nazeer** is the Lead Software Engineer & UI/UX Architect of Voice of Sufism.\n\n**Professional Engineering Services Offered:**\n• **Web Apps:** Dynamic, high-performance SaaS platforms & web portals.\n• **Mobile Apps:** Native & cross-platform Android/iOS applications with offline caching.\n• **Websites & Portfolios:** Premium responsive business & personal portfolio showcases.\n• **Software Systems:** Scalable microservices, database schemas & custom REST/GraphQL APIs.\n• **Chatbots:** Intelligent conversational AI agents & interactive widgets.\n• **Automations:** Seamless workflow automations, webhooks & backend pipelines.\n\n🌐 **Portfolio:** [saquibb.me](https://saquibb.me)\n📧 **Email:** bhatsaakib505@gmail.com\n📱 **WhatsApp / Direct:** +91 8899779073",
          link: { label: 'Explore Developer Portfolio (saquibb.me)', url: 'https://saquibb.me' }
        };
      }

      return {
        text: "**Saquib Nazeer** is the Lead Software Engineer & UI/UX Architect who conceptualized, architected, and built Voice of Sufism.\n\n**Engineering & Architectural Highlights:**\n• Modern frontend built with **React 19**, **TypeScript**, and **Tailwind CSS**.\n• Cloud persistence and real-time state with **Google Firebase Firestore**.\n• Secure client-side administrative cryptography using native **Web Crypto API (SHA-256)**.\n• Fully responsive, accessible, mobile-first design with dynamic appearance customization (Ivory, Sepia, Dark modes).\n\nYou can review his projects, software engineering services, and portfolio at **saquibb.me**.",
        link: { label: 'Visit Developer Website (saquibb.me)', url: 'https://saquibb.me' }
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 4. FOUNDER & MISSION DIRECTOR (Bhat Sahil)
    // ─────────────────────────────────────────────────────────────
    if (
      q.includes('founder') ||
      q.includes('bhat sahil') ||
      q.includes('sahil') ||
      q.includes('sahil amin') ||
      q.includes('owner') ||
      q.includes('who owns') ||
      q.includes('who started') ||
      q.includes('director') ||
      q.includes('editor') ||
      q.includes('leadership')
    ) {
      return {
        text: "**Bhat Sahil** is the Founder, Editor-in-Chief, and Mission Director of Voice of Sufism.\n\n**Leadership & Vision:**\n• Dedicated Kashmir cultural heritage researcher and field documentarian.\n• Spearheading the systematic documentation of endangered Sufi shrines, classical manuscripts, oral folk histories, and Reshi philosophy across the 20 districts of Jammu & Kashmir.\n• Champion of *Kashmiriyat*—the timeless Kashmiri cultural philosophy of communal brotherhood, universal compassion, and peace.\n\n**Official Correspondence:**\n• **Email:** mohmmadaminbhat1@gmail.com\n• **WhatsApp / Call:** +91 9596154384\n• **Headquarters:** Srinagar, Jammu & Kashmir\n\n**Official Social Media:**\n• **YouTube:** youtube.com/@voicesaahil1913\n• **Instagram:** @voice_of_sufism\n• **Facebook:** facebook.com/share/1BgsXBbhqw/\n• **Pinterest:** pin.it/46iHTerEz",
        link: { label: 'Read Founder Story in About Us', action: () => onNavigateTab && onNavigateTab('about') }
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 5. GOVERNMENT RECOGNITION & LEGAL MSME
    // ─────────────────────────────────────────────────────────────
    if (
      q.includes('msme') ||
      q.includes('udyam') ||
      q.includes('registration') ||
      q.includes('govt') ||
      q.includes('government') ||
      q.includes('legal') ||
      q.includes('license') ||
      q.includes('registered') ||
      q.includes('credible')
    ) {
      return {
        text: "**Official Government Credentials & Registration:**\n\nVoice of Sufism is legally registered as an authentic cultural enterprise and digital publication under the **Ministry of Micro, Small and Medium Enterprises (MSME), Government of India**.\n\n• **Udyam Registration Number:** `UDYAM-JK-11-0013563`\n• **Jurisdiction:** Srinagar, Jammu & Kashmir, India\n• **Domain:** Cultural Archiving, Heritage Research, Digital Media & Literature Preservation.\n\nThis legal certification validates our authenticity and institutional commitment to preserving Kashmir's heritage."
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 6. CONTACT & EDITORIAL DESK
    // ─────────────────────────────────────────────────────────────
    if (
      q.includes('contact') ||
      q.includes('phone') ||
      q.includes('whatsapp') ||
      q.includes('email') ||
      q.includes('number') ||
      q.includes('call') ||
      q.includes('reach') ||
      q.includes('location') ||
      q.includes('address') ||
      q.includes('office') ||
      q.includes('social') ||
      q.includes('instagram') ||
      q.includes('facebook') ||
      q.includes('youtube') ||
      q.includes('pinterest')
    ) {
      return {
        text: "**Official Contact & Editorial Desk:**\n\n• **Phone / WhatsApp:** +91 9596154384\n• **Editorial Email:** mohmmadaminbhat1@gmail.com\n• **Engineering Email:** bhatsaakib505@gmail.com\n• **Registered Office:** Shehr-e-Khaas, Srinagar, Jammu & Kashmir (190002)\n\n**Official Social Media:**\n• **YouTube:** youtube.com/@voicesaahil1913\n• **Instagram:** @voice_of_sufism\n• **Facebook:** facebook.com/share/1BgsXBbhqw/\n• **Pinterest:** pin.it/46iHTerEz",
        link: { label: 'Message Us on WhatsApp', url: 'https://wa.me/919596154384' }
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 7. ARTICLE SUBMISSION & EDITORIAL CONTRIBUTIONS
    // ─────────────────────────────────────────────────────────────
    if (
      q.includes('submit') ||
      q.includes('write') ||
      q.includes('contribute') ||
      q.includes('publish') ||
      q.includes('author') ||
      q.includes('pitch') ||
      q.includes('researcher') ||
      q.includes('manuscript')
    ) {
      return {
        text: "**Contribute to the Digital Archive:**\n\nVoice of Sufism invites historians, scholars, folklorists, and writers to submit authentic research papers, shrine chronicles, and field recordings.\n\n**Submission Guidelines:**\n1. Articles must focus on Kashmir Sufi saints, shrines, poetry, vernacular architecture, or oral traditions.\n2. Submissions should be factually verified with citations or elder oral attributions.\n3. Send your proposal or draft to **mohmmadaminbhat1@gmail.com** or via WhatsApp at **+91 9596154384**.",
        link: { label: 'Email Editorial Submission', url: 'mailto:mohmmadaminbhat1@gmail.com' }
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 8. ABOUT THE PLATFORM & MISSION VISION
    // ─────────────────────────────────────────────────────────────
    if (
      q.includes('about voice of sufism') ||
      q.includes('what is voice of sufism') ||
      q.includes('mission') ||
      q.includes('purpose') ||
      q.includes('vision') ||
      q.includes('platform') ||
      q.includes('website about')
    ) {
      return {
        text: "**Voice of Sufism (صداۓ تصوف)** is an independent, non-profit digital sanctuary dedicated to the perpetual preservation of Kashmir’s mystical heritage.\n\n**Key Strategic Pillars:**\n• **Encyclopedic Ziyarat Documentation:** In-depth surveys of centuries-old wooden shrines, pagodas, and relics.\n• **Saints Directory:** Comprehensive biographies of Reshi, Kubrawi, Suhrawardi, and Qadiri masters.\n• **Poetry Treasury:** Authentic preservation of Kashmiri Vakhs and Shruks with original script, English transliteration, and spiritual interpretations.\n• **Preserving Kashmiriyat:** Celebrating the syncretic values of interfaith harmony, environmental respect, and universal hospitality.",
        link: { label: 'Explore About Us Section', action: () => onNavigateTab && onNavigateTab('about') }
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 9. SHEIKH-UL-ALAM / NUND RESHI (Alamdar-e-Kashmir)
    // ─────────────────────────────────────────────────────────────
    if (
      q.includes('sheikh') ||
      q.includes('nund reshi') ||
      q.includes('alamdar') ||
      q.includes('sheikh-ul-alam') ||
      q.includes('noorani') ||
      q.includes('noor-ud-din') ||
      q.includes('shruk') ||
      q.includes('charar')
    ) {
      return {
        text: "**Hazrat Sheikh Noor-ud-Din Noorani (Nund Reshi / Alamdar-e-Kashmir, 1377–1438 AD):**\n\n• **Title & Honorific:** *Alamdar-e-Kashmir* (Flag-Bearer of Kashmir) and *Sheikh-ul-Alam*.\n• **Role:** Patron saint of Kashmir and founder of the indigenous Muslim Reshi movement.\n• **Ecological Vision:** Famously declared: *\"Ann poshi teli yeli wan poshi\"* (Food will last only as long as forests last)—championing environmental stewardship six centuries before modern ecology.\n• **Poetry:** Composed profound Kashmiri quatrains known as **Shruks**, which synthesize Quranic teachings with indigenous contemplative metaphors.\n• **Mausoleum:** Situated in the sacred town of **Charar-i-Sharief** in Budgam, established by Sultan Zain-ul-Abidin (Badshah) in 1438 AD.",
        link: { label: 'Explore Sufi Saints Directory', action: () => onNavigateTab && onNavigateTab('saints') }
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 10. MIR SAYYID ALI HAMADANI (Shah-e-Hamadan / Amir-e-Kabir)
    // ─────────────────────────────────────────────────────────────
    if (
      q.includes('hamadan') ||
      q.includes('shah-e-hamadan') ||
      q.includes('amir-e-kabir') ||
      q.includes('khanqah') ||
      q.includes('aurad') ||
      q.includes('700') ||
      q.includes('kubrawi')
    ) {
      return {
        text: "**Hazrat Mir Sayyid Ali Hamadani (Shah-e-Hamadan / Amir-e-Kabir, 1314–1384 AD):**\n\n• **Origin & Title:** Born in Hamadan, Iran; revered as *Amir-e-Kabir* (The Great Leader) and *Ali-e-Saani* (Second Ali).\n• **Spiritual Order:** Master of the Kubrawi Sufi Tariqa.\n• **Economic & Artisanal Renaissance:** Traveled to Kashmir with **700 companions**—scholars, theologians, calligraphers, and master craftsmen. He transformed Kashmir into *Iran-e-Sagheer* (Little Iran) by introducing Pashmina weaving, woodcarving, copperware, and papier-mâché.\n• **Monumental Shrine:** Commissioned in 1395 AD, **Khanqah-e-Moula** on the banks of River Jhelum in Old Srinagar stands as Kashmir's pre-eminent wooden monastery.\n• **Sacred Litany:** Author of the globally recited prayer collection, ***Aurad-e-Fathiyya***.",
        link: { label: 'Explore Sufi Saints Directory', action: () => onNavigateTab && onNavigateTab('saints') }
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 11. LAL DED (Lalleshwari / Lalla Arifa)
    // ─────────────────────────────────────────────────────────────
    if (
      q.includes('lal ded') ||
      q.includes('lalleshwari') ||
      q.includes('lalla') ||
      q.includes('vakh') ||
      q.includes('vakhs')
    ) {
      return {
        text: "**Lal Ded (Lalleshwari / Lalla Arifa, 14th Century AD):**\n\n• **Spiritual Identity:** The venerable mystic poetess and saint of Kashmir whose life stands at the cross-currents of Kashmiri Trika Shaivism and Islamic Sufism.\n• **Poetic Form:** Pioneer of **Vakhs** (aphoristic four-line spiritual verses), which constitute the foundational fountainhead of Kashmiri vernacular literature.\n• **Philosophy:** Preached the transcendence of superficial ritualism, non-duality (*Trik-shastra*), inner divine communion, and universal love across all communities.\n• **Connection to Nund Reshi:** Revered as a spiritual mother figure to Sheikh Noor-ud-Din Noorani.",
        link: { label: 'Read Vakhs in Poetry Treasury', action: () => onNavigateTab && onNavigateTab('poetry') }
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 12. SHEIKH HAMZA MAKHDOOM (Sultan-ul-Arifeen)
    // ─────────────────────────────────────────────────────────────
    if (
      q.includes('makhdoom') ||
      q.includes('sultan-ul-arifin') ||
      q.includes('sultan-ul-arifeen') ||
      q.includes('mehboob-ul-alam') ||
      q.includes('hari parbat') ||
      q.includes('koh-e-maran')
    ) {
      return {
        text: "**Hazrat Sultan-ul-Arifeen Sheikh Hamza Makhdoom (1494–1576 AD):**\n\n• **Honorific Titles:** *Sultan-ul-Arifeen* (King of Gnostics) and *Mehboob-ul-Alam* (Beloved of the World).\n• **Patron Saint:** Recognized as the spiritual guardian of Srinagar and the paramount leader of the Suhrawardi Sufi Order in Kashmir.\n• **Location:** His multi-tiered shrine rests on the southern slopes of **Koh-e-Maran (Hari Parbat)** in Srinagar, renowned for stone terraces, Khatamband ceilings, and ropeway access.\n• **Urs Tradition:** Devotees observe the annual 13-day Urs in the Islamic month of Safar with the recitation of ***Khatam-e-Makhdoomiya*** and communal *Tahri* distribution.",
        link: { label: 'Explore Sufi Saints Directory', action: () => onNavigateTab && onNavigateTab('saints') }
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 13. BABA ZAIN-UD-DIN WALI & AISHMUQAM
    // ─────────────────────────────────────────────────────────────
    if (
      q.includes('aishmuqam') ||
      q.includes('zain-ud-din') ||
      q.includes('ziya singh') ||
      q.includes('zool') ||
      q.includes('torchlight')
    ) {
      return {
        text: "**Hazrat Baba Zain-ud-Din Wali & Aishmuqam Shrine:**\n\n• **Origin:** Born as Prince Ziya Singh of Kishtwar; embraced the Reshi order after meeting Nund Reshi and became his premier Khalifa.\n• **Sacred Cave Sanctuary:** Perched atop a hill overlooking the Lidder Valley near Pahalgam (Anantnag). The inner sanctum is a natural mountain cavern where the saint meditated in austere solitude.\n• **The Historic Zool Festival:** Celebrated annually in late April. Thousands of devotees illuminate the hillside by carrying flaming pine torches (*Mashals* / *Leeshi*) up the stone staircases in commemoration of spiritual light triumphing over darkness.",
        link: { label: 'Explore Featured Ziyarats in Footer', action: () => onNavigateTab && onNavigateTab('home') }
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 14. DARGAH HAZRATBAL (Dal Lake & Sacred Relic)
    // ─────────────────────────────────────────────────────────────
    if (
      q.includes('hazratbal') ||
      q.includes('relic') ||
      q.includes('moi-e-muqqadas') ||
      q.includes('asar-e-sharief') ||
      q.includes('didar') ||
      q.includes('dal lake')
    ) {
      return {
        text: "**Dargah Hazratbal (Asar-e-Sharief, Dal Lake, Srinagar):**\n\n• **The Sacred Enshrinement:** Houses the ***Moi-e-Muqqadas***—the holy hair relic of Prophet Muhammad ﷺ, brought to Kashmir in 1699 AD during the reign of Emperor Aurangzeb by Khwaja Nur-ud-Din Eshai.\n• **Sacred Architecture:** Kashmir's only grand white marble domed sanctuary, crafted from Makrana marble with tall minarets and expansive Mughal-style lakeside lawns facing Dal Lake.\n• **Public Display (Didar):** The sacred relic is revealed to hundreds of thousands of worshippers on Eid Milad-un-Nabi ﷺ, Meraj-un-Nabi, and auspicious Friday congregations.",
        link: { label: 'Explore Featured Ziyarats in Footer', action: () => onNavigateTab && onNavigateTab('home') }
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 15. JAMIA MASJID SRINAGAR
    // ─────────────────────────────────────────────────────────────
    if (
      q.includes('jamia') ||
      q.includes('nowhatta') ||
      q.includes('378') ||
      q.includes('pillars') ||
      q.includes('sikandar')
    ) {
      return {
        text: "**Jamia Masjid Srinagar (Grand Cathedral Mosque, Nowhatta):**\n\n• **Commissioning:** Commissioned in 1394–1400 AD by Sultan Sikandar under the guidance of Mir Muhammad Hamadani, and later enlarged by Sultan Zain-ul-Abidin (Badshah).\n• **Monolithic Timber Engineering:** The vast cloisters are supported by **378 monolithic pillars**, each sculpted from a single colossal deodar tree trunk standing up to 50 feet high.\n• **Courtyard:** Features a tranquil Persian quadrangle (*Chahar Bagh*) courtyard with a central stone fountain, accommodating over 33,000 worshippers for Friday congregations and Jumu'at-ul-Vida.",
        link: { label: 'Explore Featured Ziyarats in Footer', action: () => onNavigateTab && onNavigateTab('home') }
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 16. FEATURED ZIYARATS (General Shrines Overview)
    // ─────────────────────────────────────────────────────────────
    if (
      q.includes('shrine') ||
      q.includes('ziyarat') ||
      q.includes('places to visit') ||
      q.includes('dargah') ||
      q.includes('astan') ||
      q.includes('tomb') ||
      q.includes('monastery')
    ) {
      return {
        text: "**Kashmir's Featured Ziyarats & Shrines:**\n\nOur platform documents the spiritual chronicles, timber craftsmanship, and Urs traditions of Kashmir's iconic shrines:\n\n1. **Charar-i-Sharief (Budgam):** Mausoleum of Sheikh-ul-Alam Nund Reshi.\n2. **Khanqah-e-Moula (Srinagar):** 14th-century riverbank wooden monastery of Shah-e-Hamadan.\n3. **Dargah Hazratbal (Dal Lake):** White marble dome enshrining the *Moi-e-Muqqadas*.\n4. **Aishmuqam Shrine (Anantnag):** Hillside cave hermitage of Baba Zain-ud-Din & the Zool festival.\n5. **Makhdoom Sahib (Hari Parbat):** Terraced Suhrawardi sanctuary of Sultan-ul-Arifeen.\n6. **Jamia Masjid (Nowhatta):** Grand Indo-Saracenic wooden mosque with 378 deodar pillars.\n\n*Click on any featured shrine in the footer to open the comprehensive photo gallery, historical chronicle, and Google Maps GPS navigation.*",
        link: { label: 'View Featured Ziyarats in Footer', action: () => onNavigateTab && onNavigateTab('home') }
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 17. POETRY TREASURY & SUFIANA KALAM
    // ─────────────────────────────────────────────────────────────
    if (
      q.includes('poetry') ||
      q.includes('poem') ||
      q.includes('verse') ||
      q.includes('kalam') ||
      q.includes('sufiana') ||
      q.includes('ghazal') ||
      q.includes('santoor') ||
      q.includes('song') ||
      q.includes('music')
    ) {
      return {
        text: "**Kashmiri Mystical Poetry & Sufiana Kalam:**\n\n• **Vakhs:** Classical four-line philosophical sayings pioneered by Lal Ded.\n• **Shruks:** Rhymed spiritual quatrains composed by Sheikh-ul-Alam Nund Reshi.\n• **Sufiana Kalam:** Kashmir's centuries-old choral classical music, performed in traditional *Maqams* using the hundred-stringed **Santoor**, **Saaz-e-Kashmir**, **Sehtar**, and **Tabla**.\n• **Master Poets:** Features celebrated verses of Rasul Mir, Mahmud Gami, Shams Faqir, Wahab Khar, and Samad Mir.\n\nVisit the **Poetry Treasury** tab to read original Kashmiri script, phonetic transliterations, and spiritual English translations.",
        link: { label: 'Open Poetry Treasury', action: () => onNavigateTab && onNavigateTab('poetry') }
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 18. KASHMIRIYAT & THE RESHI MOVEMENT
    // ─────────────────────────────────────────────────────────────
    if (
      q.includes('kashmiriyat') ||
      q.includes('reshi') ||
      q.includes('movement') ||
      q.includes('syncretism') ||
      q.includes('philosophy') ||
      q.includes('harmony') ||
      q.includes('peace')
    ) {
      return {
        text: "**Kashmiriyat & The Indigenous Reshi Order:**\n\n• ***Kashmiriyat:*** The centuries-old cultural identity of Kashmir founded on communal harmony, shared linguistic heritage, syncretic brotherhood, and unconditional hospitality.\n• **The Reshi Order:** Founded by Nund Reshi in the 14th century, the Reshi movement is unique to Kashmir. Reshis practiced strict non-violence (*Ahimsa*), ecological conservation, planting fruit trees, vegetarian diets, and solitary contemplation.\n• **Living Legacy:** Today, Kashmir's shrines continue this legacy through uninterrupted communal Langars (kitchens) open to seekers of all backgrounds.",
        link: { label: 'Explore About Us Section', action: () => onNavigateTab && onNavigateTab('about') }
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 19. TRADITIONAL KASHMIRI HANDICRAFTS & ARCHITECTURE
    // ─────────────────────────────────────────────────────────────
    if (
      q.includes('craft') ||
      q.includes('crafts') ||
      q.includes('pashmina') ||
      q.includes('kani') ||
      q.includes('khatamband') ||
      q.includes('pinjrakari') ||
      q.includes('wood') ||
      q.includes('timber') ||
      q.includes('papier') ||
      q.includes('copper') ||
      q.includes('samovar')
    ) {
      return {
        text: "**Kashmiri Heritage Crafts & Vernacular Architecture:**\n\nIntroduced primarily by Shah-e-Hamadan's 700 artisans in the 14th century:\n\n• **Khatamband:** Interlocking polygonal pine wood ceiling panels hand-fitted without glue or nails.\n• **Pinjrakari:** Intricate geometric lattice woodwork used in shrine windows and screens.\n• **Pashmina & Kani Shawls:** World-renowned luxury textiles hand-woven from Changthangi goat wool.\n• **Papier-Mâché:** Exquisite lacquer art hand-painted in vibrant polychrome on shrine ceilings and decorative artifacts.\n• **Copperware & Samovar:** Hand-engraved (*Kandkari*) copper vessels used for brewing salty *Nun Chai* and saffron *Kehwa*."
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 20. SHRINE VISITOR ETIQUETTE & GUIDELINES
    // ─────────────────────────────────────────────────────────────
    if (
      q.includes('etiquette') ||
      q.includes('rule') ||
      q.includes('rules') ||
      q.includes('dress') ||
      q.includes('cloth') ||
      q.includes('shoe') ||
      q.includes('shoes') ||
      q.includes('women') ||
      q.includes('photo') ||
      q.includes('timing')
    ) {
      return {
        text: "**Sacred Shrine Etiquette & Visitation Guidelines:**\n\n1. **Footwear:** Remove shoes at the designated outer marble plinth or custodian counter before entering.\n2. **Modest Attire:** Modest clothing covering arms, legs, and shoulders is mandatory. Both men and women should carry a scarf or cap for head covering.\n3. **Sanctity & Silence:** Maintain quiet reverence; avoid phone calls and loud discussions inside the inner tomb chamber.\n4. **Photography:** Permitted in outer courtyards and gardens; avoid flash photography or photographing solitary worshippers without permission.\n5. **Langar & Charity:** Charitable contributions for community kitchens can be deposited at official Waqf/Trust counters."
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 21. PLATFORM FEATURES & NAVIGATION GUIDE
    // ─────────────────────────────────────────────────────────────
    if (
      q.includes('search') ||
      q.includes('find') ||
      q.includes('bookmark') ||
      q.includes('save') ||
      q.includes('dark mode') ||
      q.includes('theme') ||
      q.includes('font') ||
      q.includes('how to use') ||
      q.includes('feature')
    ) {
      return {
        text: "**Website Features & Navigation Guide:**\n\n• **Search (Ctrl+K):** Click the search icon in the navigation bar to search across all articles, saints, and shrines.\n• **Bookmarks:** Click the bookmark ribbon on any story to save it locally for offline reading without requiring login.\n• **Appearance Modes:** Toggle between Ivory, Sepia, and Dark reading modes, or scale font sizes using the settings icon.\n• **Saints Directory:** Explore detailed biographical profiles of over a dozen Kashmiri spiritual masters.\n• **Poetry Treasury:** Listen to and study classical Vakhs, Shruks, and Sufiana verses.\n• **Featured Ziyarats:** Explore the 6 heritage shrines in the footer with stories, architecture, and Google Maps GPS navigation."
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 22. SPONSORSHIP & SUPPORTING THE MISSION
    // ─────────────────────────────────────────────────────────────
    if (
      q.includes('sponsor') ||
      q.includes('donate') ||
      q.includes('support') ||
      q.includes('patron') ||
      q.includes('fund')
    ) {
      return {
        text: "**Support Voice of Sufism:**\n\nWe welcome cultural patrons, local enterprises, academic institutions, and philanthropy partners who wish to sponsor the digital archiving of Kashmir's sacred heritage.\n\n• **Brand Recognition:** Featured in our Sponsors & Patrons directory.\n• **Preservation Impact:** Funds direct field documentation, translation of rare manuscripts, and shrine photography.\n• **Inquiries:** Contact our Mission Director at **mohmmadaminbhat1@gmail.com** or WhatsApp **+91 9596154384**.",
        link: { label: 'Explore Sponsors & Patrons', action: () => onNavigateTab && onNavigateTab('sponsors') }
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 23. COMPREHENSIVE, PROFESSIONAL INTELLIGENT FALLBACK
    // ─────────────────────────────────────────────────────────────
    return {
      text: "Thank you for reaching out to **Voice of Sufism (صداۓ تصوف)**. 🕊️\n\nI want to make sure you find precisely what you are seeking. You can ask me about:\n\n• **Spiritual Luminaries:** Sheikh-ul-Alam Nund Reshi, Shah-e-Hamadan, Lal Ded, Makhdoom Sahib, Baba Zain-ud-Din.\n• **Sacred Shrines:** Charar-i-Sharief, Khanqah-e-Moula, Dargah Hazratbal, Aishmuqam, Jamia Masjid.\n• **Poetry & Wisdom:** Kashmiri Vakhs, Shruks, Sufiana Kalam, and Reshi philosophy.\n• **Platform Leadership:** Founder Bhat Sahil, Lead Engineer Saquib Nazeer, or dev services.\n• **Legal & Contact:** MSME Registration (UDYAM-JK-11-0013563) or submitting articles.\n\n*Please type your question or select one of the quick suggestions below.*",
      link: { label: 'Explore Home Stories', action: () => onNavigateTab && onNavigateTab('home') }
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      const botReply = getBotResponse(query);
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botReply.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        link: botReply.link
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 450);
  };

  const handleResetChat = () => {
    setMessages(initialMessages);
    sessionStorage.removeItem('voice_of_sufism_chat_history');
  };

  return (
    <>
      {/* ─── FLOATING CHAT TRIGGER BUTTON ─── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-5 z-40 p-3.5 sm:px-4 sm:py-2.5 rounded-full bg-[#09090B] text-amber-300 border border-amber-400/60 shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center space-x-2 backdrop-blur-md group hover:bg-red-950"
        title="Ask Voice of Sufism Assistant"
        aria-label="Open Chat Assistant"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <MessageSquare className="w-4 h-4 text-amber-400" />
        <span className="hidden sm:inline font-bold text-xs text-amber-100 group-hover:text-white">
          Ask Assistant
        </span>
      </button>

      {/* ─── PROFESSIONAL CHAT WINDOW ─── */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[92vw] sm:w-[380px] h-[500px] max-h-[80vh] bg-[#09090B] text-white rounded-3xl shadow-2xl border border-red-900/80 overflow-hidden flex flex-col justify-between animate-scaleIn">

          {/* Top Bar */}
          <div className="bg-[#450A0A] p-3.5 border-b border-red-900/80 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-black border border-amber-400/50 flex items-center justify-center text-amber-400 shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-xs text-amber-200 flex items-center space-x-1">
                  <span>Voice of Sufism Assistant</span>
                  <Sparkles className="w-3 h-3 text-amber-400" />
                </h3>
                <p className="text-[10px] text-amber-100/70">Online • Ask any question</p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={handleResetChat}
                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-red-950 transition-colors"
                title="Reset Conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-red-950 transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs font-sans">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div
                  className={`p-3.5 rounded-2xl max-w-[88%] leading-relaxed ${msg.sender === 'user'
                    ? 'bg-amber-400 text-black font-semibold rounded-br-none shadow-sm'
                    : 'bg-[#18181B] text-slate-200 border border-slate-800 rounded-bl-none shadow-sm space-y-2'
                    }`}
                >
                  <FormattedMessage content={msg.text} isUser={msg.sender === 'user'} />

                  {/* Single Clean Action Link if present */}
                  {msg.link && (
                    <div className="pt-2 border-t border-slate-700/60 mt-2">
                      {msg.link.url ? (
                        <a
                          href={msg.link.url}
                          target={msg.link.url.startsWith('http') ? '_blank' : undefined}
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-red-950 hover:bg-red-900 text-amber-300 border border-amber-400/40 text-[11px] font-bold transition-all shadow-xs"
                        >
                          <span>{msg.link.label}</span>
                          <ExternalLink className="w-3 h-3 ml-0.5" />
                        </a>
                      ) : (
                        <button
                          onClick={() => {
                            if (msg.link?.action) msg.link.action();
                            setIsOpen(false);
                          }}
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-red-950 hover:bg-red-900 text-amber-300 border border-amber-400/40 text-[11px] font-bold transition-all shadow-xs"
                        >
                          <span>{msg.link.label}</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <span className="text-[9px] text-slate-500 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center space-x-2 text-slate-400 text-xs pl-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions Slider */}
          <div className="px-3 py-2 bg-black/50 border-t border-red-900/50 overflow-x-auto no-scrollbar flex items-center space-x-1.5 flex-shrink-0">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-red-950/70 hover:bg-red-900 text-amber-200 text-[10px] font-medium border border-red-900/60 transition-colors flex-shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-black border-t border-red-900/80 flex items-center space-x-2 flex-shrink-0"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 p-2.5 rounded-xl bg-[#18181B] text-white border border-red-900/60 text-xs focus:outline-none focus:ring-1 focus:ring-amber-400 placeholder-slate-500"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="p-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold shadow-md transition-all active:scale-95"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
