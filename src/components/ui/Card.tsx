import React from "react";

export const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  id?: string;
  onClick?: () => void;
}> = ({ children, className = "", id, onClick }) => {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-6 transition-all ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div className={`mb-5 flex items-center justify-between gap-3 ${className}`}>
    {children}
  </div>
);

export const CardTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <h3 className={`text-base sm:text-lg font-bold text-slate-900 tracking-tight ${className}`}>
    {children}
  </h3>
);

export const CardDescription: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <p className={`text-xs sm:text-sm text-slate-500 mt-1 ${className}`}>{children}</p>
);

export const Badge: React.FC<{
  children: React.ReactNode;
  variant?: "primary" | "success" | "warning" | "danger" | "neutral" | "purple";
  className?: string;
  id?: string;
}> = ({ children, variant = "neutral", className = "", id }) => {
  const variants = {
    primary: "bg-blue-100 text-blue-700 border-blue-200",
    success: "bg-green-50 text-green-600 border-green-200",
    warning: "bg-orange-50 text-orange-600 border-orange-200",
    danger: "bg-red-50 text-red-600 border-red-200",
    neutral: "bg-white text-slate-700 border-slate-200",
    purple: "bg-blue-50 text-blue-600 border-blue-200",
  };

  return (
    <span
      id={id}
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export const Progress: React.FC<{
  value: number; // 0 to 100
  className?: string;
  barClassName?: string;
  id?: string;
}> = ({ value, className = "", barClassName = "bg-blue-600", id }) => {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      id={id}
      className={`w-full bg-slate-100 rounded-full h-2 overflow-hidden ${className}`}
    >
      <div
        className={`h-full rounded-full transition-all duration-500 ease-out ${barClassName}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
};

export const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: string;
  id?: string;
}> = ({ isOpen, onClose, title, description, children, maxWidth = "max-w-lg", id }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        id={id}
        className={`bg-white rounded-3xl shadow-2xl border border-slate-200 w-full ${maxWidth} overflow-hidden transform transition-all animate-in fade-in zoom-in-95`}
      >
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
