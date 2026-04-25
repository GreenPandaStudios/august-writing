import React, { useRef, useState } from "react";
import { PoemType } from "../types";
import { toBlob } from "html-to-image";
import { BsCardImage, BsLink, BsPlusCircle, BsBookmarkHeart, BsBookmarkHeartFill, BsPlusSquareDotted } from "react-icons/bs";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { addPoemToCollection, removePoemFromCollection, addUserCollection } from "../store/collectionsSlice";

interface PoemProps extends PoemType {
  qspName: string;
  direction: "forward" | "backward";
  onPrev?: () => void;
  onNext?: () => void;
}

export const Poem: React.FC<PoemProps> = (props) => {
  const imageRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const collections = useSelector((state: RootState) => state.collections.collections.filter(c => c.type === 'user'));
  const [showBookmarkMenu, setShowBookmarkMenu] = useState(false);

  const filename = props.title.trim().normalize().replaceAll(".","")
  .replaceAll("/","")
  .replaceAll("\\","")
  .replaceAll(" ","_");
  
  const handleShare = async () => {
    if (imageRef.current === null) return;
    try {
      const newFile = await toBlob(imageRef.current, {
        backgroundColor: "#f5f2e0",
        style: { transform: "scale(1)" }
      });
      if (newFile === null) return;
      const data = {
        files: [new File([newFile], filename + ".png", { type: newFile.type })],
        title: props.title,
        text: props.title,
      };
      if (navigator.canShare && navigator.canShare(data)) {
        await navigator.share(data);
      } else {
        const link = window.location.href.split("?")[0] + "?poem=" + props.qspName;
        await navigator.clipboard.writeText(link);
        alert("Image sharing not supported on this browser. Link copied to clipboard.");
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  const handleLinkShare = async () => {
    const link: string = window.location.href.split("?")[0] + "?poem=" + props.qspName;
    try {
      if (navigator.share) {
        await navigator.share({ title: props.title, url: link });
      } else {
        await navigator.clipboard.writeText(link);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      await navigator.clipboard.writeText(link);
      alert("Link copied to clipboard!");
    }
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x < -threshold && props.onNext) {
      props.onNext();
    } else if (info.offset.x > threshold && props.onPrev) {
      props.onPrev();
    }
  };

  const handleCreateAndAdd = () => {
    const title = prompt("New Collection Title:");
    if (title) {
      const newCollectionId = `user-${Date.now()}`;
      dispatch(addUserCollection({ title, description: "My custom collection." }));
      // We use a small timeout to ensure the collection exists in state before adding
      // Alternatively, we could update the slice to accept an initial poem
      setTimeout(() => {
        dispatch(addPoemToCollection({ collectionId: newCollectionId, poemKey: props.qspName + ".json" }));
      }, 50);
    }
  };

  if (!props.title) {
    return <div className="poem"></div>;
  }

  const xOffset = props.direction === "forward" ? 40 : -40;

  return (
    <>
      <div className="poem">
        <div className="image-capture-wrapper" ref={imageRef}>
          <AnimatePresence mode="wait" custom={props.direction}>
            <motion.div
              key={props.qspName}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              initial={{ opacity: 0, x: xOffset, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -xOffset, scale: 0.98 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="paper-page"
              style={{ cursor: "grab" }}
              whileTap={{ cursor: "grabbing" }}
            >
              <div className="text-wrapper">
                <h1>{props.title}</h1>
                {props.date && <p className="poem-date">{props.date}</p>}
                {props.body.map((line, index) => {
                  return line === "" ? <br key={index + "-br"}></br> : <pre key={index + "-pre"}>{line}</pre>;
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        <div className="shareWrapper">
          <div className="bookmark-container">
            <button 
              className="shareButton bookmark-toggle" 
              title="Add to Collection"
              onClick={() => setShowBookmarkMenu(!showBookmarkMenu)}
            >
              <BsPlusCircle />
            </button>
            <AnimatePresence>
              {showBookmarkMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bookmark-menu"
                >
                  <h4>Add to Collection</h4>
                  
                  <button className="create-new-opt" onClick={handleCreateAndAdd}>
                    <BsPlusSquareDotted />
                    <em>Create New...</em>
                  </button>

                  {collections.map(col => {
                    const isBookmarked = col.poems.includes(props.qspName + ".json");
                    return (
                      <button 
                        key={col.id} 
                        onClick={() => {
                          if (isBookmarked) {
                            dispatch(removePoemFromCollection({ collectionId: col.id, poemKey: props.qspName + ".json" }));
                          } else {
                            dispatch(addPoemToCollection({ collectionId: col.id, poemKey: props.qspName + ".json" }));
                          }
                        }}
                      >
                        {isBookmarked ? <BsBookmarkHeartFill /> : <BsBookmarkHeart />}
                        {col.title}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button className="shareButton" title="Share as Image" onClick={() => handleShare()}>
            <BsCardImage />
          </button>
          <button className="shareButton" title="Copy Link" onClick={() => handleLinkShare()}>
            <BsLink />
          </button>
        </div>
      </div>
    </>
  );
};
