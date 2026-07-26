import React from 'react';
import {
  CheckCircle2,
  Cloud,
  Code2,
  ExternalLink,
  FileCheck,
  Github,
  Globe,
  Layers,
  Terminal,
  X,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';

interface CloudflareDeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CloudflareDeploymentModal: React.FC<CloudflareDeploymentModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedCmd, setCopiedCmd] = React.useState(false);

  if (!isOpen) return null;

  const handleCopyBuildCmd = () => {
    navigator.clipboard.writeText('npm run build');
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="bg-slate-900 border border-slate-700/90 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-slate-100 p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 font-extrabold shadow-lg">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Cloudflare Pages Deployment Guide
              </h2>
              <p className="text-xs text-slate-400">
                Level 2 Assignment Submission & GitHub Connection Reference
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Key Build Settings Summary Box */}
        <div className="p-4 rounded-2xl bg-slate-800/90 border border-amber-500/30 space-y-3">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
            <FileCheck className="w-4 h-4 text-amber-400" />
            <span>Required Cloudflare Build Settings</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-700">
              <span className="text-slate-400 block text-[10px] font-sans uppercase">
                Build Command
              </span>
              <div className="flex items-center justify-between mt-1 text-sky-300 font-bold">
                <code>npm run build</code>
                <button
                  onClick={handleCopyBuildCmd}
                  className="text-slate-400 hover:text-white transition-colors"
                  title="Copy command"
                >
                  {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-700">
              <span className="text-slate-400 block text-[10px] font-sans uppercase">
                Build Output Directory
              </span>
              <div className="mt-1 text-emerald-300 font-bold">
                <code>dist</code>
              </div>
            </div>
          </div>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" /> Deployment Workflow (7 Steps)
          </h3>

          <ol className="space-y-3 text-xs sm:text-sm text-slate-300">
            <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-800">
              <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <div>
                <strong className="text-white">Connect Google AI Studio to GitHub:</strong> In the top
                right menu of Google AI Studio, click <strong>Export / Connect to GitHub</strong> to
                push this Weather Intelligence project directly into your GitHub account repository.
              </div>
            </li>

            <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-800">
              <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <div>
                <strong className="text-white">Log in to Cloudflare Dashboard:</strong> Navigate to{' '}
                <a
                  href="https://dash.cloudflare.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-400 underline font-semibold hover:text-sky-300"
                >
                  Cloudflare Dashboard <ExternalLink className="w-3 h-3 inline ml-0.5" />
                </a>{' '}
                and open <strong>Workers & Pages</strong>.
              </div>
            </li>

            <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-800">
              <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <div>
                <strong className="text-white">Create Pages Application:</strong> Select{' '}
                <strong>Create Application</strong> &rarr; <strong>Pages</strong> &rarr;{' '}
                <strong>Connect to Git</strong>.
              </div>
            </li>

            <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-800">
              <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                4
              </span>
              <div>
                <strong className="text-white">Authorize Repository Access:</strong> Choose your GitHub
                account and select the newly exported Weather Intelligence repository.
              </div>
            </li>

            <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-800">
              <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                5
              </span>
              <div>
                <strong className="text-white">Configure Build Settings:</strong>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-400">
                  <li>Framework preset: <code className="text-sky-300">Vite</code></li>
                  <li>Build command: <code className="text-sky-300">npm run build</code></li>
                  <li>Build output directory: <code className="text-emerald-300">dist</code></li>
                </ul>
              </div>
            </li>

            <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-800">
              <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                6
              </span>
              <div>
                <strong className="text-white">Deploy Site:</strong> Click <strong>Save and Deploy</strong>.
                Cloudflare Pages will run Vite build and generate your live live <code className="text-amber-300">*.pages.dev</code> URL.
              </div>
            </li>

            <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-800">
              <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                7
              </span>
              <div>
                <strong className="text-white">Validate & Submit Evidence:</strong> Test at least 2 valid
                city searches (e.g. London, Tokyo) and 1 invalid city search error test. Capture screenshots and fill the evaluation rubric sheet.
              </div>
            </li>
          </ol>
        </div>

        {/* Footer Action */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm transition-all"
          >
            I Understand • Back to App
          </button>
        </div>
      </div>
    </div>
  );
};
