import { useContext } from "react";
import { AppStateContext } from "../context/AppStateProvider";

const useAppStateContext = () => {
  return useContext(AppStateContext);
};

export default useAppStateContext;