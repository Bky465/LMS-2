"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import {useState } from "react";
import { Button } from "../ui/button";

const Modal = ({
  title,
  description,
  children,
  footer,
  openButtonText = "Open Modal",
  isModalVisible,
  setIsModalVisible,
  onModalClose
}) => {

  const handleModalClose=()=>{
    setIsModalVisible(false)
    onModalClose && onModalClose()
  }

  return (
    <Dialog.Root open={isModalVisible} onOpenChange={setIsModalVisible}>
      {/* Button to Open Modal */}
      <Dialog.Trigger>
        <Button className='rounded-none'>
        {openButtonText}
        </Button>
      </Dialog.Trigger>

      {/* Overlay */}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 animate-fadeIn z-10" />

        {/* Modal Content */}
        <Dialog.Content
          className="fixed top-1/2 left-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg animate-slideIn z-20"
        >
          <div className="flex justify-between items-center mb-4">
            {/* Render the title only if provided */}
            {title && <Dialog.Title className="text-lg font-bold">{title}</Dialog.Title>}
            <Dialog.Close onClick={handleModalClose}>
              <X className="w-5 h-5 cursor-pointer" />
            </Dialog.Close>
          </div>

          {/* Render the description if provided */}
          {description && (
            <Dialog.Description className="mb-4 text-gray-500">
              {description}
            </Dialog.Description>
          )}

          {/* Modal content (passed as children) */}
          <div className="mb-4">{children}</div>
          {/* Footer (optional) */}
          {footer && <div className="mt-4">{footer}</div>}

          {/* Close Button (fallback in case no footer is provided) */}
          {!footer && (
            <Dialog.Close asChild>
              <Button
                onClick={()=>setIsModalVisible(false)}
              >
                Close
              </Button>
            </Dialog.Close>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Modal;
