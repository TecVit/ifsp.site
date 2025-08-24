'use client';

import './style.css'
import Image from "next/image"
import Logo from '@/assets/images/logo.png'
import { useState } from "react"
import { notifyError, notifySuccess } from '@/utils/toastify';
import { clearCookies, setCookie } from '@/utils/cookies';
import { calcularTempoRestante } from '@/utils/functions';

export default function Auth() {

  const [prontuario, setProntuario] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      if (!prontuario) {
        notifyError("Aviso", `Informe o prontuário`);
        return;
      }

      const response = await fetch("/api/auth", {
        method: "POST",
        body: JSON.stringify({
          uid: prontuario.toUpperCase(),
        })
      });

      const data = await response.json();

      if (!response.ok) {
        notifyError("Aviso", data.message);
        return;
      }

      setCookie('token', data.token);
      
      let minutos = calcularTempoRestante(data.user.dataDeAcesso);
        
      if (minutos <= 0) {
        notifyError("Aviso", "O tempo acabou :) Obrigado por participar!")
        clearCookies();
        return;
      }

      notifySuccess("Aviso", `Bem-Vindo(a), ${data.user.nome}`);
      
      setTimeout(() => {
        window.location.href = "/desafio";
      }, 2000);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setProntuario('');
    }
  }

  return (
    <main className="container-auth">
      <section className="content-auth">
        
        <div className="form">
          <Image src={Logo} alt="Logo" />
          
          <h1>Participar do Desafio</h1>
          <p>Com seus conhecimentos em phishing você consegue resolver esse desafio?</p>

          <div className="input">
            <label htmlFor="">Prontuário</label>
            <input name='prontuario' value={prontuario} onChange={(e) => setProntuario(e.target.value)} maxLength={9} placeholder="ex: AQ3031323" type="text" />
          </div>

          <button onClick={handleSignIn}>
            {loading ? (
              <div className="loader">Carregando..</div>
            ) : (
              <>Participar Agora</>
            )}
          </button>

        </div>

      </section>
    </main>
  )
}