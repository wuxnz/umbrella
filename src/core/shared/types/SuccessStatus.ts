// SuccessStatus
// returns success status with data
type SuccessStatus<T> = {
  status: 'success';
  data: T;
};

export default SuccessStatus;
