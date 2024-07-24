/* eslint-disable no-unused-vars */
import React from "react";
import { toast } from "react-toastify";

export const notifyMessage = (customId, message) => {
  toast.success(message, {
    toastId: customId,
  });
};
export const notifyError = (customId, message) => {
  toast.success(message, {
    toastId: customId,
  });
};
