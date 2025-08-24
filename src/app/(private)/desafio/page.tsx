'use client';

import './style.css';
import Image from "next/image";
import Logo from '@/assets/images/logo.png';
import { useEffect, useState } from "react";
import { notifyError, notifySuccess } from '@/utils/toastify';
import { clearCookies, getCookie, setCookie } from '@/utils/cookies';
import { calcularTempoRestante, minutosParaHHMMSS } from '@/utils/functions';

export default function Desafio() {

  const [remainingTime, setRemainingTime] = useState('');
  const [user, setUser] = useState<any>(null);
  const [answersCorrects, setAnswersCorrects] = useState<{[key: string]: string}>({});
  const [refreshUser, setRefreshUser] = useState(0);

  useEffect(() => {
    let interval: any;

    const getDataUser = async () => {
      try {
        const token = getCookie("token");

        const response = await fetch("/api/user", {
          method: "POST",
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!data.user) {
          notifyError("Aviso", data.message);
          clearCookies();
          window.location.href = "/";
          return;
        }

        setUser(data.user);
        setPoints(data.user.points ? data.user.points : 0);
        setAnswersCorrects(data.user.answersCorrects)

        let minutos = calcularTempoRestante(data.user.dataDeAcesso);
        
        setRemainingTime(minutosParaHHMMSS(minutos));

        interval = setInterval(() => {
          minutos = minutos - 1/60; // 1 segundo = 1 / 60 de minuto
          
          if (minutos <= 0) {
            notifyError("Aviso", "O tempo acabou :) Obrigado por participar!")
            clearCookies();
            setTimeout(() => {
              window.location.href = "/";
            }, 500);
          }
            
          setRemainingTime(minutosParaHHMMSS(minutos));
        }, 1000);

      } catch (error) {
        console.error(error);
      }
    };

    getDataUser();

    return () => clearInterval(interval);
  }, [refreshUser]);
  
  interface Question {
    uuid: string;
    question: string;
    example?: string;
  }
  
  const [loading, setLoading] = useState<boolean>(true);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const getQuestions = async () => {
      setLoading(true);

      try {
        const response = await fetch("/api/questions");

        const data = await response.json();

        if (!data.questions) {
          notifyError("Aviso", data.message);
          return;
        }

        setQuestions(data.questions);
        
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getQuestions();
  }, []);

  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [points, setPoints] = useState<number>(0);

  const verifyAnswer = async (uuid: string, answer: any) => {
    try {
      
      if (!uuid || !answer) {
        notifyError("Aviso", "Nenhuma resposta foi digitada!");
        return;
      }

      const token = getCookie('token');

      const response = await fetch("/api/verify-answer", {
        method: "POST",
        body: JSON.stringify({
          uuid,
          answer,
          token,
        }),
      });

      const data = await response.json();

      if (data && data.answer) {
        notifySuccess("Aviso", data.message);
        setRefreshUser(prev => prev + 1);
      } else {
        notifyError("Aviso", data.message);
      }

    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main className="container-dashboard">
      <section className="content-dashboard">
        <div className="points">
          <h1>{points} Pontos</h1>
        </div>

        <div className="form">
          <Image src={Logo} alt="Logo" />

          <h1>Desafio de Cyber Segurança</h1>
          <p>Teste seus conhecimentos em segurança digital e descubra se você tem a habilidade para invadir e proteger sistemas de forma ética!</p>

          <h2>Tempo Restante: <strong>{remainingTime}</strong></h2>

          {questions.length > 0 ? (
            questions.map((question, i) => (
              <div key={i} className="input">
                <label>{question.question}</label>
                
                {answersCorrects && answersCorrects[question.uuid] ? (
                  <>
                    <input
                      type="text"
                      value={answersCorrects[question.uuid] || ""}
                      disabled={true}
                    />
                    <button className='green'>Acertou!</button>
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder={question.example || ""}
                      value={answers[question.uuid] || ""}
                      onChange={(e) =>
                        setAnswers({ ...answers, [question.uuid]: e.target.value })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          verifyAnswer(question.uuid, answers[question.uuid] || "");
                        }
                      }}
                    />
                    <button
                      onClick={() =>
                        verifyAnswer(question.uuid, answers[question.uuid] || "")
                      }
                    >
                      Enviar
                    </button>

                  </>
                )}
              </div>
            ))
          ) : loading ? (
            <h2>Carregando questões...</h2>
          ) : (
            <h2>Nenhuma questão encontrada!</h2>
          )}

        </div>
      </section>
    </main>
  );
}