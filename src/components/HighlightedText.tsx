import React from "react";

export const HighlightedText: React.FC<{text?: string, highlight: string}> = (props: {text?: string, highlight: string}) => {
  

    const dString = props.text ? props.text.replaceAll(new RegExp(props.highlight,"ig"),props.highlight.toUpperCase()) : ""
  
    console.log(dString);
   if (props.text === undefined) {
    return <></>;
   }
  
  
    return (
        <div>
        {dString}
    
        </div>
  );
};
