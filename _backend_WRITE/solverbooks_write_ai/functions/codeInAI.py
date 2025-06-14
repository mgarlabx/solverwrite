from functions.getBookChapter import getBookChapter

def codeInAI(bookId, chapterNumber, addRequest):
    
    bookChapter = getBookChapter(bookId, chapterNumber, 1)
    
    messages=[
        { "role": "system", "content": "Você é um professor que precisa avaliar um aluno, para determinar seu conhecimento de programação, na prática."},
        { "role": "system", "content": "Você precisa elaborar, em português, uma <desafio> a partir do texto do capítulo do livro que será exibido a seguir."},
        { "role": "system", "content": "O <desafio> consiste em pedir para o aluno elaborar um pequeno código (máximo 15 linhas, mas não precisa mencionar isso) que faça uma determinada atividade relacionada com o capítulo."},
        { "role": "system", "content": "Seja divertido, crie desafios com humor, para motivar o aluno."},
        { "role": "system", "content": "Elabore a questão no formato JSON, usando a seguinte estrutura: \{ \"challenge\": <texto do desafio> \}"},
        { "role": "user", "content": "Esse é o texto do capítulo do livro a ser usado como base para formular o desafio: " + bookChapter},
        { "role": "user", "content": "Considere também essas instruções adicionais: " + addRequest},
    ]

    temperature = 1

    return [messages, temperature]
    
  