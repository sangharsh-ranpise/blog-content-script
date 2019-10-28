const fs=require('fs');

const filename='./input/blog-content.txt';
const separator1='---';
const separator2='---';
const separator3='READMORE';


function convertTextToBlogContent(){
try{
    const blogFile=fs.readFileSync(filename).toString();

    // Extract JSON String From txt file and Convert it to JSON
    const blogMetaData=extractJSONFromFile(blogFile,separator1,separator2);
    const blogMetaDataJSON=convertTextToJSONFormat(blogMetaData);

    // Get short-content and content from the given file
    const content=getContent(blogFile)

    // Combine contents and blogmeta data and write to file
    const blogContent={...blogMetaDataJSON,...content}
    fs.writeFileSync('./output/blogContent.json',JSON.stringify(blogContent,undefined,2))        
    
    return true;
}catch(error){
    console.log(error);
    throw error;
}
};

function getContent(blogFile){
    const indexOfShortContent=blogFile.lastIndexOf(separator2) + separator2.length;
    
    const indexOfReadMore=blogFile.indexOf(separator3);
    const indexOfContent=indexOfReadMore+separator3.length;
    
    const shortContent=blogFile.substring(indexOfShortContent,indexOfReadMore)?blogFile.substring(indexOfShortContent,indexOfReadMore).replace(/\n/g, ''):''
    const content=blogFile.substring(indexOfContent)?blogFile.substring(indexOfContent).replace(/\n/g, ''):'';
    
return {
    'short-content':shortContent,
    'content':content
};

}


/**
 * @function extractJSONFromFile function has 2 separators so that 2 different separators can be used if required 
 * @param {string} blogContent 
 * @param {string} prefix 
 * @param {string} suffix 
 */
function extractJSONFromFile(blogContent,prefix, suffix) {
    var i = blogContent.indexOf(prefix);
    
	if (i >= 0) {
		blogContent = blogContent.substring(i + prefix.length);
	}
	else {
		return '';
	}
	if (suffix) {
        
        i = blogContent.indexOf(suffix);        
        if (i >= 0) {
			blogContent = blogContent.substring(0, i);
		}
		else {
		  return '';
		}
	}
	return blogContent;
};

/**
 * @function convertTextToJSONFormat Converts extracted json string to json format 
 * @param {string} blogContent 
 */
function convertTextToJSONFormat(blogContent){
    const blogMetaDataJSON={};
    const blogContentInLines=blogContent.split('\n');
    
    for(let blogContentPerLine of blogContentInLines){
        const splitContent=blogContentPerLine.split(':');

        if(splitContent.length>1){
            
        blogMetaDataJSON[`${splitContent[0]}`]=splitContent[1].replace(/["']/g, "").trim();            
    }
    }
    
    return blogMetaDataJSON;
    
}




convertTextToBlogContent();