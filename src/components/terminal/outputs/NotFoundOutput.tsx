interface NotFoundOutputProps {
  command: string;
}

export default function NotFoundOutput({ command }: NotFoundOutputProps) {
  return (
    <p className="text-red-400 font-mono text-sm">
      command not found: <span className="text-red-300">{command}</span>. Try &apos;help&apos;.
    </p>
  );
}
