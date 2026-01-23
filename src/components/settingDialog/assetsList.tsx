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
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import request from "@/utils/fetch";
import { CommonResponse } from "@/types/response";
import { codeMap } from "@/utils/backendStatus";
import {
  CalendarIcon,
  Delete,
  Edit,
  Plus,
  Search,
  Store,
  Trash,
  Trash2,
} from "lucide-react";
import { Button } from "../button-1";
import MediaLibrary from "../mediaLibrary";
import { success, z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm, useFormState } from "react-hook-form";
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
import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTrigger,
} from "@/components/stepper";
import { Note } from "../note";
import { Badge, BadgeDot } from "../badge-2";
import { CategoryDetail, CategoryItem } from "@/types/media";
import { OrbitalLoader } from "../orbital-loader";
import { Pagination, Popconfirm, message } from "antd";
import categoryFormSchema from "@/utils/dataStruct";
import { ResetIcon } from "@radix-ui/react-icons";
import { Field, FieldLabel } from "../ui/field";

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
            <Select
              disabled={true}
              {...field}
              onValueChange={(value) => field.onChange(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="请选择媒体类型" />
              </SelectTrigger>
              <SelectContent className="z-[9999]">
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

function TagField(props: {
  formData: any;
  field: any;
  clean?: boolean;
  tags: string[];
}) {
  const { formData, field, clean = false, tags } = props;
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
              <FormDescription>
                描述媒体的内容类型，如风景、人文等
              </FormDescription>
            </>
          )}
          <FormControl>
            <Select {...field} onValueChange={(value) => field.onChange(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="请选择媒体类型" />
              </SelectTrigger>
              <SelectContent className="z-[9999]">
                {(tags || []).map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
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
                  disabled={true}
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
  const [data, setData] = useState<CategoryDetail[]>([]);
  const [assetListloading, setAssetListLoading] = useState(false);
  const [assetDetailLoading, setAssetDetailLoading] = useState(false);
  const [addMediaOpen, setAddMediaOpen] = useState(false);
  const [mediaSelectOpen, setMediaSelectOpen] = useState(false);
  const [searchParams, _setSearchParams] = useState({
    chineseTitle: "",
  });
  const searchParamsSync = useRef({
    chineseTitle: "",
  });
  const setSearchParams = (value: any) => {
    _setSearchParams(value);
    searchParamsSync.current = value;
  };

  // 分页
  const [pageInfo, _setPageInfo] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const pageInfoSync = useRef({
    page: 1,
    limit: 10,
    total: 0,
  });
  const setPageInfo = (value: any) => {
    _setPageInfo(value);
    pageInfoSync.current = value;
  };
  const updateList = () => {
    setAssetListLoading(true);
    request("/api/category/categoryList", {
      method: "post",
      body: { page: pageInfoSync.current, filter: searchParamsSync.current },
    })
      .then((res: CommonResponse) => {
        if (res.code === codeMap.success) {
          setData(res.data.list || []);
          setPageInfo(res.data.page || { page: 1, limit: 10, total: 0 });
        }
      })
      .finally(() => {
        setAssetListLoading(false);
      });
  };
  useEffect(() => {
    updateList();
  }, [pageInfo.page, pageInfo.limit]);
  useEffect(() => {}, []);
  const formData = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    mode: "onBlur",
    defaultValues: {
      sourcePath: "",
      thumbnail: "",
      type: "",
      englishTitle: "",
      chineseTitle: "",
      date: "",
      introduce: "",
      location: "",
      tag: "",
      children: [],
      tags: [],
      mediaId: "",
    } as CategoryDetail,
  });
  function onSubmit(values: z.infer<typeof categoryFormSchema>) {
    if (values.children.length < 5) {
      return message.warning("一个资产最少包含5张图片");
    }
    setAssetDetailLoading(true);
    request(
      addAssetDialogTitle === "添加资产"
        ? "/api/category/add"
        : "/api/category/edit",
      {
        method: "post",
        body: values,
      }
    )
      .then((res) => {
        if (res.code === codeMap.success) {
          message.success(res.msg);
          setAddMediaOpen(false);
          formData.reset();
          setCurrentStep(1);
          updateList();
        }
      })
      .finally(() => {
        setAssetDetailLoading(false);
      });
  }
  const [selectedMediaIds, setSelectedMediaIds] = useState<any>([]);
  const [addAssetDialogTitle, setAddAssetDialogTitle] =
    useState<string>("添加资产");

  const mediaTableJsx = (data: z.infer<typeof categoryFormSchema>[]) => (
    <Table className="flex-1">
      <TableHeader>
        <TableRow>
          <TableHead>状态</TableHead>
          <TableHead>缩略图</TableHead>
          <TableHead>中文标题</TableHead>
          <TableHead>英文标题</TableHead>
          <TableHead>媒体类型</TableHead>
          <TableHead>媒体标签</TableHead>
          <TableHead>拍摄日期</TableHead>
          <TableHead>拍摄位置</TableHead>
          <TableHead>媒体介绍</TableHead>
          <TableHead>操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item: CategoryItem, index) => {
          const coverId = formData.watch("mediaId");
          const info = formData.watch("children")[index];
          return (
            <TableRow key={item.mediaId}>
              <TableCell>
                {coverId === info.mediaId ? (
                  <Badge appearance="light" variant="success">
                    <BadgeDot /> 封面
                  </Badge>
                ) : (
                  <Badge appearance="light">
                    <BadgeDot /> 内容
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="w-20 h-20 overflow-hidden rounded-xl">
                  <img
                    src={
                      info.type === "video" ? info.thumbnail : info.sourcePath
                    }
                    className="w-full h-full object-cover"
                  ></img>
                </div>
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
                <TagField
                  formData={formData}
                  field={`children[${index}].tag`}
                  clean={true}
                  tags={formData.watch("children")[index].tags}
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
                    setSelectedMediaIds(
                      selectedMediaIds.filter(
                        (id: any) =>
                          id === formData.getValues("children")[index].mediaId
                      )
                    );
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
          );
        })}
      </TableBody>
    </Table>
  );

  const [steps, setSteps] = useState([1, 2, 3]);
  const [currentStep, setCurrentStep] = useState(1);
  const { isValid } = useFormState({
    control: formData.control,
  });

  const handleAddAsset = () => {
    setAddAssetDialogTitle("添加资产");
    setAddMediaOpen(true);
    formData.reset();
  };

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
            {assetListloading && (
              <div className="fixed inset-0 top-0 z-[99999] [--foreground:white] bg-black/40 flex justify-center items-center">
                <OrbitalLoader />
              </div>
            )}
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
                  <Button variant="outline" size="sm" onClick={handleAddAsset}>
                    <Plus></Plus>
                    添加资产
                  </Button>
                </EmptyContent>
              </Empty>
            ) : (
              <>
                <div className="flex gap-[4vmin]">
                  <Button onClick={handleAddAsset}>
                    <Plus></Plus>添加资产
                  </Button>

                  <Field orientation="horizontal">
                    <FieldLabel
                      htmlFor="chineseTitleSearch"
                      className="whitespace-nowrap"
                    >
                      中文名称
                    </FieldLabel>
                    <Input
                      id="chineseTitleSearch"
                      placeholder="请输入中文标题进行模糊搜索"
                      value={searchParams.chineseTitle}
                      onChange={(e) =>
                        setSearchParams({
                          ...searchParams,
                          chineseTitle: e.target.value,
                        })
                      }
                      onKeyUp={(e) => {
                        if (e.code === "Enter") {
                          setPageInfo({ page: 1, limit: 10, total: 0 });
                          updateList();
                        }
                      }}
                    ></Input>
                    <Button
                      variant={"secondary"}
                      onClick={() => {
                        setPageInfo({ page: 1, limit: 10, total: 0 });
                        setSearchParams({ chineseTitle: "" });
                        updateList();
                      }}
                    >
                      <ResetIcon></ResetIcon>重置
                    </Button>
                    <Button
                      onClick={() => {
                        setPageInfo({ page: 1, limit: 10, total: 0 });
                        updateList();
                      }}
                    >
                      <Search></Search>查询
                    </Button>
                  </Field>
                </div>
                <Table className="flex-1">
                  <TableHeader>
                    <TableRow>
                      <TableHead>缩略图</TableHead>
                      <TableHead>中文名称</TableHead>
                      <TableHead>英文名称</TableHead>
                      <TableHead>拍摄日期</TableHead>
                      <TableHead>拍摄位置</TableHead>
                      <TableHead>内容标签</TableHead>
                      <TableHead>内容介绍</TableHead>
                      <TableHead className="text-center">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((info: CategoryDetail) => (
                      <TableRow key={info.id}>
                        <TableCell className="w-30">
                          <div className="w-20 h-20 overflow-hidden rounded-xl">
                            <img
                              src={
                                info.type === "video"
                                  ? info.thumbnail
                                  : info.sourcePath
                              }
                              className="w-full h-full object-cover"
                            ></img>
                          </div>
                        </TableCell>
                        <TableCell>{info.chineseTitle}</TableCell>
                        <TableCell>{info.englishTitle}</TableCell>
                        <TableCell>
                          {dayjs(info.date).format("YYYY-MM-DD")}
                        </TableCell>
                        <TableCell>{info.location}</TableCell>
                        <TableCell>{info.tag}</TableCell>
                        <TableCell
                          className="max-w-64 truncate"
                          title={info.introduce}
                        >
                          {info.introduce}
                        </TableCell>
                        <TableCell className="w-32">
                          <div className="w-full h-full flex justify-center items-center gap-[2vmin]">
                            <Button
                              className="w-8 h-8 rounded-full"
                              onClick={() => {
                                setAddAssetDialogTitle("修改资产");
                                setAddMediaOpen(true);
                                setCurrentStep(2);
                                formData.reset();
                                setAssetDetailLoading(true);
                                request("/api/category/categoryDetail", {
                                  method: "post",
                                  body: { id: info.id },
                                })
                                  .then((res: CommonResponse) => {
                                    if (res.code === codeMap.success) {
                                      const data = res.data as CategoryDetail;
                                      formData.setValue(
                                        "children",
                                        data.children as any
                                      );
                                      formData.setValue(
                                        "chineseTitle",
                                        data.chineseTitle
                                      );
                                      formData.setValue(
                                        "englishTitle",
                                        data.englishTitle
                                      );
                                      formData.setValue("date", data.date);
                                      formData.setValue(
                                        "location",
                                        data.location
                                      );
                                      formData.setValue(
                                        "mediaId",
                                        data.mediaId
                                      );
                                      formData.setValue(
                                        "introduce",
                                        data.introduce
                                      );
                                      formData.setValue(
                                        "sourcePath",
                                        data.sourcePath
                                      );
                                      formData.setValue("tag", data.tag);
                                      formData.setValue("type", data.type);
                                      formData.setValue(
                                        "thumbnail",
                                        data.thumbnail || ""
                                      );
                                      formData.setValue(
                                        "tags",
                                        data.tags || []
                                      );
                                      formData.setValue("id", data.id);
                                      setSelectedMediaIds(
                                        data.children.map(
                                          (item) => item.mediaId
                                        )
                                      );
                                    }
                                  })
                                  .finally(() => {
                                    setAssetDetailLoading(false);
                                  });
                              }}
                            >
                              <Edit></Edit>
                            </Button>
                            <Popconfirm
                              placement="topLeft"
                              title={"删除资产"}
                              description={"您确定要删除该资产吗?"}
                              okText="是"
                              cancelText="否"
                              getPopupContainer={(triggerNode) =>
                                triggerNode.parentElement!
                              }
                              onConfirm={() => {
                                request("/api/category/delete", {
                                  method: "post",
                                  body: { ids: [info.id] },
                                }).then((res) => {
                                  if (res.code === codeMap.success) {
                                    message.success("删除成功");
                                    updateList();
                                  }
                                });
                              }}
                            >
                              <Button
                                className="w-8 h-8 rounded-full"
                                variant={"destructive"}
                              >
                                <Trash2></Trash2>
                              </Button>
                            </Popconfirm>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Pagination
                  className="justify-center"
                  showSizeChanger
                  defaultCurrent={pageInfo.page}
                  onChange={(page, limit) => {
                    setPageInfo({ ...pageInfo, page, limit });
                  }}
                  total={pageInfo.total}
                  pageSize={pageInfo.limit}
                />
              </>
            )}
          </DialogContent>
        </form>
      </Dialog>
      <Dialog open={addMediaOpen} onOpenChange={setAddMediaOpen}>
        <DialogContent
          className={cn(
            "w-[80dvw] max-w-[80dvw_!important] h-[80dvh] flex flex-col",
            className
          )}
        >
          {assetDetailLoading && (
            <div className="fixed inset-0 top-0 z-[99999] [--foreground:white] bg-black/40 flex justify-center items-center">
              <OrbitalLoader />
            </div>
          )}
          <DialogHeader className="h-fit">
            <DialogTitle>{addAssetDialogTitle}</DialogTitle>
          </DialogHeader>
          <Stepper
            value={currentStep}
            onValueChange={(value) => {
              setCurrentStep(value);
              if (value === 3) {
                formData.trigger();
              }
            }}
            className="space-y-8 h-full flex flex-col overflow-hidden"
          >
            <StepperNav>
              {steps.map((step) => (
                <StepperItem key={step} step={step}>
                  <StepperTrigger>
                    <StepperIndicator className="data-[state=completed]:bg-green-500 data-[state=completed]:text-white data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:text-gray-500">
                      {step}
                    </StepperIndicator>
                  </StepperTrigger>
                  {steps.length > step && (
                    <StepperSeparator className="group-data-[state=completed]/step:bg-green-500" />
                  )}
                </StepperItem>
              ))}
            </StepperNav>

            <StepperPanel className="text-sm flex-1 overflow-hidden">
              {steps.map((step) => (
                <StepperContent
                  className="w-full h-full flex items-center justify-center "
                  key={step}
                  value={step}
                >
                  {step === 1 && (
                    <div className="w-full h-full overflow-hidden">
                      <MediaLibrary
                        showSelect={true}
                        selectedMediaIds={selectedMediaIds}
                        setSelectedMedias={(medias) => {
                          setSelectedMediaIds(medias.map((media) => media.id));
                          formData.setValue(
                            "children",
                            uniqueBy(
                              [
                                ...(formData.getValues().children || []),
                                ...medias.map(
                                  (media: MediaStruct) =>
                                    ({
                                      mediaId: media.id,
                                      type: media.type,
                                      sourcePath: media.sourcePath,
                                      thumbnail: media.thumbnail,
                                      category: "",
                                      englishTitle: "",
                                      chineseTitle: media.title,
                                      date: media.createTime,
                                      introduce: "",
                                      location: "",
                                      tag: media.tags[0] || "",
                                      tags: media.tags,
                                    } as CategoryItem)
                                ),
                              ],
                              (obj) => obj.mediaId
                            )
                          );
                        }}
                      ></MediaLibrary>
                    </div>
                  )}
                  {step === 2 && (
                    <div className="w-full h-full px-2 overflow-auto">
                      {!formData.watch().children ||
                      formData.watch().children.length === 0 ? (
                        <Empty className="border border-dashed h-full">
                          <EmptyHeader>
                            <EmptyMedia variant="icon">
                              <Store />
                            </EmptyMedia>
                            <EmptyTitle className="text-foreground">
                              媒体为空
                            </EmptyTitle>
                            <EmptyDescription>
                              选择媒体以便添加资产
                            </EmptyDescription>
                          </EmptyHeader>
                          <EmptyContent>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentStep(1)}
                            >
                              挑选媒体
                            </Button>
                          </EmptyContent>
                        </Empty>
                      ) : (
                        <Form {...formData}>
                          <form className="space-y-8 h-fit">
                            <div className="w-full flex gap-[4vmin]">
                              <FormField
                                control={formData.control}
                                name="mediaId"
                                render={({ field }) => (
                                  <FormItem className={"flex-1"}>
                                    <FormLabel>媒体源</FormLabel>
                                    <FormDescription>
                                      用于作为封面
                                    </FormDescription>
                                    <FormControl>
                                      <Select
                                        value={field.value as any}
                                        onValueChange={(value) => {
                                          const media = formData
                                            .getValues("children")
                                            .find(
                                              (media) => media.mediaId === value
                                            );
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
                                          formData.setValue(
                                            "mediaId",
                                            media.mediaId
                                          );
                                          formData.setValue(
                                            "introduce",
                                            media.introduce
                                          );
                                          formData.setValue(
                                            "location",
                                            media.location
                                          );
                                          formData.setValue("tag", media.tag);
                                          formData.setValue("type", media.type);
                                          formData.setValue(
                                            "sourcePath",
                                            media.sourcePath
                                          );
                                          formData.setValue(
                                            "thumbnail",
                                            media.thumbnail
                                          );
                                          formData.setValue(
                                            "tags",
                                            media.tags || []
                                          );
                                        }}
                                      >
                                        <SelectTrigger className="w-full">
                                          <SelectValue placeholder="请选择媒体源" />
                                        </SelectTrigger>
                                        <SelectContent className="z-[9999]">
                                          {formData
                                            .getValues("children")
                                            .map((media: any) => (
                                              <SelectItem
                                                key={media.mediaId}
                                                value={media.mediaId}
                                              >
                                                {media.chineseTitle ||
                                                  media.englishTitle}
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
                              <TypeField
                                formData={formData}
                                field={"type"}
                              ></TypeField>
                              <TagField
                                formData={formData}
                                field={"tag"}
                                tags={formData.watch("tags")}
                              ></TagField>
                            </div>
                            <div className="w-full flex gap-[4vmin]">
                              <EnglishTitleField
                                formData={formData}
                                field={"englishTitle"}
                              ></EnglishTitleField>
                              <ChineseTitleField
                                formData={formData}
                                field={"chineseTitle"}
                              ></ChineseTitleField>
                            </div>
                            <div className="w-full flex gap-[4vmin]">
                              <DateField
                                formData={formData}
                                field={"date"}
                              ></DateField>
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
                  )}
                  {step === 3 && (
                    <div className="w-full h-full flex flex-col gap-[4vmin] items-center justify-center">
                      <div className="flex flex-col gap-[2vmin]">
                        <Note
                          action={<></>}
                          disabled
                          fill
                          type={isValid ? "success" : "warning"}
                        >
                          {isValid
                            ? "恭喜您完成填写🎉🎉🎉"
                            : "您似乎还有参数没有按要求填写o~"}
                        </Note>
                      </div>
                      <Button
                        className="w-32"
                        disabled={!isValid}
                        onClick={formData.handleSubmit(onSubmit)}
                      >
                        {addAssetDialogTitle === "添加资产" ? (
                          <>
                            <Plus></Plus> 添加资产
                          </>
                        ) : (
                          <>
                            <Edit></Edit>提交修改
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </StepperContent>
              ))}
            </StepperPanel>
          </Stepper>
        </DialogContent>
      </Dialog>
    </>
  );
}
