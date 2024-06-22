import { createContext,useState } from "react";

export const context = createContext(null);

const ContextProvider = ({ children }) => {
    const [file, setFile] = useState([]);
    const [download, setDownload] = useState("");
  const [numPages, setNumPages] = useState(0);

    return (
      <context.Provider
        value={{ file, setFile, download, setDownload, numPages, setNumPages }}
      >
        {children}
      </context.Provider>
    );
}

export default ContextProvider;