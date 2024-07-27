import React, { useRef } from "react";
import { PoemType } from "../types";
import { toBlob } from "html-to-image";
import { BsCardImage, BsFillShareFill, BsFolderSymlink, BsLink } from "react-icons/bs";

export const Poem: React.FC<(PoemType & {qspName: string})> = (props: (PoemType & {qspName: string})) => {
  const imageRef = useRef<HTMLDivElement>(null);
  const filename = props.title.trim().normalize().replaceAll(".","")
  .replaceAll("\/","")
  .replaceAll("\\","")
  .replaceAll(" ","_");
  
  const handleShare = async () => {
    if (imageRef.current === null) return;

    const newFile = await toBlob(imageRef.current,{
      backgroundColor: "#060607",
      style: {
        transform: "scale(.9)",
      }
    });

    if (newFile === null) return;

    const data = {
      files: [
        new File([newFile], filename + ".png", {
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

  const handleLinkShare = async () => {

    const link: string = window.location.href.split("?")[0] + "?poem=" + props.qspName;
    try {
      if (!navigator.canShare({url: link})) {
        console.error("Can't share");
      }
      await navigator.share({url: link});
    } catch (err) {
      console.error(err);
    }
  };

  if (!props.title) {
    return <div className="poem"></div>;
  }

  return (
    <>
      <div className="poem">
        <div className="text-wrapper" ref={imageRef}>
          <h1>{props.title}</h1>
          {props.body.map((line, index) => {
            return line === "" ? <br key={index + "-br"}></br> : <pre key={index + "-pre"}>{line}</pre>;
          })}
          <br></br>
        </div>
        <div className="shareWrapper">
          <button className="shareButton" onClick={() => handleShare()}>
            <BsCardImage />
          </button>
          <button className="shareButton" onClick={() => handleLinkShare()}>
            <BsLink />
          </button>
        </div>
      </div>
    </>
  );
};
