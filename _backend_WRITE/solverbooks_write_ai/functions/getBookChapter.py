import boto3
from boto3.dynamodb.types import TypeDeserializer

def getBookChapter(bookId, chapterNumber, language):
    
    dynamodb = boto3.resource("dynamodb")
    client = boto3.client("dynamodb")
    
    chapterNumberStr = str(chapterNumber).zfill(3)

    response = client.query(
        TableName = "solverbooks_v1",
        KeyConditionExpression='pk = :pk_val AND begins_with(sk, :sk_val)',
        ExpressionAttributeValues={
            ':pk_val': {'S': bookId},
            ':sk_val': {'S': chapterNumberStr},
        },
        # ExpressionAttributeNames={
        #     '#name': 'name',
        # }
    )

    bookChapter = ""
    items = response["Items"] 
    items = dynamodb_to_regular_json(items)
    for item in items:
        pageTitle = item["title"][language]
        bookChapter += pageTitle + "\\n\\n"
        for block in item["blocks"]:
            if (block["type"] == "text") or (block["type"] == "code"):
                bookChapter += block["content"][language] + "\\n"
            
 

    return bookChapter
    
    
  
def dynamodb_to_regular_json(dynamodb_json):
    deserializer = TypeDeserializer()
    def deserialize(data):
        if isinstance(data, dict):
            if len(data) == 1 and list(data.keys())[0] in ('S', 'N', 'B', 'BOOL', 'NULL', 'L', 'M', 'SS', 'NS', 'BS'):
                return deserializer.deserialize(data)
            else:
                return {k: deserialize(v) for k, v in data.items()}
        elif isinstance(data, list):
            return [deserialize(v) for v in data]
        else:
            return data
    return deserialize(dynamodb_json)
