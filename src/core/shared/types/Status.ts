import LoadingStatus from './LoadingStatus';
import SuccessStatus from './SuccessStatus';
import ErrorStatus from './ErrorStatus';

type Status<T> = LoadingStatus | SuccessStatus<T> | ErrorStatus;

export default Status;
