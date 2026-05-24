import testimonials from "../../data/testimonials";
import TestimonialCard from "../ui/TestimonialCard";
function TestimonialSection() {
  return (
    <div id="testimonials" className="w-full overflow-hidden mb-10">
      <h1 className="text-2xl font-bold text-gray-800 text-center mb-1 mt-10">
        What Our Users Say!
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-10 py-10 place-items-center">
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </div>
    </div>
  );
}

export default TestimonialSection;
