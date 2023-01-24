const LoadingUI: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-4 grid-rows-2 lg:grid-rows-1">
      <div className="bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 max-w-full h-screen">
        <div className="relative w-full h-36 overflow-hidden rounded-t-lg shadow-md animate-pulse bg-slate-500"/>
        <div className="px-3 sm:px-4 pt-4 flex absolute -translate-y-20">
          <div className="h-32 w-32 rounded-lg relative overflow-hidden shadow-sm flex border-[1px] dark:border-slate-700 bg-slate-50 dark:bg-slate-600 animate-pulse"/>
        </div>
        <div className="mr-5 mt-3 rounded-md p-2 bg-slate-100 dark:bg-slate-700 float-right shadow-md text-slate-800 dark:text-slate-300 hidden sm:block">
          <div className="animate-pulse">&nbsp;&nbsp;</div>
        </div>
        <div className="m-3 p-2 text-xs space-y-1 rounded-md float-right sm:hidden bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300">
          <div className="animate-pulse">&nbsp;&nbsp;</div>
          <div className="animate-pulse">&nbsp;&nbsp;</div>
        </div>
        <div className="p-4 sm:p-5 mt-14">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white animate-pulse">&nbsp;</h5>
            
            <article className="prose xl:prose-lg prose-p:dark:text-gray-300 prose-p:text-gray-800 prose-a:text-blue-700 prose-a:dark:text-blue-500 animate-pulse"/>
            <a href={"#"} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 animate-pulse">
            </a>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 max-w-full h-screen">
        <div className="px-2 mb-2 rounded-md dark:bg-gray-700 bg-slate-100 animate-pulse w-full h-full"/>
      </div>
    </div>
  );
}

export default LoadingUI;