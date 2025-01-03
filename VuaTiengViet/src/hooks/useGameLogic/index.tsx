import { useCallback, useEffect, useMemo, useState } from 'react';
import { END_POINT } from '../../constaints/endpoint';
import { useAuth } from '@clerk/clerk-react';
import { ICharacter, IGameData, ISubmitResponse } from '../../types/game';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSoundEffects } from '../useSoundEffects';

export const useGameLogic = () => {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [feedback, setFeedback] = useState<string>('Coi bộ khó à nghennn!');
  const [listCharacters, setListCharacters] = useState<ICharacter[]>([]);
  const [inputCharacters, setInputCharacters] = useState<(ICharacter | null)[]>(
    []
  );
  const [gameData, setGameData] = useState<IGameData | undefined>(undefined);
  const createHeaders = useCallback(async () => {
    const token = await getToken();
    return {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    };
  }, [getToken]);
  const { playSound } = useSoundEffects();

  // API calls
  const fetchNewGame = useCallback(async () => {
    try {
      const headers = await createHeaders();

      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}${END_POINT.GENERATE}`,
        {
          method: 'GET',
          headers,
        }
      );
      if (!response.ok) throw new Error('Network response was not ok');
      const { data } = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching new game:', error);
      return null;
    }
  }, [createHeaders]);

  const fetchGameById = useCallback(
    async (gameId: string) => {
      try {
        const headers = await createHeaders();
        const response = await fetch(
          `${import.meta.env.VITE_API_ENDPOINT}${END_POINT.GAME}/${gameId}`,
          {
            method: 'GET',
            headers,
          }
        );
        if (!response.ok) throw new Error('Network response was not ok');
        const { data } = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching game:', error);
        return null;
      }
    },
    [createHeaders]
  );

  const submitAnswer = useCallback(
    async (gameId: string, letters: string[]) => {
      try {
        const headers = await createHeaders();
        const response = await fetch(
          `${import.meta.env.VITE_API_ENDPOINT}${END_POINT.SUBMIT}`,
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
    if (!searchParams.get('gameId')) {
      navigate('/game');
      return;
    }
    if (gameData) return;
    const loadGame = async () => {
      const data = await fetchGameById(searchParams.get('gameId')!);
      if (!data) {
        navigate('/game');
        return;
      }
      setGameData(data);
      setFeedback('Bạn đi hỏi GPT à? Chơi đàng hoàng nghennn!');
    };

    loadGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      setFeedback('Bạn giải đúng rồi qua câu tiếp nhé.');
      const newGame = await fetchNewGame();
      if (newGame?.id) {
        setSearchParams({ gameId: newGame.id });
        setGameData(newGame);
      }
      setTimeout(() => {
        setFeedback('Thử giải câu này xemm');
      }, 900);
    } else {
      playSound('wrongAnswer');
      const correctCount = result.letters.filter(
        (item) => item.isMatched
      ).length;
      const wrongCount = result.letters.length - correctCount;
      setFeedback(
        `Sao bạn dở dữ vậy, có ${correctCount} kí tự đúng và ${wrongCount} kí tự sai`
      );
    }
  }, [
    inputCharacters,
    gameData,
    submitAnswer,
    fetchNewGame,
    setSearchParams,
    playSound,
  ]);
  useEffect(() => {
    checkAnswer();
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputCharacters]);
  console.log(gameData);

  return {
    gameData,
    listCharacters,
    inputCharacters,
    feedback,
    handleCharacterClick,
    fetchNewGame,
  };
};
