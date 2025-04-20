

import data_articles from '../data_articles'

async function Article() {

    const articles = await data_articles();
    
    return (
        <div> 
            <h1> Articles : </h1>
            
            {articles}
           
         </div>
           
    );
}

export default Article;