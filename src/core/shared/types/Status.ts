import LoadingStatus from './LoadingStatus';
import SuccessStatus from './SuccessStatus';
import ErrorStatus from './ErrorStatus';

// Status type
// returns loading status while a function is running
// or success status with data or error status
type Status<T> = LoadingStatus | SuccessStatus<T> | ErrorStatus;

export default Status;
