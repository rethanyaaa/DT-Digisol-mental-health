import React from 'react';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "Prescripto helped me find a therapist who truly understands my needs. Life-changing experience.",
      author: "Sarah K.",
      role: "Patient since 2022"
    },
    {
      quote: "The assessment tools gave me insights I never had before about my anxiety patterns.",
      author: "Michael T.",
      role: "User for 8 months"
    },
    {
      quote: "As a professional, I appreciate how easy Prescripto makes it to connect with clients.",
      author: "Dr. Priya M.",
      role: "Therapist Partner"
    }
  ];

  return (
    <section className="py-16 px-4" style={{ backgroundColor: '#f5f3ff' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#7c3aed] mb-4">
            What Our <span style={{ color: '#FFD700' }}>Community</span> Says
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-[#f59e0b] text-4xl mb-4">"</div>
              <p className="text-gray-700 mb-6 italic">{testimonial.quote}</p>
              <div>
                <p className="font-semibold text-[#7c3aed]">{testimonial.author}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;