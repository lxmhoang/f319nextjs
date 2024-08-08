import { Button } from "flowbite-react";
import { useState } from "react";
import { useFormStatus } from "react-dom";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    pendingText: string
  }

export function SubmitButton({ children, pendingText, className, ...props }: Props) {
    const { pending } = useFormStatus();
    const [buttonClicked, setButtonClicked] = useState(false);
  
    return (
      <Button type="submit" aria-disabled={pending} disabled={pending} onClick={() => setButtonClicked(true)} {...props}>
        {pending && buttonClicked ? pendingText : children}
      </Button>
    );
  }