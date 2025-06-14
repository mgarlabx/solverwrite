from functions.getBookChapter import getBookChapter

def textInAI(bookId, chapterNumber, addRequest):
    
    bookChapter = getBookChapter(bookId, chapterNumber, 1)
    
    messages=[
        { "role": "system", "content": "Você é um professor que precisa avaliar um aluno."},
        { "role": "system", "content": "Você precisa elaborar, em português, uma <pergunta> dissertativa a partir do texto do capítulo do livro que será exibido a seguir."},
        { "role": "system", "content": "Elabore também uma <rúbrica> para analisar a resposta do aluno, com critérios {good}, {meh}, {bad} e {null}, um parágrafo por critério."},
        { "role": "system", "content": "O critério para {null} deve ser para o caso da resposta conter textos, palavras e menções que não guardam nenhuma correlação o assunto central da pergunta."},
        { "role": "system", "content": "Elabore a questão no formato JSON, usando a seguinte estrutura: \{ \"question\": <texto da pergunta>, \"feedback\": \{\"good\": <texto para good>, \"meh\": <texto para meh>,\"bad\": <texto para bad>,\"null\": <texto para null>,\} \}"},
        { "role": "user", "content": "Esse é o texto do capítulo do livro a ser usado como base para formular a questão: " + bookChapter},
        { "role": "user", "content": "Considere também essas instruções adicionais: " + addRequest},
    ]

    temperature = 1

    return [messages, temperature]
    
  