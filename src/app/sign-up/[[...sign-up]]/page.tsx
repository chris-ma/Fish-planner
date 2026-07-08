import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Sign Up",
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#0A1C28] flex items-center justify-center px-4 py-16">
      <SignUp
        appearance={{
          variables: {
            colorPrimary: "#C99A3E",
            colorBackground: "#0F2635",
            colorText: "#EAE2D0",
            colorTextSecondary: "rgba(234,226,208,0.55)",
            colorInputBackground: "#143244",
            colorInputText: "#EAE2D0",
            borderRadius: "0.75rem",
          },
          elements: {
            card: "shadow-2xl !border !border-white/10",
            formButtonPrimary: "!bg-[#C99A3E] hover:!bg-[#AD8232]",
            footerActionLink: "!text-[#C99A3E] hover:!text-[#D9B15E]",
            socialButtonsBlockButton: "!border !border-white/15 hover:!bg-white/5",
            formFieldInput: "!bg-[#143244] !border-white/20 focus:!border-[#C99A3E]",
            dividerLine: "!bg-white/10",
            dividerText: "!text-white/40",
          },
        }}
      />
    </div>
  );
}
