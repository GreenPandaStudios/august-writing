import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useRequest } from "../api";
import { Poem } from "./Poem";
import { PoemType } from "../types";
import { SearchBar } from "./SearchBar";
import { HighlightedText } from "./HighlightedText";
import { motion, AnimatePresence } from "framer-motion";
import { BsList, BsChevronLeft, BsChevronRight, BsJournalBookmark, BsPlus, BsDownload, BsTrash } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { setActiveCollection, addUserCollection, deleteCollection, Collection } from "../store/collectionsSlice";
import qs from "qs";

export const PoetryWheel: React.FC = () => {
  const dispatch = useDispatch();
  const allCollections = useSelector((state: RootState) => state.collections.collections);
  const activeCollectionId = useSelector((state: RootState) => state.collections.activeCollectionId);
  
  const [fetching, searchMap] = useRequest<{ [x: string]: string }>(
    "https://greenpandastudios.github.io/august-poetry-api/searchMap.json",
    { loading: "loading..." },
    [4]
  );
  const [fetchingBodyMap, bodyMap] = useRequest<{ [x: string]: string[] }>(
    "https://greenpandastudios.github.io/august-poetry-api/bodySearchMap.json",
    { loading: [] },
    [4]
  );
  
  const [filter, setFilter] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPoem, setCurPoem] = useState<string>(() => {
    const poemQsp = qs.parse(window.location.href.split("?")[1] ?? "")["poem"]?.toString();
    return poemQsp ? poemQsp + ".json" : "";
  });
  
  useEffect(() => {
    if (currentPoem === "") setIsSidebarOpen(true);
  }, [currentPoem]);

  const [isCuratorMode, setIsCuratorMode] = useState(false);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  useEffect(() => {
    if (filter.toLowerCase() === "augustmiller") {
      setIsCuratorMode(true);
      setFilter("");
    }
  }, [filter]);

  const activeCollection = useMemo(() => {
    return allCollections.find(c => c.id === activeCollectionId);
  }, [allCollections, activeCollectionId]);

  const poemArray = useMemo(() => {
    let arr: Array<{ key: string; title: string; line?: string }> = [];
    let trackMap: { [title: string]: boolean } = {};
    
    if (activeCollectionId === 'All') {
      Object.keys(searchMap).forEach((key) => {
        if (!searchMap[key]) return;
        if (filter !== "") {
          if (searchMap[key].trim().toLowerCase().includes(filter) && !trackMap[key]) {
            arr.push({ key: key, title: searchMap[key] });
            trackMap[key] = true;
          }
          if (bodyMap[key]) {
            bodyMap[key].forEach(element => {
              if (element.toLowerCase().includes(filter) && !trackMap[key]) {
                arr.push({ key: key, title: searchMap[key], line: element });
                trackMap[key] = true;
              }
            });
          }
        } else {
          arr.push({ key: key, title: searchMap[key] });
        }
      });
      // Standard alphabetical order
      return arr.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      const col = allCollections.find(c => c.id === activeCollectionId);
      if (!col) return [];
      col.poems.forEach(key => {
        if (searchMap[key]) arr.push({ key, title: searchMap[key] });
      });
      
      // Standard curated order (Beginning at Top)

      if (filter !== "") {
        return arr.filter(p => p.title.toLowerCase().includes(filter));
      }
      return arr;
    }
  }, [searchMap, filter, bodyMap, activeCollectionId, allCollections]);

  const poemUrl = useMemo(() => {
    if (currentPoem === "") return "";
    return "https://greenpandastudios.github.io/august-poetry-api/data/" + currentPoem;
  }, [currentPoem]);

  const [gettingPoem, poem] = useRequest<PoemType>(
    poemUrl,
    { title: "", body: [] },
    [currentPoem]
  );

  const currentIndex = useMemo(() => {
    return poemArray.findIndex(p => p.key === currentPoem);
  }, [poemArray, currentPoem]);

  // STANDARD TRAVERSAL:
  // Next (Right) moves forward through the list (index + 1)
  // Prev (Left) moves backward through the list (index - 1)
  const handleNext = useCallback(() => {
    if (currentIndex < poemArray.length - 1) {
      setDirection("forward");
      setCurPoem(poemArray[currentIndex + 1].key);
    }
  }, [currentIndex, poemArray]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection("backward");
      setCurPoem(poemArray[currentIndex - 1].key);
    }
  }, [currentIndex, poemArray]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSidebarOpen || isCuratorMode) return;
      if (e.key === "ArrowLeft") handlePrev();
      else if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext, isSidebarOpen, isCuratorMode]);

  const handleCreateCollection = () => {
    const title = prompt("Collection Title:");
    if (title) {
      dispatch(addUserCollection({ title, description: "My custom collection." }));
    }
  };

  const handleExport = (col: Collection) => {
    const json = JSON.stringify(col, null, 2);
    navigator.clipboard.writeText(json);
    alert(`Collection "${col.title}" exported to clipboard!`);
  };

  if (fetching || fetchingBodyMap) return <></>;

  return (
    <div className="app-layout">
      <button className="sidebar-toggle" onClick={() => setIsSidebarOpen(true)}>
        <BsList /> Index
      </button>

      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              className="sidebar-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { if (currentPoem !== "") setIsSidebarOpen(false); }}
            />
            <motion.div 
              className="sidebar"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="sidebar-header">
                <h2><BsJournalBookmark style={{ marginRight: '0.5rem' }} /> Index</h2>
                {currentPoem !== "" && <button className="close-sidebar" onClick={() => setIsSidebarOpen(false)}>×</button>}
              </div>

              <div className="collection-manager">
                <div className="section-label">Collections</div>
                <div className="collections-nav">
                  <button className={activeCollectionId === "All" ? "active" : ""} onClick={() => dispatch(setActiveCollection("All"))}>All Works</button>
                  {allCollections.map(col => (
                    <div key={col.id} className="collection-item">
                      <button className={activeCollectionId === col.id ? "active" : ""} onClick={() => dispatch(setActiveCollection(col.id))}>{col.title}</button>
                      {col.type === 'user' && (
                        <>
                          <button className="icon-btn export" title="Export JSON" onClick={() => handleExport(col)}><BsDownload /></button>
                          <button className="icon-btn delete" title="Delete Collection" onClick={() => dispatch(deleteCollection(col.id))}><BsTrash /></button>
                        </>
                      )}
                    </div>
                  ))}
                  <button className="create-col-btn" onClick={handleCreateCollection}><BsPlus /> New Collection</button>
                </div>
              </div>

              {activeCollection && activeCollectionId !== "All" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="collection-description">
                  <p>{activeCollection.description}</p>
                </motion.div>
              )}

              <SearchBar onSearch={(s) => setFilter(s.toLowerCase().trim())} />

              <div className="PoemWheel">
                {poemArray.map((sMap, index) => (
                  <button key={index + "-button"}
                    className={sMap.key === currentPoem ? "selected" : ""}
                    onClick={() => {
                      // Forward: new poem is visually below (larger index)
                      // Backward: new poem is visually above (smaller index)
                      setDirection(index > currentIndex ? "forward" : "backward");
                      setCurPoem(sMap.key);
                      setIsSidebarOpen(false);
                    }}
                  >
                    {sMap.title}
                    <HighlightedText text={sMap.line} highlight={filter}/>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="main-content">
        <div className="page-navigation-wrapper">
          <button className={`page-nav-button prev ${currentIndex <= 0 || currentPoem === "" ? 'disabled' : ''}`} onClick={handlePrev} disabled={currentIndex <= 0 || currentPoem === ""}><BsChevronLeft /></button>
          <div className="poem-view-outer">
            {!gettingPoem && currentPoem !== "" && <Poem {...poem} qspName={currentPoem.split(".")[0]} direction={direction} onPrev={handlePrev} onNext={handleNext} />}
          </div>
          <button className={`page-nav-button next ${currentIndex >= poemArray.length - 1 || currentPoem === "" ? 'disabled' : ''}`} onClick={handleNext} disabled={currentIndex >= poemArray.length - 1 || currentPoem === ""}><BsChevronRight /></button>
        </div>
      </main>
    </div>
  );
};
