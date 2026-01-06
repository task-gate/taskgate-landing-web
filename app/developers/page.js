"use client";

import "../globals.css";
import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Code2,
  ExternalLink,
  Package,
  Zap,
  BookOpen,
  Terminal,
  ArrowRight,
} from "lucide-react";
import { SiFlutter, SiApple, SiAndroid, SiGithub } from "react-icons/si";
import { Highlight, themes } from "prism-react-renderer";

const CodeBlock = ({ code, language }) => (
  <Highlight theme={themes.vsDark} code={code.trim()} language={language}>
    {({ tokens, getLineProps, getTokenProps }) => (
      <pre
        style={{
          backgroundColor: "#1e1e1e",
          borderRadius: "0.75rem",
          padding: "1.25rem",
          fontSize: "0.9rem",
          lineHeight: "1.6",
          overflow: "auto",
          border: "1px solid #333",
        }}
      >
        {tokens.map((line, i) => (
          <div key={i} {...getLineProps({ line })}>
            {line.map((token, key) => (
              <span key={key} {...getTokenProps({ token })} />
            ))}
          </div>
        ))}
      </pre>
    )}
  </Highlight>
);

const sdks = [
  {
    name: "Flutter SDK",
    platform: "Flutter / Dart",
    description:
      "Cross-platform SDK for building TaskGate integrations in Flutter apps. Available on pub.dev with full documentation and examples.",
    iconType: "flutter",
    link: "https://pub.dev/packages/taskgate_sdk",
    linkText: "View on pub.dev",
    badge: "pub.dev",
    badgeColor: "from-cyan-500 to-blue-600",
    installCommand: "flutter pub add taskgate_sdk",
  },
  {
    name: "iOS SDK",
    platform: "Swift / Objective-C",
    description:
      "Native iOS SDK for seamless TaskGate integration in your iOS applications. Supports iOS 13+ with CocoaPods.",
    iconType: "ios",
    link: "https://github.com/task-gate/taskgate-sdk-ios",
    linkText: "View on GitHub",
    badge: "GitHub",
    badgeColor: "from-gray-600 to-gray-800",
    installCommand: "pod 'TaskGateSDK'",
  },
  {
    name: "Android SDK",
    platform: "Kotlin / Java",
    description:
      "Native Android SDK for integrating TaskGate into your Android apps. Supports Android 6.0+ with Gradle dependency.",
    iconType: "android",
    link: "https://github.com/task-gate/taskgate-sdk-android",
    linkText: "View on GitHub",
    badge: "GitHub",
    badgeColor: "from-green-500 to-emerald-600",
    installCommand: 'implementation("co.taskgate:sdk:latest")',
  },
];

const getSdkIcon = (iconType) => {
  switch (iconType) {
    case "flutter":
      return (
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
          <SiFlutter className="w-8 h-8 text-white" />
        </div>
      );
    case "ios":
      return (
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
          <SiApple className="w-8 h-8 text-white" />
        </div>
      );
    case "android":
      return (
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
          <SiAndroid className="w-8 h-8 text-white" />
        </div>
      );
    default:
      return null;
  }
};

const integrationSteps = [
  {
    step: "01",
    title: "Register & Create Your Provider ID",
    description:
      "Sign up on our Partner Portal to create your account and get your unique providerId instantly. No waiting for approval to start development.",
  },
  {
    step: "02",
    title: "Get TaskGate Dev Build",
    description:
      "Request access to the TaskGate development build via the Partner Portal. You'll receive an invite to test your integration with the dev version of TaskGate.",
  },
  {
    step: "03",
    title: "Configure Your Integration",
    description:
      "Use the Partner Config Editor to set up your app details, icons, and define your mini-tasks. Changes auto-save so you can iterate quickly.",
  },
  {
    step: "04",
    title: "Install the SDK",
    description:
      "Add our SDK to your project using your preferred package manager. Available for Flutter, iOS, and Android.",
  },
  {
    step: "05",
    title: "Set Up Deep Links",
    description:
      "Configure app links (Android) or universal links (iOS) to receive task requests from TaskGate with the task parameters.",
  },
  {
    step: "06",
    title: "Build & Test Your Mini-Task",
    description:
      "Create an engaging mini-task experience in your app. Test the full flow using the TaskGate dev build to ensure everything works.",
  },
  {
    step: "07",
    title: "Submit for Production",
    description:
      "When you're ready, submit your config for approval. Once approved, your app will be live on TaskGate for all users.",
  },
];

