export default function CollectionsDash() {
  function render(index: number): JSX.Element {
    return (<tr key={index} className="odd:bg-white even:bg-slate-100"><td>
      <a href="#" className="block hover:bg-gray-50">
        <div className="px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="truncate text-sm font-medium text-indigo-600 dark:text-white">Collection{" "}{index}</div>
            <div className="ml-2 flex flex-shrink-0">
              <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                Ethereum
              </span>
            </div>
          </div>
          <div className="mt-2 flex justify-between">
            <div className="sm:flex">
              <div className="mr-6 flex items-center text-sm text-gray-500">
                <svg className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" 
                      x-description="Heroicon name: mini/users" 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 20 20" 
                      fill="currentColor" 
                      aria-hidden="true">
                  <path d="M7 8a3 3 0 100-6 3 3 0 000 6zM14.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM1.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 017 18a9.953 9.953 0 01-5.385-1.572zM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 00-1.588-3.755 4.502 4.502 0 015.874 2.636.818.818 0 01-.36.98A7.465 7.465 0 0114.5 16z"></path>
                </svg>
                Studio{" "}{index}
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <svg className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" 
                    x-description="Heroicon name: mini/map-pin" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor" 
                    aria-hidden="true">
                <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd"></path>
              </svg>
              For Bid
            </div>
          </div>
        </div>
      </a>
    </td></tr>);
  }

  const footer: JSX.Element = 
    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between px-5 py-3">
      <div>
        <p className="text-sm text-gray-700">
          Showing{" "}<span className="font-medium">1</span>{" "}to{" "}<span className="font-medium">10</span>{" "}of{" "} 
          <span className="font-medium">100</span>{" "}results
        </p>
      </div>
      <div>
        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <a href="#" className="relative inline-flex items-center rounded-l-m bg-inherit px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20">
            {/* <span className="sr-only">Previous</span> */}
            <svg className="h-5 w-5" 
                  x-description="Heroicon name: mini/chevron-left" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor" 
                  aria-hidden="true">
              <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd"></path>
            </svg>
          </a>
          {/* <!-- Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" --> */}
          <a href="#" aria-current="page" className="relative z-10 inline-flex items-center border border-indigo-500 bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-600 focus:z-20">1</a>
          <a href="#" className="relative inline-flex items-center bg-inherit px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20">2</a>
          <a href="#" className="relative hidden items-center bg-inherit px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 md:inline-flex">3</a>
          <span className="relative inline-flex items-center bg-inherit px-4 py-2 text-sm font-medium text-gray-700">...</span>
          <a href="#" className="relative hidden items-center bg-inherit px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 md:inline-flex">8</a>
          <a href="#" className="relative inline-flex items-center bg-inherit px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20">9</a>
          <a href="#" className="relative inline-flex items-center bg-inherit px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20">10</a>
          <a href="#" className="relative inline-flex items-center rounded-r-md bg-inherit px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20">
            {/* <span className="sr-only">Next</span> */}
            <svg className="h-5 w-5" 
                  x-description="Heroicon name: mini/chevron-right" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor" 
                  aria-hidden="true">
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd"></path>
            </svg>
          </a>
        </nav>
      </div> 
    </div>;

  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className="bg-gray-100 dark:bg-slate-800">
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-none">
          <div className="overflow-hidden bg-white dark:bg-black shadow sm:rounded-lg">
            <table className="table-fixed w-full">
              <thead className="table-header-group bg-slate-200 dark:bg-slate-800">
                <tr className="table-row-group">
                  <th className="table-cell px-6 py-4 ">Top Collections</th>
                </tr>
              </thead>
              <tbody>
                {data.map(idx => render(idx))}
              </tbody>
              <tfoot className="table-footer-group">
                <tr className="table-row bg-white dark:bg-slate-900">
                  <td className="table-cell">{footer}</td>
                </tr>
              </tfoot>
            </table>            
          </div>
        </div>
      </div>
    </div>
  );
}