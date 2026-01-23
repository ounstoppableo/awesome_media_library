import useAuth from "@/hooks/useAuth";
import { getPool } from "@/lib/db";
import log from "@/logs/setting";
import { CategoryDetail } from "@/types/media";
import { CommonResponse } from "@/types/response";
import { codeMap, codeMapMsg } from "@/utils/backendStatus";
import errorStringify from "@/utils/errorStringify";
import { NextRequest } from "next/server";

type Page = {
  limit: number;
  page: number;
};

export async function POST(_req: NextRequest) {
  let body: { page: Page; filter?: { chineseTitle: string } };
  try {
    body = await _req.json();
  } catch (e) {
    body = {
      page: {
        limit: 10,
        page: 1,
      },
    };
  }

  const startOffset = (body.page.page - 1) * body.page.limit;
  const conn = await getPool().getConnection();
  try {
    await conn.beginTransaction();
    const [categories] = await conn.query(
      `
      SELECT category.id,mediaId,englishTitle,chineseTitle,introduce,location,tag,tags,type,sourcePath,category.updateTime date,thumbnail
      FROM category
      JOIN media ON category.mediaId = media.id
      ${body.filter?.chineseTitle ? "WHERE chineseTitle like ?" : ""}
      ORDER BY category.updateTime DESC
      LIMIT ?, ?;`,
      body.filter?.chineseTitle
        ? [
            "%" + body.filter.chineseTitle.split("").join("%") + "%",
            startOffset,
            body.page.limit,
          ]
        : [startOffset, body.page.limit]
    );
    const [[{ total }]]: any = await conn.query(
      `
      SELECT COUNT(*) AS total
      FROM category
      ${body.filter?.chineseTitle ? "WHERE chineseTitle like ?" : ""}
      `,
      body.filter?.chineseTitle
        ? ["%" + body.filter.chineseTitle.split("").join("%") + "%"]
        : []
    );
    const promises = (categories as CategoryDetail[]).map(async (category) => {
      category.tags = JSON.parse((category.tags as any) || "[]");
      const [children] = await conn.query(
        `
        SELECT mediaId,englishTitle,chineseTitle,introduce,location,tag,tags,type,sourcePath,updateTime date,thumbnail
        FROM subCategory    
        JOIN media ON subCategory.mediaId = media.id    
        WHERE categoryId = ?
        ORDER BY mediaId`,
        [category.id]
      );
      category.children = ((children || []) as CategoryDetail[]).map(
        (item) => ({
          ...item,
          tags: JSON.parse((item.tags as any) || "[]"),
        })
      );

      return;
    });
    await Promise.all(promises);
    return Response.json({
      code: codeMap.success,
      msg: codeMapMsg[codeMap.success],
      data: {
        list: categories,
        page: {
          ...body.page,
          total,
        },
      },
    } as CommonResponse);
  } catch (err: any) {
    await conn.rollback();
    log(err);
    return Response.json({
      code: codeMap.serverError,
      msg: codeMapMsg[codeMap.serverError],
    } as CommonResponse);
  } finally {
    conn.release();
  }
}
