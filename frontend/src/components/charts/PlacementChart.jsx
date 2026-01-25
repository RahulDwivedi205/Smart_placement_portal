const PlacementChart = ({ data = [] }) => {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-blue-200">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-400 bg-opacity-30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white">Placement Trends</h3>
          <p className="text-blue-200">Chart visualization coming soon</p>
          <p className="text-sm text-blue-300">Data points: {data.length}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64 flex items-center justify-center text-blue-200">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-400 bg-opacity-30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-white">Placement Trends</h3>
        <p className="text-blue-200">Chart visualization coming soon</p>
        <p className="text-sm text-blue-300">Data points: {data.length}</p>
      </div>
    </div>
  );
};

export default PlacementChart;