"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

interface EditButtonProps {
  label: string;
  feature: string;
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
}

export function EditButton({ label, feature, variant = "outline", size = "default" }: EditButtonProps) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    alert(`${feature} feature is coming soon! This will allow you to edit your settings directly in the application.`);
    setTimeout(() => setIsClicked(false), 2000);
  };

  return (
    <Button variant={variant} size={size} onClick={handleClick} disabled={isClicked}>
      {label}
    </Button>
  );
}
