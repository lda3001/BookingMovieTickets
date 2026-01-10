import React from "react";
import { Edit, useForm, getValueFromEvent } from "@refinedev/antd";
import { Flex, Form, Input, Switch, Upload, DatePicker } from "antd";
import type { IMovie } from "../../interfaces";
import { useApiUrl } from "@refinedev/core";
import TextArea from "antd/es/input/TextArea";
import AppQuill from "../../components/appQuill";
import { axiosInstance } from "../../utils/axios";
import { generateFileWithTimeStamp } from "../../utils/helper";
import dayjs from "../../utils/dayjs";

export const MovieEdit = () => {
  const {
    formProps,
    formLoading,
    saveButtonProps,
    query: queryResult,
  } = useForm<IMovie>({
    action: "edit",
    transform: (values: any) => {
      return {
        slug: values.slug,
        title: values.title,
        image: values.image,
        duration: values.duration,
        rating: values.rating,
        releaseDate: values.releaseDate ? dayjs(values.releaseDate).format("DD/MM/YYYY") : undefined,
        country: values.country,
        producer: values.producer,
        genre: values.genre,
        director: values.director,
        cast: values.cast,
        tagline: values.tagline,
        subtitle: values.subtitle,
        trailerUrl: values.trailerUrl,
        content: values.content,
        description: values.description,
        isActive: values.isActive,
      };
    },
  });

  const postData = queryResult?.data?.data;
  const apiUrl = useApiUrl();
  axiosInstance.defaults.baseURL = apiUrl;

  return (
    <Edit isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Form
        {...formProps}
        layout="vertical"
        initialValues={{
          ...postData,
          releaseDate: postData?.releaseDate ? dayjs(postData.releaseDate, "DD/MM/YYYY", true) : undefined,
        }}
      >
        <Flex gap={20} justify="right">
          <Form.Item
            label="Trạng thái"
            name="isActive"
            initialValue={true}
            layout="horizontal"
          >
            <Switch checkedChildren="Hoạt động" unCheckedChildren="Không hoạt động" />
          </Form.Item>
        </Flex>

        <Form.Item
          label="Tiêu đề"
          name="title"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tiêu đề phim",
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
          <Input disabled />
        </Form.Item>

        <Form.Item
          label="Ảnh poster"
          name="image"
          valuePropName="image"
          getValueFromEvent={getValueFromEvent}
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
                formProps.form?.getFieldValue("image") || ""
              )}`;
            }}
            headers={{
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            }}
            listType="picture"
            defaultFileList={
              postData?.image
                ? [
                    {
                      uid: "-1",
                      name: postData.image.split("/").pop() || "image.jpg",
                      status: "done",
                      url: postData.image.startsWith("http") ? postData.image : apiUrl + postData.image,
                    },
                  ]
                : []
            }
            beforeUpload={async (file) => {
              const fileWithTimestamp = generateFileWithTimeStamp(file);
              const currentImage = formProps.form?.getFieldValue("image");
              if (currentImage) {
                try {
                  await axiosInstance.delete(currentImage);
                } catch (error) {
                  console.log("Error deleting old file:", error);
                }
              }
              formProps.form?.setFieldsValue({
                image: fileWithTimestamp.newFileName,
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
                  image: file,
                });
              }
            }}
          >
            <p className="ant-upload-text">Kéo thả file vào đây hoặc click để chọn</p>
          </Upload.Dragger>
        </Form.Item>

        <Flex gap={20}>
          <Form.Item label="Thời lượng" name="duration" style={{ flex: 1 }}>
            <Input />
          </Form.Item>
          <Form.Item label="Đánh giá" name="rating" style={{ flex: 1 }}>
            <Input />
          </Form.Item>
          <Form.Item label="Ngày phát hành" name="releaseDate" style={{ flex: 1 }}>
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>
        </Flex>

        <Flex gap={20}>
          <Form.Item label="Quốc gia" name="country" style={{ flex: 1 }}>
            <Input />
          </Form.Item>
          <Form.Item label="Đạo diễn" name="director" style={{ flex: 1 }}>
            <Input />
          </Form.Item>
        </Flex>

        <Form.Item label="Nhà sản xuất" name="producer">
          <Input />
        </Form.Item>

        <Form.Item label="Thể loại" name="genre">
          <Input />
        </Form.Item>

        <Form.Item label="Diễn viên" name="cast">
          <Input />
        </Form.Item>

        <Form.Item label="Tagline" name="tagline">
          <Input />
        </Form.Item>

        <Form.Item label="Phụ đề" name="subtitle">
          <Input />
        </Form.Item>

        <Form.Item label="Trailer URL" name="trailerUrl">
          <Input />
        </Form.Item>

        <Form.Item label="Mô tả ngắn" name="description">
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item label="Nội dung chi tiết" name="content">
          <AppQuill />
        </Form.Item>
      </Form>
    </Edit>
  );
};

