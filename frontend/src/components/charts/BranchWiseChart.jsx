const BranchWiseChart = ({ data = [] }) => {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No data available
      </div>
    );
  }

  return (
    <div className="h-64 flex items-center justify-center text-gray-500">
      <div>
        <h3 className="text-lg font-medium">Branch-wise Placement</h3>
        <p>Chart will be displayed here</p>
        <p className="text-sm">Branches: {data.length}</p>
      </div>
    </div>
  );
};

export default BranchWiseChart;