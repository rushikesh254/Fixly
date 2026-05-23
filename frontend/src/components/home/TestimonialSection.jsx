import TestimonialCard from "../ui/TestimonialCard";
function TestimonialSection() {
  const testimonials = [
    {
      id: 1,
      name: "John Doe",
      role: "Verified Customer",
      content:
        "The service was amazing! Highly recommended.the technician was professional and efficient.",
      review: 5,
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "Verified Customer",
      content:
        "The service was great! I will definitely use it again.The cost was reasonable and the quality of work was excellent.",
      review: 4,
    },
    {
      id: 3,
      name: "Alice Johnson",
      role: "Professional Cleaner",
      content:
        "The customer was so satisfied with the service.But the scheduling process was a bit confusing.",
      review: 5,
    },
    {
      id: 4,
      name: "Bob Williams",
      role: "Professional Plumber",
      content:
        "The service was prompt and professional.but the customer support could be improved.",
      review: 4,
    },
    {
      id: 5,
      name: "Charlie Brown",
      role: "Verified Customer",
      content:
        "Excellent service! The technician arrived on time and did a great job.",
      review: 5,
    },
    {
      id: 6,
      name: "Bob Williams",
      role: "Professional Plumber",
      content:
        "The service was prompt and professional.but the customer support could be improved.",
      review: 4,
    },
  ];

  return (
    <div id="testimonials" className="w-full overflow-hidden mb-10">
      <h1 className="text-2xl font-bold text-gray-800 text-center mb-1 mt-10">
        What Our Users Say!
      </h1>
      <div className="flex gap-6 overflow-x-auto px-10 py-10 scrollbar-hide">
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </div>
    </div>
  );
}

export default TestimonialSection;
