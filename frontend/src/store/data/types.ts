import { IBucket, IDataset, LabelingToolUser, IConfig } from '../../models';

export interface IDataState {
  buckets: IBucket[];
  datasets: IDataset[];
  labelingToolUsers: LabelingToolUser[];
  configs: IConfig;
}
