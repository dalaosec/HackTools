import { Button, Card, Checkbox, Col, Divider, Input, Layout, Modal, Popconfirm, Progress, Radio, Row, Table, Tooltip, message } from 'antd';
import jsyaml from 'js-yaml';
import { useEffect, useRef, useState } from 'react';
import createOWSTGStore, { Category, Substep } from './stores/MethodologyStore';
import tabStateStore from './stores/TabStateStore';
const { TextArea } = Input;
const { Header, Content } = Layout;


const OWSTG = ({ id }: { id: string }) => {
  const useStore = createOWSTGStore(id);
  const setCategories = useStore((state) => state.setCategories);
  const categories = useStore((state) => state.categories);
  const toggleTested = useStore(state => state.toggleTested);
  const setVulnerable = useStore(state => state.setVulnerable);
  const setNote = useStore(state => state.setNote);
  const downloadCSV = useStore((state) => state.downloadCSV);
  const reset = useStore((state) => state.reset);
  
  const totalTests = categories.reduce((total, category) => total + category.atomic_tests.length, 0);
  const completedTests = categories.reduce((total, category) => total + category.atomic_tests.filter(test => test.wasTested).length, 0);
  const vulnerableTests = categories.reduce((total, category) => total + category.atomic_tests.filter(test => test.wasVulnerable).length, 0);
  const notVulnerableTests = categories.reduce((total, category) => total + category.atomic_tests.filter(test => !test.wasVulnerable && test.wasTested).length, 0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to export state
  const exportState = () => {
    const tabName = tabStateStore.getState().items.find(item => item.key === id)?.label;
    const currentState = useStore.getState();  
    const blob = new Blob([JSON.stringify(currentState)], { type: "application/json" });  
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");  
    link.href = url;
    link.download = `methodology_state_${tabName}_${new Date().toISOString()}.json`;
    link.click();  
    URL.revokeObjectURL(url);  
  };


  const importState = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.warn("No file selected!");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const newState = JSON.parse(result);  
      useStore.setState(newState);  
    };
    reader.readAsText(file);
  };

  // Fetch OWSTG checklist
  useEffect(() => {
    const fetchChecklist = async () => {
      if (categories.length === 0) {
        try {
          const response = await fetch('https://raw.githubusercontent.com/LasCC/Hack-Tools/dev/src/pages/popup/assets/data/Methodology/owstg.yaml');
          const data = await response.text();
          const parsedData = jsyaml.load(data).map(item => item.category) as Category[];
          console.log(parsedData);
          setCategories(parsedData);
        } catch (error) {
          console.error('Failed to fetch OWSTG checklist:', error);
        }
      }
    };

    fetchChecklist();
  }, [setCategories, categories]);

  // Popconfirm functions
  const confirm = () => {
    reset();
    message.success('Resetted');
  };
  const cancel = () => {
    message.error('Cancelled');
  };


  const columns = [
    {
      title: 'Test ID',
      dataIndex: 'id',
      key: 'id',
      render: (text, record) => (
          <a href={`${record.reference}`} target="_blank" rel="noreferrer">{text}</a>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      filters: categories.flatMap((category) =>
        category.atomic_tests.map((test) => ({ text: test.description, value: test.description }))
      ),

      onFilter: (value, record) => record.description.indexOf(value) === 0,
      render: (text, record) => (
        <a onClick={() => openModal(record)}>{text}</a>
      ),
    },
    {
      title: 'Tested',
      dataIndex: 'wasTested',
      key: 'wasTested',
      filters: [
        { text: 'Yes', value: true },
        { text: 'No', value: false },
      ],
      onFilter: (value, record) => record.wasTested === value,

      render: (text, record) => (
        <Checkbox
          checked={record.wasTested}
          onClick={(e) => {
            e.stopPropagation();
            toggleTested(record.categoryId, record.id);
          }}
        >
          Was Tested
        </Checkbox>
      ),
    },
    {
      title: 'Vulnerability',
      dataIndex: 'wasVulnerable',
      key: 'wasVulnerable',

      filters: [
        { text: 'Vulnerable', value: true },
        { text: 'Not Vulnerable', value: false },
      ],
      onFilter: (value, record) => record.wasVulnerable === value,
      render: (text, record) => (
        <Radio.Group
          value={record.wasVulnerable}
          onChange={(e) => {
            e.stopPropagation();
            setVulnerable(record.categoryId, record.id, e.target.value);
          }}
        >
          <Radio value={true}>Vulnerable</Radio>
          <Radio value={false}>Not Vulnerable</Radio>
        </Radio.Group>
      ),
    },
    {
      title: 'Notes',
      dataIndex: 'note',
      key: 'note',
      render: (text, record) => (
        <TextArea
          rows={4}
          value={record.note}
          placeholder="Notes"
          onChange={(e) => setNote(record.categoryId, record.id, e.target.value)}
        />
      ),
    },
  ];


  // Table data
  const data = categories.flatMap((category) =>
    category.atomic_tests.map((test) => ({ ...test, categoryId: category.id }))
  );

  // Modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTest, setCurrentTest] = useState(null);
  const [exportOption, setExportOption] = useState('all');
  const [isExportModalVisible, setIsExportModalVisible] = useState(false);

  // Modal functions
  const openExportModal = () => {
    setIsExportModalVisible(true);
  };
  const closeExportModal = () => {
    setIsExportModalVisible(false);
  };
  const openModal = (record) => {
    setCurrentTest(record);
    setIsModalVisible(true);
  };
  const closeModal = () => {
    setCurrentTest(null);
    setIsModalVisible(false);
  };

  // Modal components
  const exportCSVModal = (
    <Modal
      title="Export as CSV"
      open={isExportModalVisible}
      onOk={() => {
        downloadCSV(exportOption);
        closeExportModal();
      }}
      onCancel={closeExportModal}
    >
      <p>Please select which tests you want to export:</p>
      <Radio.Group onChange={(e) => setExportOption(e.target.value)} value={exportOption}>
        <Radio value='all'>All Tests</Radio>
        <Radio value='vulnerable'>Vulnerable Tests</Radio>
        <Radio value='not_vulnerable'>Not Vulnerable Tests</Radio>
      </Radio.Group>
    </Modal>
  )

  const onDescriptionCaseClickModal = (
    <Modal open={isModalVisible} onCancel={closeModal}>
        <h2>{currentTest?.description}</h2>
      <TextArea
        rows={4}
        value={currentTest?.note}
        placeholder="Notes"
        onChange={(e) => setNote(currentTest?.categoryId, currentTest?.id, e.target.value)}
      />
      <Divider />

      {currentTest?.substeps.map((substep: Substep) => (
        <>
          <p>{`${substep}`}</p>
        </>
      ))}
    </Modal>)

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={24} >
          <Card title="Total progress" style={{ width: "100%" }}>
          <Tooltip title={`${completedTests} / ${totalTests} completed`}>
              <Progress
                type="circle"
                percent={parseFloat(((completedTests / totalTests) * 100).toFixed(2))}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
                style={{ marginRight: '10px' }}
                size='small'
              />
            </Tooltip>
            <Tooltip title={`${vulnerableTests} / ${totalTests} issue(s) identified`}>
              <Progress
                type="circle"
                percent={parseFloat(((vulnerableTests / totalTests) * 100).toFixed(2))}
                strokeColor="red"
                style={{ marginTop: '10px' }}
                size='small'
              />
            </Tooltip>
            <Button type="primary" onClick={openExportModal} style={{ marginLeft: '10px' }}>Export as CSV</Button>
            <Popconfirm
              title="Are you sure to reset all your progress?"
              onConfirm={confirm}
              onCancel={cancel}
              okText="Yes"
              cancelText="No"
              placement="bottom"

            >
              <Button type="primary" danger style={{ marginLeft: '10px' }} >Reset</Button>
            </Popconfirm>
            <Button type="primary" onClick={exportState} style={{ marginLeft: '10px' }}>Export State</Button>
      <input ref={fileInputRef} type="file" hidden onChange={importState} />
      <Button type="primary" onClick={() => fileInputRef.current?.click()} style={{ marginLeft: '10px' }}>Import State</Button>
          </Card>
        </Col>
      </Row>

      <Divider />

      <Table columns={columns} dataSource={data} rowKey="id" />

      {onDescriptionCaseClickModal}
      {exportCSVModal}
    </>
  );
};

export default OWSTG;
