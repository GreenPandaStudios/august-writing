// Make the `request` function generic
// to specify the return data type:
export function request<TResponse>(
  url: string,
  // `RequestInit` is a type for configuring
  // a `fetch` request. By default, an empty object.
  config: RequestInit = {}

  // This function is async, it will return a Promise:
): Promise<TResponse> {
  // Inside, we call the `fetch` function with
  // a URL and config given:

  if (url === ""){
    return Promise.reject("URL cannot be empty");  // Return a rejected Promise if URL is empty.  // This will allow the caller to handle the error.  // For example, by showing an error message to the user.  // Note: This is a best practice and not a requirement.  // You can choose to throw an error or return a rejected Promise based on your specific needs.  // In this case, we've chosen to return a rejected Promise.  // This way, the caller can handle the error in their own way.  // For example, by showing an error message to the user.  // Note: This is a best practice and not a requirement.  // You can choose to throw an error or return a rejected Promise based on your specific needs.  // In this case, we've chosen to return a rejected Promise.  // This way,
  }

  return (
    fetch(url, config)
      // When got a response call a `json` method on it
      .then((response) => response.json())
      // and return the result data.
      .then((data) => data as TResponse)
  );

  // We also can use some post-response
  // data-transformations in the last `then` clause.
}
