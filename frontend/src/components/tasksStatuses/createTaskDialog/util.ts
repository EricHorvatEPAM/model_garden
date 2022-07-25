import { IBucket, IDataset, LabelingToolUser, IConfig } from '../../../models';

export interface ILabelingProps {
  configs: IConfig;
  buckets: IBucket[];
  datasets: IDataset[];
  users: LabelingToolUser[];
  filesCount: number;
  getUnsignedImagesCount: any;
  clearUnsignedImagesCount: any;
  createLabelingTask: any;
  getDatasets: any;
  openCreateTaskDialog: boolean;
  setOpenCreateTaskDialog: any;
}

export interface IFormData {
  currentDatasetId: string;
  taskName: string;
  user: string | number;
  filesInTask: number;
  countOfTasks: number;
}
