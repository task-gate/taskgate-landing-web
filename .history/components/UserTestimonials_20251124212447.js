"use client";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Product Designer",
    avatar: "/avatars/sarah.jpg",
    rating: 5,
    text: "TaskGate has completely changed my relationship with my phone. The breathing exercises before opening Instagram help me stay mindful. I've reduced my social media time by 60% in just two weeks!",
  },
  {
    name: "Marcus Rodriguez",
    role: "Software Engineer",
    avatar: "/avatars/marcus.jpg",
    rating: 5,
    text: "I love how TaskGate makes me pause before mindlessly scrolling. The mini-tasks are quick but effective. The partner app integration is genius – I'm learning languages through quick flashcards before checking Twitter.",
  },
  {
    name: "Emma Thompson",
    role: "Marketing Manager",
    avatar: "/avatars/emma.jpg",
    rating: 5,
    text: "TaskGate transformed my impulsive phone habits. Instead of immediately opening TikTok, I complete a quick journal prompt. It's helped me be more intentional about my screen time. Highly recommend!",
  },
  {
    name: "David Park",
    role: "Student",
    avatar: "/avatars/david.jpg",
    rating: 5,
    text: "What I love about TaskGate is how it interrupts the scroll cycle without completely blocking apps. The tasks are short enough that they don't feel like a burden, but long enough to make me reconsider if I really need to open the app.",
  },
  {
    name: "Lisa Johnson",
    role: "Freelance Writer",
    avatar: "/avatars/lisa.jpg",
    rating: 5,
    text: "TaskGate helps me maintain focus during work hours. The breathing exercises before opening distracting apps help me refocus. I've become so much more productive since I started using it.",
  },
  {
    name: "Alex Kumar",
    role: "Entrepreneur",
    avatar: "/avatars/alex.jpg",
    rating: 5,
    text: "The partner app integration is brilliant! I use a meditation app's mini-sessions as my gate. It's a win-win – I get more mindful and my impulsive phone checking has dropped dramatically.",
  },
];

const UserTestimonials = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.8 } }}
      className="relative z-10 w-full bg-white py-16 overflow-hidden"
    >
      <div className="container mx-auto p-4 px-5 md:px-[5%] 2xl:px-0 max-w-[1200px]">
        <div className="text-center mb-12 bg-bg-secondary border border-border rounded-3xl p-6 shadow-sm">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0, transition: { duration: 0.8 } }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-3 text-primary"
          >
            What Our Users Are Saying
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.8, delay: 0.2 },
            }}
            viewport={{ once: true }}
            className="text-base text-secondary max-w-2xl mx-auto"
          >
            Join thousands who are using TaskGate to build better digital habits
            and transform impulsive scrolling into intentional usage.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, delay: index * 0.1 },
              }}
              viewport={{ once: true }}
              className="group bg-white border border-border p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              <blockquote className="text-primary mb-6 italic leading-relaxed">
                &quot;{testimonial.text}&quot;
              </blockquote>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                  {testimonial.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <div className="font-semibold text-primary">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-secondary">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, delay: 0.8 },
          }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="bg-bg-secondary border border-border p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-4 text-primary">
              Join Thousands Breaking the Scroll Cycle
            </h3>
            <p className="text-secondary mb-6 max-w-2xl mx-auto">
              Start your journey to more intentional phone usage today.
              Transform impulsive app opens into moments of mindfulness and
              purpose.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-accent text-white px-8 py-3 rounded-lg font-medium hover:bg-accent-hover transition-colors">
                Download Now
              </button>
              <button className="border-2 border-accent text-accent px-8 py-3 rounded-lg font-medium hover:bg-accent hover:text-white transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default UserTestimonials;
