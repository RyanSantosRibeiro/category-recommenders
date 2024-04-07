import React, { useEffect, useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import './App.css'
import bg from './bg.jpg'
import modal from './modal.png'

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const categorias = [
  "Moda",
  "Eletrônicos",
  "Casa e Decoração",
  "Beleza e Saúde",
  "Esporte e Lazer",
  "Alimentos e Bebidas",
  "Calçados",
  "Celulares e Smartphones",
  "Informática",
  "Livros",
  "Cama, Mesa e Banho",
  "Eletrodomésticos",
  "Móveis",
  "Perfumaria",
  "Brinquedos",
  "Automotivo",
  "Cama e Mesa",
  "Jóias e Acessórios",
  "Suplementos e Vitaminas",
  "Ferramentas",
  "Material de Construção",
  "Jardins e Piscinas",
  "Bebidas",
  "Papelaria",
  "CDs e DVDs",
  "Instrumentos Musicais",
  "Games",
  "Bebês",
  "Pet Shop",
  "Artigos de Pesca",
  "Esportes",
  "Cama, Mesa e Banho Infantil",
  "Roupas Masculinas",
  "Roupas Femininas",
  "Roupas Infantis",
  "Sapatos Masculinos",
  "Sapatos Femininos",
  "Sapatos Infantis",
  "Cosméticos",
  "Maquiagem",
  "Cuidados com a Pele",
  "Cabelos",
  "Perfumes Masculinos",
  "Perfumes Femininos",
  "Relógios",
  "Óculos de Sol",
  "Jóias",
  "Bolsas e Malas",
  "Bijuterias",
  "Casa e Cozinha",
  "Eletroportáteis",
  "Decoração",
  "Iluminação",
  "Organização",
  "Utilidades Domésticas",
  "Jardim",
  "Piscinas",
  "Ferramentas e Equipamentos",
  "Materiais de Construção",
  "Tintas e Acessórios",
  "Materiais Elétricos",
  "Materiais Hidráulicos",
  "Ferramentas para Jardinagem",
  "Piscinas e Acessórios",
  "Brinquedos para Bebês",
  "Carrinhos de Bebê",
  "Roupas para Bebês",
  "Fraldas e Higiene",
  "Alimentos para Bebês",
  "Brinquedos para Crianças",
  "Jogos e Brinquedos",
  "Bicicletas",
  "Patins e Skates",
  "Carrinhos de Brinquedo",
  "Bonecas",
  "Carros de Controle Remoto",
  "Pelúcias",
  "Jogos de Tabuleiro",
  "Livros Infantis",
  "CDs e DVDs Infantis",
  "Roupas para Animais",
  "Alimentos para Animais",
  "Acessórios para Animais",
  "Cama e Mesa para Animais",
  "Brinquedos para Animais"
];

const App = () => {
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
  const [resultado, setResultado] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  async function run() {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
  
    const prompt = "Write a story about a magic backpack."
  
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
  }

  useEffect(() => {
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const requestBody = {
      profile: formData,
      categorias: categorias.join(', '),
    };

    const jsonString = JSON.stringify(requestBody);
     // For text-only input, use the gemini-pro model
     const model = genAI.getGenerativeModel({ model: "gemini-pro"});
  
     const prompt = "Escreva a categoria que mais faz sentido com o perfil enviado (Escreva apenas o nome da categoria): " + jsonString;
   
     const result = await model.generateContent(prompt);
     const response = await result.response;
     const text = response.text();
     setIsLoading(false)
     setResultado(text);
     console.log(text);
  };

  return (
    <div className='container' style={{backgroundImage: `url(${bg})`}}>
      <div className='modal'>
        <div className='modal-left' style={{backgroundImage: `url(${modal})`}}>
        {isLoading ? <div>Enviando dados...</div> :
        resultado.length > 0 && (
        <div>
          <h2>Melhor categoria para você:</h2>
          <ul>
            {resultado}
          </ul>
        </div>
        )}
        </div>
        <div className='modal-right'>
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
