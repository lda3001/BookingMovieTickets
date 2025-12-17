import React, { useContext, useEffect, useRef, useState } from "react";
import { GetRef, InputNumber, InputRef, TableProps } from "antd";
import { Button, Form, Input, Popconfirm, Table, Switch } from "antd";
import { v4 as uuidv4 } from "uuid";
import { PlusOutlined } from "@ant-design/icons";

type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  id: number;
  name: string;
  price: number;
  stock: boolean;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[{ required: true, message: `${title} is required.` }]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingInlineEnd: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};
interface DataType {
  id: string;
  name: string;
  price: number;
  discountPrice: number;
  ctvPrice: number;
  stock: boolean;
}

type ColumnTypes = Exclude<TableProps<DataType>["columns"], undefined>;

const ProductPackage = ({
  values = "[]",
  onChange,
}: {
  values?: string;
  onChange: (value: any) => void;
}) => {
  const [dataSource, setDataSource] = useState<DataType[]>(JSON.parse(values));

  const [count, setCount] = useState(2);

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.id !== key);
    setDataSource(newData);
  };

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex: string;
  })[] = [
    {
      title: "Tên",
      dataIndex: "name",
      width: "15%",
      editable: true,
    },
    {
      title: "Giá",
      dataIndex: "price",
      width: "20%",
      render: (text: number, record: DataType) => (
        <InputNumber<number>
          value={text}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) =>
            value?.replace(/\$\s?|(,*)/g, "") as unknown as number
          }
          onChange={(value) => {
            handleSave({ ...record, price: value as number });
          }}
          suffix="₫"
          style={{ width: '100%' }}
        />
      ),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Giá khuyến mãi",
      dataIndex: "discountPrice",
      width: "20%",
      render: (text: number, record: DataType) => (
        <InputNumber<number>
          value={text}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) =>
            value?.replace(/\$\s?|(,*)/g, "") as unknown as number
          }
          onChange={(value) => {
            handleSave({ ...record, discountPrice: value as number });
          }}
          suffix="₫"
          style={{ width: '100%' }}
        />
      ),
      sorter: (a, b) => a.discountPrice - b.discountPrice,
    },
    {
      title: "CTV",
      dataIndex: "ctvPrice",
      width: "20%",
      render: (text: number, record: DataType) => (
        <InputNumber<number>
          value={text}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) =>
            value?.replace(/\$\s?|(,*)/g, "") as unknown as number
          }
          onChange={(value) => {
            handleSave({ ...record, ctvPrice: value as number });
          }}
          suffix="₫"
          style={{ width: '100%' }}
        />
      ),
      sorter: (a, b) => a.ctvPrice - b.ctvPrice,
    },
    {
      title: "Còn hàng",
      dataIndex: "stock",
      width: "10%",
      render: (_, record) => (
        <Switch
          checkedChildren="Còn"
          unCheckedChildren="Hết"
          checked={record.stock}
          onChange={(checked) => handleSave({ ...record, stock: checked })}
        />
      ),
    },
    {
      title: "Hành động",
      dataIndex: "operation",
      width: "10%",
      fixed: 'right',
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Popconfirm
            title="Chắc chắn xóa?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" danger size="small">
              Xóa
            </Button>
          </Popconfirm>
        ) : null,
    },
  ];

  const formatPrice = (value: number) => {
    if (!value) return "";
    return value.toLocaleString("vi-VN");
  };

  const handleAdd = () => {
    const newData: DataType = {
      id: uuidv4().toString(),
      name: `${count} Tháng`,
      price: 100000,
      discountPrice: 90000,
      ctvPrice: 80000,
      stock: true,
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  const handleSave = (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
    onChange(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <Table<DataType>
        rowKey={(record) => record.id}
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={dataSource}
        columns={columns as ColumnTypes}
        scroll={{ x: true }}
        footer={() => (
          <Button
            type="dashed"
            onClick={handleAdd}
            block
            icon={<PlusOutlined />}
          >
            Thêm
          </Button>
        )}
      ></Table>
    </div>
  );
};

export default ProductPackage;
