import { FC } from "react";

interface InputFieldProps {
  onChange: (e: any) => void;
  label: string;
  name: string | undefined;
  type: React.HTMLInputTypeAttribute | undefined;
}

export function InputField({ onChange, label, type, name }: InputFieldProps) {
  return (
    <div className="flex flex-col">
      <p className="text-xs">{label}</p>
      <input
        name={name}
        type={type}
        onChange={onChange}
        className="text-black"
      />
    </div>
  );
}

interface ButtonProps {
  onClick: () => void;
  children: any;
}

export function Button({ onClick, children }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>;
}

export function AppBar() {
  return (
    <div className="h-[10vh] p-2 flex items-center justify-between">
      <p className="text-2xl font-semibold">Solana Examples</p>
      <WalletMultiButton />
    </div>
  );
}
