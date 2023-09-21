import { useEffect } from 'react';
import { Button, Card, Checkbox, Col, Divider, Form, Input, Layout, Modal, Popconfirm, Progress, Radio, Row, Select, Space, Statistic, Table, Tag, Tooltip, Typography, message } from 'antd';
import createOWSTGStore, { initializeChecklist } from './stores/MethodologyStore';
import { AtomicTest, Pentest, Substep, TestCaseStatus, Quote } from "./ChecklistInterfaces"
import tabStateStore from './stores/TabStateStore';
const { TextArea } = Input;
import { useHotkeys } from 'react-hotkeys-hook';
import { UserOutlined, BugOutlined, HourglassOutlined, SearchOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';
import { Dropdown } from 'antd';
import { BsFiletypeJson } from 'react-icons/bs';
import { TbCsv } from 'react-icons/tb';
import { MdHttp } from 'react-icons/md';
import type { MenuProps } from 'antd';
import { Record, String, Array, Number, Union, Literal, Static } from 'runtypes';
import quotes from '../../../assets/data/Quotes/Quotes.json';
const { Header, Content } = Layout;


const OWSTG = ({ id }: { id: string }) => {
  const QOTD: Quote = quotes[Math.floor(Math.random() * quotes.length)];



  // Handler for this Tab's state
  const useStore = createOWSTGStore(id);
  const { stateFlattenedChecklists, handleStatusChange, handleObservationsChange, handleFileUpload } = useStore();


  const currentTabStateExportAsJSON = () => {
    const dataStr = JSON.stringify(stateFlattenedChecklists);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    let exportFileDefaultName = `htool_state_methodology_${new Date().getTime()}_${new Date().toLocaleDateString()}.json`;

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    linkElement.remove();
  };

  enum Actions {
    ImportLocalFile = "1",
    ExportJSON = "2",
    ImportURI = "3"
  };



  const handleCSVExport = () => {
    console.log("Exporting as CSV");
  }

const handleMenuClick: MenuProps['onClick'] = (e) => {
  switch (e.key) {
    case Actions.ImportLocalFile:
      handleFileUpload();
      break;
    case Actions.ExportJSON:
      currentTabStateExportAsJSON()
      break;
    case Actions.ImportURI:
      message.info('Not implemented yet');
      break;
    default:
      break;
  }
};

  const items: MenuProps['items'] = [
    {
      label: 'Import methodology from local file',
      key: '1',
      icon: <BsFiletypeJson />,
    },
    {
      label: 'Export current state as JSON',
      key: '2',
      icon: <UserOutlined />,
    },
    {
      label: 'Import methodology from URI',
      key: '3',
      icon: <MdHttp />,
    }
  ];


  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters = () => { } }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => confirm()}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
  });


  const columns = [
    {
      title: 'Test ID',
      dataIndex: 'id',
      key: 'id',
      ...getColumnSearchProps('id'),
      render: (text, record) => (
        <a href={`${record.reference}`} target="_blank" rel="noreferrer">{text}</a>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'State',
      dataIndex: 'testCaseStatus',
      key: 'testCaseStatus',
      filters: Object.values(TestCaseStatus).map(status => ({ text: status, value: status })),
      onFilter: (value, record) => record.testCaseStatus.indexOf(value) === 0,
      render: (testCaseStatus, record) => {
        console.log(testCaseStatus, record);
        return (
          <Select
            defaultValue={record.testCaseStatus || TestCaseStatus.NOT_TESTED}
            style={{ width: "100%" }}
            onChange={(value) => handleStatusChange(record.id, value)}
            options={
              Object.values(TestCaseStatus).map(status => ({ label: status, value: status }))
            }
          />
        );
      },

    },
  ];

  const { Text, Link } = Typography;

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };


  return (
    <>
      <Card>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Progress
              size={75}
              type="circle"
              percent={
                Math.round(
                  stateFlattenedChecklists.filter(test =>
                    test.testCaseStatus !== TestCaseStatus.NOT_TESTED &&
                    test.testCaseStatus !== TestCaseStatus.IN_PROGRESS
                  ).length / stateFlattenedChecklists.length * 100
                )
              }
              strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }} />
          </Col>
          <Col span={6}>
            <Statistic
              title="Issues found"
              value={
                stateFlattenedChecklists.filter(test => test.testCaseStatus === TestCaseStatus.FAILED).length
              }
              valueStyle={{ color: '#B22222' }}
              prefix={<BugOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Pending tests"
              value={
                stateFlattenedChecklists.filter(test => test.testCaseStatus === TestCaseStatus.NOT_TESTED).length
              }
              valueStyle={{ color: '#FFA500' }}
              prefix={<HourglassOutlined />}
            />
          </Col>
          <Col span={6}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Dropdown.Button menu={menuProps} onClick={handleCSVExport}>
              Export as CSV
            </Dropdown.Button>
          </Col>
        </Row>
      </Card>

      <Divider />


      <Table
        columns={columns}
        dataSource={stateFlattenedChecklists}
        rowKey="id"
        expandable={{
          expandedRowRender: (record: AtomicTest) => (
            <Row gutter={[16, 16]}>
              <Col span={24} >
                <Text strong>Objectives :</Text>
                <ul>
                  {record.objectives.map((objective, index) => (
                    <li key={index}>{objective}</li>
                  ))}
                </ul>
              </Col>
              <Col span={24} >
                <Text strong>Observations :</Text>
              </Col>
              <Col span={24} >
                <TextArea value={record.observations}
                  onChange={(e) => handleObservationsChange(record.id, e.target.value)} />
              </Col>
              <Divider />
              <Col span={24} >
                <Text strong>Custom testing methodology :</Text>
              </Col>
              <Col span={24} >
                {record.substeps.map((substep, index) => (
                  <>
                    <Text key={index}>{substep.step}</Text>
                    <li key={index}>{substep.description}</li>
                    <Divider />
                  </>
                ))}
              </Col>
            </Row>
          ),
        }}
      />
      <FloatButton />
    </>
  );
};

export default OWSTG;
