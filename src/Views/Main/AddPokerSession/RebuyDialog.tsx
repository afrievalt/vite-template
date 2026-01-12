import React, { useState } from 'react';

import { useAppDispatch } from '../../../store/hooks';
import { addBuyInWithId } from '../../../store/slices/buyinsSlice';
import { generateUUID } from '../../../utils/uuid';

interface RebuyDialogProps {
  isOpen: boolean;
  playerId: string;
  sessionId: string | null;
  onClose: () => void;
}

interface RebuyButtonProps {
  amount: number;
  onClick: (amount: number) => void;
}

const RebuyButton: React.FC<RebuyButtonProps> = ({ amount, onClick }) => {
  const handleClick = () => {
    onClick(amount);
  };
  return (
    <button
      type="button"
      className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
      onClick={handleClick}
    >
      {`$${amount}`}
    </button>
  );
};

export const RebuyDialog: React.FC<RebuyDialogProps> = ({
  isOpen,
  playerId,
  sessionId,
  onClose,
}) => {
  const [customAmount, setCustomAmount] = useState('');
  const dispatch = useAppDispatch();

  if (!isOpen) return null;

  const handleRebuy = (amount: number) => {
    if (!sessionId) return;
    dispatch(
      addBuyInWithId({
        id: generateUUID(),
        playerId,
        sessionId,
        amount,
      }),
    );
    setCustomAmount('');
    onClose();
  };

  const handleSave = () => {
    const amount = Number.parseFloat(customAmount);
    if (!Number.isNaN(amount) && amount > 0) {
      handleRebuy(amount);
    }
  };

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="rounded-lg bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">Rebuy</h3>
        <div className="mb-4 flex gap-2">
          <RebuyButton amount={100} onClick={handleRebuy} />
          <RebuyButton amount={50} onClick={handleRebuy} />
          <RebuyButton amount={20} onClick={handleRebuy} />
        </div>

        <div className="mb-4 flex gap-2">
          <input
            type="number"
            value={customAmount}
            onChange={(event) => setCustomAmount(event.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleSave}
            className="rounded-md bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
          >
            Save
          </button>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-md bg-gray-300 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-400"
        >
          Close
        </button>
      </div>
    </div>
  );
};
