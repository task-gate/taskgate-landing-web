import { v4 as uuid } from "uuid";

export const privacyPolicy = [
  {
    id: uuid(),
    title: "Information We Collect",
    text: "TaskGate is designed with privacy in mind. We do not collect any personal information unless you explicitly choose to provide it. Depending on how you use the app, we may collect the following minimal information:",
    subtext: "a. App Usage Data (Optional & Anonymous)",
    subtext2:
      "To improve the app's performance and user experience, we may collect limited, anonymized data such as:",
    list: [
      "App open and close times",
      "Which features are used most often",
      "Crash reports and diagnostic logs (via Firebase Crashlytics or Google Play Services)",
    ],
    addition:
      "This data does not contain any personal identifiers (such as name, email, or precise location).",
    subtext3: "b. Permissions",
    subtext4:
      "TaskGate may request permission to detect when certain apps are opened — only to display mindful prompts before launching them. We do not read or track your app content, messages, or browsing history.",
    subtext5: "c. Optional Cloud Sync (if enabled)",
    subtext6:
      "If future updates allow syncing affirmations or user preferences via cloud backup, we may temporarily store this data under your account. You will be clearly informed and able to opt out at any time.",
  },
  {
    id: uuid(),
    title: "How We Use Information",
    text: "We use collected data only for:",
    list: [
      "App performance analytics",
      "Debugging and crash prevention",
      "Improving features and user experience",
      "Personalizing your affirmations (if you opt in)",
    ],
    addition:
      "We never sell, rent, or share your data with third parties for advertising or marketing purposes.",
  },
  {
    id: uuid(),
    title: "Third-Party Services",
    text: "TaskGate may integrate trusted third-party SDKs to help us maintain app stability and usage insights, including:",
    list: [
      "Firebase Analytics / Crashlytics (Google LLC) — anonymized analytics and crash data",
      "RevenueCat (if premium features are added) — to manage in-app purchases securely via Google Play",
    ],
    addition:
      "Each third party adheres to GDPR and CCPA-compliant standards. You can review their policies here:",
    sublist: ["Google Firebase Privacy Policy", "RevenueCat Privacy Policy"],
  },
  {
    id: uuid(),
    title: "Data Retention and Deletion",
    text: "We retain collected data only as long as necessary to fulfill the purposes described in this policy. If you wish to delete your personal data, you may request it through our contact form.",
  },
  {
    id: uuid(),
    title: "Security",
    text: "We follow industry-standard practices to protect your information from unauthorized access, alteration, or disclosure. While no system is completely secure, we continuously update our infrastructure to maintain the highest level of privacy and safety.",
  },
  {
    id: uuid(),
    title: "Children's Privacy",
    text: "TaskGate is not intended for children under 13. We do not knowingly collect personal information from children. If we discover such data, it will be deleted immediately.",
  },
  {
    id: uuid(),
    title: "Your Rights",
    text: "Depending on your region, you may have the right to:",
    list: [
      "Access, correct, or delete your personal data",
      "Withdraw consent to data processing",
      "Request a copy of your stored data",
    ],
    addition:
      "To exercise these rights, please contact us through our contact form.",
  },
  {
    id: uuid(),
    title: "Changes to This Policy",
    text: "We may update this Privacy Policy periodically. The latest version will always be available within the app and on our official website. Material changes will be communicated clearly through in-app notices or version updates.",
  },
  {
    id: uuid(),
    title: "Contact Us",
    text: "If you have any questions or concerns about this Privacy Policy or how TaskGate handles your data, please reach out to:",
    list: ["TaskGate Support Team 📧 hawk20605@gmail.com"],
  },
];
