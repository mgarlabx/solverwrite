def improve(content):
    
    messages=[
        { "role": "system", "content": "Você é o autor de um livro"},
        { "role": "system", "content": "Você precisa revisar um parágrafo e corrigir erros de ortografia e gramática em português."},
        { "role": "system", "content": "Você poderá também fazer sugestões para melhor entendimento do texto."},
        { "role": "system", "content": "Use esse JSON layout: \{\"paragraph\": <parágrafo>\}"},
        { "role": "user", "content": "Esse é o texto a ser revisado: " + content},
    ]

    temperature = 0.5

    return [messages, temperature]