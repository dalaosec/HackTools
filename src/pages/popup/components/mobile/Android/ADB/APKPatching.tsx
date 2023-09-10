import React from 'react';
import { Typography, Divider } from 'antd';
import apkPatchingCommands from '../../../../assets/data/Mobile/APK_PATCHING.json';

const { Title, Paragraph, Text } = Typography;

const APKPatching = () => {
  const handleCommand = (command) => {
    return command.command;
  }

  return (
    <>
      {apkPatchingCommands.map((command, index) => (
        <div key={index}>
          <Title level={4}>{command.name}</Title>
          <Paragraph>{command.description}</Paragraph>
          <Paragraph>
            <pre><Text copyable>
              {handleCommand(command)}
            </Text></pre>
          </Paragraph>
        </div>
      ))}
      <Divider />
    </>
  )
}

export default APKPatching;