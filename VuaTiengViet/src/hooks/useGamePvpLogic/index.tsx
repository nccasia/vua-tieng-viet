import { useCallback, useEffect, useState } from 'react';
import { useSocketContext } from '../useSocketContext';
import { ICharacter } from '../../types';
import { useSoundEffects } from '../useSoundEffects';

const useGamePvpLogic = () => {
  const { gameState, submitWord } = useSocketContext();
  const [listCharacters, setListCharacters] = useState<ICharacter[]>([]);
  const [inputCharacters, setInputCharacters] = useState<(ICharacter | null)[]>(
    []
  );
  const { playSound } = useSoundEffects();

  // Initialize characters when word changes
  useEffect(() => {
    if (!gameState.currentWord?.letters) return;

    // Set up list characters
    const initialListChars = gameState.currentWord.letters.map(
      (char, index) => ({
        char,
        check: false,
        position: index,
      })
    );
    setListCharacters(initialListChars);

    // Set up input characters with spaces preserved
    const initialInputChars = gameState.currentWord.letters.map((item) =>
      item === ' ' ? { char: ' ', check: false, position: -1 } : null
    );
    setInputCharacters(initialInputChars);
  }, [gameState.currentWord]);

  const handleCharacterClick = useCallback(
    (char: ICharacter, fromInput: boolean = false) => {
      if (fromInput) {
        // Remove character from input
        playSound('removeCharacter');
        setListCharacters((prev) =>
          prev.map((item) =>
            item.position === char.position ? { ...item, check: false } : item
          )
        );
        setInputCharacters((prev) =>
          prev.map((item) => (item?.position === char.position ? null : item))
        );
      } else {
        // Add character to input
        const emptySlotIndex = inputCharacters.findIndex(
          (slot) => slot === null
        );
        if (emptySlotIndex === -1) return;

        playSound('clickCharacter');
        setListCharacters((prev) =>
          prev.map((item) =>
            item.position === char.position ? { ...item, check: true } : item
          )
        );
        setInputCharacters((prev) => {
          const newInputs = [...prev];
          newInputs[emptySlotIndex] = char;
          return newInputs;
        });
      }
    },
    [inputCharacters, playSound]
  );

  // Check answer when input changes
  const checkAnswer = async () => {
    const letters = inputCharacters
      .filter((item) => item?.char !== ' ')
      .map((item) => item!.char);

    // Add all necessary validations here
    if (
      !gameState.currentWord?.id ||
      !gameState.gameId ||
      !letters.length ||
      letters.length <= 1 ||
      !inputCharacters.every((char) => char !== null)
    ) {
      return;
    }

    submitWord(gameState.gameId, gameState.currentWord.id, letters);
  };

  useEffect(() => {
    checkAnswer();
  }, [inputCharacters]);

  return {
    gameState,
    listCharacters,
    inputCharacters,
    handleCharacterClick,
  };
};

export default useGamePvpLogic;
