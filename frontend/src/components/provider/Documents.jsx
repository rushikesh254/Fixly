import { useState } from "react";
import { CiFileOn } from "react-icons/ci";
import { toast } from "sonner";

function Documents() {
  const [idProof, setIdProof] = useState(null);
  const [addressProof, setAddressProof] = useState(null);
  const [skillProof, setSkillProof] = useState(null);
  const [status] = useState("pending");

  const handleUpload = (e, setter) => {
    const file = e.target.files[0];
    if (!file) return;
    setter(file);
    toast.success(`${file.name} uploaded!`);
  };

  return (
    <div className="max-w-2xl">
      {/* Verification status */}
      <div className="mb-8 flex items-center gap-3">
        <span className="text-sm font-medium text-slate-800">
          Verification Status:
        </span>
        {status === "verified" ? (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
            Verified
          </span>
        ) : status === "pending" ? (
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
            Pending
          </span>
        ) : (
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
            Rejected
          </span>
        )}
      </div>

      <div className="flex flex-col gap-5">
        {/* ID Proof */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3 mb-4">
            <CiFileOn size={20} className="text-slate-500" />
            <h3 className="text-sm font-semibold text-gray-900">ID Proof</h3>
          </div>

          {idProof ? (
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <span className="text-sm text-slate-700 truncate max-w-[70%]">
                {idProof.name}
              </span>
              <button
                onClick={() => setIdProof(null)}
                className="cursor-pointer text-xs text-red-500 transition hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ) : (
            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 transition hover:border-blue-400 hover:bg-blue-50">
              <CiFileOn size={28} className="text-slate-400" />
              <span className="text-[13px] text-slate-500">
                Upload a valid ID (Aadhaar, Driving License, Voter ID)
              </span>
              <span className="text-xs text-blue-600 font-medium">
                Browse File
              </span>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => handleUpload(e, setIdProof)}
              />
            </label>
          )}
        </div>

        {/* Address Proof */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3 mb-4">
            <CiFileOn size={20} className="text-slate-500" />
            <h3 className="text-sm font-semibold text-gray-900">
              Address Proof
            </h3>
          </div>

          {addressProof ? (
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <span className="text-sm text-slate-700 truncate max-w-[70%]">
                {addressProof.name}
              </span>
              <button
                onClick={() => setAddressProof(null)}
                className="cursor-pointer text-xs text-red-500 transition hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ) : (
            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 transition hover:border-blue-400 hover:bg-blue-50">
              <CiFileOn size={28} className="text-slate-400" />
              <span className="text-[13px] text-slate-500">
                Upload address proof (Aadhaar, Utility bill, Bank statement)
              </span>
              <span className="text-xs text-blue-600 font-medium">
                Browse File
              </span>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => handleUpload(e, setAddressProof)}
              />
            </label>
          )}
        </div>

        {/* Skill/Experience Proof */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3 mb-4">
            <CiFileOn size={20} className="text-slate-500" />
            <h3 className="text-sm font-semibold text-gray-900">
              Skill/ Experience Proof
            </h3>
          </div>

          {skillProof ? (
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <span className="text-sm text-slate-700 truncate max-w-[70%]">
                {skillProof.name}
              </span>
              <button
                onClick={() => setSkillProof(null)}
                className="cursor-pointer text-xs text-red-500 transition hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ) : (
            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 transition hover:border-blue-400 hover:bg-blue-50">
              <CiFileOn size={28} className="text-slate-400" />
              <span className="text-[13px] text-slate-500">
                Upload skill proof (ITI/ Diploma/ Training/ Experience
                Certificate)
              </span>
              <span className="text-xs text-blue-600 font-medium">
                Browse File
              </span>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => handleUpload(e, setAddressProof)}
              />
            </label>
          )}
        </div>
      </div>
    </div>
  );
}

export default Documents;
