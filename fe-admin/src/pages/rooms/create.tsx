import { Create, useForm, useSelect } from "@refinedev/antd";
import { Flex, Form, Input, Switch, InputNumber, Select } from "antd";
import type { IRoom, ICinema } from "../../interfaces";

export const RoomCreate = () => {
  const { formProps, formLoading, saveButtonProps } = useForm<IRoom>({
    action: "create",
  });

  const { selectProps: cinemaSelectProps } = useSelect<ICinema>({
    resource: "cinemas",
    optionLabel: "name",
    optionValue: "id",
  });

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
          label="Rạp"
          name={["cinema", "id"]}
          rules={[
            {
              required: true,
              message: "Vui lòng chọn rạp",
            },
          ]}
        >
          <Select {...cinemaSelectProps} placeholder="Chọn rạp" />
        </Form.Item>

        <Form.Item
          label="Tên phòng"
          name="name"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên phòng",
            },
          ]}
        >
          <Input placeholder="VD: Phòng 1, Phòng VIP, IMAX 1" />
        </Form.Item>

        <Flex gap={20}>
          <Form.Item
            label="Số hàng ghế"
            name="totalRows"
            style={{ flex: 1 }}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập số hàng ghế",
              },
            ]}
          >
            <InputNumber min={1} style={{ width: "100%" }} placeholder="VD: 10" />
          </Form.Item>
          <Form.Item
            label="Ghế mỗi hàng"
            name="seatsPerRow"
            style={{ flex: 1 }}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập số ghế mỗi hàng",
              },
            ]}
          >
            <InputNumber min={1} style={{ width: "100%" }} placeholder="VD: 15" />
          </Form.Item>
        </Flex>

        <Form.Item
          label="Hàng VIP (JSON array)"
          name="vipRows"
          tooltip="Nhập mảng JSON các số hàng VIP, VD: [1, 2] hoặc để trống"
        >
          <Input.TextArea
            rows={3}
            placeholder='VD: [1, 2] hoặc ["A", "B"]'
            onBlur={(e) => {
              const value = e.target.value.trim();
              if (value) {
                try {
                  JSON.parse(value);
                  formProps.form?.setFieldsValue({ vipRows: value });
                } catch (error) {
                  formProps.form?.setFieldsError([
                    {
                      name: "vipRows",
                      errors: ["Định dạng JSON không hợp lệ"],
                    },
                  ]);
                }
              }
            }}
          />
        </Form.Item>
      </Form>
    </Create>
  );
};

