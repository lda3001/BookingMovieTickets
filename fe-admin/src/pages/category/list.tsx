import {
  List,
  TextField,
  useTable,
  EditButton,
  ShowButton,
  useForm,
  Create,
  DeleteButton,
} from "@refinedev/antd";
import { Table, Space, Button, Flex, Modal, Form, Input } from "antd";
import type { ICategory } from "../../interfaces";
import { PlusOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";

const Actions = ({ record, refetch }: { record: ICategory; refetch: () => void }) => (
  <Space>
    <EditButton hideText size="small" recordItemId={record.id} />
    <DeleteButton
      hideText
      size="small"
      recordItemId={record.id}
      onSuccess={() => refetch()} // Gọi refetch sau khi xóa thành công
    />
  </Space>
);


export const CategoryList = () => {
  const { formProps, saveButtonProps  } = useForm<ICategory>({
    action: "create",
    submitOnEnter: true,
    onMutationSuccess: () => {
      setShowModal(false); 
      tableQuery.refetch(); 
      formProps?.form?.resetFields();
    },
  });



  const [showModal, setShowModal] = useState(false);
  const tableRef = useRef<any>(null);

  const { tableProps, tableQuery } = useTable<ICategory>({
    pagination: { pageSize: 10 },
  });

  return (
    <Space direction="vertical" style={{ width: "100%" }} size={"middle"}>
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        footer={null}
        onCancel={() => setShowModal(false)}
      >
        <Create saveButtonProps={saveButtonProps}>
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
          </Form>
        </Create>
      </Modal>
      <Flex justify="end">
        <Button
          type="primary"
          onClick={() => {
            setShowModal(true);
          }}
          icon={<PlusOutlined />}
        >
          Create
        </Button>
      </Flex>
      <Table
        ref={tableRef}
        {...tableProps}
        rowKey="id"
        loading={tableProps.loading}
        locale={{ emptyText: "No categories found" }}
      >
        <Table.Column
          dataIndex="name"
          title="Tên"
          render={(value) => <TextField value={value} />}
        />
        <Table.Column
          dataIndex="slug"
          title="Slug"
          render={(value) => <TextField value={value} />}
        />
        <Table.Column
          title="Actions"
          render={(_, record: ICategory) => (
            <Actions record={record} refetch={tableQuery.refetch} />
          )}
        />
      </Table>
    </Space>
  );
};
