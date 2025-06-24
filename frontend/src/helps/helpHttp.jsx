export const helpHttp = () => {
const customFetch = async (endpoint, options) => {
  const defaultHeader = {
    accept: "application/json",
  };

  const token = localStorage.getItem("token");

  const controller = new AbortController();
  options.signal = controller.signal;

  options.method = options.method || "GET";
  options.headers = options.headers
    ? { ...defaultHeader, ...options.headers }
    : defaultHeader;

  if (token && !options.headers?.Authorization) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  options.body = JSON.stringify(options.body) || false;
  if (!options.body) delete options.body;

  setTimeout(() => controller.abort(), 2000);

  return fetch(endpoint, options)
    .then(async (res) => {
      if (!res.ok) {
        const text = await res.text();
        return await Promise.reject({
          err: true,
          status: res.status || "00",
          statusText: res.statusText || "Ocurrió un error",
          body: text,
        });
      }
      return res.json();
    })
    .catch((err) => {
      return err;
    });
};

  const get = (url, options = {}) => customFetch(url, options);

  const post = (url, options = {}) => {
    options.method = "POST";
    return customFetch(url, options);
  };

  const put = (url, options = {}) => {
    options.method = "PUT";
    return customFetch(url, options);
  };

  const del = (url, options = {}) => {
    options.method = "DELETE";
    return customFetch(url, options);
  };

    const patch = (url, options = {}) => {
    options.method = "PATCH";
    return customFetch(url, options);
  };

  return {
    get,
    post,
    patch,
    put,
    del,
  };
};
