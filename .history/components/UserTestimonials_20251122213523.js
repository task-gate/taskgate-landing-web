"use client";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Manifestation Coach",
    avatar: "/avatars/sarah.jpg",
    rating: 5,
    text: "TaskGate has revolutionized how I practice the Law of Attraction daily. Every time I reach for my phone, I'm reminded of my intentions. I've manifested two major goals since starting - it's like having a spiritual guide in my pocket!",
  },
  {
    name: "Marcus Rodriguez",
    role: "Life Coach & Author",
    avatar: "/avatars/marcus.jpg",
    rating: 5,
    text: "This app perfectly bridges ancient wisdom with modern technology. The affirmation interruptions have helped me become so much more conscious of my energy. I'm attracting better opportunities because I'm more aligned with my desires.",
  },
  {
    name: "Emma Thompson",
    role: "Spiritual Entrepreneur",
    avatar: "/avatars/emma.jpg",
    rating: 5,
    text: "TaskGate transformed my relationship with my phone from mindless scrolling to conscious manifestation practice. I've set affirmations for abundance and love, and I'm seeing real shifts in my reality. This is manifestation made practical!",
  },
  {
    name: "David Park",
    role: "Mindfulness Teacher",
    avatar: "/avatars/david.jpg",
    rating: 5,
    text: "What I love about TaskGate is how it makes the Law of Attraction accessible in our digital world. Those micro-moments of consciousness throughout the day are building into major life transformations. Highly recommend!",
  },
  {
    name: "Lisa Johnson",
    role: "Energy Healer",
    avatar: "/avatars/lisa.jpg",
    rating: 5,
    text: "TaskGate helps me maintain high vibration even when using technology. The affirmations keep me centered and focused on what I want to attract. I've noticed my clients are drawn to higher energy since I started using this app.",
  },
  {
    name: "Alex Kumar",
    role: "Meditation Instructor",
    avatar: "/avatars/alex.jpg",
    rating: 5,
    text: "I teach all my students about conscious living, and TaskGate is the perfect tool for practicing awareness in daily life. It's amazing how these small moments of intention can shift your entire energetic frequency.",
  },
];

const UserTestimonials = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.8 } }}
      className="relative z-10 w-full bg-gray-50 py-16 overflow-hidden"
    >
      <div className="container mx-auto p-4 px-5 md:px-[5%] 2xl:px-0 max-w-[1200px]">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0, transition: { duration: 0.8 } }}
            viewport={{ once: true }}
            className="text-h2 lg:text-h1 font-bold mb-4 bg-gradient-to-r from-indigo-900 to-purple-900 bg-clip-text text-transparent"
          >
            What Our Conscious Community Is Saying
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.8, delay: 0.2 },
            }}
            viewport={{ once: true }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Join thousands of manifestors who are using TaskGate to align their
            digital habits with their highest intentions and attract more of
            what they truly desire.
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
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              <blockquote className="text-gray-700 mb-6 italic">
                &quot;{testimonial.text}&quot;
              </blockquote>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {testimonial.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
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
          <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-black text-white p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">
              Join Over 50,000 Conscious Manifestors
            </h3>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              Begin your journey of digital consciousness today. Transform every
              phone interaction into a moment of manifestation and energetic
              alignment with your highest self.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-purple-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Start Manifesting
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-900 transition-colors">
                Learn the Method
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default UserTestimonials;
