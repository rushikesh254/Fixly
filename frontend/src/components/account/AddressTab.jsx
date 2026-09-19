import { useCallback, useState } from "react";
import { CiHome } from "react-icons/ci";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";
import { deleteAddress, getAddress } from "../../api/users";
import ConfirmDialog from "../ui/ConfirmDialog";
import Loader, { ErrorState } from "../ui/Loader";
import { useFetch } from "../../hooks/useFetch";
import { getApiErrorMessage } from "../../utils/apiError";
import AddressCard from "../user/AddressCard.jsx";

export function AddressTab() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchAddress = useCallback(
    () => getAddress().then((res) => res.data.address),
    [],
  );

  const {
    data: address,
    loading,
    error,
    refetch,
    setData: setAddress,
  } = useFetch(fetchAddress);

  // the api returns the saved address, so the ui updates without refetching
  const handleSave = (saved) => {
    setAddress(saved || null);
    setIsFormOpen(false);
  };

  const handleDelete = async () => {
    try {
      await deleteAddress();
      setAddress(null);
      setShowDeleteModal(false);
      toast.success("Address removed.");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Could not remove the address."));
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <span className="inline-block h-5 w-1 rounded-full bg-blue-600"></span>
          YOUR ADDRESS
        </h2>

        {!isFormOpen && address && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
          >
            <FiEdit2 size={14} />
            Change Address
          </button>
        )}
      </div>

      {isFormOpen && (
        <AddressCard
          currentAddress={address}
          onSave={handleSave}
          setAddressOpen={setIsFormOpen}
        />
      )}

      {loading && <Loader label="Loading your address..." />}

      {!loading && error && <ErrorState message={error} onRetry={refetch} />}

      {!loading && !error && !address ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <CiHome size={26} />
          </div>
          <p className="font-semibold text-gray-900">No Address Saved</p>
          <p className="max-w-xs text-sm text-gray-500">
            Add your address to make booking faster.
          </p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="mt-2 flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <FiPlus size={16} />
            Add Address
          </button>
        </div>
      ) : (
        !loading &&
        !error && (
          <div className="max-w-md">
            <div className="relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600">
                    <CiHome size={14} />
                    {address.label || "Address"}
                  </span>
                </div>

                {address.flat && (
                  <p className="text-sm leading-relaxed text-gray-700">
                    {address.flat}
                  </p>
                )}
                <p className="text-sm leading-relaxed text-gray-700">
                  {address.street}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {address.city}, {address.state} - {address.pincode}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-3 border-t border-gray-100 pt-3">
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="cursor-pointer text-xs font-medium text-blue-600 hover:underline"
                >
                  Change
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="ml-auto flex cursor-pointer items-center gap-1 text-xs font-medium text-red-500 hover:underline"
                >
                  <FiTrash2 size={13} />
                  Remove
                </button>
              </div>
            </div>
          </div>
        )
      )}

      {showDeleteModal && (
        <ConfirmDialog
          title="Remove this address?"
          message="You will need to add an address again before your next booking."
          cancelLabel="Keep Address"
          confirmLabel="Remove"
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
