const providerProfileData = {
  id: "PRV-0001",
  role: "provider",
  providerName: "CleanPro Services",
  status: "approved",
  category: "Cleaning",
  coverImage:
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80",
  galleryImages: [
    "https://images.unsplash.com/photo-1627905646269-7f034dcc5738?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&auto=format&fit=crop&q=80",
  ],
  name: "Raj Sharma",
  image: "https://randomuser.me/api/portraits/men/32.jpg",
  gender: "male",
  experience: "5 years",
  bio: "Hi, I am Raj Sharma, a home cleaning specialist with 5 years of experience. I focus on tidy rooms, hygienic surfaces, and dependable doorstep service.",
  phoneNumber: "+91 90000 10001",
  email: "raj.sharma@example.com",
  address: {
    area: "Flat 12, Ashok Nagar Colony, MG Marg, Civil Lines",
    city: "Allahabad",
    state: "Uttar Pradesh",
    pincode: "211001",
  },
  services: [
    {
      serviceId: "SVC-0001",
      title: "Home Cleaning",
      category: "Cleaning",
      price: 499,
      estimatedDuration: "2-3 hours",
      description: "Professional home cleaning...",
      includes: ["Dusting", "Floor cleaning", "Bathroom cleaning"],
      availableToday: true,
      instantBooking: false,
    },
    {
      serviceId: "SVC-0003",
      title: "Pest Control",
      category: "Cleaning",
      price: 899,
      estimatedDuration: "1-2 hours",
      description: "Complete pest control treatment...",
      includes: ["Spray treatment", "Inspection"],
      availableToday: false,
      instantBooking: true,
    },
  ],
  rating: 4.2,
  totalReviews: 320,
  bookingsCompleted: 1200,
  reviews: [
    {
      id: "REV-0001",
      user: "Amit",
      rating: 5,
      date: "12 May 2026",
      comment:
        "Excellent cleaning service! My home has never been this spotless. Highly recommend Raj and CleanPro Services.",
    },
    {
      id: "REV-0002",
      user: "Sneha",
      rating: 4,
      date: "15 May 2026",
      comment:
        "Good service overall. The team was professional and did a great job. The only reason I'm giving 4 stars instead of 5 is because they were a bit late to arrive, but the quality of cleaning made up for it.",
    },
  ],
};

export default providerProfileData;
