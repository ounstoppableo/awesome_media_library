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
    Promise.allSettled([
      request("/api/category/randomCategory", {
        method: "post",
        body: { count: 11 },
      }).then((res: CommonResponse) => {
        if (res.code === codeMap.success) {
          setRandomData(res.data.list);
        }
      }),
      request("/api/category/categoryList", {
        method: "post",
        body: { page: { page: 1, limit: 6 } },
      }).then((res: CommonResponse) => {
        if (res.code === codeMap.success) {
          setNewestData(res.data.list || []);
        }
      }),
    ]).finally(() => {
      dispatch(setGlobalLoading({ globalLoading: false }));
    });
  }, []);
  return { newestData, randomData };
}
