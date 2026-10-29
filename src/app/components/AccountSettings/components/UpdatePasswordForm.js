"use client";

import { useMemo, useState } from "react";
import { Button, Form } from "@heroui/react";

import { updatePassword } from "../../../services/authService";
import FormMessage from "./FormMessage";
import PasswordField from "./PasswordField";
import PasswordRequirements from "./PasswordRequirements";
import SettingsCard from "./SettingsCard";
import { getPasswordRequirements, validatePasswordForm } from "../utils";

const INITIAL_FORM = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function UpdatePasswordForm() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const requirements = useMemo(
    () =>
      getPasswordRequirements(formData.newPassword, formData.currentPassword),
    [formData.newPassword, formData.currentPassword],
  );

  const isSubmitDisabled =
    isLoading ||
    !formData.currentPassword ||
    !formData.newPassword ||
    !formData.confirmPassword ||
    Object.values(requirements).some((r) => !r);

  function updateField(field, value) {
    const nextFormData = { ...formData, [field]: value };
    setFormData(nextFormData);
    setErrors(validatePasswordForm(nextFormData));
    setMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validatePasswordForm(formData);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    try {
      setIsLoading(true);
      setMessage("");
      await updatePassword(formData.currentPassword, formData.newPassword);
      setFormData(INITIAL_FORM);
      setErrors({});
      setMessageType("success");
      setMessage("Password updated successfully");
    } catch (error) {
      setMessageType("error");
      setMessage(error.message || "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SettingsCard
      title="Change password"
      description="Update your account password."
      className="w-auto"
    >
      <Form
        id="Update_Password_Form"
        className="flex flex-col items-center justify-center gap-4"
        onSubmit={handleSubmit}
      >
        <div className="flex w-full flex-col gap-4 md:flex-row">
          <div id="inputs" className="flex w-80 flex-col gap-4">
            <PasswordField
              name="current-password"
              label="Current Password"
              placeholder="Enter your current password"
              autoComplete="current-password"
              value={formData.currentPassword}
              onChange={(value) => updateField("currentPassword", value)}
              error={errors.currentPassword}
              isDisabled={isLoading}
              isVisible={isPasswordVisible}
            />
            <PasswordField
              name="new-password"
              label="New Password"
              placeholder="Enter new password"
              autoComplete="new-password"
              value={formData.newPassword}
              onChange={(value) => updateField("newPassword", value)}
              error={errors.newPassword}
              isDisabled={isLoading}
              isVisible={isPasswordVisible}
              onToggleVisibility={() => setIsPasswordVisible((c) => !c)}
            />
            <PasswordField
              name="confirm-password"
              label="Confirm Password"
              placeholder="Confirm new password"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={(value) => updateField("confirmPassword", value)}
              error={errors.confirmPassword}
              isDisabled={isLoading}
              isVisible={isPasswordVisible}
            />
          </div>

          <div className="overflow-auto">
            <PasswordRequirements requirements={requirements} />
          </div>
        </div>

        <FormMessage message={message} type={messageType} />

        <Button
          color="primary"
          className="!w-fit"
          type="submit"
          isLoading={isLoading}
          isDisabled={isSubmitDisabled}
        >
          Change password
        </Button>
      </Form>
    </SettingsCard>
  );
}
