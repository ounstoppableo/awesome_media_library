import { useAppDispatch } from "@/store/hooks";
import { setGlobalLoading } from "@/store/loading/loading-slice";
import { CommonResponse } from "@/types/response";
import { codeMap } from "@/utils/backendStatus";
import request from "@/utils/fetch";
import { useEffect, useState } from "react";

export default function useAccessData() {
  const [newestData, setNewestData] = useState([]);
  const [randomData, setRandomData] = useState([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setGlobalLoading({ globalLoading: true }));
    request("/api/category/randomCategory", { method: "post" })
      .then((res: CommonResponse) => {
        if (res.code === codeMap.success) {
          setRandomData(res.data);
        }
      })
      .finally(() => {
        dispatch(setGlobalLoading({ globalLoading: false }));
      });
    request("/api/category/newestCategory", { method: "post" })
      .then((res: CommonResponse) => {
        if (res.code === codeMap.success) {
          setNewestData(res.data);
        }
      })
      .finally(() => {
        dispatch(setGlobalLoading({ globalLoading: false }));
      });
  }, []);
  return { newestData, randomData };
}
