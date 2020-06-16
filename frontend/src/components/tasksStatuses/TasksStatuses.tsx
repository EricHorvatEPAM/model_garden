import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Tooltip } from 'antd';
import { Box, IconButton } from '@material-ui/core';
import { Refresh, FileCopy } from '@material-ui/icons';
import 'antd/dist/antd.css';
import './TasksStatuses.css';
import { DropdownButton } from './DropdownButton';
import { AppState } from '../../store';
import {
  archiveLabelingTask,
  getLabelingTasks,
  retryLabelingTask
} from '../../store/labelingTask';
import { TableStateProps } from '../../models';
import { ROWS_PER_PAGE } from './constants';
import { GetColumnSearchProps } from './GetColumnSearchProps';
import StatusField from './StatusField';

export const TasksStatuses: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [tableState, setTableState] = useState<TableStateProps>({
    page: 1,
    rowsPerPage: ROWS_PER_PAGE,
    searchProps: {},
    filterStatus: JSON.parse(
      localStorage.getItem('taskStatusFilter') as any
    ) || ['annotation', 'validation', 'completed', 'saved'],
    sortOrder: undefined,
    sortField: undefined
  });

  const areTasksLoading = useSelector(
    (state: AppState) => state.labelingTask.isLabelingTasksStatusesLoading
  );
  const tasks = useSelector(
    (state: AppState) => state.labelingTask.labelingTasksStatuses.tasks
  );
  const tasksCount = useSelector(
    (state: AppState) => state.labelingTask.labelingTasksStatuses.count
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getLabelingTasks(tableState));
  }, [tableState, dispatch]);

  const updateSearchState = (newSearchProps: Object) => {
    setTableState((prevState: any) => {
      return {
        ...prevState,
        searchProps: {
          ...prevState.searchProps,
          ...newSearchProps
        },
        page: 1
      };
    });
  };

  const resetSearchState = () => {
    setTableState((prevState: any) => {
      return {
        ...prevState,
        searchProps: {},
        page: 1
      };
    });
  };

  const TASK_STATUSES_COLUMNS = [
    {
      title: 'Task Name',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      sorter: true,
      showSorterTooltip: false,
      filtered: tableState.searchProps.name,
      ...GetColumnSearchProps('name', updateSearchState, resetSearchState)
    },
    {
      title: 'Dataset',
      dataIndex: 'dataset',
      key: 'dataset',
      width: '20%',
      sorter: true,
      filtered: tableState.searchProps.dataset,
      ...GetColumnSearchProps('dataset', updateSearchState, resetSearchState)
    },
    {
      title: 'Labeler',
      dataIndex: 'labeler',
      key: 'labeler',
      sorter: true,
      filtered: tableState.searchProps.labeler,
      ...GetColumnSearchProps('labeler', updateSearchState, resetSearchState)
    },
    {
      title: 'Url',
      dataIndex: 'url',
      key: 'url',
      render: (value: string) => {
        let hostname = value;
        let res = /https?:\/\/(.+?)\/.*/.exec(value);
        if (res && res.length === 2) {
          hostname = res[1];
        }
        return (
          <a href={value} target="_blank" rel="noopener noreferrer">
            {hostname}
          </a>
        );
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      render: (text: string, record: { error: string; status: string }) => (
        <StatusField text={text} record={record} />
      ),
      filters: [
        { text: 'annotation', value: 'annotation' },
        { text: 'validation', value: 'validation' },
        { text: 'completed', value: 'completed' },
        { text: 'saved', value: 'saved' },
        { text: 'archived', value: 'archived' },
        { text: 'failed', value: 'failed' }
      ],
      filteredValue: tableState.filterStatus
    }
  ];

  const handleTableChange = (
    pagination: {
      pageSize: number;
      current: number;
      total: number;
    },

    filter: any,
    sorter: {
      column?: any;
      order?: 'ascend' | 'descend';
      field?: string;
      columnKey?: any;
    }
  ) => {
    localStorage.setItem('taskStatusFilter', JSON.stringify(filter.status));
    setTableState((prevState: TableStateProps) => ({
      ...prevState,
      page: pagination.current,
      filterStatus: filter.status,
      sortOrder: sorter.order,
      sortField: sorter.field
    }));
  };

  const onSelectChange = (values: Array<number & never>) => {
    setSelectedRowKeys(values);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  };

  const handleArchive: any = () => {
    if (selectedRowKeys.length > 0) {
      (dispatch(
        archiveLabelingTask(selectedRowKeys, tableState)
      ) as any).finally(() => {
        setSelectedRowKeys([]);
      });
    }
  };

  const handleRetry: any = () => {
    if (selectedRowKeys.length > 0) {
      (dispatch(retryLabelingTask(selectedRowKeys, tableState)) as any).finally(
        () => {
          setSelectedRowKeys([]);
        }
      );
    }
  };
  const handleRefresh = () => {
    dispatch(getLabelingTasks(tableState));
  };

  const onShowSizeChange = (current: any, pageSize: any) => {
    setTableState((prevState: any) => {
      return {
        ...prevState,
        page: current,
        rowsPerPage: pageSize
      };
    });
  };

  return (
    <div className={'task-statuses'}>
      <Box display="flex" alignItems="center" marginBottom={1}>
        <DropdownButton onArchive={handleArchive} onRetry={handleRetry} />
        <IconButton aria-label="refresh" onClick={handleRefresh}>
          <Refresh />
        </IconButton>
      </Box>

      <Table
        columns={TASK_STATUSES_COLUMNS as any}
        rowKey={(record) => record.id}
        rowSelection={rowSelection as any}
        rowClassName={(record) => `task-status-${record.status}`}
        dataSource={tasks}
        pagination={{
          pageSize: tableState.rowsPerPage,
          current: tableState.page,
          total: tasksCount,
          showSizeChanger: true,
          onShowSizeChange: onShowSizeChange
        }}
        loading={areTasksLoading}
        onChange={handleTableChange as any}
      />
    </div>
  );
};
