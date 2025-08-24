'use client';

import './style.css';
import Image from "next/image";
import Logo from '@/assets/images/logo.png';
import { useEffect, useState } from "react";

export default function Ranking() {
  const [ranking, setRanking] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchRanking() {
    try {
      const res = await fetch("/api/ranking");
      if (!res.ok) throw new Error("Erro ao buscar ranking");

      const data = await res.json();
      setRanking(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // primeira chamada imediata
    fetchRanking();

    // chama a cada 1 minuto
    const interval = setInterval(() => {
      fetchRanking();
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="container-dashboard">
      <section className="content-dashboard">
        <div className="form">
          <Image src={Logo} alt="Logo" />

          <h1>Ranking do Desafio - Ao Vivo</h1>
          <p>Acompanhe o desenvolvimento da turma em tempo real</p>

          {loading ? (
            <h2>Carregando ranking...</h2>
          ) : ranking.length > 0 ? (
            <table className="ranking-table">
              <thead>
                <tr>
                  <th>Classificação</th>
                  <th>Nome</th>
                  <th>Pontos</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((user, i) => (
                  <tr key={i}>
                    <td>{user.ranking}</td>
                    <td>{user.nome}</td>
                    <td>{user.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <h2>Nenhum participante no ranking ainda!</h2>
          )}
        </div>
      </section>
    </main>
  );
}