import React, { useState } from 'react';

interface TimeInputProps {
  onChange: (newTime: string | null) => void;
}

const TimeInput: React.FC<TimeInputProps> = ({ onChange }) => {
  const [time, setTime] = useState<string | null>('10:00');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = event.target.value || null;
    setTime(newTime);
    onChange(newTime); // Propaga a mudança para o componente pai
  };

  return (
    <input
      type="time"
      value={time || ''}
      onChange={handleChange}
      style={{ width: '40%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
    />
  );
};

export default TimeInput;
