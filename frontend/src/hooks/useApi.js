import axios from "axios";
import { useState, useEffect } from "react";

// custom API fetching hook
const useApi = (dataSource) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axios.get(`${dataSource}`, {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("user")).token
            }`,
          },
        });
        setData(data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [dataSource]);

  return { data };
};

export default useApi;