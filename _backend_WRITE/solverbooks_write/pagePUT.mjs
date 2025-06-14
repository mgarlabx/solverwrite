import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";


const pagePUT = async (pageJson) => {
    
    const client = new DynamoDBClient({});
    
    const chapterStr = pageJson.chapterNumber.toString().padStart(3, '0');
    const pageStr = pageJson.pageNumber.toString().padStart(3, '0');
    const versionStr = pageJson.versionNumber.toString().padStart(3, '0');
    const sk = chapterStr + "." +  pageStr + "." + versionStr;
   
    const pageOrder = pageJson.pageOrder;
    const active = pageJson.active;

    let title = [];
    for (let i = 0; i < pageJson.titles.length; i++) {
        title.push({S: pageJson.titles[i] });
    }

    let blocks = [];
    for (let i = 0; i < pageJson.blocks.length; i++) {
        
        const blockJson = pageJson.blocks[i];
        
        // type, order, active
        const type = blockJson.type;
        
        // options
        let options = {};
        const optionsItem = blockJson.options;
        for (let key in optionsItem) {
            if (typeof optionsItem[key] === 'string')
                options[key] = {S: optionsItem[key]};
            else if (typeof optionsItem[key] === 'number')
                options[key] = {N: Number(optionsItem[key])};
        }
        
        // content
        let content = [];
        for (let j = 0; j < blockJson.contents.length; j++) {
            content.push({S:blockJson.contents[j] });
        }

        // block
        let block = {};
        block.type = {S: type};
        block.options = {M: options};
        block.content = {L: content};
        blocks.push({M: block });
    }
    
    // Prepare item 
    const page = {
    	pk: {S: pageJson.bookId },
    	sk: {S: sk},
    	pageOrder: {N: pageOrder },
    	active: {N: active },
     	title: {L: title},
     	blocks: {L: blocks},
    };

    // Insert/update item
    const command = new PutItemCommand({
    	TableName: "solverbooks_v1",
    	Item: page,
    });
    const response = await client.send(command);

    return response;

};

export default pagePUT;
