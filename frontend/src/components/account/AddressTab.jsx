import { useState } from "react";
import { CiCircleCheck, CiHome } from "react-icons/ci";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import AddressCard from "../user/AddressCard.jsx";

export function AddressTab() {
  const [addresses, setAddresses] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSave = (data) => {
    setAddresses((prev) => [
      ...prev,
      { id: Date.now(), ...data, isDefault: prev.length === 0 },
    ]);
    setIsFormOpen(false);
  };

  const handleDelete = (id) => {
    setAddresses((prev) => {
      let next = prev.filter((a) => a.id !== id);
      if (next.length > 0 && !next.some((a) => a.isDefault)) {
        next[0].isDefault = true;
      }
      return next;
    });
  };

  const setDefault = (id) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <span className="inline-block h-5 w-1 rounded-full bg-blue-600"></span>
          SAVED ADDRESSES
        </h2>

        {!isFormOpen && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <FiPlus size={16} />
            Add Address
          </button>
        )}
      </div>

      {isFormOpen && (
        <div className="mb-8">
          <AddressCard
            inline
            onSave={handleSave}
            setAddressOpen={setIsFormOpen}
          />
          <button
            onClick={() => setIsFormOpen(false)}
            className="mt-3 cursor-pointer rounded-full border border-gray-300 px-5 py-2.5 text-sm text-gray-700 transition hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      )}

      {addresses.length === 0 && !isFormOpen ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <CiHome size={26} />
          </div>
          <p className="font-semibold text-gray-900">No Addresses Saved</p>
          <p className="max-w-xs text-sm text-gray-500">
            Add your home or work address to make booking faster.
          </p>
          {!isFormOpen && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="mt-2 flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <FiPlus size={16} />
              Add Address
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600">
                    <CiHome size={14} />
                    {addr.label}
                  </span>

                  {addr.isDefault && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                      <CiCircleCheck size={14} />
                      Default
                    </span>
                  )}
                </div>

                {addr.flat && (
                  <p className="text-sm leading-relaxed text-gray-700">
                    {addr.flat}
                  </p>
                )}
                <p className="text-sm leading-relaxed text-gray-700">
                  {addr.street}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {addr.city}, {addr.state} - {addr.pincode}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-3 border-t border-gray-100 pt-3">
                {!addr.isDefault && (
                  <button
                    onClick={() => setDefault(addr.id)}
                    className="cursor-pointer text-xs font-medium text-blue-600 hover:underline"
                  >
                    Set as default
                  </button>
                )}
                <button
                  onClick={() => handleDelete(addr.id)}
                  className="ml-auto flex cursor-pointer items-center gap-1 text-xs font-medium text-red-500 hover:underline"
                >
                  <FiTrash2 size={13} />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
