import { Flex, Form, Input } from "antd";
import TextArea from "antd/es/input/TextArea";

const BaseSEOForm = () => {
  return (
    <>
      <Flex gap={20}>
        <Form.Item label="SEO Title" name="seoTitle" style={{ flex: 1 }}>
          <Input />
        </Form.Item>
        <Form.Item label="SEO Keywords" name="seoKeyword" style={{ flex: 1 }}>
          <Input />
        </Form.Item>
      </Flex>
      <Form.Item label="SEO Description" name="seoDescription">
        <TextArea />
      </Form.Item>
    </>
  );
};
export default BaseSEOForm;
