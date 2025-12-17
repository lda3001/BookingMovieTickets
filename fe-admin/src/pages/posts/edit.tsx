import React from "react";

import { Edit, useForm, useSelect } from "@refinedev/antd";

import { Flex, Form, Input, Select, Switch, Upload } from "antd";

import type { IPost, ICategory, ICategoryPost } from "../../interfaces";
import AppQuill from "../../components/appQuill";
import { useApiUrl } from "@refinedev/core";
import { axiosInstance } from "../../utils/axios";
import { generateFileWithTimeStamp } from "../../utils/helper";
import TextArea from "antd/es/input/TextArea";
import BaseSEOForm from "../../components/baseSEOForm";

export const PostEdit = () => {
  const { formProps, saveButtonProps, query: queryResult } = useForm<IPost>();

  const postData = queryResult?.data?.data;
  const { selectProps: categorySelectProps } = useSelect<ICategoryPost>({
    resource: "categoryposts",
    optionLabel: "name", // Hiển thị name trong Select
    optionValue: "id", // Sử dụng id cho giá trị của Select
    // defaultValue: postData?.categories.id,
  });
  const apiUrl = useApiUrl();
  axiosInstance.defaults.baseURL = apiUrl;

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
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
          label="Ảnh đại diện"
          name="thumbnail"
          valuePropName="thumbnail"
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
            defaultFileList={
              postData?.thumbnail
                ? [
                    {
                      uid: "-1", // Đặt uid cho file đã tải lên
                      name:
                        postData.thumbnail.split("/").pop() || "thumbnail.jpg",
                      status: "done",
                      url: apiUrl + postData.thumbnail, // Đặt URL của ảnh
                    },
                  ]
                : []
            }
            beforeUpload={async (file) => {
              const fileWithTimestamp = generateFileWithTimeStamp(file);
              // Kiểm tra xem có file cũ trong form hay không
              const currentThumbnail =
                formProps.form?.getFieldValue("thumbnail");
              if (currentThumbnail) {
                try {
                  // Trước khi upload hình mới, xóa hình cũ
                  await axiosInstance.delete(currentThumbnail);
                } catch (error) {
                  console.log("Error deleting old file:", error);
                  // Trả về false để ngừng quá trình upload nếu xóa không thành công
                }
              }
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
        <Form.Item label="Mô tả" name="description">
          <TextArea />
        </Form.Item>
        <Form.Item
          label="Danh mục"
          name="categoryPostIds"
          rules={[
            {
              required: true,
              message: "Please select  one category",
            },
          ]}
        >
          <Select
            {...categorySelectProps}
            // Cho phép chọn nhiều giá trị
            // Khi chọn, sẽ trả về đối tượng đầy đủ của category
          />
        </Form.Item>

        <Form.Item
          label="Nội dung"
          name="content"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <AppQuill></AppQuill>
        </Form.Item>
      </Form>
    </Edit>
  );
};
