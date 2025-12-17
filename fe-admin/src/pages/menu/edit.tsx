import { Edit, getValueFromEvent, useForm, useSelect } from "@refinedev/antd";

import { Form, Image, Input, Select, Upload, UploadFile } from "antd";

import type { ICategory } from "../../interfaces";
import { useApiUrl, useParsed } from "@refinedev/core";
import { FileType, getBase64 } from "../../components/appImageWithLink";
import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { axiosInstance } from "../../utils/axios";
import { generateFileWithTimeStamp } from "../../utils/helper";

export const MenuEdit = () => {
  const { id } = useParsed();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [souldUpdate, setShouldUpdate] = useState(false);
  
  const {
    formProps,
    saveButtonProps,
    query: queryResult,
  } = useForm<ICategory>({
    resource: "menus",
    action: "edit",
    id,
  });

  const data = queryResult?.data?.data;
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
  return (
    <Edit saveButtonProps={saveButtonProps}>
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
            beforeUpload={async (file) => {
              const fileWithTimestamp = generateFileWithTimeStamp(file);
              const currentThumbnail = formProps.form?.getFieldValue("icon");
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
            headers={{
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            }}
            maxCount={1}
            listType="picture-card"
            onPreview={handlePreview}
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
                afterOpenChange: (visible) => !visible && setPreviewImage(""),
              }}
              src={previewImage || apiUrl + data?.icon}
            />
          )}
        </Form.Item>
        <Form.Item label="Slug" name="slug">
          <Input />
        </Form.Item>
      </Form>
    </Edit>
  );
};
