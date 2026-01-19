import { CommonResponse } from "@/types/response";
import { codeMap } from "@/utils/backendStatus";
import request from "@/utils/fetch";
import { useEffect, useState } from "react";

export default function useAccessData() {
  const [newestData, setNewestData] = useState([]);
  const [randomData, setRandomData] = useState([]);
  useEffect(() => {
    request("/api/category/randomCategory", { method: "post" }).then(
      (res: CommonResponse) => {
        if (res.code === codeMap.success) {
          setRandomData(res.data);
        }
      }
    );
    request("/api/category/newestCategory", { method: "post" }).then(
      (res: CommonResponse) => {
        if (res.code === codeMap.success) {
          setNewestData(res.data);
        }
      }
    );
  }, []);
  return { newestData, randomData };
}
