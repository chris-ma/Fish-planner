import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#020B14] flex items-center justify-center px-4 py-16">
      <SignIn
        appearance={{
          variables: {
            colorPrimary: "#0D9488",
            colorBackground: "#040F1C",
            colorText: "#F5F0E8",
            colorTextSecondary: "rgba(245,240,232,0.55)",
            colorInputBackground: "#071B30",
            colorInputText: "#F5F0E8",
            borderRadius: "0.75rem",
          },
          elements: {
            card: "shadow-2xl !border !border-white/10",
            formButtonPrimary: "!bg-[#0D9488] hover:!bg-[#0F766E]",
            footerActionLink: "!text-[#0D9488] hover:!text-teal-400",
            socialButtonsBlockButton: "!border !border-white/15 hover:!bg-white/5",
            formFieldInput: "!bg-[#071B30] !border-white/20 focus:!border-[#0D9488]",
            dividerLine: "!bg-white/10",
            dividerText: "!text-white/40",
          },
        }}
      />
    </div>
  );
}
