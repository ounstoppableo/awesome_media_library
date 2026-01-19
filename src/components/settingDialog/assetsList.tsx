import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import request from "@/utils/fetch";
import { CommonResponse } from "@/types/response";
import { codeMap } from "@/utils/backendStatus";
import { CalendarIcon, Delete, Plus, Store, Trash, Trash2 } from "lucide-react";
import { Button } from "../button-1";
import MediaLibrary from "../mediaLibrary";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import dayjs from "dayjs";
import { Calendar } from "../ui/calendar";
import { MediaStruct } from "../mediaLibrary/components/mediaItem";
import { Textarea } from "../ui/textarea";
import { uniqueBy } from "@/utils/convention";

function TypeField(props: { formData: any; field: any; clean?: boolean }) {
  const { formData, field, clean = false } = props;
  return (
    <FormField
      control={formData.control}
      name={field}
      render={({ field }) => (
        <FormItem className={"flex-1"}>
          {clean ? (
            <></>
          ) : (
            <>
              <FormLabel>媒体类型</FormLabel>
              <FormDescription>
                描述媒体资产类型，如图片、视频等
              </FormDescription>
            </>
          )}
          <FormControl>
            <Select {...field} onValueChange={(value) => field.onChange(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="请选择媒体类型" />
              </SelectTrigger>
              <SelectContent className="z-9999">
                {[
                  { label: "视频", value: "video" },
                  { label: "图片", value: "image" },
                ].map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function CategoryField(props: { formData: any; field: any; clean?: boolean }) {
  const { formData, field, clean = false } = props;
  return (
    <FormField
      control={formData.control}
      name={field}
      render={({ field }) => (
        <FormItem className={"flex-1"}>
          {clean ? (
            <></>
          ) : (
            <>
              <FormLabel>媒体属类</FormLabel>
              <FormDescription>
                描述媒体的内容类型，如风景、人文等
              </FormDescription>
            </>
          )}
          <FormControl>
            <Input {...field} placeholder="请输入媒体属类"></Input>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function TagField(props: { formData: any; field: any; clean?: boolean }) {
  const { formData, field, clean = false } = props;
  return (
    <FormField
      control={formData.control}
      name={field}
      render={({ field }) => (
        <FormItem className={"flex-1"}>
          {clean ? (
            <></>
          ) : (
            <>
              <FormLabel>媒体标签</FormLabel>
              <FormDescription>和媒体属类类似</FormDescription>
            </>
          )}
          <FormControl>
            <Input {...field} placeholder="请输入媒体标签"></Input>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function EnglishTitleField(props: {
  formData: any;
  field: any;
  clean?: boolean;
}) {
  const { formData, field, clean = false } = props;
  return (
    <FormField
      control={formData.control}
      name={field}
      render={({ field }) => (
        <FormItem className={"flex-1"}>
          {clean ? (
            <></>
          ) : (
            <>
              <FormLabel>英文标题</FormLabel>{" "}
              <FormDescription>描述媒体内容的英文标题</FormDescription>
            </>
          )}

          <FormControl>
            <Input {...field} placeholder="请输入英文标题"></Input>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
function ChineseTitleField(props: {
  formData: any;
  field: any;
  clean?: boolean;
}) {
  const { formData, field, clean = false } = props;
  return (
    <FormField
      control={formData.control}
      name={field}
      render={({ field }) => (
        <FormItem className={"flex-1"}>
          {" "}
          {clean ? (
            <></>
          ) : (
            <>
              <FormLabel>中文标题</FormLabel>
              <FormDescription>描述媒体内容的中文标题</FormDescription>
            </>
          )}
          <FormControl>
            <Input {...field} placeholder="请输入中文标题"></Input>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
function DateField(props: { formData: any; field: any; clean?: boolean }) {
  const { formData, field, clean = false } = props;
  return (
    <FormField
      control={formData.control}
      name={field}
      render={({ field }) => (
        <FormItem className={"flex-1"}>
          {" "}
          {clean ? (
            <></>
          ) : (
            <>
              <FormLabel>拍摄日期</FormLabel>{" "}
              <FormDescription>描述媒体的拍摄时间</FormDescription>
            </>
          )}
          <FormControl>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  data-empty={!field.value}
                  className="data-[empty=true]:text-muted-foreground justify-start text-left font-normal w-full"
                >
                  <CalendarIcon />
                  {field.value ? (
                    dayjs(field.value).format("YYYY-MM-DD")
                  ) : (
                    <span>挑选日期</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-[9999]">
                <Calendar
                  mode="single"
                  selected={field.value as any}
                  onSelect={(value) => {
                    field.onChange(dayjs(value).format("YYYY-MM-DD"));
                  }}
                />
              </PopoverContent>
            </Popover>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
function LocationField(props: { formData: any; field: any; clean?: boolean }) {
  const { formData, field, clean = false } = props;
  return (
    <FormField
      control={formData.control}
      name={field}
      render={({ field }) => (
        <FormItem className={"flex-1"}>
          {" "}
          {clean ? (
            <></>
          ) : (
            <>
              <FormLabel>拍摄位置</FormLabel>
              <FormDescription>描述媒体的拍摄位置</FormDescription>
            </>
          )}
          <FormControl>
            <Input {...field} placeholder="请输入拍摄位置"></Input>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
function IntroduceField(props: { formData: any; field: any; clean?: boolean }) {
  const { formData, field, clean = false } = props;
  return (
    <FormField
      control={formData.control}
      name={field}
      render={({ field }) => (
        <FormItem className={"flex-1"}>
          {" "}
          {clean ? (
            <></>
          ) : (
            <>
              <FormLabel>媒体介绍</FormLabel>{" "}
              <FormDescription>描述媒体的相关信息</FormDescription>
            </>
          )}
          <FormControl>
            <Textarea {...field} placeholder="请输入媒体介绍" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default function AssetsList(props: any) {
  const { open, handleOpenChange, className } = props;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addMediaOpen, setAddMediaOpen] = useState(false);
  const [mediaSelectOpen, setMediaSelectOpen] = useState(false);
  const formSchema = z.object({
    sourcePath: z.string(),
    id: z.string().min(1, { message: "id参数不能为空" }),
    type: z.string().min(1, { message: "类型参数不能为空" }),
    category: z.string().min(1, { message: "类别参数不能为空" }),
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
      .max(250, { message: "介绍不能超过150个字符" }),
    location: z
      .string()
      .min(1, { message: "位置参数不能为空" })
      .max(20, { message: "位置参数不能超过20个字符" }),
    tag: z.string().min(1, { message: "标签参数不能为空" }),
    children: z.array(
      z.object({
        sourcePath: z.string(),
        id: z.string().min(1, { message: "id参数不能为空" }),
        type: z.string().min(1, { message: "类型参数不能为空" }),
        category: z.string().min(1, { message: "类别参数不能为空" }),
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
          .min(150, { message: "介绍不能少于100字" })
          .max(250, { message: "介绍不能超过150个字符" }),
        location: z
          .string()
          .min(1, { message: "位置参数不能为空" })
          .max(20, { message: "位置参数不能超过20个字符" }),
        tag: z.string().min(1, { message: "标签参数不能为空" }),
      })
    ),
  });
  useEffect(() => {
    // setLoading(true);
    // request("/api/category/newestCategory", { method: "post" })
    //   .then((res: CommonResponse) => {
    //     if (res.code === codeMap.success) {
    //       setData(res.data);
    //     }
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //   });
  }, []);
  const formData = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sourcePath: "",
      id: "",
      type: "",
      category: "",
      englishTitle: "",
      chineseTitle: "",
      date: "",
      introduce: "",
      location: "",
      tag: "",
      children: [],
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
  const [selectedMedias, setSelectedMedias] = useState<any>([]);

  const mediaTableJsx = (data: z.infer<typeof formSchema>[]) => (
    <Table className="flex-1">
      <TableHeader>
        <TableRow>
          <TableHead>缩略</TableHead>
          <TableHead>中文标题</TableHead>
          <TableHead>英文标题</TableHead>
          <TableHead>媒体类型</TableHead>
          <TableHead>媒体属类</TableHead>
          <TableHead>媒体标签</TableHead>
          <TableHead>拍摄日期</TableHead>
          <TableHead>拍摄位置</TableHead>
          <TableHead>媒体介绍</TableHead>
          <TableHead>
            <div className="gap-2 flex items-center h-full">
              操作
              <Button
                className="w-8 h-8 rounded-full"
                variant={"outline"}
                onClick={() => setMediaSelectOpen(true)}
              >
                <Plus></Plus>
              </Button>
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item: z.infer<typeof formSchema>, index) => (
          <TableRow key={item.id}>
            <TableCell>
              <ChineseTitleField
                formData={formData}
                field={`children[${index}].chineseTitle`}
                clean={true}
              ></ChineseTitleField>
            </TableCell>
            <TableCell>
              <ChineseTitleField
                formData={formData}
                field={`children[${index}].chineseTitle`}
                clean={true}
              ></ChineseTitleField>
            </TableCell>
            <TableCell>
              <EnglishTitleField
                formData={formData}
                field={`children[${index}].englishTitle`}
                clean={true}
              ></EnglishTitleField>
            </TableCell>
            <TableCell>
              <TypeField
                formData={formData}
                field={`children[${index}].type`}
                clean={true}
              ></TypeField>
            </TableCell>
            <TableCell>
              <CategoryField
                formData={formData}
                field={`children[${index}].category`}
                clean={true}
              ></CategoryField>
            </TableCell>
            <TableCell>
              <TagField
                formData={formData}
                field={`children[${index}].tag`}
                clean={true}
              ></TagField>
            </TableCell>
            <TableCell>
              <DateField
                formData={formData}
                field={`children[${index}].date`}
                clean={true}
              ></DateField>
            </TableCell>
            <TableCell>
              <LocationField
                formData={formData}
                field={`children[${index}].location`}
                clean={true}
              ></LocationField>
            </TableCell>
            <TableCell className="w-100">
              <IntroduceField
                formData={formData}
                field={`children[${index}].introduce`}
                clean={true}
              ></IntroduceField>
            </TableCell>
            <TableCell align="center">
              <Button
                className="w-8 h-8 rounded-full"
                variant="destructive"
                onClick={() => {
                  formData.setValue(
                    "children",
                    formData
                      .getValues("children")
                      .filter((_, _index) => _index !== index)
                  );
                }}
              >
                <Trash2></Trash2>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <form>
          <DialogTrigger asChild></DialogTrigger>
          <DialogContent
            className={cn(
              "w-[100dvw] max-w-[100dvw_!important] h-[100dvh] flex flex-col",
              className
            )}
          >
            <DialogHeader className="h-fit">
              <DialogTitle>资产列表</DialogTitle>
            </DialogHeader>
            {data.length === 0 ? (
              <Empty className="border border-dashed">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Store />
                  </EmptyMedia>
                  <EmptyTitle className="text-foreground">
                    资产列表为空
                  </EmptyTitle>
                  <EmptyDescription>
                    添加资产，使其能在其他地方进行服务
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAddMediaOpen(true)}
                  >
                    添加资产
                  </Button>
                </EmptyContent>
              </Empty>
            ) : (
              <>
                <Table className="flex-1">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Invoice</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((item) => (
                      <TableRow>
                        <TableCell className="font-medium">INV001</TableCell>
                        <TableCell>Paid</TableCell>
                        <TableCell>Credit Card</TableCell>
                        <TableCell className="text-right">$250.00</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>
                        2
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </>
            )}
          </DialogContent>
        </form>
      </Dialog>
      <Dialog open={addMediaOpen} onOpenChange={setAddMediaOpen}>
        <DialogContent
          className={cn(
            "w-[100dvw] max-w-[100dvw_!important] h-[100dvh] flex flex-col",
            className
          )}
        >
          <DialogHeader className="h-fit">
            <DialogTitle>添加资产</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
            {!formData.getValues().children ||
            formData.getValues().children.length === 0 ? (
              <Empty className="border border-dashed h-full">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Store />
                  </EmptyMedia>
                  <EmptyTitle className="text-foreground">媒体为空</EmptyTitle>
                  <EmptyDescription>选择媒体以便添加资产</EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMediaSelectOpen(true)}
                  >
                    挑选媒体
                  </Button>
                </EmptyContent>
              </Empty>
            ) : (
              <Form {...formData}>
                <form
                  onSubmit={formData.handleSubmit(onSubmit)}
                  className="space-y-8 h-fit"
                >
                  <div className="w-full flex gap-[4vmin]">
                    <FormField
                      control={formData.control}
                      name="id"
                      render={({ field }) => (
                        <FormItem className={"flex-1"}>
                          <FormLabel>媒体源</FormLabel>
                          <FormDescription>用于作为封面</FormDescription>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={(value) => {
                                const media = formData
                                  .getValues("children")
                                  .find((media) => media.id === value);
                                if (!media) return;
                                formData.setValue(
                                  "chineseTitle",
                                  media.chineseTitle
                                );
                                formData.setValue("date", media.date);
                                formData.setValue(
                                  "englishTitle",
                                  media.englishTitle
                                );
                                formData.setValue("id", media.id);
                                formData.setValue("introduce", media.introduce);
                                formData.setValue("location", media.location);
                                formData.setValue("tag", media.tag);
                                formData.setValue("type", media.type);
                                formData.setValue(
                                  "sourcePath",
                                  media.sourcePath
                                );
                              }}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="请选择媒体源" />
                              </SelectTrigger>
                              <SelectContent className="z-9999">
                                {formData
                                  .getValues("children")
                                  .map((media: any) => (
                                    <SelectItem key={media.id} value={media.id}>
                                      {media.chineseTitle || media.englishTitle}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-full flex gap-[4vmin]">
                    <TypeField formData={formData} field={"type"}></TypeField>
                    <CategoryField
                      formData={formData}
                      field={"category"}
                    ></CategoryField>
                    <TagField formData={formData} field={"tag"}></TagField>
                  </div>
                  <div className="w-full flex gap-[4vmin]">
                    <EnglishTitleField
                      formData={formData}
                      field={"englishField"}
                    ></EnglishTitleField>
                    <ChineseTitleField
                      formData={formData}
                      field={"chineseField"}
                    ></ChineseTitleField>
                  </div>
                  <div className="w-full flex gap-[4vmin]">
                    <DateField formData={formData} field={"date"}></DateField>
                    <LocationField
                      formData={formData}
                      field={"location"}
                    ></LocationField>
                  </div>
                  <div className="w-full flex gap-[4vmin]">
                    <IntroduceField
                      formData={formData}
                      field={"introduce"}
                    ></IntroduceField>
                  </div>
                  {mediaTableJsx(formData.watch("children") as any)}
                </form>
              </Form>
            )}
          </div>
          <DialogFooter className="sm:justify-center">
            <DialogClose
              asChild
              onClick={() => {
                setMediaSelectOpen(false);
              }}
            >
              <Button variant="outline">取消</Button>
            </DialogClose>
            <Button type="submit" onClick={() => {}}>
              确认
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={mediaSelectOpen}
        onOpenChange={(value) => {
          setMediaSelectOpen(value);
          if (!value) {
            setSelectedMedias([]);
          }
        }}
      >
        <DialogContent
          className={cn(
            "w-[100dvw] max-w-[100dvw_!important] h-[100dvh] flex flex-col",
            className
          )}
        >
          <DialogHeader className="h-fit">
            <DialogTitle>挑选媒体</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <MediaLibrary
              showSelect={true}
              selectedMedias={selectedMedias}
              setSelectedMedias={setSelectedMedias}
            ></MediaLibrary>
          </div>
          <DialogFooter className="sm:justify-center">
            <DialogClose
              asChild
              onClick={() => {
                setMediaSelectOpen(false);
              }}
            >
              <Button variant="outline">取消</Button>
            </DialogClose>
            <Button
              type="submit"
              onClick={() => {
                formData.setValue(
                  "children",
                  uniqueBy(
                    [
                      ...(formData.getValues().children || []),
                      ...selectedMedias.map((media: MediaStruct) => ({
                        id: media.id,
                        type: media.type,
                        sourcePath: media.sourcePath,
                        category: "",
                        englishTitle: "",
                        chineseTitle: media.title,
                        date: media.createTime,
                        introduce: "",
                        location: "",
                        tag: media.tags[0] || "",
                      })),
                    ],
                    (obj) => obj.id
                  )
                );

                setMediaSelectOpen(false);
                setSelectedMedias([]);
              }}
            >
              确认
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
