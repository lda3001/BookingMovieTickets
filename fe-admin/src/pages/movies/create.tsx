import { Create, useForm, getValueFromEvent } from "@refinedev/antd";
import { Flex, Form, Input, Switch, Upload, DatePicker, InputNumber } from "antd";
import type { IMovie } from "../../interfaces";
import { useApiUrl } from "@refinedev/core";
import TextArea from "antd/es/input/TextArea";
import AppQuill from "../../components/appQuill";
import { axiosInstance } from "../../utils/axios";
import { generateFileWithTimeStamp } from "../../utils/helper";
import dayjs from "dayjs";

export const MovieCreate = () => {
  const { formProps, formLoading, saveButtonProps } = useForm<IMovie>({
    action: "create",
  });

  const apiUrl = useApiUrl();
  axiosInstance.defaults.baseURL = apiUrl;

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Form
        {...formProps}
        layout="vertical"
        initialValues={{
          isActive: true,
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
          <Input placeholder="Nhập tiêu đề phim" />
        </Form.Item>

        <Form.Item
          label="Slug"
          name="slug"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập slug",
            },
          ]}
        >
          <Input placeholder="slug-phim" />
        </Form.Item>

        <Form.Item
          label="Ảnh poster"
          name="image"
          valuePropName="image"
          getValueFromEvent={getValueFromEvent}
          rules={[
            {
              required: true,
              message: "Vui lòng upload ảnh poster",
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
            beforeUpload={async (file) => {
              const fileWithTimestamp = generateFileWithTimeStamp(file);
              formProps.form?.setFieldsValue({
                image: fileWithTimestamp.newFileName,
              });
              return fileWithTimestamp.newFile;
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
            <Input placeholder="VD: 120 phút" />
          </Form.Item>
          <Form.Item label="Đánh giá" name="rating" style={{ flex: 1 }}>
            <Input placeholder="VD: PG-13" />
          </Form.Item>
          <Form.Item label="Ngày phát hành" name="releaseDate" style={{ flex: 1 }}>
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>
        </Flex>

        <Flex gap={20}>
          <Form.Item label="Quốc gia" name="country" style={{ flex: 1 }}>
            <Input placeholder="VD: Việt Nam" />
          </Form.Item>
          <Form.Item label="Đạo diễn" name="director" style={{ flex: 1 }}>
            <Input placeholder="Tên đạo diễn" />
          </Form.Item>
        </Flex>

        <Form.Item label="Nhà sản xuất" name="producer">
          <Input placeholder="Tên nhà sản xuất" />
        </Form.Item>

        <Form.Item label="Thể loại" name="genre">
          <Input placeholder="VD: Hành động, Kịch tính, Tình cảm" />
        </Form.Item>

        <Form.Item label="Diễn viên" name="cast">
          <Input placeholder="Danh sách diễn viên" />
        </Form.Item>

        <Form.Item label="Tagline" name="tagline">
          <Input placeholder="Câu tagline của phim" />
        </Form.Item>

        <Form.Item label="Phụ đề" name="subtitle">
          <Input placeholder="VD: Phụ đề Việt, Lồng tiếng" />
        </Form.Item>

        <Form.Item label="Trailer URL" name="trailerUrl">
          <Input placeholder="URL video trailer" />
        </Form.Item>

        <Form.Item label="Mô tả ngắn" name="description">
          <TextArea rows={4} placeholder="Mô tả ngắn về phim" />
        </Form.Item>

        <Form.Item label="Nội dung chi tiết" name="content">
          <AppQuill />
        </Form.Item>
      </Form>
    </Create>
  );
};

