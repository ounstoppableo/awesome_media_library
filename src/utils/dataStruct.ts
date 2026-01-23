import z from "zod";

const categoryFormSchema = z.object({
  id: z.any(),
  sourcePath: z.string(),
  thumbnail: z.string(),
  mediaId: z.union([
    z.number(),
    z.string().min(1, { message: "id参数不能为空" }),
  ]),
  type: z.string().min(1, { message: "类型参数不能为空" }),
  englishTitle: z
    .string()
    .min(1, { message: "英文标题不能为空" })
    .max(50, { message: "英文标题不能超过50个字符" }),
  chineseTitle: z
    .string()
    .min(1, { message: "中文标题不能为空" })
    .max(30, { message: "中文标题不能超过30个字符" }),
  date: z.string().min(1, { message: "日期参数不能为空" }),
  introduce: z
    .string()
    .min(150, { message: "介绍不能少于150字" })
    .max(400, { message: "介绍不能超过400个字符" }),
  location: z
    .string()
    .min(1, { message: "位置参数不能为空" })
    .max(20, { message: "位置参数不能超过20个字符" }),
  tag: z.string().min(1, { message: "标签参数不能为空" }),
  tags: z.array(z.string()),
  children: z.array(
    z.object({
      sourcePath: z.string(),
      thumbnail: z.string(),
      mediaId: z.union([
        z.number(),
        z.string().min(1, { message: "id参数不能为空" }),
      ]),
      type: z.string().min(1, { message: "类型参数不能为空" }),
      englishTitle: z
        .string()
        .min(1, { message: "英文标题不能为空" })
        .max(50, { message: "英文标题不能超过50个字符" }),
      chineseTitle: z
        .string()
        .min(1, { message: "中文标题不能为空" })
        .max(30, { message: "中文标题不能超过30个字符" }),
      date: z.string().min(1, { message: "日期参数不能为空" }),
      introduce: z
        .string()
        .min(150, { message: "介绍不能少于150字" })
        .max(400, { message: "介绍不能超过400个字符" }),
      location: z
        .string()
        .min(1, { message: "位置参数不能为空" })
        .max(20, { message: "位置参数不能超过20个字符" }),
      tag: z.string().min(1, { message: "标签参数不能为空" }),
      tags: z.array(z.string()),
    })
  ),
});

export default categoryFormSchema;
