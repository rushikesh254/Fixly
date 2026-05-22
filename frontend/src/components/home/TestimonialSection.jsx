import TestimonialCard from "../ui/TestimonialCard";
function TestimonialSection() {
  const testimonials = [
    {
      id: 1,
      name: "John Doe",
      role: "Verified Customer",
      content:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat, doloremque consequuntur rem ex provident iusto hic quasi quis cumque quibusdam est, necessitatibus, molestiae eligendi!",
      review: 5,
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "Verified Customer",
      content:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat, doloremque consequuntur rem ex provident iusto hic quasi quis cumque quibusdam est, necessitatibus, molestiae eligendi!",
      review: 4,
    },
    {
      id: 3,
      name: "Alice Johnson",
      role: "Professional Cleaner",
      content:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat, doloremque consequuntur rem ex provident iusto hic quasi quis cumque quibusdam est, necessitatibus, molestiae eligendi!",
      review: 5,
    },
    {
      id: 4,
      name: "Bob Williams",
      role: "Professional Plumber",
      content:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat, doloremque consequuntur rem ex provident iusto hic quasi quis cumque quibusdam est, necessitatibus, molestiae eligendi!",
      review: 4,
    },
    {
      id: 5,
      name: "Emily Davis",
      role: "Verified Customer",
      content:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat, doloremque consequuntur rem ex provident iusto hic quasi quis cumque quibusdam est, necessitatibus, molestiae eligendi!",
      review: 5,
    },
    {
      id: 6,
      name: "Michael Brown",
      role: "Professional Electrician",
      content:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat, doloremque consequuntur rem ex provident iusto hic quasi quis cumque quibusdam est, necessitatibus, molestiae eligendi!",
      review: 5,
    },
  ];

  return (
    <div className="w-full overflow-hidden">
      <h1 className="text-2xl font-bold text-gray-800 text-center mb-7">
        What Our Users Say!
      </h1>
      <div className="flex gap-10 overflow-x-auto px-10 py-4 snap-x snap-mandatory scroll-smooth scrollbar-hide">
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </div>
    </div>
  );
}

export default TestimonialSection;
