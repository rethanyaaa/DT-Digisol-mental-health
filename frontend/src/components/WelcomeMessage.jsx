 import React from 'react';
import { FaHeart, FaHandsHelping, FaLeaf } from 'react-icons/fa';
import { motion } from "framer-motion";

const WelcomeMessage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl p-8 sm:p-12 my-12 relative overflow-hidden shadow-xl"
    >
      {/* Decorative elements */}
      <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] rounded-full bg-purple-100/30 z-0"></div>
      <div className="absolute bottom-[-30px] left-[-30px] w-[150px] h-[150px] rounded-full bg-amber-100/30 z-0"></div>

      <div className="relative z-10">
        <motion.h2 
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="text-3xl md:text-4xl font-bold text-purple-800 mb-8 flex items-center gap-4"
        >
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="p-3 bg-pink-100 rounded-full"
          >
            <FaHeart className="text-pink-500 text-2xl" />
          </motion.div>
          Welcome to Mood Mantra – Your Safe Space for Healing & Growth
        </motion.h2>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white rounded-2xl p-6 mb-8 shadow-md hover:shadow-lg transition-all"
        >
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            In today's fast-paced world, our mental health is often overlooked, buried beneath responsibilities, expectations, and daily struggles. But just like physical health, our emotional well-being deserves care, attention, and timely support.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed">
            If you've been feeling overwhelmed, anxious, emotionally drained, or simply unheard, know that you are not alone. Seeking help is not a sign of weakness—it is a step toward strength, clarity, and a healthier mind.
          </p>
        </motion.div>

        <motion.h3 
          initial={{ x: -20 }}
          whileInView={{ x: 0 }}
          className="text-2xl md:text-3xl font-bold text-purple-700 my-8 flex items-center gap-3"
        >
          <div className="p-3 bg-amber-100 rounded-xl">
            <FaHandsHelping className="text-amber-600 text-xl" />
          </div>
          Why is timely counseling important?
        </motion.h3>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 mb-8 shadow-md hover:shadow-lg transition-all border-l-4 border-purple-500"
        >
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Many emotional struggles start small—stress, self-doubt, relationship conflicts, or work pressure. When left unaddressed, these can build up, leading to anxiety, depression, or other serious disorders. The good news? Early intervention through talk therapy can prevent this.
          </p>
          
          <p className="text-lg text-gray-700 leading-relaxed">
            Just as we visit a doctor for a minor cold before it turns into a severe illness, counseling helps the mind recover before emotional distress deepens.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 mb-8 shadow-md hover:shadow-lg transition-all border-l-4 border-amber-400"
        >
          <p className="text-lg text-gray-700 leading-relaxed mb-4 font-medium">
            At Mood Mantra, we provide professional counseling and therapy services through compassionate conversations that help untangle your thoughts, ease emotional burdens, and empower you to regain control over your life.
          </p>
          
          <p className="text-lg text-gray-700 leading-relaxed">
            With the right guidance, a safe space to express yourself, and personalized support, you can heal, grow, and thrive.
          </p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.98 }}
          whileInView={{ scale: 1 }}
          className="text-center mt-12 p-6 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl text-white shadow-lg"
        >
          <p className="text-xl leading-relaxed mb-4 flex items-center justify-center gap-2">
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <FaLeaf className="text-green-300 text-2xl" />
            </motion.span>
            Your mental health matters. Your feelings are valid. Your happiness is possible. 
            Let's take the first step together—because you deserve a mind at peace and a life full of meaning.
          </p>
          
          <motion.p 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-2xl font-bold mt-6 flex items-center justify-center gap-2"
          >
            <span className="text-amber-300">🧡 We are here for you.</span> Let's talk.
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WelcomeMessage;