const LoadingState = ({ message = 'Loading...' }) => (
  <div className="flex-1 flex items-center justify-center bg-[#F7FAFA]">
    <div className="text-qreva-navy">{message}</div>
  </div>
);

export default LoadingState;