import React from "react";
import { Create, useForm } from "@refinedev/antd";
import { Flex, Form, Input, Switch, InputNumber } from "antd";
import type { ICinema } from "../../interfaces";

export const CinemaCreate = () => {
  const {
    formProps,
    formLoading,
    saveButtonProps,
  } = useForm<ICinema>({
    action: "create",
  });

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Form
        {...formProps}
        layout="vertical"
        initialValues={{
          isActive: true,
          totalRooms: 0,
        }}
      >
        <Flex gap={20} justify="right">
          <Form.Item
            label="Trạng thái"
            name="isActive"
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
          <Input placeholder="Nhập tên rạp chiếu phim" />
        </Form.Item>

        <Form.Item 
          label="Địa chỉ" 
          name="address"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập địa chỉ",
            },
          ]}
        >
          <Input placeholder="Nhập địa chỉ rạp" />
        </Form.Item>

        <Flex gap={20}>
          <Form.Item 
            label="Thành phố" 
            name="city" 
            style={{ flex: 1 }}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập thành phố",
              },
            ]}
          >
            <Input placeholder="Nhập thành phố" />
          </Form.Item>
          <Form.Item 
            label="Số điện thoại" 
            name="phone" 
            style={{ flex: 1 }}
            rules={[
              {
                pattern: /^[0-9]{10,11}$/,
                message: "Số điện thoại phải từ 10-11 chữ số",
              },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
        </Flex>

        <Form.Item 
          label="Số phòng" 
          name="totalRooms"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập số phòng",
            },
          ]}
        >
          <InputNumber min={0} max={50} style={{ width: "100%" }} placeholder="Nhập số phòng chiếu" />
        </Form.Item>
      </Form>
    </Create>
  );
};
