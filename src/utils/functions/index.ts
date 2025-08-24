import { Timestamp } from "firebase/firestore";

export function xorEncode(str: string, key: string): string {
  const result = Array.from(str).map((char, i) => 
    char.charCodeAt(0) ^ key.charCodeAt(i % key.length)
  );
  return Buffer.from(result).toString("base64");
}

export function xorDecode(encoded: string, key: string): string {
  const bytes = Buffer.from(encoded, "base64");
  return Array.from(bytes).map((byte, i) => 
    String.fromCharCode(byte ^ key.charCodeAt(i % key.length))
  ).join("");
}

export function calcularTempoRestante(timestamp: Timestamp) {
  const agora = new Date();
  const acesso = new Date(timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1e6));

  const diferencaMs = agora.getTime() - acesso.getTime();
  const diferencaMin = diferencaMs / 1000 / 60;

  const totalPermitido = 100; // 100 Minutos
  const restante = totalPermitido - diferencaMin;

  return restante > 0 ? restante : 0;
}

export function minutosParaHHMMSS(minutosRestantes: number): string {
  if (minutosRestantes <= 0) {
    return "00:00:00";
  }

  const totalSegundos = Math.floor(minutosRestantes * 60);

  const horas = Math.floor(totalSegundos / 3600);
  const minutos = Math.floor((totalSegundos % 3600) / 60);
  const segundos = totalSegundos % 60;

  const hh = String(horas).padStart(2, "0");
  const mm = String(minutos).padStart(2, "0");
  const ss = String(segundos).padStart(2, "0");

  return `${hh}:${mm}:${ss}`;
}