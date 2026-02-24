import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { ArrowLeft, Rocket, Info } from "lucide-react";
import { createAuction } from "@/lib/api"; // <-- import your API call

interface FormData {
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
}

const CreateAuction: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>({
    title: "",
    description: "",
    startingPrice: "",
    commitDeadline: "",
    revealDeadline: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!form.title.trim() || form.title.length < 3)
      errs.title = "Title must be at least 3 characters.";
    if (!form.description.trim() || form.description.length < 10)
      errs.description = "Description must be at least 10 characters.";
    const price = parseFloat(form.startingPrice);
    if (isNaN(price) || price <= 0)
      errs.startingPrice = "Starting price must be a positive number.";
    if (!form.commitDeadline) errs.commitDeadline = "Bid deadline is required.";
    if (!form.revealDeadline)
      errs.revealDeadline = "Reveal deadline is required.";
    if (form.commitDeadline && form.revealDeadline) {
      if (new Date(form.revealDeadline) <= new Date(form.commitDeadline)) {
        errs.revealDeadline = "Reveal deadline must be after bid deadline.";
      }
    }
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const now = new Date();

      const commitDate = new Date(form.commitDeadline);
      const revealDate = new Date(form.revealDeadline);

      // ⏱ Convert to hours
      const duration = Math.ceil(
        (commitDate.getTime() - now.getTime()) / (1000 * 60 * 60),
      );

      const revealDuration = Math.ceil(
        (revealDate.getTime() - commitDate.getTime()) / (1000 * 60 * 60),
      );

      const payload = {
        title: form.title,
        description: form.description,
        startingPrice: parseFloat(form.startingPrice),
        commitDeadline: form.commitDeadline,
        revealDeadline: form.revealDeadline,
        creatorWallet: "0xYourWallet", // 🔥 replace with Starknet wallet later
      };

      console.log("Sending payload:", payload); // debug

      await createAuction(payload);

      setSubmitted(true);
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      console.error("Failed to create auction:", err);
      alert("Failed to create auction. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const field = (
    key: keyof FormData,
    label: string,
    type: string = "text",
    placeholder?: string,
    hint?: string,
  ) => (
    <div className="space-y-1.5">
      <label className="font-heading text-sm font-semibold text-foreground flex items-center gap-2">
        {label}
        {hint && (
          <span className="group relative">
            <Info size={13} className="text-muted-foreground cursor-help" />
            <span className="absolute left-5 -top-1 w-48 p-2 bg-card border border-border rounded-lg text-xs font-body text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
              {hint}
            </span>
          </span>
        )}
      </label>
      {type === "textarea" ? (
        <textarea
          className={`w-full bg-muted border rounded-xl px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold transition-colors resize-none h-28 ${
            errors[key] ? "border-destructive" : "border-border"
          }`}
          placeholder={placeholder}
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        />
      ) : (
        <input
          type={type}
          className={`w-full bg-muted border rounded-xl px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold transition-colors ${
            errors[key] ? "border-destructive" : "border-border"
          }`}
          placeholder={placeholder}
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        />
      )}
      {errors[key] && (
        <p className="text-xs font-body text-destructive">{errors[key]}</p>
      )}
    </div>
  );

  if (submitted) {
    return (
      <PageLayout>
        <div className="max-w-lg mx-auto px-4 py-20 text-center animate-fade-in">
          <div className="w-20 h-20 rounded-2xl bg-gradient-gold mx-auto flex items-center justify-center mb-6 gold-glow">
            <Rocket size={36} className="text-accent-foreground" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
            Auction Created!
          </h2>
          <p className="font-body text-muted-foreground">
            Your sealed-bid auction is live on Starknet. Redirecting...
          </p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 animate-fade-in">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-body text-sm mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <div className="card-glass p-6 sm:p-8">
          <div className="mb-8">
            <h1 className="font-heading text-2xl font-bold text-foreground mb-1">
              Create Auction
            </h1>
            <p className="font-body text-sm text-muted-foreground">
              Deploy a sealed-bid auction smart contract on Starknet.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {field(
              "title",
              "Auction Title",
              "text",
              "e.g. Circuit Genesis #001",
            )}
            {field(
              "description",
              "Description",
              "textarea",
              "Describe your NFT and auction terms...",
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {field(
                "startingPrice",
                "Starting Price (STRK)",
                "number",
                "0.00",
                "Minimum bid accepted",
              )}
              <div />
            </div>

            <div className="p-4 rounded-xl border border-border bg-muted/50 space-y-1">
              <p className="font-heading text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Auction Timeline
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {field(
                "commitDeadline",
                "Bid Deadline",
                "datetime-local",
                undefined,
                "Last time users can submit sealed bids",
              )}
              {field(
                "revealDeadline",
                "Reveal Deadline",
                "datetime-local",
                undefined,
                "Last time users can reveal their bids",
              )}
            </div>

            <div className="flex gap-3 p-4 rounded-xl border border-accent-muted bg-accent/5">
              <Info size={16} className="text-gold mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="font-heading text-sm font-semibold text-foreground">
                  How commit-reveal works
                </p>
                <p className="font-body text-xs text-muted-foreground leading-relaxed">
                  Bidders submit a cryptographic hash of their bid during the
                  commit phase. After the deadline, they reveal the actual bid.
                  This prevents frontrunning and ensures a fair auction.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-gold rounded-xl font-heading font-bold text-accent-foreground text-base gold-glow hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2 animate-gold-pulse"
            >
              <Rocket size={18} />
              {loading ? "Creating..." : "Create Auction 🚀"}
            </button>
          </form>
        </div>
      </div>
    </PageLayout>
  );
};

export default CreateAuction;
