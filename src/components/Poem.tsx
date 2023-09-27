import React from "react";
import { PoemType } from "../types";
import { useRequest } from "../api";

export const Poem: React.FC<PoemType> = (props: PoemType) => {
  return (
    <>
      <div className="poem">
        <div className="text-wrapper">
          <h1>{props.title}</h1>
          {props.body.map((line) => {
            return <p>{line}</p>;
          })}
        </div>
      </div>
    </>
  );
};
