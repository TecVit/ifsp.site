import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './style.css';

const createCustomToast = (title: string, message: string, type: "success" | "info" | "error") => {
  toast(
    <div className='text'>
      <h1>{title}</h1>
      <p>{message}</p>
    </div>,
    {
      type,
      position: "top-right",
      autoClose: 7500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    }
  );
};

// Notificação de Sucesso
export const notifySuccess = (title: string, message: string) => {
  createCustomToast(title, message, "success");
};

// Notificação de Informação
export const notifyInfo = (title: string, message: string) => {
  createCustomToast(title, message, "info");
};

// Notificação de Erro
export const notifyError = (title: string, message: string) => {
  createCustomToast(title, message, "error");
};