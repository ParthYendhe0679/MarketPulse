import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  // Prevent body scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1, transition: { type: "spring", damping: 25, stiffness: 350 } }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="relative w-full max-w-lg bg-[#FAFAFA] border-4 border-[#111111] shadow-[8px_8px_0px_0px_#111111] rounded-2xl overflow-hidden z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-[#FF9ECF] border-b-4 border-[#111111]">
              <h2 className="text-xl font-bold font-display uppercase tracking-tight text-[#111111] m-0">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="w-9 h-9 border-3 border-[#111111] bg-white text-[#111111] hover:bg-[#FFD54A] flex items-center justify-center rounded-lg shadow-[2px_2px_0px_0px_#111111] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#111111]"
              >
                <X className="w-5 h-5 stroke-[3]" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {children}
            </div>

            {/* Footer */}
            <div className="flex justify-end p-4 border-t-3 border-[#111111] bg-white gap-3">
              <Button variant="white" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
