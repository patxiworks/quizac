import React from 'react';

const QuizResults = ({ questions, selectedOptions }) => {
  return (
    <div>
      <h2>Quiz Results</h2>
      <ul>
        {questions.map((question, index) => (
          <li key={question.id}>
            <p>Question: {question.question}</p>
            <p>Your Answer: {selectedOptions[index]}</p>
            <p>Correct Answer: {question.answer}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuizResults;
