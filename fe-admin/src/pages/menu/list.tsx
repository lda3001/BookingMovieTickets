
import {
    List,
    TextField,
    useTable,
    EditButton,
    ShowButton,
    useForm,
    Create,
    DeleteButton,
    getValueFromEvent,
  } from "@refinedev/antd";
  import {
    Space,
    Button,
    Flex,
    Modal,
    Form,
    Input,
    message,
    Image,
    Upload,
    UploadFile,
  } from "antd";
  import type { ICategory } from "../../interfaces";
  import { PlusOutlined } from "@ant-design/icons";
  import { useRef, useState } from "react";
  import { DragSortTable, ProColumns } from "@ant-design/pro-components";
  import { useApiUrl } from "@refinedev/core";
  import { FileType, getBase64 } from "../../components/appImageWithLink";
  import { axiosInstance } from "../../utils/axios";
  import { generateFileWithTimeStamp } from "../../utils/helper";
  
  const Actions = ({
    record,
    refetch,
  }: {
    record: ICategory;
    refetch: () => void;
  }) => (
    <Space>
      <EditButton hideText size="small" recordItemId={record.id} />
      <DeleteButton
        resource="menus"
        hideText
        size="small"
        recordItemId={record.id}
        onSuccess={() => refetch()} // Gọi refetch sau khi xóa thành công
      />
    </Space>
  );
  
  export const MenuList = () => {
    const columns: ProColumns<ICategory, "text">[] = [
      {
        title: "",
        dataIndex: "sort",
        width: 60,
        className: "drag-visible",
      },
      {
        title: "Tên ",
        dataIndex: "name",
        className: "drag-visible",
      },
      {
        title: "Icon ",
        dataIndex: "icon",
        render: (value) => <Image src={`${apiUrl}${value}`} width={80} />,
      },
      {
        title: "Slug",
        dataIndex: "slug",
      },
      {
        title: "Actions",
        render: (_, record: ICategory) => (
          <Actions record={record} refetch={tableQuery.refetch} />
        ),
      },
    ];
    const {
      formProps,
      saveButtonProps,
      query: queryResult,
    } = useForm<ICategory>({
      resource: "menus",
      action: "create",
      submitOnEnter: true,
      onMutationSuccess: () => {
        setShowModal(false);
        tableQuery.refetch();
        formProps?.form?.resetFields();
      },
    });
    const data = queryResult?.data?.data;
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [souldUpdate, setShouldUpdate] = useState(false);
  
    const [showModal, setShowModal] = useState(false);
    const tableRef = useRef<any>(null);
    const apiUrl = useApiUrl();
    axiosInstance.defaults.baseURL = apiUrl;
    const handlePreview = async (file: UploadFile) => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj as FileType);
      }
  
      setPreviewImage(file.url || (file.preview as string));
      setPreviewOpen(true);
    };
    const uploadButton = (
      <button style={{ border: 0, background: "none" }} type="button">
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </button>
    );
  
    
    const { tableProps, tableQuery } = useTable<ICategory>({
      resource: "menus",
      pagination: { pageSize: 10 },
    });
    
    // return JSON.stringify(tableProps);
    const handleDragSortEnd = async (
      beforeIndex: number,
      afterIndex: number,
      newDataSource: any
    ) => {
      console.log(
        "排序后的数据",
        newDataSource,
        ">>",
        beforeIndex,
        ">>",
        afterIndex,
        ">>",
        tableProps
      );
      try {
        const response = await axiosInstance.post(
          `${apiUrl}/menus/SortOrder?beforeIndex=${beforeIndex}&afterIndex=${afterIndex}`,
          {
            headers: {
              Accept: "*/*",
              "Content-Type": "application/json",
            },
          }
        );
        tableQuery.refetch();
        message.success("sắp xếp danh sách thành công");
        console.log("sort updated successfully", response.data);
      } catch (error) {
        // Xử lý lỗi ở đây
        message.error("loi");
        console.error("Error updating status:", error);
      }
    };
  
    return (
      <Space direction="vertical" style={{ width: "100%" }} size={"middle"}>
        <Modal
          open={showModal}
          onClose={() => setShowModal(false)}
          footer={null}
          onCancel={() => setShowModal(false)}
        >
          <Create saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
              <Form.Item
                label="Title"
                name="name"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Slug"
                name="slug"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Icon"
                name="icon"
                getValueFromEvent={getValueFromEvent}
              >
                <Upload
                  style={{
                    width: "100%",
                  }}
                  accept="image/*"
                  action={(file) => {
                    return `${apiUrl}/files/upload?filename=${encodeURIComponent(
                      formProps.form?.getFieldValue("icon")
                    )}`;
                  }}
                  headers={{
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  }}
                  maxCount={1}
                  listType="picture-card"
                  onPreview={handlePreview}
                  beforeUpload={async(file)=>{
                    console.log("beforeUpload", file);
                    
                    const fileWithTimestamp = generateFileWithTimeStamp(file);
                    const currentThumbnail =
                      formProps.form?.getFieldValue("icon");
                    if (currentThumbnail) {
                      try {
                        await axiosInstance.delete(currentThumbnail);
                      } catch (error) {
                        console.log("Error deleting old file:", error);
                        return false;
                      }
                    }
                    formProps.form?.setFieldsValue({
                      icon: fileWithTimestamp.newFileName,
                    });
                    return fileWithTimestamp.newFile;
                  }}
                  onChange={async (info) => {
                    const { file } = info;
  
                    if (file.status === "done" && file.response) {
                      formProps.form?.setFieldsValue({
                        icon: file.response, // Cập nhật giá trị logo từ response
                      });
                    } else if (file.status === "removed") {
                      try {
                        await axiosInstance.delete(
                          file.response ?? formProps.form?.getFieldValue("icon")
                        );
                      } catch (error) {
                        console.error("Error deleting file:", error);
                      }
                      formProps.form?.setFieldsValue({
                        icon: null, // Xóa giá trị logo nếu file bị xóa
                      });
                    }
                    setShouldUpdate(!souldUpdate);
                  }}
                  defaultFileList={
                    data?.icon
                      ? [
                          {
                            uid: "-1", // Đặt uid duy nhất
                            name: data.icon.split("/").pop() || "thumbnail.jpg",
                            status: "done",
                            url: apiUrl + data.icon, // URL của ảnh đã tải lên
                          },
                        ]
                      : []
                  }
                >
                  {!formProps.form?.getFieldValue("icon") && uploadButton}
                </Upload>
                {previewImage && (
                  <Image
                    wrapperStyle={{ display: "none" }}
                    preview={{
                      visible: previewOpen,
                      onVisibleChange: (visible) => setPreviewOpen(visible),
                      afterOpenChange: (visible) =>
                        !visible && setPreviewImage(""),
                    }}
                    src={previewImage || apiUrl + data?.icon}
                  />
                )}
              </Form.Item>
            </Form>
          </Create>
        </Modal>
        <Flex justify="end">
          <Button
            type="primary"
            onClick={() => {
              setShowModal(true);
            }}
            icon={<PlusOutlined />}
          >
            Create
          </Button>
        </Flex>
  
        <DragSortTable
          headerTitle="Menu"
          columns={columns}
          rowKey="id"
          actionRef={tableRef}
          search={false}
          pagination={false}
          loading={tableProps.loading}
          dataSource={tableProps.dataSource}
          scroll={tableProps.scroll}
          dragSortKey="sort"
          onDragSortEnd={handleDragSortEnd}
        />
      </Space>
    );
  };
  