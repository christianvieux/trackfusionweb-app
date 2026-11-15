import React from "react";

const messageStyles = {
  success: "text-success",
  error: "text-danger",
};

export default function FormMessage({ type = "success", children }) {
  if (!children) return null;

  return (
    <p
      role={type === "error" ? "alert" : "status"}
      className={`break-words text-center text-sm ${messageStyles[type]}`}
    >
      {children}
    </p>
  );
}
