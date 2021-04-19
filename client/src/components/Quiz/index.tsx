import React from "react";
import "./style.css";

import { Avatar } from "antd";

// Assets
import AvatarIcon from "../../assets/icons/hacker.svg";

// Components
import AnswerButton from './components/AnswerButton';

const Quiz = () => {
  return (
    <div className="quiz-container">
      <div className="quiz-header-container">
        <div className="quiz-timer-container">
        12

        </div>

        <div className="quiz-players-container">
          <div className="quiz-players-owner">
            <Avatar
              size={64}
              style={{ backgroundColor: "#fff", verticalAlign: "middle" }}
              src={AvatarIcon}
            />
            <div className="quiz-players-owner-info">
              <h3>TefinhaFuracao</h3>
              <p>80</p>
            </div>
          </div>
          <div className="quiz-players-opponent">
            <Avatar
              size={64}
              style={{ backgroundColor: "#fff", verticalAlign: "middle" }}
              src={AvatarIcon}
            />
            <div className="quiz-players-opponent-info">
              <h3>PedrinhoTsunami</h3>
              <p>100</p>
            </div>
          </div>
        </div>
      </div>

      <div className="quiz-bottom-container">
        <div className="quiz-question-container">
          <h4>Na fase de introdução de um produto ou serviço, qual é o instrumento comercial que assume maior importância?</h4>
        </div>

        <div className="quiz-answers-container">
          <AnswerButton text="O preço, porque a oferta deve ser competitiva em relação à dos concorrentes." isCorrect={false} answerId={1} />
          <AnswerButton text="A qualidade, porque o produto ou serviço devem ir ao encontro da preferência do consumidor." isCorrect={true} answerId={2} />
          <AnswerButton text="A publicidade, porque deve-se lembrar ao consumidor que o produto é a melhor opção do mercado." isCorrect={false} answerId={3} />
          <AnswerButton text="A distribuição, porque o consumidor não está disposto a percorrer longas distâncias para comprar o produto." isCorrect={false} answerId={4} />

        </div>
      </div>
    </div>
  );
};

export default Quiz;
