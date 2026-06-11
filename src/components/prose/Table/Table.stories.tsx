import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Table } from './Table';
import { Td } from './Td';
import { Th } from './Th';
import { Thead } from './Thead';
import { Tr } from './Tr';

const meta = {
  title: 'Prose/Table',
  component: Table
} satisfies Meta<typeof Table>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Table>
      <Thead>
        <Tr>
          <Th>Header A</Th>
          <Th>Header B</Th>
          <Th>Header C</Th>
        </Tr>
      </Thead>
      <tbody>
        <Tr>
          <Td>Cell 1</Td>
          <Td>Cell 2</Td>
          <Td>Cell 3</Td>
        </Tr>
        <Tr>
          <Td>Cell 4</Td>
          <Td>Cell 5</Td>
          <Td>Cell 6</Td>
        </Tr>
      </tbody>
    </Table>
  )
};
