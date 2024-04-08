import React, { useEffect, useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import './App.css'
import bg from './bg.jpg'
import modal from './modal.png'

// Chave da API Gemini obtida do arquivo .env
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

// Inicialização da instância da API Google Generative AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Lista de categorias pré-definidas
const categorias = [
  "Moda",
  "Eletrônicos",
  // Adicione outras categorias conforme necessário...
];

const App = () => {
  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    idade: '',
    email: '',
    hobbies: '',
    campo1: '',
    campo2: '',
    campo3: '',
    campo4: '',
  });

  // Estado para armazenar a cor de fundo
  const [color, setColor] = useState('');

  // Estado para armazenar o resultado da recomendação
  const [resultado, setResultado] = useState(null);

  // Estado para indicar se os dados estão sendo enviados
  const [isLoading, setIsLoading] = useState(false);

  // Função para lidar com a mudança nos campos de entrada
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Função para lidar com o envio do formulário
  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Monta o corpo da requisição para a API Gemini
    const requestBody = {
      profile: formData,
      categorias: categorias.join(', '),
    };

    // Converte o corpo da requisição para formato JSON
    const jsonString = JSON.stringify(requestBody);

    // Gera o prompt para a API Gemini
    const prompt = "Escreva a categoria que mais faz sentido com o perfil enviado .Envie tambem o motivo pelo qual escolheu , uma frase simples. E uma cor em hexadecima, que faria sentido colocar no fundo da vitrine de produtos para essa categoria. (me retorne um json , exemplo: {'categoria':'Lazer','color':'#058476','motivo':'motivo exemplo'}): " + jsonString;
   
    // Gera o conteúdo com base no prompt usando a API Generative AI
    const result = await genAI.getGenerativeModel({ model: "gemini-pro"}).generateContent(prompt);
    const response = await result.response;
    const text = JSON.parse(response.text());
    
    // Atualiza os estados com base na resposta da API
    setColor(text.color);
    setIsLoading(false)
    setResultado(text);
  }; 

  return (
    <div className='container' style={color === '' ? {backgroundImage: `url(${bg})`} : {backgroundColor: color}}>
      <div className='modal'>
        <div className='modal-left' style={{backgroundImage: `url(${modal})`}}>
          {/* Exibe mensagem de carregamento ou resultado da recomendação */}
          {isLoading ? <div>Enviando dados...</div> :
          resultado != null && (
            <div>
              <h2>Melhor categoria para você: {resultado?.categoria ? resultado?.categoria : '' }</h2>
              <ul>
                {resultado?.motivo ? resultado.motivo : ''}
              </ul>
            </div>
          )}
        </div>
        <div className='modal-right'>
          {/* Formulário para entrada de dados */}
          <h1>Recomendação de Categoria</h1>
          <form onSubmit={onSubmit}>
            {/* Campos do formulário */}
            <input type="text" name="nome" value={formData.nome} onChange={handleInputChange} placeholder="Nome" />
            <input type="number" name="idade" value={formData.idade} onChange={handleInputChange} placeholder="Idade" />
            <textarea name="hobbies" value={formData.hobbies} onChange={handleInputChange} placeholder="Hobbies"></textarea>
            {/* ... Adicione outros campos aqui ... */}
            <button type="submit" disabled={isLoading}>Enviar</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default App;
