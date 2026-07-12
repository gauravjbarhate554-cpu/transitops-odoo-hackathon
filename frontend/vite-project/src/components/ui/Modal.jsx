import ReactModal from "react-modal";

ReactModal.setAppElement("#root");

export default function Modal({
  isOpen,
  onRequestClose,
  children,
}) {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      closeTimeoutMS={200}
      shouldCloseOnOverlayClick
      shouldCloseOnEsc
      className="
        absolute
        left-1/2
        top-1/2
        w-[500px]
        max-w-[95vw]
        -translate-x-1/2
        -translate-y-1/2
        rounded-xl
        bg-white
        p-6
        shadow-2xl
        outline-none
      "
      overlayClassName="
        fixed
        inset-0
        bg-black/40
        backdrop-blur-sm
        z-50
      "
    >
      {children}
    </ReactModal>
  );
}