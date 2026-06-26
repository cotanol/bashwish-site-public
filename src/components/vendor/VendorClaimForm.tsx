"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  vendorClaimSchema,
  vendorClaimDefaults,
  type VendorClaimInput,
} from "@/schemas";
import { submitVendorClaim } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Loader2, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";

/**
 * Field Error Message Component
 * Displays validation errors professionally
 */
function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <div className="flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-1 duration-200">
      <XCircle className="h-4 w-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}

/**
 * Get input class names based on validation state
 * Returns CSS classes for visual feedback (red border on error, green on valid)
 */
function getInputClassName(error: boolean, isDirty: boolean): string {
  // Only show visual feedback if user has written something
  if (!isDirty) return "";

  if (error) {
    return "border-red-500 focus-visible:ring-red-500";
  }
  // Valid field and user has written
  return "border-green-500 focus-visible:ring-green-500";
}

/**
 * Vendor Claim Form Component
 * Formulario reactivo con validación Zod + React Hook Form
 */
export function VendorClaimForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // ✨ React Hook Form with Zod Resolver + Real-time validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields, dirtyFields },
    setError,
  } = useForm<VendorClaimInput>({
    resolver: zodResolver(vendorClaimSchema) as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    defaultValues: vendorClaimDefaults,
    mode: "onChange", // ✨ Validates in real time while typing
    criteriaMode: "all", // Shows all errors, not just the first one
  });

  /**
   * Handle form submission
   */
  const onSubmit = async (data: VendorClaimInput) => {
    setIsLoading(true);
    setServerError(null);

    const response = await submitVendorClaim(data);

    if (response.success) {
      setSuccess(true);

      // Redirect after 5 seconds
      setTimeout(() => {
        router.push("/");
      }, 5000);
    } else {
      // Handle server validation errors
      if (response.errors && Array.isArray(response.errors)) {
        response.errors.forEach((err: { field?: string; message?: string }) => {
          if (err.field && err.message) {
            setError(err.field as keyof VendorClaimInput, {
              type: "server",
              message: err.message,
            });
          }
        });
      }

      // Show general error message
      setServerError(response.error || "Failed to submit claim request");
    }

    setIsLoading(false);
  };

  // Success state
  if (success) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold text-green-800">
              Claim Submitted Successfully!
            </h2>
            <p className="text-gray-600">
              Thank you for your submission. We&apos;ll review your venue claim
              request and get back to you within 24-48 hours.
            </p>
            <p className="text-sm text-gray-500">
              You will receive a confirmation email shortly.
            </p>
            <p className="text-sm text-gray-400 mt-4">
              Redirecting to homepage in 5 seconds...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Server Error Alert */}
      {serverError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      {/* ================================================ */}
      {/* VENDOR APPLICATION FORM (Simplified MVP) */}
      {/* ================================================ */}
      <Card>
        <CardHeader>
          <CardTitle>Vendor Application</CardTitle>
          <CardDescription>
            Join DEMO and start receiving leads for your party venue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Contact Name */}
          <div className="space-y-2">
            <Label htmlFor="contactName">
              Your Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="contactName"
              placeholder="John Doe"
              {...register("contactName")}
              className={
                errors.contactName
                  ? "border-red-500 focus-visible:ring-red-500"
                  : dirtyFields.contactName && !errors.contactName
                    ? "border-green-500 focus-visible:ring-green-500"
                    : ""
              }
            />
            <FieldError message={errors.contactName?.message} />
          </div>

          {/* Contact Email */}
          <div className="space-y-2">
            <Label htmlFor="contactEmail">
              Email Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="contactEmail"
              type="email"
              placeholder="john@example.com"
              {...register("contactEmail")}
              className={
                errors.contactEmail
                  ? "border-red-500 focus-visible:ring-red-500"
                  : dirtyFields.contactEmail && !errors.contactEmail
                    ? "border-green-500 focus-visible:ring-green-500"
                    : ""
              }
            />
            <FieldError message={errors.contactEmail?.message} />
            <p className="text-sm text-gray-500">
              We&apos;ll use this email to create your vendor account.
            </p>
          </div>

          {/* Contact Phone */}
          <div className="space-y-2">
            <Label htmlFor="contactPhone">Phone Number (Optional)</Label>
            <Input
              id="contactPhone"
              type="tel"
              placeholder="+1 (123) 456-7890"
              {...register("contactPhone")}
              className={getInputClassName(
                !!errors.contactPhone,
                !!touchedFields.contactPhone,
              )}
            />
            <FieldError message={errors.contactPhone?.message} />
          </div>

          {/* Business Name */}
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name (Optional)</Label>
            <Input
              id="businessName"
              placeholder="Amazing Events LLC"
              {...register("businessName")}
              className={getInputClassName(
                !!errors.businessName,
                !!touchedFields.businessName,
              )}
            />
            <FieldError message={errors.businessName?.message} />
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label htmlFor="website">Website (Optional)</Label>
            <Input
              id="website"
              type="url"
              placeholder="https://example.com"
              {...register("website")}
              className={getInputClassName(
                !!errors.website,
                !!touchedFields.website,
              )}
            />
            <FieldError message={errors.website?.message} />
            <p className="text-sm text-gray-500">
              Your business website (helps us verify your business).
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Info Note */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>What happens next?</strong> After approval, you&apos;ll be
          able to log in and add your venue(s), upload photos, create packages,
          and start receiving leads!
        </AlertDescription>
      </Alert>

      {/* ================================================ */}
      {/* SUBMIT BUTTON */}
      {/* ================================================ */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isLoading || isSubmitting}
          variant="golden"
          size={"golden"}
        >
          {isLoading || isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Application"
          )}
        </Button>
      </div>
    </form>
  );
}
