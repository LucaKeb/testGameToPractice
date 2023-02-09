import './GameOver.css'

const gameOver = ({ retry, score }) => {
  return (
    <div className='game-over'>
      <h1>Fim de jogo</h1>
      <h2>Sua pontuação foi de <span>{score}</span></h2>
      <button onClick={retry}>Recomeçar</button>
    </div>
  )
}

export default gameOver