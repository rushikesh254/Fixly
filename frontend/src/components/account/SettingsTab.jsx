import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { deleteAccount } from "../../api/users";
import { useAuth } from "../../context/AuthContext";
import { getApiErrorMessage } from "../../utils/apiError";
import ConfirmDialog from "../ui/ConfirmDialog";

export function SettingsTab() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteAccount();
      setShowDeleteModal(false);
      toast.success(res.data.message || "Your account has been deleted.");
      await logout();
      navigate("/");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not delete your account."));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-xl">
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
        <h3 className="text-sm font-semibold text-red-600">Delete Account</h3>
        <p className="mt-1 text-[13px] text-red-500">
          Permanently delete your account and all associated data. This action
          cannot be undone.
        </p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="mt-4 cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
        >
          Delete Account
        </button>
      </div>

      {showDeleteModal && (
        <ConfirmDialog
          title="Delete your account?"
          message={
            <>
              <p className="text-sm text-gray-600">
                Are you sure you want to permanently delete your account?
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Your saved address and saved services will be removed, and any
                upcoming bookings will be cancelled.
              </p>
            </>
          }
          cancelLabel="Cancel"
          confirmLabel={isDeleting ? "Deleting..." : "Delete Account"}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
