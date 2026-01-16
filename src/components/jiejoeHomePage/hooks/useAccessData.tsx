import { useState } from "react";

export default function useAccessData() {
  const [data, setData] = useState([]);
  return { data };
}
