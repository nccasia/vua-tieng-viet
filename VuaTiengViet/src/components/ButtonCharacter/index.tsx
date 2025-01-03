import { CharactersProps } from '../../types';

const ButtonCharacter: React.FC<CharactersProps> = ({
  listCharacters,
  handleCharacterClick,
}) => {
  return (
    <div className="flex justify-center flex-wrap gap-2">
      {listCharacters
        .filter((item) => item.char !== ' ')
        .map((char, index) => (
          <button
            key={index}
            onClick={() => handleCharacterClick(char)}
            className={`
              bg-blue-500 text-white p-2 w-12 h-12 rounded hover:bg-blue-600 border-[1px] font-sans font-medium text-xl uppercase
              ${char.check ? 'invisible' : 'visible'}
            `}
          >
            {char.char}
          </button>
        ))}
    </div>
  );
};
export default ButtonCharacter;
