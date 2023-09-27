import { useEffect, useMemo, useState } from "react";
import { request } from "./request";

export function useRequest<TResponseData>(
  requestUrl: string,
  defaultData: TResponseData,
  deps: [...any] | []
): [boolean, TResponseData] {
  const [fetching, setFetching] = useState<boolean>(true);
  const [data, setData] = useState<TResponseData>(defaultData);

  useMemo(() => {
    request<TResponseData>(requestUrl)
      .then((rDdata) => setData(rDdata))
      .catch(() => setData(defaultData))
      .finally(() => setFetching(false));
  }, [...deps]);
  console.log(data);
  return [fetching, data];
}
