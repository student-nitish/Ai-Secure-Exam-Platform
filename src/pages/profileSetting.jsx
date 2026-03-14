import { useEffect, useState } from "react";
import { apiConnector } from "../servicse/apiConnector";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import socket from "../socket";


const ProfileSettings = () => {
  const [profile, setProfile] = useState({});
  const [form, setForm] = useState({ name: "", email: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const dispatch=useDispatch();

    const handleLogout = async () => {
    try {
      await apiConnector("POST", "/auth/logout", {}, { withCredentials: true });

      dispatch(logout());
      socket.disconnect();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await apiConnector("GET", "/users/profile");

      setProfile(res.data.user);
      setForm({
        name: res.data.user.name,
        email: res.data.user.email,
      });
    } catch {
      toast.error("Failed to load profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileUpdate = async () => {
    try {
      await apiConnector("PUT", "/users/update-profile", form);

      toast.success("Profile updated");

      fetchProfile();
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      await apiConnector("PUT", "/users/change-password", passwordForm);

      toast.success("Password updated");

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch {
      toast.error("Password update failed");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await apiConnector("DELETE", "/users/delete-account");

      toast.success("Account deleted");
      handleLogout();     
      navigate("/");
    } catch {
      toast.error("Failed to delete account");
    }
  };

  

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12">
      <h1 className="text-3xl font-bold mb-10 md:pt-9 pt-12">
        Profile Settings
      </h1>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* PROFILE INFO */}

        <div className="bg-[#0f172a] p-8 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-6">Profile Information</h2>

          {/* AVATAR */}

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full overflow-hidden border border-slate-600">
              <img
                src={profile?.image}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </div>

            <span className="text-gray-400 text-sm">
              Avatar generated via DiceBear
            </span>
          </div>

          {/* NAME */}

          <div className="mb-4">
            <label className="text-sm text-gray-400">Name</label>

            <input
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              className="w-full mt-1 p-3 bg-[#1e293b] rounded-lg outline-none"
            />
          </div>

          {/* EMAIL */}

          <div className="mb-6">
            <label className="text-sm text-gray-400">Email</label>

            <input
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              className="w-full mt-1 p-3 bg-[#1e293b] rounded-lg outline-none"
            />
          </div>

          <button
            onClick={handleProfileUpdate}
            className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-500"
          >
            Save Changes
          </button>
        </div>

        {/* CHANGE PASSWORD */}

        <div className="bg-[#0f172a] p-8 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-6">Change Password</h2>

          <div className="mb-4">
            <label className="text-sm text-gray-400">Current Password</label>

            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  currentPassword: e.target.value,
                })
              }
              className="w-full mt-1 p-3 bg-[#1e293b] rounded-lg outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="text-sm text-gray-400">New Password</label>

            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  newPassword: e.target.value,
                })
              }
              className="w-full mt-1 p-3 bg-[#1e293b] rounded-lg outline-none"
            />
          </div>

          <div className="mb-6">
            <label className="text-sm text-gray-400">Confirm Password</label>

            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  confirmPassword: e.target.value,
                })
              }
              className="w-full mt-1 p-3 bg-[#1e293b] rounded-lg outline-none"
            />
          </div>

          <button
            onClick={handlePasswordUpdate}
            className="bg-green-600 px-6 py-2 rounded-lg hover:bg-green-500"
          >
            Update Password
          </button>
        </div>
      </div>

      {/* DANGER ZONE */}

      <div className="bg-red-900/20 border border-red-600 p-8 rounded-xl mt-12">
        <h2 className="text-xl font-semibold mb-3 text-red-400">Danger Zone</h2>

        <p className="text-gray-400 mb-6">
          Deleting your account will permanently remove all your data.
        </p>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="bg-red-600 px-6 py-2 rounded-lg hover:bg-red-500"
        >
          Delete Account
        </button>
      </div>

      {/* ✅ DELETE MODAL */}
    {showDeleteModal && (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

        <div className="bg-[#0f172a] p-6 rounded-xl w-[400px] border border-white/10">

          <h3 className="text-lg font-semibold text-red-400 mb-3">
            Confirm Account Deletion
          </h3>

          <p className="text-gray-400 mb-6">
            Are you sure you want to delete your account? This action cannot be undone.
          </p>

          <div className="flex justify-end gap-3">

            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>

            <button
              onClick={() => {
                handleDeleteAccount();
                setShowDeleteModal(false);
              }}
              className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-500"
            >
              Delete
            </button>

          </div>

        </div>

      </div>
    )}
    </div>

    
  );

   

};


export default ProfileSettings;