export default function Developers() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative bg-black pt-32 pb-16 overflow-hidden"
      >
        <div className="relative z-20 max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-gradient-to-r from-accent/10 to-purple-600/10 border border-accent/30">
              <Code2 className="w-4 h-4 text-accent" />
              <span className="bg-gradient-to-r from-accent to-purple-600 bg-clip-text text-transparent font-medium text-sm">
                Developer Resources
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
              Build with{" "}
              <span className="bg-gradient-to-r from-accent to-purple-600 bg-clip-text text-transparent">
                TaskGate
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed">
              Integrate TaskGate into your apps with our official SDKs.
              Available for Flutter, iOS, and Android.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="https://github.com/task-gate"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="px-8 py-4 rounded-lg bg-gradient-to-r from-accent to-purple-600 text-white font-semibold hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl flex items-center gap-2">
                  <SiGithub className="w-5 h-5" />
                  View on GitHub
                </button>
              </a>
              <Link href="/contact-us?interest=developer">
                <button className="px-8 py-4 rounded-lg bg-white/10 backdrop-blur-md border border-white/30 text-white font-semibold hover:bg-white/20 transition-all duration-300">
                  Get Developer Support
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* SDKs Section - WHITE */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          {/* Provider ID Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 bg-gradient-to-r from-accent/5 to-purple-600/5 border border-accent/20 rounded-2xl p-8 text-center"
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Get Started in Minutes
              </h3>
              <p className="text-gray-600 mb-4">
                Register on our Partner Portal to instantly create your{" "}
                <code className="bg-gray-200 px-2 py-1 rounded text-accent font-mono text-sm">
                  providerId
                </code>
                , configure your integration, and start building. Submit for
                approval when you&apos;re ready for production.
              </p>
              <Link href="/partner">
                <button className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-accent to-purple-600 text-white font-semibold hover:opacity-90 transition-opacity">
                  Open Partner Portal
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Official SDKs
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Choose the SDK that fits your platform and start integrating
              TaskGate today.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {sdks.map((sdk, index) => (
              <motion.div
                key={sdk.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-gray-50 rounded-3xl p-8 border border-gray-200 hover:border-accent/50 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-6">
                  {getSdkIcon(sdk.iconType)}
                  <span
                    className={`px-3 py-1 rounded-full bg-gradient-to-r ${sdk.badgeColor} text-white text-xs font-medium`}
                  >
                    {sdk.badge}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {sdk.name}
                </h3>
                <p className="text-accent text-sm mb-4">{sdk.platform}</p>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {sdk.description}
                </p>

                {/* Install Command */}
                <div className="bg-gray-900 rounded-lg p-3 mb-6">
                  <code className="text-sm text-gray-300 break-all">
                    {sdk.installCommand}
                  </code>
                </div>

                <a
                  href={sdk.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-accent hover:text-purple-600 transition-colors group-hover:gap-3 duration-300"
                >
                  {sdk.linkText}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Steps Section - BLACK */}
      <section className="bg-black py-20">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How to Integrate with TaskGate
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Follow these steps to become a TaskGate partner app and reach
              users building better digital habits.
            </p>
          </motion.div>

          <div className="space-y-6">
            {integrationSteps.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex gap-6 items-start bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-accent/30 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-accent to-purple-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">
                    {item.step}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Deep Link Setup Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Deep Link Setup by Platform
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Configure your app to receive task requests from TaskGate using
              platform-specific deep linking.
            </p>
          </motion.div>

          <div className="space-y-12">
            {/* iOS */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200"
            >
              <div className="flex items-center gap-4 mb-8">
                {getSdkIcon("ios")}
                <h3 className="text-2xl font-bold text-gray-900">iOS</h3>
              </div>
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-green-500 font-bold">✓</span>
                    <p className="font-semibold text-gray-900 text-lg">
                      URL Scheme{" "}
                      <span className="text-sm text-gray-500 font-normal">
                        (required for install detection)
                      </span>
                    </p>
                  </div>
                  <CodeBlock
                    language="xml"
                    code={`<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>yourapp</string>
    </array>
  </dict>
</array>`}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-green-500 font-bold">✓</span>
                    <p className="font-semibold text-gray-900 text-lg">
                      Universal Links{" "}
                      <span className="text-sm text-gray-500 font-normal">
                        (required for launching task)
                      </span>
                    </p>
                  </div>
                  <CodeBlock
                    language="bash"
                    code={`# In Xcode → Signing & Capabilities:
+ Associated Domains → applinks:yourdomain.com`}
                  />
                  <p className="mt-4 text-sm text-gray-600">
                    Verify your apple-app-site-association:{" "}
                    <a
                      href="https://getuniversal.link/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline font-medium"
                    >
                      getuniversal.link
                    </a>
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    Flutter docs:{" "}
                    <a
                      href="https://docs.flutter.dev/cookbook/navigation/set-up-universal-links"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline font-medium"
                    >
                      Set up Universal Links
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Android */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200"
            >
              <div className="flex items-center gap-4 mb-8">
                {getSdkIcon("android")}
                <h3 className="text-2xl font-bold text-gray-900">Android</h3>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-green-500 font-bold">✓</span>
                  <p className="font-semibold text-gray-900 text-lg">
                    App Links{" "}
                    <span className="text-sm text-gray-500 font-normal">
                      (required for launching task)
                    </span>
                  </p>
                </div>
                <CodeBlock
                  language="xml"
                  code={`<intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data 
        android:scheme="https"
        android:host="yourdomain.com"
        android:pathPrefix="/taskgate" />
</intent-filter>`}
                />
                <p className="mt-4 text-sm text-gray-600">
                  Flutter docs:{" "}
                  <a
                    href="https://docs.flutter.dev/cookbook/navigation/set-up-app-links"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline font-medium"
                  >
                    Set up App Links
                  </a>
                </p>
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="font-semibold text-gray-900 mb-2">
                    Verify in Play Console:
                  </p>
                  <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                    <li>Go to Play Console → Grow users → Deep links</li>
                    <li>
                      Check that your domain shows &quot;Deep linked&quot;
                      status
                    </li>
                    <li>
                      Ensure assetlinks.json is properly hosted at your domain
                    </li>
                  </ol>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Help with Deep Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-12 text-center"
          >
            <p className="text-gray-600">
              Need help setting up App Links or Universal Links?{" "}
              <a
                href="/contact-us?interest=developer"
                className="text-accent hover:underline font-medium"
              >
                Contact developer support
              </a>
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section - WHITE */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Create your partner account, configure your integration, and start
              building today. No approval needed to begin development.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/partner">
                <button className="px-8 py-4 rounded-lg bg-gradient-to-r from-accent to-purple-600 text-white font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 justify-center w-full sm:w-auto">
                  <Terminal className="w-5 h-5" />
                  Open Partner Portal
                </button>
              </Link>
              <a
                href="https://pub.dev/packages/taskgate_sdk"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="px-8 py-4 rounded-lg bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center gap-2 justify-center w-full sm:w-auto">
                  <Package className="w-5 h-5" />
                  View Flutter SDK
                </button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
