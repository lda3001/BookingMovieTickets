
import { Edit, useForm, useSelect } from "@refinedev/antd";

import { Form, Input, Select } from "antd";


import type { ICategory } from "../../interfaces";
import { useParsed } from "@refinedev/core";

export const CategoryEdit = () => {
  const { id } = useParsed();

  const { formProps, saveButtonProps, query: queryResult } = useForm<ICategory>({
    resource: "categories",
    action:"edit",
    id,
  });


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
          label="Slug"
          name="slug"
        >
          <Input disabled />
        </Form.Item>
      </Form>
    </Edit>
  );
};
