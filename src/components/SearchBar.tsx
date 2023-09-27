import React from "react";
interface IProps {
  onSearch(s: string): void;
}
export const SearchBar: React.FC<IProps> = (props: IProps) => {
  return (
    <div className="SearchBar">
      <input
        type="text"
        className="input-search"
        placeholder="Type to Filter..."
        onChange={(t) => props.onSearch(t.target.value)}
      />
    </div>
  );
};
