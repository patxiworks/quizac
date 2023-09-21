
import { useState } from "react";

const LongText = ({ content, limit, hideReadMore}) => {
    const [showAll, setShowAll] = useState(false);

    const words = content.split(' ').filter(Boolean);
  
    const showMore = () => setShowAll(true);
    const showLess = () => setShowAll(false);
  
    if (words.length <= limit) {
      // there is nothing more to show
      return <div>{content}</div>
    }
    if (showAll) {
      // We show the extended text and a link to reduce it
      return <div> 
        {content + " "}
        {!hideReadMore ? <span style={{fontWeight: 'bold', cursor: 'pointer'}} onClick={showLess}>[read less]</span> : ''}
      </div>
    }
    // In the final case, we show a text with ellipsis and a `Read more` button
    const toShow = words.slice(0, limit).join(' ') + "... ";
    return <div style={!hideReadMore ? { borderBottom: '1px solid #e2e0e0'} : {}}> 
      {toShow} 
      {!hideReadMore ? <span style={{fontWeight: 'bold', cursor: 'pointer'}} onClick={showMore}>[read more]</span> : ''}
    </div>
}

export {
    LongText
}