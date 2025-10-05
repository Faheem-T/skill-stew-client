import {
  api,
  type ApiErrorResponseType,
  type ApiResponseType,
  type ApiResponseWithMessage,
} from "@/api/baseApi";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";

export const ResendButton: React.FC<{ email: string }> = ({ email }) => {
  const { isPending, mutate } = useMutation<
    ApiResponseType,
    ApiErrorResponseType
  >({
    mutationFn: async (): Promise<ApiResponseWithMessage> => {
      return api.post("/auth/resend-verification-link", { email });
    },

    onError(error) {
      if (error.response?.data) {
        if (error.response.data.message) {
          toast.error(error.response.data.message);
        }
      }
    },
    onSuccess(data) {
      if (data.message) toast.success(data.message);
    },
  });

  const [totalTime, setTotalTime] = useState(30);

  const [timeLeft, setTimeLeft] = useState(totalTime);
  useEffect(() => {
    const intervalId = setInterval(
      () =>
        setTimeLeft((prev) => {
          if (prev === 0) {
            clearInterval(intervalId);
            return prev;
          }
          return prev - 1;
        }),
      1000,
    );

    return () => clearInterval(intervalId);
  });

  async function onSubmit() {
    mutate();
    setTotalTime(30);
    setTimeLeft(30);
  }

  return (
    <Button
      disabled={isPending || timeLeft > 0}
      onClick={onSubmit}
      className="relative"
    >
      Resend Email {timeLeft > 0 && `(${timeLeft})`}
      <span
        className="absolute bottom-0 left-0 h-1 bg-red-500 transition-all duration-1000"
        style={{ width: `${(timeLeft / totalTime) * 100}%` }}
      />
    </Button>
  );
};
