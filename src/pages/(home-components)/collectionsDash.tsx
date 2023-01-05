import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function CollectionsDash() {

  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  const startIdx = 1;
  const viewLength = data.length;
  const dataSize = data.length * 10;
  //const viewLength = 10
  //const dataSize = data.length;

  function render(index: number): JSX.Element {
    return (<tr key={index} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800"><td>
      <Link href={`/collection/${index}`} className="block hover:bg-gray-200 dark:hover:bg-gray-600">
        <div className="px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="truncate text-sm font-medium text-indigo-600 dark:text-indigo-300">Collection{" "}{index}</div>
            <div className="ml-2 flex flex-shrink-0">
              <span className="inline-flex rounded-full bg-green-100 dark:bg-green-800 px-2 text-xs font-semibold leading-5 text-green-800 dark:text-green-100">
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
                <path fillRule="evenodd" 
                      d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" 
                      clipRule="evenodd"></path>
              </svg>
              For Bid
            </div>
          </div>
        </div>
      </Link>
    </td></tr>);
  }

  function renderPageCt(ct: number): JSX.Element {
    return (
      <span className="font-medium">{`${ct}`}</span>
    );
  }

  const paginationStyles = {
    highlighted: `relative z-10 inline-flex items-center border border-indigo-500 bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-600 focus:z-20`,
    regular:     `relative inline-flex items-center bg-inherit px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20`,
    compact:     `relative hidden items-center bg-inherit px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 md:inline-flex`,
    edge_r:      `relative inline-flex items-center rounded-r-md bg-inherit px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20`,
    edge_l:      `relative inline-flex items-center rounded-l-md bg-inherit px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20`
  }

  const footer: JSX.Element = 
    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between px-5 py-3">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing{" "}{renderPageCt(startIdx)}{" "}to{" "}{renderPageCt(startIdx + viewLength - 1)}{" "}of{" "} 
          {renderPageCt(dataSize)}{" "}results
        </p>
      </div>
      <div>
        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <Link href="#" className={paginationStyles.edge_l}>
            <span className="sr-only">Previous</span>
            <ChevronLeftIcon className="h-4 w-4"/>
          </Link>
          {/* <!-- Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" --> */}
          <Link href="#" aria-current="page" className={paginationStyles.highlighted}>1</Link>
          <Link href="#" className={paginationStyles.regular}>2</Link>
          <Link href="#" className={paginationStyles.compact}>3</Link>
          <span className="relative inline-flex items-center bg-inherit px-4 py-2 text-sm font-medium text-gray-700">...</span>
          <Link href="#" className={paginationStyles.compact}>8</Link>
          <Link href="#" className={paginationStyles.regular}>9</Link>
          <Link href="#" className={paginationStyles.regular}>10</Link>
          <Link href="#" className={paginationStyles.edge_r}>
            <span className="sr-only">Next</span>
            <ChevronRightIcon className="h-4 w-4"/>
          </Link>
        </nav>
      </div> 
    </div>;

  return (
    <div className="bg-gray-100 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mx-auto max-w-none">
          <div className="overflow-hidden bg-white dark:bg-black shadow sm:rounded-lg">
            <table className="table-fixed w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="table-header-group text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr className="table-row-group">
                  <th className="table-cell px-6 py-4 ">Top Collections</th>
                </tr>
              </thead>
              <tbody>
                {data.map(idx => render(idx))}
              </tbody>
              <tfoot className="table-footer-group">
                <tr className={data.length % 2 === 0 
                               ? `table-row bg-white dark:bg-gray-900`
                               : `table-row bg-gray-50 dark:bg-gray-800`}>
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