// Loading Status
// returns loading status while a function is running
type LoadingStatus<T> = {
  status: 'loading';
  data?: T;
};

export default LoadingStatus;
