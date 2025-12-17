import { Edit, getValueFromEvent, useForm, useSelect } from "@refinedev/antd";

import { Flex, Form, Image, Input, Select, Switch, Upload } from "antd";

import type { IGlobalConfig } from "../../interfaces";
import { useApiUrl, useParsed } from "@refinedev/core";
import TextArea from "antd/es/input/TextArea";
import AppImageWithLink, {
  FileType,
  getBase64,
} from "../../components/appImageWithLink";
import { UploadFile } from "antd/lib";
import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { axiosInstance } from "../../utils/axios";
import { generateFileWithTimeStamp } from "../../utils/helper";
import BaseSEOForm from "../../components/baseSEOForm";

export const ConfigEdit = () => {
  const { id } = useParsed();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [souldUpdate, setShouldUpdate] = useState(false);
  const {
    formProps,
    saveButtonProps,
    query: queryResult,
    formLoading,
  } = useForm<IGlobalConfig>({
    resource: "global-config",
    action: "edit",
    id: "7df2600d-24d9-44fb-a5e9-49bc98633caf",
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

  useEffect(() => {
    setShouldUpdate(!souldUpdate);
  }, [data, formProps.form]);

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={formLoading}>
      <Form {...formProps} layout="vertical">
        <BaseSEOForm />
        <Flex wrap gap={25}>
          <Form.Item
            label="Logo"
            name="logo"
            getValueFromEvent={getValueFromEvent}
            shouldUpdate
          >
            <Upload
              style={{
                width: "100%",
              }}
              accept="image/*"
              action={(file) => {
                return `${apiUrl}/files/upload?filename=${encodeURIComponent(
                  formProps.form?.getFieldValue("logo")
                )}`;
              }}
              headers={{
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              }}
              maxCount={1}
              listType="picture-card"
              onPreview={handlePreview}
              beforeUpload={(file) => {
                const fileWithTimestamp = generateFileWithTimeStamp(file);
                formProps.form?.setFieldsValue({
                  logo: fileWithTimestamp.newFileName,
                });
                return fileWithTimestamp.newFile;
              }}
              onChange={async (info) => {
                const { file } = info;

                if (file.status === "done" && file.response) {
                  formProps.form?.setFieldsValue({
                    logo: file.response, // Cập nhật giá trị logo từ response
                  });
                } else if (file.status === "removed") {
                  try {
                    await axiosInstance.delete(
                      file.response ?? formProps.form?.getFieldValue("logo")
                    );
                  } catch (error) {
                    console.error("Error deleting file:", error);
                  }
                  formProps.form?.setFieldsValue({
                    logo: null, // Xóa giá trị logo nếu file bị xóa
                  });
                }
                setShouldUpdate(!souldUpdate);
              }}
              defaultFileList={
                data?.logo
                  ? [
                      {
                        uid: "-1", // Đặt uid duy nhất
                        name: data.logo.split("/").pop() || "thumbnail.jpg",
                        status: "done",
                        url: apiUrl + data.logo, // URL của ảnh đã tải lên
                      },
                    ]
                  : []
              }
            >
              {!formProps.form?.getFieldValue("logo") && uploadButton}
            </Upload>
            {previewImage && (
              <Image
                wrapperStyle={{ display: "none" }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                  afterOpenChange: (visible) => !visible && setPreviewImage(""),
                }}
                src={previewImage || apiUrl + data?.logo}
              />
            )}
          </Form.Item>
          <Form.Item
            shouldUpdate={(prev, current) =>
              prev.logoFooter !== current.logoFooter
            }
          >
            {({ getFieldValue }) => (
              <Form.Item
                label="logoFooter"
                name="logoFooter"
                getValueFromEvent={getValueFromEvent}
              >
                <Upload
                  style={{
                    width: "100%",
                  }}
                  accept="image/*"
                  action={(file) => {
                    return `${apiUrl}/files/upload?filename=${encodeURIComponent(
                      getFieldValue("logoFooter")
                    )}`;
                  }}
                  headers={{
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  }}
                  maxCount={1}
                  listType="picture-card"
                  onPreview={handlePreview}
                  beforeUpload={(file) => {
                    const fileWithTimestamp = generateFileWithTimeStamp(file);
                    formProps.form?.setFieldsValue({
                      logoFooter: fileWithTimestamp.newFileName,
                    });
                    return fileWithTimestamp.newFile;
                  }}
                  onChange={async (info) => {
                    const { file } = info;

                    if (file.status === "done" && file.response) {
                      formProps.form?.setFieldsValue({
                        logoFooter: file.response, // Cập nhật giá trị logoFooter từ response
                      });
                    } else if (file.status === "removed") {
                      try {
                        await axiosInstance.delete(
                          file.response ??
                            formProps.form?.getFieldValue("logoFooter")
                        );
                      } catch (error) {
                        console.error("Error deleting file:", error);
                      }
                      formProps.form?.setFieldsValue({
                        logoFooter: null, // Xóa giá trị logoFooter nếu file bị xóa
                      });
                    }
                  }}
                  defaultFileList={
                    data?.logoFooter
                      ? [
                          {
                            uid: "-1", // Đặt uid duy nhất
                            name:
                              data.logoFooter.split("/").pop() ||
                              "thumbnail.jpg",
                            status: "done",
                            url: apiUrl + data.logoFooter, // URL của ảnh đã tải lên
                          },
                        ]
                      : []
                  }
                >
                  {!getFieldValue("logoFooter") && uploadButton}
                </Upload>
              </Form.Item>
            )}
          </Form.Item>

          <Flex style={{ flex: 1 }} vertical>
            <Form.Item
              label="Tên Website"
              name="nameWeb"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Mô tả"
              name="description"
              rules={[{ required: true }]}
            >
              <TextArea />
            </Form.Item>
          </Flex>
        </Flex>

        <Flex wrap gap={25}>
          <Form.Item
            label="Số Điện Thoại"
            name="numberPhone"
            rules={[
              {
                required: true,
              },
            ]}
            style={{ flex: 1 ,minWidth: 200}}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Zalo"
            name="Zalo"
            rules={[
              {
                required: true,
              },
            ]}
            style={{ flex: 1 ,minWidth: 200}}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Message"
            name="Message"
            rules={[
              {
                required: true,
              },
            ]}
            style={{ flex: 1 ,minWidth: 200}}

          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="emailContact"
            rules={[
              {
                required: true,
              },
            ]}
            style={{ flex: 1 ,minWidth: 200}}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Facebook"
            name="facebookLink"
            rules={[
              {
                required: true,
              },
            ]}
            style={{ flex: 1 ,minWidth: 200}}
          >
            <Input />
          </Form.Item>
        </Flex>

        <Flex gap={25}>
          <Form.Item
            name={"telegramToken"}
            label="Telegram Token"
            rules={[
              {
                required: true,
              },
            ]}
            style={{ flex: 1 }}
          >
            <Input.Password autoComplete={"false"} />
          </Form.Item>
          <Form.Item
            name={"telegramChatId"}
            label="Telegram Chat ID"
            rules={[
              {
                required: true,
              },
            ]}
            style={{ flex: 1 }}

          >
            <Input.Password  autoComplete={"false"}/>
          </Form.Item>
        </Flex>
        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Flex wrap gap={25} style={{ width: "100%" }}>
          <Form.Item
            label="Trạng thái thông báo"
            name="isShowTopbarNotice"
            initialValue={true}
            layout="horizontal"
          >
            <Switch checkedChildren="Show" unCheckedChildren="Hide" />
          </Form.Item>
          <Form.Item
            label="Nội dung thông báo"
            name="topbarNoticeContent"
            layout="horizontal"
            style={{ flex: 1 }}
          >
            <TextArea />
          </Form.Item>
        </Flex>

        <Flex gap={25}>
          <Form.Item
            label="Banner quảng cáo"
            name="advertisement"
            getValueFromEvent={getValueFromEvent}
          >
            <Upload
              style={{
                width: "100%",
              }}
              className="customSizedUpload"
              accept="image/*"
              action={(file) => {
                return `${apiUrl}/files/upload?filename=${encodeURIComponent(
                  formProps.form?.getFieldValue("advertisement")
                )}`;
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
                    advertisement: file.response, // Cập nhật giá trị advertisement từ response
                  });
                } else if (file.status === "removed") {
                  try {
                    await axiosInstance.delete(
                      file.response ??
                        formProps.form?.getFieldValue("advertisement")
                    );
                  } catch (error) {
                    console.error("Error deleting file:", error);
                  }
                  formProps.form?.setFieldsValue({
                    advertisement: null, // Xóa giá trị advertisement nếu file bị xóa
                  });
                }
                setShouldUpdate(!souldUpdate);
              }}
              beforeUpload={(file) => {
                const fileWithTimestamp = generateFileWithTimeStamp(file);
                formProps.form?.setFieldsValue({
                  advertisement: fileWithTimestamp.newFileName,
                });
                return fileWithTimestamp.newFile;
              }}
              defaultFileList={
                data?.advertisement
                  ? [
                      {
                        uid: "-1", // Đặt uid duy nhất
                        name:
                          data.advertisement.split("/").pop() ||
                          "thumbnail.jpg",
                        status: "done",
                        url: apiUrl + data.advertisement, // URL của ảnh đã tải lên
                      },
                    ]
                  : []
              }
            >
              {!formProps.form?.getFieldValue("advertisement") && uploadButton}
            </Upload>
            {previewImage && (
              <Image
                wrapperStyle={{ display: "none" }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                  afterOpenChange: (visible) => !visible && setPreviewImage(""),
                }}
                src={previewImage || apiUrl + data?.advertisement}
              />
            )}
          </Form.Item>
          <Form.Item
            label="Link Banner quảng cáo"
            name="advertisementLink"
            rules={[
              {
                required: true,
              },
            ]}
            style={{ flex: 1 }}
          >
            <Input />
          </Form.Item>
        </Flex>
        <Form.Item
          label="Slider"
          name="slideObject"
          rules={[
            {
              required: true,
            },
          ]}
          style={{ flex: 1 }}
        >
          <AppImageWithLink />
        </Form.Item>
      </Form>
    </Edit>
  );
};
