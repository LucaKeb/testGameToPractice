// CSS
import './App.css';

// React 
import { useCallback, useEffect, useState } from 'react';

// data
import { wordsList } from './data/words';

// components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  { id: 1, name: 'start' },
  { id: 2, name: 'game' },
  { id: 3, name: 'end' },
];

function App() {

  const guessesQty = 3;
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState('');
  const [pickedCategory, setPickedCategory] = useState('');
  const [letters, setLetters] = useState('');

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setscore] = useState(0);

  const pickWordAndCategory = useCallback(() => {

    // pick a random category
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random() * categories.length)];

    // pick a random word

    const word = words[category][Math.floor(Math.random() * words[category].length)];

    return { category, word };

  }, [words]);

  // starts the secret word game
  const startGameStage = useCallback(() => {

    // clear all states
    clearLettersStates();

    // pick word and category
    const { category, word } = pickWordAndCategory();

    // create an array of letters
    let wordLetters = word.split('');
    wordLetters = wordLetters.map(l => l.toLowerCase());

    // fill states
    setPickedCategory(category);
    setPickedWord(word);
    setLetters(wordLetters);

    setGameStage(stages[1].name);

  }, [pickWordAndCategory])

  // process the letter input
  const verifyLetter = (letter) => {

    const normalizedLetter = letter.toLowerCase();

    if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) {
      return;
    }

    if(letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters, normalizedLetter,
      ])
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters, normalizedLetter,
      ]);
      setGuesses((actualGuesses => actualGuesses - 1));
    }


  }

  const clearLettersStates = () => {

    setGuessedLetters([]);
    setWrongLetters([]);

  };

  //check if guesses ended
  useEffect(() => {
    // reset all states
    if(guesses <= 0) {
      clearLettersStates();
      setGameStage(stages[2].name);
    }

  }, [guesses]);

  //check win condition 
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)]

    if(uniqueLetters.length === guessedLetters.length) {
      //add score
      setscore((actualScore) => actualScore + 100);

      //restart game with new word
      startGameStage();
    }

  }, [guessedLetters, letters, startGameStage]);

  // restart the process
  const retry = () => {
    setscore(0);
    setGuesses(guessesQty);

    setGameStage(stages[0].name);
  }

  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGameStage} />}
      {gameStage === 'game' && <Game
        verifyLetter={verifyLetter}
        test={[pickedWord, pickedCategory, letters]}
        pickedWord={pickedWord}
        pickedCategory={pickedCategory}
        letters={letters}
        guessedLetters={guessedLetters}
        wrongLetters={wrongLetters}
        guesses={guesses}
        score={score}
      />}
      {gameStage === 'end' && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
