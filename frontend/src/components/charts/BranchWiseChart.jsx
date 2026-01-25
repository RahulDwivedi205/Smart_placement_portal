const BranchWiseChart = ({ data = [] }) => {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-blue-200">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-400 bg-opacity-30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white">Branch-wise Placement</h3>
          <p className="text-blue-200">Chart visualization coming soon</p>
          <p className="text-sm text-blue-300">Branches: {data.length}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64 flex items-center justify-center text-blue-200">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-400 bg-opacity-30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-white">Branch-wise Placement</h3>
        <p className="text-blue-200">Chart visualization coming soon</p>
        <p className="text-sm text-blue-300">Branches: {data.length}</p>
      </div>
    </div>
  );
};

export default BranchWiseChart;