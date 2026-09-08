import React from "react";
import { Modal } from "../ui/Card";
import { Button } from "../ui/Button";
import { LogOut } from "lucide-react";

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmLogout: () => void;
}

export const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmLogout,
}) => {
  return (
    <Modal
      id="logout-confirm-modal"
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Logout"
      description="You will be returned to the home landing page"
    >
      <div className="space-y-4">
        <p className="text-xs text-slate-600">
          Are you sure you want to log out of your AI Interview Preparation Assistant account? Your completed mocks, resume audits, and tasks are safely saved.
        </p>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            id="confirm-logout-submit-btn"
            variant="danger"
            size="sm"
            onClick={onConfirmLogout}
          >
            <LogOut className="w-3.5 h-3.5 mr-1" />
            Logout
          </Button>
        </div>
      </div>
    </Modal>
  );
};
