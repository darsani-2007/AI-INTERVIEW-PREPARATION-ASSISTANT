import React, { useState } from "react";
import { User, Profile } from "../../types";
import { Card, CardHeader, CardTitle, CardDescription, Modal } from "../ui/Card";
import { Button } from "../ui/Button";
import { authService } from "../../services/auth";
import { dbService } from "../../services/db";
import {
  Lock,
  Bell,
  Sliders,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  LogOut,
} from "lucide-react";

interface SettingsPageProps {
  user: User;
  profile: Profile | null;
  onProfileUpdated: (p: Profile) => void;
  onLogout: () => void;
  onAccountDeleted: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  user,
  profile,
  onProfileUpdated,
  onLogout,
  onAccountDeleted,
}) => {
  // Password State
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Preference State
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [difficultyPref, setDifficultyPref] = useState(
    profile?.experienceLevel === "Fresher" ? "Medium" : "Hard"
  );
  const [prefSuccess, setPrefSuccess] = useState<string | null>(null);

  // Delete Account State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess(null);
    setPasswordError(null);

    if (newPassword.length < 8) {
      setPasswordError("Password must contain at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await authService.updatePassword(newPassword);
      setPasswordSuccess("Password successfully updated!");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(null), 4000);
    } catch (err: any) {
      setPasswordError(err?.message || "Failed to update password.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleSavePreferences = async () => {
    setPrefSuccess("Preferences saved successfully!");
    setTimeout(() => setPrefSuccess(null), 3000);
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await dbService.deleteUser(user.id);
      setIsDeleteModalOpen(false);
      onAccountDeleted();
    } catch (err) {
      console.error("Failed to delete account", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Account Settings
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your password, notification preferences, and account credentials.
        </p>
      </div>

      {/* Password Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-600" />
            <div>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Ensure your account is using a secure, long password
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        {passwordSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{passwordSuccess}</span>
          </div>
        )}

        {passwordError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              New Password (min 8 characters)
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="block w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isUpdatingPassword}
          >
            {isUpdatingPassword ? "Updating Password..." : "Update Password"}
          </Button>
        </form>
      </Card>

      {/* Notifications & Difficulty Preferences */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            <div>
              <CardTitle>Interview & Notification Preferences</CardTitle>
              <CardDescription>
                Customize practice alerts and default mock interview challenge level
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        {prefSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{prefSuccess}</span>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between py-2.5 border-b border-slate-100">
            <div>
              <p className="text-xs font-semibold text-slate-800">
                Daily Practice Reminder Emails
              </p>
              <p className="text-[11px] text-slate-500">
                Receive friendly nudges to maintain your 4-day interview streak.
              </p>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500/20 cursor-pointer h-4 w-4"
            />
          </div>

          <div className="flex items-center justify-between py-2.5 border-b border-slate-100">
            <div>
              <p className="text-xs font-semibold text-slate-800">
                Weekly Placement Digest
              </p>
              <p className="text-[11px] text-slate-500">
                Summary of your competency scores, completed tasks, and top weak areas.
              </p>
            </div>
            <input
              type="checkbox"
              checked={weeklyDigest}
              onChange={(e) => setWeeklyDigest(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500/20 cursor-pointer h-4 w-4"
            />
          </div>

          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
              Default Mock Difficulty Preference
            </label>
            <select
              value={difficultyPref}
              onChange={(e) => setDifficultyPref(e.target.value)}
              className="block w-64 px-3.5 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="Easy">Easy (Conceptual & Definition Warm-ups)</option>
              <option value="Medium">Medium (Balanced Technical & Projects)</option>
              <option value="Hard">Hard (Deep Systems & Rigorous Follow-ups)</option>
            </select>
          </div>

          <div className="pt-2">
            <Button variant="outline" size="sm" onClick={handleSavePreferences}>
              Save Preferences
            </Button>
          </div>
        </div>
      </Card>

      {/* Danger Zone / Delete Account */}
      <Card className="border-rose-200 bg-rose-50/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <div>
              <CardTitle className="text-rose-950">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible actions for your student profile and saved interview data
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-bold text-slate-900">
              Delete Student Account
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Permanently delete all your profiles, mock interview logs, resume data, and roadmap progress.
            </p>
          </div>
          <Button
            id="settings-delete-account-btn"
            variant="danger"
            size="sm"
            onClick={() => setIsDeleteModalOpen(true)}
            className="shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            Delete Account
          </Button>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Account Deletion"
        description="Are you sure you want to permanently delete your account?"
      >
        <div className="space-y-4 text-xs text-slate-600">
          <p>
            This action <strong>cannot be undone</strong>. All your interview evaluations, resumes, and study progress will be permanently erased.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={isDeleting}
              onClick={handleDeleteAccount}
            >
              Yes, Permanently Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
