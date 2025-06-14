from functions.getBookChapter import getBookChapter

def quizAI(bookId, chapterNumber, addRequest):
    
    bookChapter = getBookChapter(bookId, chapterNumber, 1)
    
    messages=[
        { "role": "system", "content": "Você é um professor que precisa avaliar um aluno."},
        { "role": "system", "content": "Você precisa elaborar, em português, uma questão de múltipla escolha, com quatro alternativas a partir do texto do capítulo do livro que será exibido a seguir."},
        { "role": "system", "content": "Elabore também o feedback para cada uma das alternativas."},
        { "role": "system", "content": "Elabore a questão no formato JSON, usando a seguinte estrutura: \{ \"question\": <texto da pergunta>, \"A\": <texto da alternativa A>, \"B\": <texto da alternativa B>, \"C\": <texto da alternativa C>, \"D\": <texto da alternativa D>, \"feedA\": <texto do feedback da alternativa A>, \"feedB\": <texto do feedback da alternativa B>, \"feedC\": <texto do feedback da alternativa C>, \"feedD\": <texto do feedback da alternativa D>, \"correct\": <alternativa correta A, B, C ou D> \}"},
        { "role": "user", "content": "Esse é o texto do capítulo do livro a ser usado como base para formular a questão: " + bookChapter},
        { "role": "user", "content": "Considere também essas instruções adicionais: " + addRequest},
    ]

    temperature = 1

    return [messages, temperature]
    
  