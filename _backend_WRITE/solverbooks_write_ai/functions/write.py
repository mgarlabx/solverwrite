def write(content):
    
    messages=[
        { "role": "system", "content": "Você é o autor de um livro"},
        { "role": "system", "content": "Você precisa escrever um parágrafo em português com no máximo 100 palavras sobre o assunto que será informado a seguir."},
        { "role": "system", "content": "Você poderá usar o markdown para formatar o texto, caso necessário."},
        { "role": "system", "content": "Use esse JSON layout: \{\"paragraph\": <parágrafo>\}"},
        { "role": "user", "content": "Esse é o assunto: " + content},
    ]
    
    temperature = 1

    return [messages, temperature]