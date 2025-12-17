import {
  nanoid,
  ProCard,
  ProForm,
  ProFormGroup,
  ProFormList,
  ProFormText,
} from "@ant-design/pro-components";
import {
  Upload,
  Button,
  Image,
  Flex,
  GetProp,
  UploadFile,
  Input,
  Typography,
} from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { UploadProps } from "antd/lib";
import { useApiUrl } from "@refinedev/core";
import { axiosInstance } from "../../utils/axios";
import { generateFileWithTimeStamp } from "../../utils/helper";

export type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
export const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const AppImageWithLink = ({
  value = "[]",
  onChange,
}: {
  value?: string;
  onChange?: (value: string) => void;
}) => {
  // Chuyển đổi value từ JSON string sang object
  const apiUrl = useApiUrl();
  axiosInstance.defaults.baseURL = apiUrl;
  const [data, setData] = useState(() => {
    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  });

  const [currentFileName, setCurrentFileName] = useState(`slider${nanoid()}.jpg`);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  // Cập nhật `data` khi `value` thay đổi
  useEffect(() => {
    try {
      setData(JSON.parse(value));
    } catch {
      setData([]);
    }
  }, [value]);

  // Xử lý thay đổi và truyền dữ liệu ra ngoài
  const handleChange = (newData: any) => {
    setData(newData); // Cập nhật state
    onChange?.(JSON.stringify(newData)); // Gọi callback với dữ liệu mới
  };

  // Hàm xử lý khi upload hình ảnh
  const handleUploadChange = (file: any, index: number) => {
    const fileUrl = URL.createObjectURL(file); // Lấy URL tạm thời của ảnh
    const updatedData = [...data];
    updatedData[index] = { ...updatedData[index], image: fileUrl }; // Cập nhật URL vào dữ liệu
    handleChange(updatedData); // Cập nhật state và gọi callback
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  //   const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
  //     setFileList(newFileList);

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
  return (
    <ProCard title="" bordered>
      <ProForm
        submitter={false} // Ẩn nút submit
      >
        <ProFormList
          name="imageWithLink"
          initialValue={data}
          creatorButtonProps={{ position: "bottom" }} // Thêm nút tạo mới ở dưới
          //hiển thị ngang
          onAfterRemove={async (index) => {
            let a = data;
            try {
              await axiosInstance.delete(a[index as number].image);
            } catch (error) {}
            a.splice(index, 1);
            handleChange(a);
          }}
        >
          {(field, index) => (
            <>
              {/* Upload và Preview */}
              <ProFormGroup
                key="group"
                align="center"
                style={{ marginBottom: 10, justifyContent: "center" }}
              >
                <Flex align="center" gap={10} justify="space-between">
                  {data[index]?.image && data[index]?.image }
                  <Upload
                    accept="image/*"
                    action={()=>`${apiUrl}/files/upload?filename=${encodeURIComponent(
                      currentFileName// Tên file mặc định
                    )}`}
                    headers={{
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    }}
                    maxCount={1} // Chỉ cho phép upload 1 ảnh
                    listType="picture-card"
                    beforeUpload={(file) => {
                      const fileWithTimestamp = generateFileWithTimeStamp(file);
                      setCurrentFileName(fileWithTimestamp.newFileName);
                      handleUploadChange(fileWithTimestamp.newFile, index);
                      return fileWithTimestamp.newFile;
                    }}
                    onPreview={handlePreview}
                    onChange={(info) => {
                      let a = data;
                      a[index].image = info.file.response;
                      handleChange(a);
                    }}
                    defaultFileList={
                      data[index]?.image
                        ? [
                            {
                              uid: "-1", // Đặt uid cho file đã tải lên
                              name:
                                data[index].image.split("/").pop() ||
                                "thumbnail.jpg",
                              status: "done",
                              url: apiUrl + data[index].image, // Đặt URL của ảnh
                            },
                          ]
                        : []
                    }
                    onRemove={async (file) => {
                      let a = data;
                      a[index].image = null;
                      handleChange(a);
                      try {
                        await axiosInstance.delete(file.response);
                      } catch (error) {
                        console.log(error);
                      }
                    }}
                  >
                    {data[index]?.image == null && uploadButton}
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
                      src={previewImage}
                    />
                  )}
                </Flex>
                <div>
                  <Typography.Text type="secondary">link</Typography.Text>
                  <Input
                    name="link"
                    placeholder="Nhập liên kết"
                    style={{ flex: 1 }}
                    onChange={(e) => {
                      let a = data;
                      a[index].link = e.target.value;
                      handleChange(a);
                    }}
                    width={700}
                    defaultValue={data[index]?.link}
                  />
                </div>
              </ProFormGroup>
            </>
          )}
        </ProFormList>
      </ProForm>
    </ProCard>
  );
};

export default AppImageWithLink;
