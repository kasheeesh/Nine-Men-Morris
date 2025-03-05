import { useNavigate } from 'react-router-dom';

function NineMenMorris() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Nine Men's Morris</h1>
      <button onClick={() => navigate('/games/ninemenmorris/friends')}>
        Play with Friends
      </button>
      <button onClick={() => navigate('/games/ninemenmorris/computer')}>
        Play with Computer
      </button>
    </div>
  );
}

export default NineMenMorris;
