import json
import os 
from openai import OpenAI
from functions.translate import translate
from functions.improve import improve
from functions.write import write
from functions.quizAI import quizAI
from functions.textInAI import textInAI
from functions.codeInAI import codeInAI

def lambda_handler(event, context):

    token = event["headers"]["authorization"]
    bookId = token[43:79] 
    method = event["requestContext"]["http"]["method"]
    path = event["requestContext"]["http"]["path"]

    body = event['body']
    if isinstance(body, str): body = json.loads(event['body']) # para converter em json quando vem do JS ou do Postman

    resp = ""
    ret = [[],0.5]

    if (path == "/translate") & (method == "POST"):
        content = body['content']     
        ret = translate(content)
        
    elif (path == "/improve") & (method == "POST"):
        content = body['content']     
        ret = improve(content)
        
    elif (path == "/write") & (method == "POST"):
        content = body['content']     
        ret = write(content)
        
    elif (path == "/quizAI") & (method == "POST"):
        bookId = body["bookId"]
        chapterNumber = body["chapterNumber"]
        addRequest = body["addRequest"]
        ret = quizAI(bookId, chapterNumber, addRequest)

    elif (path == "/textInAI") & (method == "POST"):
        bookId = body["bookId"]
        chapterNumber = body["chapterNumber"]
        addRequest = body["addRequest"]
        ret = textInAI(bookId, chapterNumber, addRequest)

    elif (path == "/codeInAI") & (method == "POST"):
        bookId = body["bookId"]
        chapterNumber = body["chapterNumber"]
        addRequest = body["addRequest"]
        ret = codeInAI(bookId, chapterNumber, addRequest)

    else:
        return {
            'statusCode': 400,
            'body': 'Bad Request'
        }
            
    messages = ret[0]
    temperature = ret[1]

    client = OpenAI(api_key=os.getenv('API_KEY'))
    
    chat_completion = client.chat.completions.create(
        messages=messages,
        temperature=temperature,
        model="gpt-4o",
        response_format={ "type": "json_object" },
    )
    
    resp = chat_completion.choices[0].message.content
    
    return {
         'statusCode': 200,
         'body': resp
    }
     