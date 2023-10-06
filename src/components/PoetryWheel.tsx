import React, { useCallback, useMemo, useState } from "react";
import { useRequest } from "../api";
import { Poem } from "./Poem";
import { PoemType } from "../types";
import { SearchBar } from "./SearchBar";
interface Json {
  [x: string]: string;
}
export const PoetryWheel: React.FC = () => {
  const [fetching, searchMap] = useRequest<Json>(
    "https://greenpandastudios.github.io/august-poetry-api/searchMap.json",
    { apples: "a" },
    [4]
  );
  const [filter, setFilter] = useState<string>("");
  const poemArray = useMemo(() => {
    let arr: Array<{ key: string; title: string }> = [];
    Object.keys(searchMap).forEach((key) => {
      if (filter !== "") {
        if (searchMap[key].trim().toLowerCase().includes(filter)) {
          arr.push({ key: key, title: searchMap[key] });
        }
      } else {
        arr.push({ key: key, title: searchMap[key] });
      }
    });
    return arr.sort((a, b) => (a.title > b.title ? 1 : 0));
  }, [searchMap, filter]);

  const [currentPoem, setCurPoem] = useState<string>(poemArray[0]?.key || "");

  const [gettingPoem, poem] = useRequest<PoemType>(
    "https://greenpandastudios.github.io/august-poetry-api/data/" + currentPoem,
    { title: "", body: [] },
    [currentPoem]
  );

  if (fetching) {
    return <></>;
  }

  return (
    <div>
      <div className="row">{!gettingPoem && <Poem {...poem} />}</div>
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
            {poemArray.map((sMap) => (
              <button
                className={sMap.key === currentPoem ? "selected" : ""}
                onClick={() => {
                  setCurPoem(sMap.key);
                }}
              >
                {sMap.title}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
