import { Create, getValueFromEvent, useForm, useSelect } from "@refinedev/antd";
import { Flex, Form, Input, Select, Switch, Upload } from "antd";
import type { ICategoryPost, IPost } from "../../interfaces";
import { useApiUrl } from "@refinedev/core";

import ReactQuill from "react-quill";
import AppQuill from "../../components/appQuill";
import { axiosInstance } from "../../utils/axios";
import { generateFileWithTimeStamp } from "../../utils/helper";
import TextArea from "antd/es/input/TextArea";
import BaseSEOForm from "../../components/baseSEOForm";

export const PostCreate = () => {
  const { formProps, formLoading, saveButtonProps } = useForm<IPost>({
    action: "create", // Thực hiện thao tác create
    resource: "posts",
    // dùng form data để gửi dữ liệu lên server
  });

  // Sử dụng useSelect để lấy danh sách các category
  const { selectProps: categorypostSelectProps } = useSelect<ICategoryPost>({
    resource: "categoryposts", // Chỉ định resource là categories
    optionLabel: "name", // Hiển thị name trong Select
    optionValue: "id", // Sử dụng id cho giá trị của Select
  });
  const apiUrl = useApiUrl();
  axiosInstance.defaults.baseURL = apiUrl;

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Form
        {...formProps}
        layout="vertical"
        initialValues={{
          categories: [],
          star: 5, // Default là mảng trống vì đây là create
        }}
      >
        <Flex gap={20} justify="right">
          <Form.Item
            label="Trạng thái"
            name="isActive"
            initialValue={true}
            layout="horizontal"
          >
            <Switch checkedChildren="Public" unCheckedChildren="Draft" />
          </Form.Item>
        </Flex>
        <BaseSEOForm />
        <Form.Item
          label="Tiêu đề"
          name="title"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Danh mục"
          name="categoryPostIds" // Sửa lại cho đúng với tên trong useSelect
          rules={[
            {
              required: true,
              message: "Please select at one category",
            },
          ]}
        >
          <Select
            {...categorypostSelectProps}
            // Cho phép chọn nhiều giá trị
            // Khi chọn, sẽ trả về các giá trị id của category
          />
        </Form.Item>
        <Form.Item label="Mô tả" name="description">
          <TextArea />
        </Form.Item>
        <Form.Item
          valuePropName="thumbnail"
          getValueFromEvent={getValueFromEvent}
          label="thumbnail"
          name="thumbnail"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Upload.Dragger
            name="file"
            maxCount={1}
            action={(file) => {
              return `${apiUrl}/files/upload?filename=${encodeURIComponent(
                formProps.form?.getFieldValue("thumbnail")
              )}`;
            }}
            headers={{
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            }}
            listType="picture"
            beforeUpload={async (file) => {
              // Kiểm tra xem có file cũ trong form hay không
              const fileWithTimestamp = generateFileWithTimeStamp(file);
              const currentThumbnail =
                formProps.form?.getFieldValue("thumbnail");

              if (currentThumbnail) {
                try {
                  // Trước khi upload hình mới, xóa hình cũ
                  await axiosInstance.delete(currentThumbnail);
                } catch (error) {
                  console.log("Error deleting old file:", error);
                  // Trả về false để ngừng quá trình upload nếu xóa không thành công
                  return false;
                }
              }

              // Nếu xóa file cũ thành công, cho phép upload file mới
              formProps.form?.setFieldsValue({
                thumbnail: fileWithTimestamp.newFileName,
              });
              return fileWithTimestamp.newFile;
            }}
            onRemove={async (file) => {
              try {
                await axiosInstance.delete(file.response);
              } catch (error) {
                console.log(error);
              }
            }}
            onChange={async (info) => {
              const file = info.file.response;
              if (file) {
                formProps.form?.setFieldsValue({
                  thumbnail: file,
                });
              }
            }}
          >
            <p className="ant-upload-text">Drag & drop a file in this area</p>
          </Upload.Dragger>
        </Form.Item>

        <Form.Item label="Mô tả" name="content">
          <AppQuill />
        </Form.Item>
      </Form>
    </Create>
  );
};
