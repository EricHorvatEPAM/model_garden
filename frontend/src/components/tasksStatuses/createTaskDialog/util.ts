import { Bucket, Dataset, LabelingToolUser } from '../../../models';

export interface ILabelingProps {
  buckets: Bucket[];
  datasets: Dataset[];
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
