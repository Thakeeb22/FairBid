import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "@starknet-react/core";
import PageLayout from "@/components/layout/PageLayout";
import { ArrowLeft, Rocket, Info } from "lucide-react";
import { createAuction } from "@/lib/api";

// -----------------------------
// Types
// -----------------------------
interface FormState {
  title: string;
  description: string;
  startingPrice: string;
  commitDeadline: string;
  revealDeadline: string;
}

interface FormErrors {
  title?: string;
  description?: string;
  startingPrice?: string;
  commitDeadline?: string;
  revealDeadline?: string;
  image?: string;
}

// -----------------------------
// Component
// -----------------------------
const CreateAuction: React.FC = () => {
  const navigate = useNavigate();
  const { address } = useAccount(); // ✅ REAL WALLET

  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    startingPrice: "",
    commitDeadline: "",
    revealDeadline: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // -----------------------------
  // Validation
  // -----------------------------
  const validate = (): FormErrors => {
    const err: FormErrors = {};

    if (!form.title.trim() || form.title.length < 3)
      err.title = "Title must be at least 3 characters.";

    if (!form.description.trim() || form.description.length < 10)
      err.description = "Description must be at least 10 characters.";

    const price = parseFloat(form.startingPrice);
    if (isNaN(price) || price <= 0)
      err.startingPrice = "Starting price must be a positive number.";

    if (!form.commitDeadline) err.commitDeadline = "Commit deadline required";
    if (!form.revealDeadline) err.revealDeadline = "Reveal deadline required";

    if (form.commitDeadline && form.revealDeadline) {
      if (new Date(form.revealDeadline) <= new Date(form.commitDeadline)) {
        err.revealDeadline = "Reveal must be after commit";
      }
    }

    if (!image) err.image = "Auction image required";

    return err;
  };

  // -----------------------------
  // Submit Handler
  // -----------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validate();
    if (Object.keys(validation).length) {
      setErrors(validation);
      return;
    }

    if (!address) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("startingPrice", form.startingPrice);
      formData.append("commitDeadline", form.commitDeadline);
      formData.append("revealDeadline", form.revealDeadline);
      formData.append("creatorWallet", address); // ✅ REAL WALLET
      if (image) formData.append("image", image);

      await createAuction(formData);

      setSubmitted(true);
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      console.error(err);
      alert("Failed to create auction. Check console.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Reusable Input
  // -----------------------------
  const Input = (
    key: keyof FormState,
    label: string,
    type: string = "text",
    textarea = false
  ) => (
    <div className="space-y-1.5">
      <label className="font-heading text-sm font-semibold">{label}</label>

      {textarea ? (
        <textarea
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          className="w-full bg-muted border rounded-xl px-4 py-3"
        />
      ) : (
        <input
          type={type}
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          className="w-full bg-muted border rounded-xl px-4 py-3"
        />
      )}

      {errors[key] && (
        <p className="text-xs text-destructive">{errors[key]}</p>
      )}
    </div>
  );

  // -----------------------------
  // Success Screen
  // -----------------------------
  if (submitted) {
    return (
      <PageLayout>
        <div className="text-center py-20">
          <Rocket size={40} className="mx-auto text-gold" />
          <h2 className="text-xl font-bold mt-4">Auction Created!</h2>
          <p className="text-muted-foreground">
            Redirecting to dashboard...
          </p>
        </div>
      </PageLayout>
    );
  }

  // -----------------------------
  // Main UI
  // -----------------------------
  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto py-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-muted-foreground mb-6"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="card-glass p-6 space-y-5">
          <h1 className="text-2xl font-bold">Create Auction</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {Input("title", "Auction Title")}
            {Input("description", "Description", "text", true)}

            {Input("startingPrice", "Starting Price (STRK)", "number")}

            {/* Image Upload */}
            <div>
              <label className="font-semibold text-sm">Auction Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="w-full mt-2"
              />
              {errors.image && (
                <p className="text-xs text-destructive">{errors.image}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {Input("commitDeadline", "Commit Deadline", "datetime-local")}
              {Input("revealDeadline", "Reveal Deadline", "datetime-local")}
            </div>

            {/* Info Box */}
            <div className="flex gap-2 text-xs text-muted-foreground">
              <Info size={14} />
              Commit = hidden bids. Reveal = open bids.
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-gold rounded-xl font-bold"
            >
              {loading ? "Creating..." : "Create Auction 🚀"}
            </button>
          </form>
        </div>
      </div>
    </PageLayout>
  );
};

export default CreateAuction;