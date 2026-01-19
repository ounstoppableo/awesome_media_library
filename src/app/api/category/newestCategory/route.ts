import useAuth from "@/hooks/useAuth";
import log from "@/logs/setting";
import { CommonResponse } from "@/types/response";
import { codeMap, codeMapMsg } from "@/utils/backendStatus";
import errorStringify from "@/utils/errorStringify";
import { NextRequest } from "next/server";

export async function POST(_req: NextRequest) {
  let body;
  try {
    body = await _req.json();
  } catch (e) {
    body = {};
  }
  const count = body.count || 6;
  return Response.json({
    code: codeMap.success,
    data: [
      {
        id: 1,
        type: "image",
        img: "/img21.jpg",
        category: "scene",
        englishTitle: "Blench Bankai Mashup1",
        chineseTitle: "死神千年血战宣传片1",
        date: "2026.1.9",
        introduce: ` Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolor iusto
        quaerat qui, illo incidunt suscipit fugiat distinctio officia earum
        eius quae officiis quis harum animi. Lorem, ipsum dolor sit amet
        consectetur adipisicing elit. Dolor iusto quaerat qui, illo incidunt
        suscipit fugiat distinctio officia earum eius quae officiis quis harum
        animi.`,
        location: "TEL AVIV",
        tag: "scene",
        children: [
          {
            id: 1,
            type: "image",
            img: "/img21.jpg",
            category: "scene",
            englishTitle: "Blench Bankai Mashup1",
            chineseTitle: "死神千年血战宣传片1",
            date: "2026.1.9",
            introduce: ` Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolor iusto
            quaerat qui, illo incidunt suscipit fugiat distinctio officia earum
            eius quae officiis quis harum animi. Lorem, ipsum dolor sit amet
            consectetur adipisicing elit. Dolor iusto quaerat qui, illo incidunt
            suscipit fugiat distinctio officia earum eius quae officiis quis harum
            animi.`,
            location: "TEL AVIV",
          },
          {
            id: 2,
            type: "image",
            img: "/img33.jpg",
            category: "scene",
            englishTitle: "Best Huangshan scene",
            chineseTitle: "最佳黄山美景",
            date: "2026.1.3",
            introduce: ` Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolor iusto
            quaerat qui, illo incidunt suscipit fugiat distinctio officia earum
            eius quae officiis quis harum animi. Lorem, ipsum dolor sit amet
            consectetur adipisicing elit. Dolor iusto quaerat qui, illo incidunt
            suscipit fugiat distinctio officia earum eius quae officiis quis harum
            animi.`,
            location: "Huang Shan",
          },
          {
            id: 3,
            type: "image",
            img: "/Magic.jpg",
            category: "scene",
            englishTitle: "Best bench scene",
            chineseTitle: "最佳海岸美景",
            date: "2026.1.5",
            introduce: ` Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolor iusto
        quaerat qui, illo incidunt suscipit fugiat distinctio officia earum
        eius quae officiis quis harum animi. Lorem, ipsum dolor sit amet
        consectetur adipisicing elit. Dolor iusto quaerat qui, illo incidunt
        suscipit fugiat distinctio officia earum eius quae officiis quis harum
        animi.`,
            location: "San Ya",
          },
          {
            id: 4,
            type: "image",
            img: "/img21.jpg",
            category: "scene",
            englishTitle: "Best Snow scene",
            chineseTitle: "最佳雪景",
            date: "2026.1.6",
            introduce: ` Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolor iusto
            quaerat qui, illo incidunt suscipit fugiat distinctio officia earum
            eius quae officiis quis harum animi. Lorem, ipsum dolor sit amet
            consectetur adipisicing elit. Dolor iusto quaerat qui, illo incidunt
            suscipit fugiat distinctio officia earum eius quae officiis quis harum
            animi.`,
            location: "Japan",
          },
          {
            id: 5,
            type: "image",
            img: "/img21.jpg",
            category: "scene",
            englishTitle: "Best strait scene",
            chineseTitle: "最佳海峡风景",
            date: "2026.1.7",
            introduce: ` Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolor iusto
            quaerat qui, illo incidunt suscipit fugiat distinctio officia earum
            eius quae officiis quis harum animi. Lorem, ipsum dolor sit amet
            consectetur adipisicing elit. Dolor iusto quaerat qui, illo incidunt
            suscipit fugiat distinctio officia earum eius quae officiis quis harum
            animi.`,
            location: "TEL AVIV",
          },
        ],
      },
      {
        id: 2,
        type: "image",
        img: "/img33.jpg",
        category: "scene",
        englishTitle: "Best Huangshan scene",
        chineseTitle: "最佳黄山美景",
        date: "2026.1.3",
        introduce: ` Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolor iusto
        quaerat qui, illo incidunt suscipit fugiat distinctio officia earum
        eius quae officiis quis harum animi. Lorem, ipsum dolor sit amet
        consectetur adipisicing elit. Dolor iusto quaerat qui, illo incidunt
        suscipit fugiat distinctio officia earum eius quae officiis quis harum
        animi.`,
        location: "Huang Shan",
        tag: "scene",
      },
      {
        id: 3,
        type: "image",
        img: "/Magic.jpg",
        category: "scene",
        englishTitle: "Best bench scene",
        chineseTitle: "最佳海岸美景",
        date: "2026.1.5",
        introduce: ` Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolor iusto
        quaerat qui, illo incidunt suscipit fugiat distinctio officia earum
        eius quae officiis quis harum animi. Lorem, ipsum dolor sit amet
        consectetur adipisicing elit. Dolor iusto quaerat qui, illo incidunt
        suscipit fugiat distinctio officia earum eius quae officiis quis harum
        animi.`,
        location: "San Ya",
        tag: "scene",
      },
      {
        id: 4,
        type: "image",
        img: "/img21.jpg",
        category: "scene",
        englishTitle: "Best Snow scene",
        chineseTitle: "最佳雪景",
        date: "2026.1.6",
        introduce: ` Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolor iusto
        quaerat qui, illo incidunt suscipit fugiat distinctio officia earum
        eius quae officiis quis harum animi. Lorem, ipsum dolor sit amet
        consectetur adipisicing elit. Dolor iusto quaerat qui, illo incidunt
        suscipit fugiat distinctio officia earum eius quae officiis quis harum
        animi.`,
        location: "Japan",
        tag: "scene",
      },
      {
        id: 5,
        type: "image",
        img: "/img21.jpg",
        category: "scene",
        englishTitle: "Best strait scene",
        chineseTitle: "最佳海峡风景",
        date: "2026.1.7",
        introduce: ` Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolor iusto
        quaerat qui, illo incidunt suscipit fugiat distinctio officia earum
        eius quae officiis quis harum animi. Lorem, ipsum dolor sit amet
        consectetur adipisicing elit. Dolor iusto quaerat qui, illo incidunt
        suscipit fugiat distinctio officia earum eius quae officiis quis harum
        animi.`,
        location: "TEL AVIV",
        tag: "scene",
      },
      {
        id: 6,
        type: "image",
        img: "https://cdn.prod.website-files.com/673306db3b111afa559bc378/675eb903f604a7a856c87467_taboo.webp",
        category: "scene",
        englishTitle: "Best strait scene",
        chineseTitle: "最佳电影",
        date: "2026.1.7",
        introduce: ` Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolor iusto
        quaerat qui, illo incidunt suscipit fugiat distinctio officia earum
        eius quae officiis quis harum animi. Lorem, ipsum dolor sit amet
        consectetur adipisicing elit. Dolor iusto quaerat qui, illo incidunt
        suscipit fugiat distinctio officia earum eius quae officiis quis harum
        animi.`,
        location: "TEL AVIV",
        tag: "scene",
      },
    ],
  } as CommonResponse);
}
