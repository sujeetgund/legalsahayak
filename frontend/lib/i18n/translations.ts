export type Language = "en" | "hi";

export const LANGUAGE_STORAGE_KEY = "legalsahayak_language";

export const translations = {
  en: {
    common: {
      language: "Language",
      english: "English",
      hindi: "Hindi",
      legalSahayak: "LegalSahayak",
      termsOfService: "Terms of Service",
      privacyPolicy: "Privacy Policy",
      continue: "Continue",
      loading: "Loading...",
      submit: "Submit",
    },
    header: {
      toggleMenu: "Toggle menu",
      aiAssistant: "AI Assistant",
      community: "Community",
      dashboard: "Dashboard",
      searchPlaceholder: "Search the platform...",
      freePlan: "Free Plan",
      profileSettings: "Profile Settings",
      manageAccount: "Manage your account",
      viewOverview: "View your overview",
      quickAccess: "Quick Access",
      communityForum: "Community Forum",
      legalLibrary: "Legal Library",
      helpSupport: "Help & Support",
      downloadData: "Download My Data",
      logout: "Log Out",
      unknownUser: "User",
      languageLabel: "Interface Language",
    },
    home: {
      legalHelpline: "24/7 Legal Helpline",
      heroTitle: "AI-Powered Legal Guidance",
      heroDescription:
        "Get accurate legal answers backed by real laws and regulations-free, instant, and in your language.",
      getHelpNow: "Get Legal Help Now",
      howItWorks: "How It Works",
      legalResourcesIndexed: "Legal Resources Indexed",
      avgResponseTime: "Average Response Time",
      languagesSupported: "Languages Supported",
      alwaysAvailable: "Always Available & Free",
      justiceInSteps: "Justice in 4 Simple Steps",
      step1Title: "1. Share Your Problem",
      step1Text:
        "Tell us your issue in your own words, in any supported language. You can also upload documents for analysis.",
      step2Title: "2. AI Analyzes Laws",
      step2Text:
        "Our AI instantly scans thousands of central and state laws to find the ones relevant to your case.",
      step3Title: "3. Get Clear Answers",
      step3Text:
        "Receive a simple, easy-to-understand summary of your rights and a step-by-step action plan.",
      step4Title: "4. Take Action",
      step4Text:
        "Use our guidance to draft letters, file complaints, and confidently resolve your issue.",
      whatMakesDifferent: "What Makes LegalSahayak Different?",
      differentDescription:
        "We use advanced technology that understands your unique situation and explains every legal recommendation step-by-step.",
      findHelpTitle: "Find Help for Your Issue",
      findHelpDescription: "We cover a wide range of common legal problems.",
      categorySupport:
        "Landlord disputes, faulty products, salary issues, and more.",
      startHere: "Start Here",
      joinThousands: "Join Thousands Who Found Justice",
      joinDescription:
        "100% Free | No Registration Required | Completely Confidential",
      startJourney: "Start Your Legal Journey",
      personalizedTitle: "Personalized for You",
      personalizedDescription:
        "Smart AI adapts to your location, demographics, and unique circumstances. Get legal insights that actually apply to your situation.",
      ragTitle: "Advanced RAG System",
      ragDescription:
        "Retrieval-Augmented Generation grounds every answer in real laws, regulations, and precedents.",
      transparentTitle: "Transparent & Explainable",
      transparentDescription:
        "We show the laws, articles, and reasoning behind each recommendation so you can trust the guidance.",
      broaderTitle: "Broader Coverage",
      broaderDescription:
        "From family law to employment disputes and consumer rights, we cover diverse legal domains.",
      categoryProperty: "Property & Real Estate",
      categoryConsumer: "Consumer Complaints",
      categoryFamily: "Family Law",
      categoryBusiness: "Business & Contracts",
      categoryLabor: "Labor & Employment",
      categoryOther: "Other Legal Issues",
    },
    auth: {
      tagline: "AI-Powered Legal Assistance",
      welcomeBack: "Welcome back",
      signinDescription: "Sign in to access your legal assistance dashboard",
      email: "Email",
      password: "Password",
      rememberMe: "Remember me",
      forgotPassword: "Forgot password?",
      signingIn: "Signing in...",
      signIn: "Sign In",
      noAccount: "Don't have an account?",
      signUp: "Sign up",
      bySignin: "By signing in, you agree to our",
      createAccount: "Create your account",
      signupDescription:
        "Join us to access AI-powered legal assistance and community insights",
      fullName: "Full Name",
      confirmPassword: "Confirm Password",
      creatingAccount: "Creating account...",
      createAccountButton: "Create Account",
      alreadyAccount: "Already have an account?",
      bySignup: "By signing up, you agree to our",
      signInLink: "Sign in",
    },
    onboarding: {
      companion: "Your Legal Companion",
      welcomeTitle: "Welcome! Let's Get Started",
      welcomeDescription:
        "Help us understand you better so we can provide personalized legal guidance tailored to your needs.",
      aiGuidance: "AI-Powered Guidance",
      aiGuidanceDesc: "Get instant legal advice powered by advanced AI",
      forEveryone: "For Everyone",
      forEveryoneDesc: "Accessible legal help for all Indians",
      knowRights: "Know Your Rights",
      knowRightsDesc: "Understand and exercise your legal rights",
      privacyFirst: "Privacy First:",
      privacyDesc:
        "Your information is secure and only used to personalize your experience. We never share your data.",
      tellUs: "Tell Us About Yourself",
      tellUsDesc:
        "This helps us provide relevant legal information for your situation",
      age: "Age",
      gender: "Gender",
      stateRegion: "State/Region",
      education: "Education Level",
      occupation: "Occupation",
      selectGender: "Select gender",
      selectState: "Select your state",
      selectEducation: "Select education level",
      selectOccupation: "Select your occupation",
      male: "Male",
      female: "Female",
      other: "Other",
      preferNot: "Prefer not to say",
      continueButton: "Continue to LegalSahayak",
      termsNote:
        "By continuing, you agree to our Terms of Service and Privacy Policy",
    },
    forum: {
      title: "Community Forum",
      subtitle: "Connect with others and discuss legal topics",
      comingSoon: "Forum Coming Soon",
      comingSoonDesc: "Our community forum is being prepared. Check back soon!",
      protectedRoute: "This route is available only to authenticated users.",
    },
    dashboard: {
      title: "Your Dashboard",
      subtitle: "Manage your profile and access legal tools",
      memberSince: "Member since",
      askAssistant: "Ask AI Assistant",
      askAssistantDesc: "Get instant legal guidance",
      communityForum: "Community Forum",
      communityForumDesc: "Connect with others",
      legalResources: "Legal Resources",
      legalResourcesDesc: "Browse legal library",
      basicInfo: "Basic Information",
      additionalDetails: "Additional Details",
      accountSettings: "Account Settings",
    },
    assistant: {
      loadingTitle: "Analyzing your question...",
      loadingDesc: "This may take a moment",
      title: "AI Legal Assistant",
      subtitle:
        "Your confidential, AI-powered guide to understanding your rights. Ask any legal question and get clear, actionable answers.",
      inputPlaceholder: "My landlord won't return my security deposit...",
      resourcesTitle: "Or, Explore Other Resources",
      resourcesSubtitle:
        "Dive deeper into legal topics, learn from others, or browse official documents.",
      communityStories: "Community Stories",
      communityStoriesDesc:
        "Read real-life experiences from people who have faced similar legal issues.",
      browseStories: "Browse Stories",
      exploreTopics: "Explore Legal Topics",
      exploreTopicsDesc:
        "Browse our library of simplified legal acts, codes, and regulations.",
      goToLibrary: "Go to Library",
      genericError: "Sorry, I encountered an error. Please try again.",
      jurisdiction: "Jurisdiction: India",
      confidence: "Confidence",
      aiGeneratedGuidance: "AI-generated guidance",
      answerTab: "Answer",
      legalReferencesTab: "Legal References",
      actionPlanTab: "Action Plan",
      noLegalReferences: "No legal references provided.",
      noActionPlan: "No action plan provided.",
      askFirstQuestion: "Ask your first question",
      firstQuestionHint:
        "Share your situation. We will tailor the answer to your profile.",
      quickPrompt1: "I work on daily wages. What are my rights?",
      quickPrompt2: "How do I file a consumer complaint?",
      quickPrompt3: "What documents do I need for a rental agreement?",
      detailedInputPlaceholder:
        "Describe your legal situation in detail. Include dates, locations, and relevant context...",
      tipText: "Tip: Provide context and location for more accurate guidance.",
      poweredBy: "Powered by LegalSahayak AI",
    },
  },
  hi: {
    common: {
      language: "भाषा",
      english: "अंग्रेज़ी",
      hindi: "हिंदी",
      legalSahayak: "लीगलसहायक",
      termsOfService: "सेवा की शर्तें",
      privacyPolicy: "गोपनीयता नीति",
      continue: "जारी रखें",
      loading: "लोड हो रहा है...",
      submit: "सबमिट करें",
    },
    header: {
      toggleMenu: "मेनू टॉगल करें",
      aiAssistant: "एआई सहायक",
      community: "समुदाय",
      dashboard: "डैशबोर्ड",
      searchPlaceholder: "प्लेटफॉर्म में खोजें...",
      freePlan: "फ्री प्लान",
      profileSettings: "प्रोफाइल सेटिंग्स",
      manageAccount: "अपना खाता प्रबंधित करें",
      viewOverview: "अपना ओवरव्यू देखें",
      quickAccess: "त्वरित पहुंच",
      communityForum: "कम्युनिटी फोरम",
      legalLibrary: "कानूनी पुस्तकालय",
      helpSupport: "सहायता और समर्थन",
      downloadData: "मेरा डेटा डाउनलोड करें",
      logout: "लॉग आउट",
      unknownUser: "उपयोगकर्ता",
      languageLabel: "इंटरफेस भाषा",
    },
    home: {
      legalHelpline: "24/7 कानूनी हेल्पलाइन",
      heroTitle: "एआई आधारित कानूनी मार्गदर्शन",
      heroDescription:
        "वास्तविक कानूनों और नियमों पर आधारित सटीक कानूनी उत्तर पाएं-मुफ्त, तुरंत और आपकी भाषा में।",
      getHelpNow: "अभी कानूनी मदद लें",
      howItWorks: "यह कैसे काम करता है",
      legalResourcesIndexed: "कानूनी संसाधन इंडेक्स",
      avgResponseTime: "औसत प्रतिक्रिया समय",
      languagesSupported: "समर्थित भाषाएं",
      alwaysAvailable: "हमेशा उपलब्ध और मुफ्त",
      justiceInSteps: "4 सरल चरणों में न्याय",
      step1Title: "1. अपनी समस्या साझा करें",
      step1Text:
        "अपनी समस्या अपनी भाषा में बताएं। आप दस्तावेज़ भी अपलोड कर सकते हैं।",
      step2Title: "2. एआई कानूनों का विश्लेषण करता है",
      step2Text:
        "हमारा एआई आपके मामले से जुड़े केंद्रीय और राज्य कानून तुरंत खोजता है।",
      step3Title: "3. स्पष्ट उत्तर पाएं",
      step3Text:
        "अपने अधिकारों का सरल सारांश और चरण-दर-चरण कार्य योजना प्राप्त करें।",
      step4Title: "4. कार्रवाई करें",
      step4Text:
        "शिकायत दर्ज करने, पत्र लिखने और समाधान पाने के लिए मार्गदर्शन का उपयोग करें।",
      whatMakesDifferent: "लीगलसहायक को अलग क्या बनाता है?",
      differentDescription:
        "हम उन्नत तकनीक का उपयोग करते हैं जो आपकी स्थिति समझती है और हर सिफारिश का कारण बताती है।",
      findHelpTitle: "अपनी समस्या के लिए मदद खोजें",
      findHelpDescription:
        "हम सामान्य कानूनी समस्याओं की विस्तृत श्रेणी कवर करते हैं।",
      categorySupport:
        "मकान मालिक विवाद, खराब उत्पाद, वेतन समस्याएं और बहुत कुछ।",
      startHere: "यहां से शुरू करें",
      joinThousands: "हजारों लोगों की तरह न्याय पाएं",
      joinDescription: "100% मुफ्त | पंजीकरण आवश्यक नहीं | पूरी तरह गोपनीय",
      startJourney: "अपनी कानूनी यात्रा शुरू करें",
      personalizedTitle: "आपके लिए व्यक्तिगत",
      personalizedDescription:
        "स्मार्ट एआई आपकी लोकेशन और परिस्थितियों के अनुसार सलाह देता है।",
      ragTitle: "उन्नत RAG सिस्टम",
      ragDescription:
        "हर उत्तर वास्तविक कानूनों, नियमों और उदाहरणों पर आधारित होता है।",
      transparentTitle: "पारदर्शी और समझने योग्य",
      transparentDescription:
        "हम हर सिफारिश के पीछे कानून और कारण बताते हैं ताकि आप भरोसा कर सकें।",
      broaderTitle: "व्यापक कवरेज",
      broaderDescription:
        "परिवार कानून से उपभोक्ता अधिकार तक हम कई कानूनी क्षेत्रों को कवर करते हैं।",
      categoryProperty: "संपत्ति और रियल एस्टेट",
      categoryConsumer: "उपभोक्ता शिकायतें",
      categoryFamily: "परिवार कानून",
      categoryBusiness: "व्यवसाय और अनुबंध",
      categoryLabor: "श्रम और रोजगार",
      categoryOther: "अन्य कानूनी मुद्दे",
    },
    auth: {
      tagline: "एआई आधारित कानूनी सहायता",
      welcomeBack: "वापसी पर स्वागत है",
      signinDescription: "अपना कानूनी डैशबोर्ड देखने के लिए साइन इन करें",
      email: "ईमेल",
      password: "पासवर्ड",
      rememberMe: "मुझे याद रखें",
      forgotPassword: "पासवर्ड भूल गए?",
      signingIn: "साइन इन हो रहा है...",
      signIn: "साइन इन",
      noAccount: "खाता नहीं है?",
      signUp: "साइन अप करें",
      bySignin: "साइन इन करके आप हमारी",
      createAccount: "अपना खाता बनाएं",
      signupDescription:
        "एआई आधारित कानूनी सहायता और समुदाय से जुड़ने के लिए हमारे साथ जुड़ें",
      fullName: "पूरा नाम",
      confirmPassword: "पासवर्ड की पुष्टि करें",
      creatingAccount: "खाता बनाया जा रहा है...",
      createAccountButton: "खाता बनाएं",
      alreadyAccount: "पहले से खाता है?",
      bySignup: "साइन अप करके आप हमारी",
      signInLink: "साइन इन करें",
    },
    onboarding: {
      companion: "आपका कानूनी साथी",
      welcomeTitle: "स्वागत है! चलिए शुरू करते हैं",
      welcomeDescription:
        "हमें अपने बारे में बताएं ताकि हम आपकी जरूरत के अनुसार कानूनी मार्गदर्शन दे सकें।",
      aiGuidance: "एआई आधारित मार्गदर्शन",
      aiGuidanceDesc: "उन्नत एआई से तुरंत कानूनी सलाह पाएं",
      forEveryone: "सबके लिए",
      forEveryoneDesc: "सभी भारतीयों के लिए सुलभ कानूनी सहायता",
      knowRights: "अपने अधिकार जानें",
      knowRightsDesc: "अपने कानूनी अधिकार समझें और उपयोग करें",
      privacyFirst: "गोपनीयता पहले:",
      privacyDesc:
        "आपकी जानकारी सुरक्षित है और केवल आपके अनुभव को बेहतर बनाने के लिए उपयोग होगी।",
      tellUs: "अपने बारे में बताएं",
      tellUsDesc: "इससे हम आपकी स्थिति के अनुसार उचित कानूनी जानकारी दे पाएंगे",
      age: "आयु",
      gender: "लिंग",
      stateRegion: "राज्य/क्षेत्र",
      education: "शिक्षा स्तर",
      occupation: "पेशा",
      selectGender: "लिंग चुनें",
      selectState: "अपना राज्य चुनें",
      selectEducation: "शिक्षा स्तर चुनें",
      selectOccupation: "अपना पेशा चुनें",
      male: "पुरुष",
      female: "महिला",
      other: "अन्य",
      preferNot: "बताना नहीं चाहते",
      continueButton: "लीगलसहायक पर आगे बढ़ें",
      termsNote:
        "जारी रखकर आप हमारी सेवा की शर्तों और गोपनीयता नीति से सहमत हैं",
    },
    forum: {
      title: "कम्युनिटी फोरम",
      subtitle: "दूसरों से जुड़ें और कानूनी विषयों पर चर्चा करें",
      comingSoon: "फोरम जल्द आ रहा है",
      comingSoonDesc:
        "हमारा कम्युनिटी फोरम तैयार किया जा रहा है। जल्द वापस आएं!",
      protectedRoute: "यह पेज केवल प्रमाणित उपयोगकर्ताओं के लिए उपलब्ध है।",
    },
    dashboard: {
      title: "आपका डैशबोर्ड",
      subtitle: "अपनी प्रोफाइल प्रबंधित करें और कानूनी टूल्स उपयोग करें",
      memberSince: "सदस्यता शुरू",
      askAssistant: "एआई सहायक से पूछें",
      askAssistantDesc: "तुरंत कानूनी मार्गदर्शन पाएं",
      communityForum: "कम्युनिटी फोरम",
      communityForumDesc: "दूसरों से जुड़ें",
      legalResources: "कानूनी संसाधन",
      legalResourcesDesc: "कानूनी पुस्तकालय देखें",
      basicInfo: "मूल जानकारी",
      additionalDetails: "अतिरिक्त विवरण",
      accountSettings: "खाता सेटिंग्स",
    },
    assistant: {
      loadingTitle: "आपके प्रश्न का विश्लेषण हो रहा है...",
      loadingDesc: "इसमें कुछ समय लग सकता है",
      title: "एआई कानूनी सहायक",
      subtitle:
        "आपके अधिकार समझने के लिए आपका गोपनीय एआई सहायक। कोई भी कानूनी प्रश्न पूछें और स्पष्ट उत्तर पाएं।",
      inputPlaceholder: "मेरा मकान मालिक सुरक्षा जमा राशि वापस नहीं कर रहा...",
      resourcesTitle: "या, अन्य संसाधन देखें",
      resourcesSubtitle:
        "कानूनी विषयों को और समझें, दूसरों के अनुभव पढ़ें, या आधिकारिक दस्तावेज़ देखें।",
      communityStories: "समुदाय की कहानियां",
      communityStoriesDesc:
        "ऐसे लोगों के वास्तविक अनुभव पढ़ें जिन्होंने समान कानूनी समस्याएं झेली हैं।",
      browseStories: "कहानियां देखें",
      exploreTopics: "कानूनी विषय देखें",
      exploreTopicsDesc:
        "सरल कानूनी अधिनियमों, कोड और नियमों की हमारी लाइब्रेरी देखें।",
      goToLibrary: "लाइब्रेरी पर जाएं",
      genericError: "क्षमा करें, त्रुटि हुई। कृपया फिर प्रयास करें।",
      jurisdiction: "क्षेत्राधिकार: भारत",
      confidence: "विश्वसनीयता",
      aiGeneratedGuidance: "एआई द्वारा निर्मित मार्गदर्शन",
      answerTab: "उत्तर",
      legalReferencesTab: "कानूनी संदर्भ",
      actionPlanTab: "कार्य योजना",
      noLegalReferences: "कोई कानूनी संदर्भ उपलब्ध नहीं है।",
      noActionPlan: "कोई कार्य योजना उपलब्ध नहीं है।",
      askFirstQuestion: "अपना पहला प्रश्न पूछें",
      firstQuestionHint:
        "अपनी स्थिति बताएं। हम उत्तर को आपकी प्रोफाइल के अनुसार तैयार करेंगे।",
      quickPrompt1: "मैं दिहाड़ी पर काम करता हूं। मेरे अधिकार क्या हैं?",
      quickPrompt2: "उपभोक्ता शिकायत कैसे दर्ज करूं?",
      quickPrompt3: "किराये के समझौते के लिए कौन से दस्तावेज़ चाहिए?",
      detailedInputPlaceholder:
        "अपनी कानूनी स्थिति विस्तार से बताएं। तारीख, स्थान और संबंधित संदर्भ शामिल करें...",
      tipText: "टिप: अधिक सटीक मार्गदर्शन के लिए संदर्भ और स्थान दें।",
      poweredBy: "लीगलसहायक एआई द्वारा संचालित",
    },
  },
} as const;

export type TranslationSection = keyof (typeof translations)["en"];
export type TranslationKey<S extends TranslationSection> =
  keyof (typeof translations)["en"][S];

export const getTranslation = <S extends TranslationSection>(
  language: Language,
  section: S,
  key: TranslationKey<S>,
): string => {
  const localized = (translations[language][section] as Record<string, string>)[
    key as string
  ];
  if (localized) {
    return localized;
  }

  return (translations.en[section] as Record<string, string>)[key as string];
};
