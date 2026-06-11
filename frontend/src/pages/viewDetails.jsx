import { useState } from "react";
import { CiCircleCheck } from "react-icons/ci";
import { FaCheckCircle, FaInfoCircle, FaStar } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import { IoIosArrowBack } from "react-icons/io";
import { MdElectricBolt, MdEventAvailable } from "react-icons/md";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Gallery from "../components/service/Gallery";
import ProviderCard from "../components/service/providerCard";
import ReviewSection from "../components/service/reviewSection";
import guarantees from "../constants/guarantees";
import pricingNote from "../constants/pricingNote";
import Provider from "../data/SingleProvider";
function ViewDetails() {
  // const { id } = useParams();
  // const location = useLocation();

  // find provider based on id from params or state passed via Link
  const p = Provider;
  // change this to api call using id from params to fetch provider details

  // state for lightbox
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  function handlesaved() {
    // logic to save provider to user's saved list (e.g. API call)
    console.log("Saved provider:", p.providerName);
    toast.success("Service saved to your list!");
  }

  // if provider not found display message
  if (!p) {
    return (
      <div className="px-4 py-10 text-center text-gray-600">
        Service provider not found.
      </div>
    );
  }

  const galleryImages = p.galleryImages || [];
  const includes = p.includes || [];
  const reviews = p.reviews || [];
  const images = [p.coverImage, ...galleryImages].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 sm:px-6 lg:px-10">
      {/* back button */}
      <Link
        className="mb-6 inline-flex items-center gap-1.5 px-4 sm:px-10 md:px-20 text-sm font-bold text-gray-500 hover:text-blue-600"
        to="/services"
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }
      >
        <IoIosArrowBack />
        <span>Go Back</span>
      </Link>

      {/* provider name, title, location */}
      <div className="px-4 sm:px-10 md:px-20">
        <h1 className="pb-2 text-2xl sm:text-3xl font-bold">
          {p.providerName}
        </h1>

        <h2 className="mb-5 flex flex-wrap items-center text-sm sm:text-lg font-semibold">
          <span className="font-semibold text-blue-600">{p.title}</span>
          <span className="px-2 text-gray-700">|</span>
          <FiMapPin className="mr-2 text-gray-700" size={16} />

          <span className="text-[13px] font-normal text-gray-700">
            {p.location}
          </span>
        </h2>
      </div>
      {/* main content with images, details, booking button and reviews */}
      <Gallery
        p={p}
        images={images}
        galleryImages={galleryImages}
        open={open}
        setOpen={setOpen}
        index={index}
        setIndex={setIndex}
        handlesaved={handlesaved}
      />

      {/* provider desc, booking info and reviews section */}
      <div className="mx-auto mt-8 flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1">
          <p className="py-2 text-[15px] uppercase leading-7 tracking-[0.3px] text-gray-700">
            {p.description}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="flex w-fit items-center rounded-lg bg-gray-200 px-4 py-2 text-[13px] font-medium">
              {p.rating}
              <FaStar className="ml-2 text-green-600" />
              <span className="mx-2">|</span>
              <span className="text-gray-500">{p.totalReviews}</span>
            </div>
            <div className="flex w-fit items-center rounded-lg bg-gray-200 px-4 py-2 text-[13px] font-medium">
              <span className="mr-2 text-green-600">
                <FaCheckCircle />
              </span>
              {p.bookingsCompleted}
              <span className="ml-2 text-gray-500">Bookings Completed</span>
            </div>
          </div>

          {/* price */}
          <h1 className="mt-5 text-4xl font-bold tracking-tight">
            ₹{p.price}
            <span className="ml-2 text-lg font-medium text-gray-500">
              / service
            </span>
          </h1>
          {/*guarantees */}
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5">
            <div className="grid grid-cols-1 gap-y-3 sm:grid-cols-2 sm:gap-x-6">
              {guarantees.map(({ title, Icon }) => (
                <div
                  key={title}
                  className="flex items-center gap-3 rounded-xl py-1"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500">
                    <Icon />
                  </span>
                  <h3 className="text-sm font-semibold text-slate-600">
                    {title}
                  </h3>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-2 flex items-start gap-3  px-4 py-3 text-[13px] text-gray-700">
            <FaInfoCircle className="mt-0.5 shrink-0 text-yellow-600" />
            {/* price disclaimer */}
            <p className="leading-6">{pricingNote}</p>
          </div>
          <div className="mt-8 block lg:hidden sm:max-w-md sm:mx-auto">
            <ProviderCard
              provider={p}
              onBook={() => console.log("Book Service")}
            />
          </div>

          {/* what's included and booking availability */}
          <div className="mt-10 border-y border-gray-300 py-5">
            <h1 className="text-lg font-bold tracking-wide">
              ABOUT THIS SERVICE
            </h1>
            <div className="mt-5 grid gap-8 md:grid-cols-2">
              <div>
                <h2 className="text-base font-semibold text-gray-700">
                  What's Included?
                </h2>
                {includes.map((item, i) => (
                  <div key={i} className="mt-3 flex items-start gap-3">
                    <span className="mt-0.5 text-gray-600">
                      <CiCircleCheck />
                    </span>
                    <p className="text-sm text-gray-700">{item}</p>
                  </div>
                ))}
              </div>

              <div>
                <h2 className="text-base font-semibold text-gray-700">
                  Booking Availability
                </h2>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between  ">
                    <span className="flex items-center gap-3 text-sm text-gray-700">
                      <MdEventAvailable className="text-base" />
                      Available today?
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        p.availableToday
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {p.availableToday ? "Yes" : "No"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between ">
                    <span className="flex items-center gap-3 text-sm text-gray-700">
                      <MdElectricBolt className="text-base" />
                      Instant booking available?
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        p.instantBooking
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {p.instantBooking ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* reviews section */}
          <ReviewSection reviews={reviews} />
        </div>
        {/* sticky provider card with booking button for larger screens */}
        <aside className="hidden w-full lg:sticky lg:top-24 lg:block lg:w-95 lg:self-start">
          <ProviderCard
            provider={p}
            onBook={() => console.log("Book service")}
          />
        </aside>
      </div>
    </div>
  );
}

export default ViewDetails;
