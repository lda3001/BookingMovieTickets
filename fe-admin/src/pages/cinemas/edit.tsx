import React from "react";
import { Edit, useForm } from "@refinedev/antd";
import { Flex, Form, Input, Switch, InputNumber } from "antd";
import type { ICinema } from "../../interfaces";

export const CinemaEdit = () => {
  const {
    formProps,
    formLoading,
    saveButtonProps,
    query: queryResult,
  } = useForm<ICinema>({
    action: "edit",
    transform: (values: any) => {
      return {
        name: values.name,
        address: values.address,
        phone: values.phone,
        city: values.city,
        totalRooms: values.totalRooms,
        isActive: values.isActive,
      };
    },
  });

  const postData = queryResult?.data?.data;

  return (
    <Edit isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Form
        {...formProps}
        layout="vertical"
        initialValues={{
          ...postData,
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
          label="Tên rạp"
          name="name"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên rạp",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Địa chỉ" name="address">
          <Input />
        </Form.Item>

        <Flex gap={20}>
          <Form.Item label="Thành phố" name="city" style={{ flex: 1 }}>
            <Input />
          </Form.Item>
          <Form.Item label="Số điện thoại" name="phone" style={{ flex: 1 }}>
            <Input />
          </Form.Item>
        </Flex>

        <Form.Item label="Số phòng" name="totalRooms">
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Edit>
  );
};

