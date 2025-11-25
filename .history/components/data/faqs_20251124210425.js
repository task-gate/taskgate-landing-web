const faqs = [
  {
    question: "What is TaskGate and how does it work?",
    answer:
      "TaskGate is an app blocker that intercepts impulsive app opens. When you try to launch a gated app (like Instagram or TikTok), TaskGate intercepts it and presents a quick mini-task instead—such as a breathing exercise, journal prompt, or flashcard. After completing the task, you can proceed to the app, but now with intention rather than impulse.",
  },
  {
    question: "What kinds of tasks do I need to complete?",
    answer:
      "TaskGate offers various built-in mini-tasks including breathing exercises, mindful reflections, journal prompts, and flashcards. You can customize which tasks appear. Additionally, TaskGate supports partner apps—when selected, TaskGate opens the partner app via a deep link, you complete their mini-task, and they send a callback to return you to TaskGate and unlock your app.",
  },
  {
    question: "How does partner app integration work?",
    answer:
      "TaskGate can integrate with partner apps using app links (Android) or universal links (iOS). When you select a partner app task, TaskGate launches that app with a special link. After you complete their mini-task, the partner app sends a 'task complete' callback link back to TaskGate, which then grants access to your originally requested app. It's seamless and automatic.",
  },
  {
    question: "Can I choose which apps to block?",
    answer:
      "Yes! You have full control over which apps get 'gated.' Most users gate social media apps (Instagram, TikTok, Facebook), streaming apps (YouTube, Netflix), and games—but you can select any app that triggers impulsive usage. Productivity apps can remain ungated.",
  },
  {
    question: "Will TaskGate completely block my apps?",
    answer:
      "No, TaskGate doesn't permanently block apps. It adds a small 'speed bump' by requiring a quick task before access. This creates a moment of conscious choice: do I really want to open this app right now, or should I redirect my time? Many users find that after completing a task, they naturally choose not to proceed.",
  },
  {
    question: "How long do the mini-tasks take?",
    answer:
      "Most tasks take 10-30 seconds. The goal isn't to waste your time but to break the automatic impulse and create a moment of awareness. Quick tasks like '3 deep breaths' or 'name one thing you're grateful for' are fast yet effective at interrupting mindless scrolling.",
  },
  {
    question: "Can I customize my tasks?",
    answer:
      "Absolutely! You can choose which types of tasks appear (breathing, reflection, flashcards, etc.), customize prompts, and integrate partner apps. TaskGate is designed to adapt to your personal goals—whether that's mindfulness, learning, or habit change.",
  },
  {
    question: "Does TaskGate track my usage?",
    answer:
      "Yes, TaskGate provides analytics showing how often you're intercepted, which tasks you complete, and trends over time. This helps you see your progress toward more intentional phone usage. All data stays private on your device—we don't collect or sell your information.",
  },
  {
    question: "What if I need to access an app immediately?",
    answer:
      "In urgent situations, TaskGate offers an 'override' option. However, using it frequently reduces effectiveness. The whole point is to break the impulse—if you genuinely need the app, 10 seconds to complete a task won't make a difference. Most users find they rarely need the override.",
  },
  {
    question: "Is there a premium version?",
    answer:
      "Yes, TaskGate Premium includes advanced features like unlimited partner app integrations, detailed usage analytics, custom task creation, scheduled gating (e.g., only during work hours), and exclusive content from mindfulness and productivity experts.",
  },
];

export default faqs;
