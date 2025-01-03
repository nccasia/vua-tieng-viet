import { useCallback } from 'react';
import { ICharacter } from '../../types';

interface InputCharactersProps {
  inputCharacters: (ICharacter | null)[];
  handleCharacterClick: (char: ICharacter, fromInput?: boolean) => void;
}

const InputCharacters: React.FC<InputCharactersProps> = ({
  inputCharacters,
  handleCharacterClick,
}) => {
  const renderInputButton = useCallback(
    (char: ICharacter | null, index: number) => (
      <button
        key={index}
        onClick={char ? () => handleCharacterClick(char, true) : undefined}
        className={`
          w-12 h-12 rounded
          ${
            !char
              ? 'opacity-60 border-2 border-dashed border-white'
              : char.char === ' '
              ? 'invisible'
              : 'bg-blue-500 text-white hover:bg-orange-400 uppercase'
          }
        `}
      >
        {char?.char || ''}
      </button>
    ),
    [handleCharacterClick]
  );

  return (
    <div className="flex justify-center mb-4 flex-wrap gap-2">
      {inputCharacters.map((char, index) => renderInputButton(char, index))}
    </div>
  );
};
export default InputCharacters;
