import { useHistory, useParams } from 'react-router-dom'

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
// import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';

import '../styles/room.scss';

import { useTheme } from '../hooks/useTheme';

type RoomParams = {
    id: string;
}

export function AdminRoom() {
 //   const { user } = useAuth();
    const history = useHistory();
    const params = useParams<RoomParams>();
    const roomId = params.id;   
    const { toggleTheme, theme } = useTheme();

    const { title, questions } = useRoom(roomId)

    async function handleEndRoom () {
      await database.ref(`rooms/${roomId}`).update({
          endedAt: new Date(),
      })

      history.push('/');
    }

    async function handleDeleteQuestion(questionId: String) {
      if  (window.confirm('Tem certeza que deseja excluir esta pergunta?')) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
      }
    }

    async function handleCheckQuestionAsAnswer(questionId: String) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true,
        });
    }
    
    async function handleHighlightQuestion(questionId: String) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighLighted: true,
        });
    }

    return (
        <div id="page-room" className={theme}>
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <button className="onOff" onClick={toggleTheme}>Modo {theme}</button>
                        <RoomCode code={roomId} />
                        <Button isOutLined onClick={handleEndRoom}>Encerrar sala</Button>
                    </div>
                </div>
            </header>

            <main className="content">
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    { questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>
                <div className="question-list">
                    {questions.map(question => {
                        return (
                            <Question 
                                key={question.id}
                                content={question.content}
                                author={question.author}
                                isAnswered={question.isAnswered}
                                isHighLighted={question.isHighLighted}
                            > 
                            {!question.isAnswered && (
                                <> 
                                    <button
                                    type="button"
                                    onClick={() => handleCheckQuestionAsAnswer(question.id)}
                                >
                                    <img src={checkImg} alt="Marcar pergunta como respondida" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleHighlightQuestion(question.id)}
                                >
                                    <img src={answerImg} alt="Dar destaque ?? pergunta" />
                                </button>
                            </>
                            )}
                            <button
                                    type="button"
                                    onClick={() => handleDeleteQuestion(question.id)}
                            >
                                    <img src={deleteImg} alt="Remover pergunta" />
                            </button>
                            </Question>
                        );
                })}
                </div>
            </main>
        </div>
    );
}