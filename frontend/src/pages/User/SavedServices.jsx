import { useSaved } from "../../context/savedContext";
import EmptyState from "../../components/ui/EmptyState";
import SavedCard from "../../components/user/SavedCard";

function SavedServices() {
  const { savedServices } = useSaved();
  return (
    <div className="p-7">
      {/* Header */}
      <div>
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
          Saved Services
        </h1>
        <p className="text-gray-500 text-[13px] sm:text-sm mt-0.5">
          View and manage the services you've saved for later.
        </p>
      </div>
      <div className="flex flex-col gap-4 mt-10">
        {savedServices.length === 0 ? (
          <EmptyState
            title="No Services Saved"
            description="You haven't saved any services yet. Save services to quickly
                    access them later."
            buttonLink="services"
            buttonText="Explore Services"
            className={`bg-amber-500 hover:bg-amber-600`}
          />
        ) : (
          savedServices.map((booking) => (
            <SavedCard key={booking.id} booking={booking} compact />
          ))
        )}
      </div>
    </div>
  );
}

export default SavedServices;
