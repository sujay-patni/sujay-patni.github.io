interface NotFoundOutputProps {
  command: string;
}

export default function NotFoundOutput({ command }: NotFoundOutputProps) {
  return (
    <p className="text-[var(--t-danger)] font-mono text-sm">
      command not found: <span className="opacity-80">{command}</span>. Try &apos;help&apos;.
    </p>
  );
}
