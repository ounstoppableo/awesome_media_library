import useAuth from "@/hooks/useAuth";
import { getPool } from "@/lib/db";
import log from "@/logs/setting";
import { CategoryDetail } from "@/types/media";
import { CommonResponse } from "@/types/response";
import { codeMap, codeMapMsg } from "@/utils/backendStatus";
import errorStringify from "@/utils/errorStringify";
import { NextRequest } from "next/server";

export async function POST(_req: NextRequest) {
  let body: { count: number };
  try {
    body = await _req.json();
  } catch (e) {
    body = {
      count: 10,
    };
  }
  const conn = await getPool().getConnection();
  try {
    await conn.beginTransaction();
    const [categories] = await conn.query(
      `
      SELECT category.id,mediaId,englishTitle,chineseTitle,introduce,location,tag,tags,type,sourcePath,updateTime date,thumbnail
      FROM category
      JOIN media ON category.mediaId = media.id
      ORDER BY RAND()
      LIMIT ?;`,
      [body.count]
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
