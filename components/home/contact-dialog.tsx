"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { contactStepSchema } from "@/lib/schemas/contacting.schema";
import { useState } from "react";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

type ContactDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  onSubmit: (data: { email: string; message: string; reason: string }) => void;
};

export const ContactDialog = ({
  isOpen,
  onOpenChange,
  email,
  onSubmit,
}: ContactDialogProps) => {
  const [message, setMessage] = useState("");
  const [reason, setReason] = useState("");
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateStep = () => {
    try {
      if (step === 1) {
        contactStepSchema.step1.parse({ message });
      } else if (step === 2) {
        contactStepSchema.step2.parse({ reason });
      } else if (step === 3) {
        contactStepSchema.step3.parse({ email, message, reason });
      }
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (typeof err.path[0] === "string") {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = () => {
    if (validateStep()) {
      onSubmit({ email, message, reason });
      setStep(1);
      setMessage("");
      setReason("");
      setErrors({});
    }
  };

  const getStepTitle = () => {
    if (step === 1) return "Your request";
    if (step === 2) return "Select a reason";
    return "Confirmation";
  };

  const getStepDescription = () => {
    if (step === 1) return "Describe your request !";
    if (step === 2) return "Select a reason ?";
    return "Check the information before sending";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-neutral-950 text-neutral-200 rounded-lg border border-neutral-800 shadow-2xl max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 pb-2">
            {getStepTitle()}
          </DialogTitle>
          <DialogDescription className="text-neutral-500 text-sm">
            {getStepDescription()}
          </DialogDescription>
        </DialogHeader>
        <div className="my-6">
          {step === 1 && (
            <div>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your request here..."
                className={`bg-neutral-950 border-neutral-800 text-neutral-200 rounded-lg focus:ring-2 focus:ring-teal-500 min-h-[150px] placeholder:text-neutral-700 ${
                  errors.message ? "border-red-500" : "border-neutral-800"
                }`}
              />
              {errors.message && (
                <p className="text-red-500 text-sm mt-1">{errors.message}</p>
              )}
            </div>
          )}
          {step === 2 && (
            <Select onValueChange={setReason}>
              <SelectTrigger className="bg-neutral-950 border-neutral-800 text-neutral-200 rounded-lg focus:ring-2 focus:ring-teal-500">
                <SelectValue placeholder="Sélectionnez une raison" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-950 border-neutral-800 text-neutral-200">
                <SelectItem value="emploi">Offre d&apos;emploi</SelectItem>
                <SelectItem value="collaboration">Une collaboration</SelectItem>
                <SelectItem value="autre">Autre</SelectItem>
              </SelectContent>
            </Select>
          )}
          {step === 3 && (
            <div className="space-y-3 text-sm bg-neutral-950 border border-neutral-800 p-4 rounded-lg">
              <p>
                <strong className="text-neutral-200">Email :</strong>{" "}
                <span className="text-neutral-500">{email}</span>
              </p>
              <p>
                <strong className="text-neutral-200">Message :</strong>{" "}
                <span className="text-neutral-500">{message}</span>
              </p>
              <p>
                <strong className="text-neutral-200">Raison :</strong>{" "}
                <span className="text-neutral-500">{reason}</span>
              </p>
            </div>
          )}
        </div>
        <DialogFooter className="flex justify-between">
          {step > 1 && (
            <Button
              onClick={prevStep}
              className="bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg hover:bg-neutral-900 px-6 py-2 transition-colors duration-300"
            >
              Retour
            </Button>
          )}
          {step < 3 ? (
            <Button
              onClick={nextStep}
              className="bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg focus:ring-2 focus:ring-teal-500 hover:bg-neutral-900 px-6 py-2 transition-all duration-300"
            >
              Suivant
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg focus:ring-2 focus:ring-teal-500 hover:bg-neutral-900 px-6 py-2 transition-all duration-300"
            >
              Envoyer
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};