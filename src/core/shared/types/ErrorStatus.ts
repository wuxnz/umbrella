// Error Status
// returns error status when a function fails
type ErrorStatus<T> = {
  status: 'error';
  error: string;
  data?: T;
};

export default ErrorStatus;
