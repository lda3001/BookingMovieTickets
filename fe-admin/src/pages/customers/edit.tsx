import React from "react";
import { Edit, useForm } from "@refinedev/antd";
import { Flex, Form, Input, Select, DatePicker } from "antd";
import type { IUser } from "../../interfaces";
import dayjs from "../../utils/dayjs";

export const CustomerEdit = () => {
  const {
    formProps,
    formLoading,
    saveButtonProps,
    query: queryResult,
  } = useForm<IUser>({
    action: "edit",
    resource: "users",
    queryOptions: {
      select: (data: any) => {
        // Backend trả về: { status: "success", data: UserResponse }
        // Refine expects: { data: UserResponse }
        return {
          data: data?.data?.data || data?.data,
        };
      },
    },
    transform: (values: any) => {
      const updateData: any = {
        fullName: values.fullName,
        email: values.email,
        role: values.role,
        phone: values.phone,
        dateOfBirth: values.dateOfBirth
          ? dayjs(values.dateOfBirth).format("YYYY-MM-DD")
          : undefined,
        isActive: values.isActive,
      };

      // Only include password if it's provided
      if (values.password) {
        updateData.password = values.password;
      }

      return updateData;
    },
  });

  const userData = queryResult?.data?.data;
   

  return (
    <Edit isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Form
        {...formProps}
        layout="vertical"
        initialValues={{
          ...userData,
        }}
      >
        <Form.Item
          label="Tên khách hàng"
          name="fullName"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên khách hàng",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Flex gap={20}>
          <Form.Item
            label="Email"
            name="email"
            style={{ flex: 1 }}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập email",
              },
              {
                type: "email",
                message: "Email không hợp lệ",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Số điện thoại" name="phone" style={{ flex: 1 }}>
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
        </Flex>

        <Flex gap={20}>
          <Form.Item
            label="Mật khẩu mới (để trống nếu không đổi)"
            name="password"
            style={{ flex: 1 }}
            rules={[
              {
                min: 6,
                message: "Mật khẩu phải có ít nhất 6 ký tự",
              },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu mới" />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu mới"
            name="confirmPassword"
            style={{ flex: 1 }}
            dependencies={["password"]}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const password = getFieldValue("password");
                  if (!password || !value || password === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp")
                  );
                },
              }),
            ]}
          >
            <Input.Password placeholder="Xác nhận mật khẩu mới" />
          </Form.Item>
        </Flex>

        <Flex gap={20}>
          <Form.Item
            label="Ngày sinh"
            name="dateOfBirth"
            style={{ flex: 1 }}
            getValueProps={(value) => ({
              value: value ? dayjs(value) : undefined,
            })}
            normalize={(value) => {
              return value ? dayjs(value).format("YYYY-MM-DD") : undefined;
            }}
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item
            label="Vai trò"
            name="role"
            style={{ flex: 1 }}
            rules={[
              {
                required: true,
                message: "Vui lòng chọn vai trò",
              },
            ]}
          >
            <Select
              placeholder="Chọn vai trò"
              options={[
                { value: "ADMIN", label: "Quản Trị Viên" },
                { value: "USER", label: "Khách Hàng" },
              ]}
            />
          </Form.Item>
        </Flex>
      </Form>
    </Edit>
  );
};
