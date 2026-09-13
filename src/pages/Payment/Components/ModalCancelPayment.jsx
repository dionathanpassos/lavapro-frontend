import Button from "../../../components/Button/Button";

export default function ModalCancelPayment({ isOpen, onConfirm, onClose }) {

    const handleConfirmClick = async () => {
    await onConfirm(); 
  };

  return (
    <div
      className={`inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-120 p-4 transition-all ${isOpen ? "fixed" : "hidden"}`}
    >
      <div className="bg-white rounded-2xl w-90 p-6 shadow-2xl border border-border flex flex-col max-h-[90vh] overflow-y-auto space-y-4">
        <span>Deseja realmente cancelar o pagamento?</span>
        <div className="flex justify-end pt-4 border-t border-gray-100 mt-4 gap-4">
          <Button action={"cancel"} type="button" onClick={onClose}>Cancelar</Button>
          <Button type="button" onClick={handleConfirmClick}>Confirmar</Button>

        </div>
      </div>
    </div>
  );
}
