'use client';

import './pages.css'
import Image from "next/image"
import Logo from '@/assets/images/logo.png'

export default function Auth() {
  return (
    <main className="container-auth">
      <section className="content-auth">
        
        <div className="form">
          <Image src={Logo} alt="Logo" />
          
          <h1>Página não encontrada!</h1>
          <p style={{ margin: '0px 0px 15px 0px' }}>Não foi possível encontrar a página em nosso servidor</p>

          <button onClick={() => window.location.href = "/"}>Voltar para o início</button>

        </div>

      </section>
    </main>
  )
}