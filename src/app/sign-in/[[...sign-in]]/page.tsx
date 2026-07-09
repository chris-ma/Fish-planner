import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Sign In",
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#0B1D2A] flex items-center justify-center px-4 py-16">
      <SignIn
        appearance={{
          variables: {
            colorPrimary: "#FFC423",
            colorBackground: "#0F2635",
            colorText: "#F2EDE2",
            colorTextSecondary: "rgba(234,226,208,0.55)",
            colorInputBackground: "#143244",
            colorInputText: "#F2EDE2",
            borderRadius: "0.75rem",
          },
          elements: {
            card: "shadow-2xl !border !border-white/10",
            formButtonPrimary: "!bg-[#FFC423] hover:!bg-[#D9A61C]",
            footerActionLink: "!text-[#FFC423] hover:!text-[#FFD666]",
            socialButtonsBlockButton: "!border !border-white/15 hover:!bg-white/5",
            formFieldInput: "!bg-[#143244] !border-white/20 focus:!border-[#FFC423]",
            dividerLine: "!bg-white/10",
            dividerText: "!text-white/40",
          },
        }}
      />
    </div>
  );
}
