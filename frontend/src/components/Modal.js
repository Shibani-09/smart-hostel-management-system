export const Modal = ({ isOpen, title, children, onClose, actionButton = null }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-xl max-w-md w-full shadow-2xl shadow-indigo-500/20">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4 text-slate-300">
            {children}
          </div>

          {/* Footer */}
          {actionButton && (
            <div className="flex gap-3 border-t border-white/10 px-6 py-4">
              <button
                onClick={onClose}
                className="flex-1 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              {actionButton}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
