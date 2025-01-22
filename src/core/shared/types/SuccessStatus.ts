type SuccessStatus<T> = {
  status: 'success';
  data: T;
};

export default SuccessStatus;
