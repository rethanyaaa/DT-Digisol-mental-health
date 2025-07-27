 import React from 'react';
import { motion } from 'framer-motion';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "Prescripto helped me find a therapist who truly understands my needs. Life-changing experience.",
      author: "Sarah K.",
      role: "Patient since 2022",
      rating: 5
    },
    {
      quote: "The assessment tools gave me insights I never had before about my anxiety patterns.",
      author: "Michael T.",
      role: "User for 8 months",
      rating: 4
    },
    {
      quote: "As a professional, I appreciate how easy Prescripto makes it to connect with clients.",
      author: "Dr. Priya M.",
      role: "Therapist Partner",
      rating: 5
    },
    {
      quote: "I was skeptical at first, but after just 3 sessions I noticed significant improvement in my mood.",
      author: "David R.",
      role: "Patient for 3 months",
      rating: 5
    },
    {
      quote: "The matching algorithm is incredible - my therapist is perfectly suited to my personality.",
      author: "Emma L.",
      role: "Patient since 2021",
      rating: 5
    },
    {
      quote: "Prescripto's platform is intuitive and the support team is responsive and caring.",
      author: "James P.",
      role: "Patient for 1 year",
      rating: 4
    },
    
  ];

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const RatingStars = ({ rating }) => {
    return (
      <div className="flex mb-3">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-indigo-700 mb-4">
            Voices of <span className="bg-gradient-to-r from-amber-400 to-amber-600 text-transparent bg-clip-text">Trust</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from people who've transformed their mental health journey with Prescripto
          </p>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index} 
              variants={item}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-indigo-400"
            >
              <RatingStars rating={testimonial.rating} />
              <div className="text-indigo-400 text-5xl font-serif mb-4 leading-none">"</div>
              <p className="text-gray-700 mb-6 text-lg italic relative pl-4 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-amber-300 before:to-amber-500">
                {testimonial.quote}
              </p>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="font-bold text-indigo-700">{testimonial.author}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <button className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105">
            Share Your Story
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;