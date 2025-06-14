def translate(content):
    
    messages=[
        { "role": "system", "content": "You are a translator from Portuguese to English and to Spanish"},
        { "role": "system", "content": "Translate the user content to English and to Spanish"},
        { "role": "system", "content": "If the word is \"string\", don't translate to \"cadena\" in Spanish, always keep as \"string\""},
        { "role": "system", "content": "Use this JSON layout: \{\"english\": <translated text>, \"spanish\": <translated text>\}"},
        { "role": "user", "content": content},
    ]

    temperature = 0.5

    return [messages, temperature] 