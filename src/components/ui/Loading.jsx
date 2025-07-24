import React from "react";

const Loading = ({ type = "cards" }) => {
  if (type === "cards") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 h-[280px]">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
                </div>
                <div className="flex-1">
                  <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-md mb-2 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
                  </div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-md w-3/4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
                  </div>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
                </div>
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-5/6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
                </div>
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-4/6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
                </div>
                <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-24 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "list") {
    return (
      <div className="space-y-4 p-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
                  </div>
                  <div className="flex-1">
                    <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-md mb-2 w-3/4 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
                    </div>
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-md w-1/2 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-16 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
                  </div>
                  <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-12">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span className="text-lg font-medium bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Loading amazing opportunities...
        </span>
      </div>
    </div>
  );
};

export default Loading;