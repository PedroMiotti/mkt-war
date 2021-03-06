"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QuizQuestions = require("../assets/questions");
exports.GetRandomQuestion = (last_questions) => {
    let lastQuestionArr = [];
    if (last_questions) {
        lastQuestionArr = last_questions.split(' , ');
    }
    for (let i = 0; i < QuizQuestions.questions.length; i++) {
        const randomQuestionId = Math.floor(Math.random() * QuizQuestions.questions.length);
        if (!lastQuestionArr.includes(randomQuestionId.toString())) {
            return QuizQuestions.questions[randomQuestionId];
        }
    }
    ;
};
//# sourceMappingURL=QuestionUtil.js.map