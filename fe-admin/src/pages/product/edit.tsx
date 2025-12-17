import React from "react";
import { Edit, useForm, useSelect } from "@refinedev/antd";
import { Flex, Form, Input, Rate, Select, Switch, Upload } from "antd";
import type { ICategory, IProduct } from "../../interfaces";

import { useApiUrl } from "@refinedev/core";
import ProductPackage from "./productPackage";
import TextArea from "antd/es/input/TextArea";
import AppQuill from "../../components/appQuill";
import { TypeProduct } from "../../interfaces/enum";
import { axiosInstance } from "../../utils/axios";
import { generateFileWithTimeStamp } from "../../utils/helper";
import BaseSEOForm from "../../components/baseSEOForm";

export const ProductEdit = () => {
  const {
    formProps,
    formLoading,
    saveButtonProps,
    query: queryResult,
  } = useForm<IProduct>({
    action: "edit",
  });

  const postData = queryResult?.data?.data;

  const { selectProps: categorySelectProps } = useSelect<ICategory>({
    resource: "categories", // Chỉ định resource là categories
    optionLabel: "name", // Hiển thị name trong Select
    optionValue: "id",
    defaultValue: postData?.categories?.map((categoryId: string) => ({
      id: categoryId,
    })),
  });
  const apiUrl = useApiUrl();
  axiosInstance.defaults.baseURL = apiUrl;
  return (
    <Edit isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Form
        {...formProps}
        layout="vertical"
        initialValues={{
          ...postData,
          // Cập nhật lại giá trị default của categories với các id từ postData
          categories: postData?.categories?.map(
            (category: ICategory) => category.id
          ),
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

          <Form.Item
            label="Còn hàng"
            name="Stock"
            initialValue={true}
            layout="horizontal"
          >
            <Switch checkedChildren="Còn hàng" unCheckedChildren="Hết hàng" />
          </Form.Item>
          <Form.Item
            label="Thanh toán trước"
            name="isPaymentBefore"
            initialValue={true}
            layout="horizontal"
          >
            <Switch
              checkedChildren="Thanh toán trước"
              unCheckedChildren="Thanh toán sau"
            />
          </Form.Item>
          <Form.Item
            label="Rate"
            name="star"
            initialValue={true}
            layout="horizontal"
          >
            <Rate />
          </Form.Item>
        </Flex>
        <BaseSEOForm />

        <Flex justify="space-between" gap={20}>
          <Form.Item
            label="Tiêu đề"
            name="name"
            style={{ width: "50%" }}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            style={{ width: "50%" }}
            label="slug"
            name="slug"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input disabled />
          </Form.Item>
        </Flex>

        <Form.Item
          label="thumbnail"
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
          label="Sản phẩm"
          name="productPackage"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <ProductPackage
            values={postData?.productPackage}
            onChange={(value) => {
              formProps.form?.setFieldValue(
                "productPackage",
                JSON.stringify(value)
              );
            }}
          />
        </Form.Item>

        <Form.Item
          hidden
          label="price"
          name="price"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input value={100} disabled />
        </Form.Item>
        <Form.Item
          label="Danh mục"
          name="categoryIds"
          rules={[
            {
              required: true,
              message: "Please select at least one category",
            },
          ]}
        >
          <Select
            {...categorySelectProps}
            mode="multiple" // Cho phép chọn nhiều giá trị
            // Khi chọn, sẽ trả về đối tượng đầy đủ của category
          />
        </Form.Item>
        <Form.Item label="Loại Tài Khoản" name="typeProduct">
          <Select
            options={[
              { value: null, label: "" },
              { value: TypeProduct.AVAILABLE, label: "Tạo Sẵn" },
              { value: TypeProduct.OWNER, label: "Chính Chủ " },
              {
                value: TypeProduct.ONLYGMAIL,
                label: "Chính Chủ (chỉ cần gmail)",
              },
            ]}
          />
        </Form.Item>
        <Form.Item label="Nhãn Dán" name="tickTag">
          <Input />
        </Form.Item>
        <Form.Item
          label="Thông tin chi tiết"
          name="detailInfomation"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <AppQuill />
        </Form.Item>
      </Form>
    </Edit>
  );
};
