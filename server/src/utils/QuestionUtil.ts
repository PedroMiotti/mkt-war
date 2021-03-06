import QuizQuestions = require("../assets/questions");

export interface IQuestion {
    id: number;
    text: string; 
    answers: {id: number, text: string}[];
    correct: number;
}

export const GetRandomQuestion = (last_questions: string): IQuestion => {
    let lastQuestionArr: string[] = [];

    if(last_questions){
        lastQuestionArr = last_questions.split(' , ');
    }

    for(let i: number = 0; i < QuizQuestions.questions.length; i++ ){

        const randomQuestionId = Math.floor(Math.random() * QuizQuestions.questions.length);

        if(!lastQuestionArr.includes(randomQuestionId.toString())){
            return QuizQuestions.questions[randomQuestionId];
        }

    };

}