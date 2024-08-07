import React, { useEffect, useMemo, useState } from "react";
import { useRequest } from "../api";
import { Poem } from "./Poem";
import { PoemType } from "../types";
import { SearchBar } from "./SearchBar";
import { HighlightedText } from "./HighlightedText";
import qs from "qs";



export const PoetryWheel: React.FC = () => {

  const [fetching, searchMap] = useRequest<{
    [x: string]: string;
  }>(
    "https://greenpandastudios.github.io/august-poetry-api/searchMap.json",
    { loading: "loading..." },
    [4]
  );
  const [fetchingBodyMap, bodyMap] = useRequest<{
    [x: string]: string[];
  }>(
    "https://greenpandastudios.github.io/august-poetry-api/bodySearchMap.json",
    { loading: [] },
    [4]
  );
  const [filter, setFilter] = useState<string>("");
  



  const poemArray = useMemo(() => {
    let arr: Array<{ key: string; title: string; line?: string }> = [];
    let trackMap: {[title:string] : boolean} = {};
    Object.keys(searchMap).forEach((key) => {
      if (filter !== "") {
        if (searchMap[key].trim().toLowerCase().includes(filter) && !trackMap[key]) {
          arr.push({ key: key, title: searchMap[key] });
          trackMap[key] = true;
        }
        bodyMap[key].forEach(element => {
          if (element.toLowerCase().includes(filter) && !trackMap[key]) {
            arr.push({ key: key, title: searchMap[key],line: element });
            trackMap[key] = true;
          }
        });

      } else {
        arr.push({ key: key, title: searchMap[key] });
      }
    });
    return arr.sort((a, b) => (a.title > b.title ? 1 : 0));
  }, [searchMap, filter, bodyMap]);

  const [currentPoem, setCurPoem] = useState<string>("");
 
  useEffect(()=>{

    if (poemArray.length === 0) {
      return;
    }

    const poemQsp = qs.parse(window.location.href.split("?")[1] ?? "")["poem"]?.toString();
    if (poemQsp !== undefined) {
      setCurPoem(poemQsp + ".json");
    }

  },[setCurPoem,poemArray.length])

  const poemUrl = useMemo(()=>
    {
      if (currentPoem === "") {
        return "";
      }
      return "https://greenpandastudios.github.io/august-poetry-api/data/" + currentPoem;
}
,[currentPoem]);

  const [gettingPoem, poem] = useRequest<PoemType>(
    poemUrl,
    { title: "", body: [] },
    [currentPoem]
  );

  if (fetching || fetchingBodyMap) {
    return <></>;
  }

  return (
    <div>
      <div className="row">{!gettingPoem && <Poem {...poem} qspName={currentPoem.split(".")[0]} />}</div>
      <SearchBar onSearch={(s) => setFilter(s.toLowerCase().trim())} />
      {filter.startsWith("gou") && (
        <div className="row">
          <a href="https://greenpandastudios.github.io/cool-app-4000">
            Gounyvid Part 3
          </a>
        </div>
      )}
      <div className="row">
        {poemArray.length > 0 && (
          <div className="PoemWheel">
            {poemArray.map((sMap, index) => (
              <button key={index + "-button"}
                className={sMap.key === currentPoem ? "selected" : ""}
                onClick={() => {
                  setCurPoem(sMap.key);
                }}
              >
                {sMap.title}
                <HighlightedText text={sMap.line} highlight={filter}/>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
