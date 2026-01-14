"use client";

import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_ENVIRONMENT, Environment } from "@/lib/env";

export function HighlightNotification() {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  // Only show in production environment
  if (APP_ENVIRONMENT !== Environment.PRODUCTION || !isVisible) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
      <Alert
        variant="destructive"
        className="shadow-lg border-2 border-yellow-600 "
      >
        <AlertTitle className="text-base font-semibold text-yellow-200">
          For your information
        </AlertTitle>
        <AlertDescription>
          <p className="mb-2 text-yellow-100/90 break-words">
            This site is displaying data from the Preview. The Mainnet is planned to launch in Q1/2026.
            <br />
            The NIGHT token has already been minted on Cardano, you guys can view it here:{" "}
            <br />
            👉
            <a 
              href="https://cardanoscan.io/token/0691b2fecca1ac4f53cb6dfb00b7013e561d1f34403b957cbb5af1fa4e49474854"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-yellow-300 hover:text-yellow-100 underline decoration-yellow-400/50 hover:decoration-yellow-100 transition-colors break-all"
            >
              cardanoscan.io/token/0691b2fe...4e49474854
            </a>
          </p>
        </AlertDescription>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6 rounded-full hover:bg-yellow-900/30 text-yellow-200 hover:text-yellow-100"
          onClick={handleDismiss}
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </Button>
      </Alert>
    </div>
  );
}
