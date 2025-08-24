import { signOut } from "firebase/auth";

function setCookie(name: string, value: string | boolean, days: number = 7): void | null {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return null;
  }
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${encodeURIComponent(value || "")}${expires}; path=/; SameSite=None; Secure`;
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return null;
  }
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }
  return null;
}

function deleteCookie(name: string): void | null {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return null;
  }
  document.cookie = `${name}=; Max-Age=-99999999;`;
}

function clearCookies(): Promise<void> | null {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return null;
  }
  return new Promise( async (resolve) => {
    const cookies = document.cookie.split(";");
  
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      const igualPos = cookie.indexOf("=");
      const nome = igualPos > -1 ? cookie.substr(0, igualPos) : cookie;

      document.cookie = `${nome}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      document.cookie = `${nome}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;

      const domainParts = window.location.hostname.split(".");
      if (domainParts.length > 2) {
        domainParts.shift();
        const domain = domainParts.join(".");
        document.cookie = `${nome}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}`;
      }
    }
    resolve();
  });
}

export { setCookie, deleteCookie, getCookie, clearCookies };