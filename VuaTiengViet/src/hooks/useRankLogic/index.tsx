import { useAuth } from '@clerk/clerk-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { END_POINT } from '../../constaints/endpoint';
import {
    ICharacter,
    IGameCurrentData,
    ISubmitResponse,
} from '../../types/game';
import { useSoundEffects } from '../useSoundEffects';

export const useRankLogic = () => {
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [feedback, setFeedback] = useState<string>('Are you ready?');
  const [listCharacters, setListCharacters] = useState<ICharacter[]>([]);
  const [inputCharacters, setInputCharacters] = useState<(ICharacter | null)[]>(
    []
  );
  const [gameData, setGameData] = useState<IGameCurrentData | undefined>(
    undefined
  );

  const createHeaders = useCallback(async () => {
    const token = await getToken();
    return {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    };
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { playSound } = useSoundEffects();

  const fetchCurrentChallenge = useCallback(async () => {
    try {
      const headers = await createHeaders();
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}${END_POINT.CURRENT_CHALLENGE}`,
        {
          method: 'POST',
          headers,
        }
      );
      if (!response.ok) throw new Error('Network response was not ok');
      const { data } = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching current challenge:', error);
      return null;
    }
  }, [createHeaders]);

  const submitAnswer = useCallback(
    async (gameId: string, letters: string[]) => {
      try {
        const headers = await createHeaders();

        const response = await fetch(
          `${import.meta.env.VITE_API_ENDPOINT}${END_POINT.SUBMIT_CHALLENGE}`,
          {
            method: 'POST',
            headers,

            body: JSON.stringify({ gameId, letters }),
          }
        );
        if (!response.ok) throw new Error('Network response was not ok');
        const { data } = await response.json();
        return data as ISubmitResponse;
      } catch (error) {
        console.error('Error submitting answer:', error);
        return null;
      }
    },
    [createHeaders]
  );
  const initialCharacterState = useMemo(() => {
    if (!gameData?.wordLetters) return [];
    return gameData.wordLetters.map((char, index) => ({
      char,
      check: false,
      position: index,
    }));
  }, [gameData?.wordLetters]);

  useEffect(() => {
    if (gameData) return;

    const loadGame = async () => {
      const data = await fetchCurrentChallenge();

      if (!data) {
        navigate('/game');
        return;
      }
      setGameData(data);
      setFeedback('');
    };

    loadGame();
  }, [gameData, fetchCurrentChallenge, navigate]);

  useEffect(() => {
    setListCharacters(initialCharacterState);
    if (gameData?.wordLetters) {
      const updatedInputCharacters = gameData.wordLetters.map((item) =>
        item === ' ' ? { char: ' ', check: false, position: -1 } : null
      );
      setInputCharacters(updatedInputCharacters);
    }
  }, [initialCharacterState, gameData?.wordLetters]);
  const handleCharacterClick = useCallback(
    (char: ICharacter, fromInput: boolean = false) => {
      if (fromInput) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [inputCharacters]
  );
  const checkAnswer = useCallback(async () => {
    if (!inputCharacters.length || !gameData?.id) return;
    if (!inputCharacters.every((char) => char !== null)) return;

    const letters = inputCharacters
      .filter((item) => item?.char !== ' ')
      .map((item) => item!.char);
    const result = await submitAnswer(gameData.id, letters);

    if (!result) return;

    if (result.isCorrect) {
      playSound('correctAnswer');
      setFeedback('Congratulation, this is the correct answer');
      const newGame = await fetchCurrentChallenge();
      setGameData(newGame);
      setTimeout(() => {
        setFeedback('Try the next one');
      }, 900);
    } else {
      playSound('wrongAnswer');
      const correctCount = result.letters.filter(
        (item) => item.isMatched
      ).length;
      const wrongCount = result.letters.length - correctCount;
      setFeedback(
        `You have ${correctCount} correct letters and ${wrongCount} wrong letters`
      );
    }
  }, [inputCharacters, gameData, submitAnswer, playSound]);
  useEffect(() => {
    checkAnswer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputCharacters]);


  return {
    gameData,
    listCharacters,
    inputCharacters,
    feedback,
    handleCharacterClick,
  };
};
