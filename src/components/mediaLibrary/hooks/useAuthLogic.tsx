import { CommonResponse } from "@/types/response";
import { codeMap } from "@/utils/backendStatus";
import request from "@/utils/fetch";
import { useEffect, useState } from "react";

export default function useAuthLogic() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("Authorization");
    token &&
      request("/api/auth").then((res: CommonResponse) => {
        if (res.code === codeMap.success) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      });
  }, []);

  return { isAuth };
}
