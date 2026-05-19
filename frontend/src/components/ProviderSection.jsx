import PrimaryBtn from "./PrimaryBtn";

function ProviderSection() {
  return (
    <div className="w-full min-h-[70vh] flex items-center justify-center py-5 px-5">
      <div className="max-w-7xl mx-auto flex justify-between items-start w-full bg-white rounded-2xl pl-10 hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 mt-10">
            Become a Provider
          </h1>
          <p className="text-md text-gray-500 mb-10">
            Start earning with your skills and take control of your time.
          </p>

          <div className="flex flex-col-reverse md:flex-row items-center w-full justify-between gap-10">
            <div className="flex flex-col gap-1 w-full ">
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 transition-colors duration-200 cursor-pointer group">
                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                  ✔
                </span>
                <p className="text-gray-700 font-medium group-hover:text-blue-900">
                  Get regular bookings
                </p>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 transition-colors duration-200 cursor-pointer group">
                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                  ✔
                </span>
                <p className="text-gray-700 font-medium group-hover:text-blue-900">
                  Work on your own schedule
                </p>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 transition-colors duration-200 cursor-pointer group">
                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                  ✔
                </span>
                <p className="text-gray-700 font-medium group-hover:text-blue-900">
                  Grow your income sustainably
                </p>
              </div>

              <PrimaryBtn btn="Join as a Provider" className="mt-5  ml-3" />
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 rounded-r-2xl overflow-hidden shadow-lg cursor-pointer group">
          <img
            src="https://plus.unsplash.com/premium_photo-1664476872915-f3332ca961a6?q=80&w=2070&auto=format&fit=crop"
            alt="Become a provider"
            className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 brightness-75"
          />
        </div>
      </div>
    </div>
  );
}

export default ProviderSection;
