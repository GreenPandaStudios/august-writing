import React, { useRef } from "react";
import { PoemType } from "../types";
import { toBlob } from "html-to-image";
import { BsFillShareFill } from "react-icons/bs";

export const Poem: React.FC<PoemType> = (props: PoemType) => {
  const imageRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    if (imageRef.current === null) return;

    const newFile = await toBlob(imageRef.current);

    if (newFile === null) return;

    const data = {
      files: [
        new File([newFile], "image.png", {
          type: newFile.type,
        }),
      ],
      title: "Image",
      text: "image",
    };

    try {
      if (!navigator.canShare(data)) {
        console.error("Can't share");
      }
      await navigator.share(data);
    } catch (err) {
      console.error(err);
    }
  };
  if (!props.title) {
    return <> </>;
  }

  return (
    <>
      <div className="poem">
        <div className="text-wrapper" ref={imageRef}>
          <h1>{props.title}</h1>
          {props.body.map((line) => {
            return line === "" ? <br></br> : <pre>{line}</pre>;
          })}
        </div>
        <button className="shareButton" onClick={() => handleShare()}>
          <BsFillShareFill />
        </button>
      </div>
    </>
  );
};
