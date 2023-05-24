
const Cards: React.FC<any> = () => {
    return(
      <div className="flex items-center justify-center">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
          <div className="relative py-6 px-6 rounded-3xl w-64 my-4 shadow-xl  bg-green-100 dark:bg-green-100">
              <div className=" text-white flex items-center absolute rounded-full py-4 px-4 shadow-xl bg-blue-500 left-4 -top-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                  </svg>
              </div>
              <div className="mt-8">
                  <p className="text-xl font-semibold my-2">Sentiment</p>
                  <p className="text-xl font-bold my-2 center">69%</p>
  
                  <div className="border-t-2"></div>
  
                  <div className="flex justify-between">
                      <div className="my-2">
                          <p className="font-semibold text-base mb-2">Chart</p>
  
                      </div>
                      <div className="my-2">
                          <p className="font-semibold text-base mb-2">Progress</p>
                          <div className="text-base text-gray-400 font-semibold">
                              <p>34%</p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
  
          <div className="relative py-6 px-6 rounded-3xl w-64 my-4 shadow-xl  bg-green-100 dark:bg-green-100">
              <div className=" text-white flex items-center absolute rounded-full py-4 px-4 shadow-xl bg-yellow-500 left-4 -top-6">
              <svg 
                xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line>
              </svg>
              </div>
              <div className="mt-8">
                  <p className="text-xl font-semibold my-2">Predicted Price</p>
                  
                  <div className="border-t-2 "></div>
  
                  <div className="flex justify-between">
                      <div className="my-2">
                      </div>
                      <div className="my-2">
                          <p className="font-semibold text-base mb-2">Progress</p>
                          <div className="text-base text-gray-400 font-semibold">
                              <p>76%</p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
  
          <div className="relative py-6 px-6 rounded-3xl w-64 my-4 shadow-xl  bg-green-100 dark:bg-green-100">
              <div className=" text-white flex items-center absolute rounded-full py-4 px-4 shadow-xl bg-pink-500 left-4 -top-6">
              <svg
                xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
              </svg>
              </div>
              <div className="mt-8">
                  <p className="text-xl font-semibold my-2">Percentage Increase</p>
                  
                  <div className="border-t-2 "></div>
  
                  <div className="flex justify-between">
                      <div className="my-2">
                          <p className="font-semibold text-base mb-2">Chart</p>
                      </div>
                      <div className="my-2">
                          <p className="font-semibold text-base mb-2">Progress</p>
                          <div className="text-base text-gray-400 font-semibold">
                              <p>4%</p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
  
          <div className="relative py-6 px-6 rounded-3xl w-64 my-4 shadow-xl  bg-green-100 dark:bg-green-100">
              <div className=" text-white flex items-center absolute rounded-full py-4 px-4 shadow-xl bg-green-500 left-4 -top-6">
              <svg 
                xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
              </svg>
              </div>
              <div className="mt-8">
                  <p className="text-xl font-semibold my-2">Recommendation</p>
                  
                  <div className="border-t-2 "></div>
  
                  <div className="flex justify-between">
                      <div className="my-2">
                          <p className="font-semibold text-base mb-2">Chart</p>
  
                      </div>
                      <div className="my-2">
                          <p className="font-semibold text-base mb-2">Progress</p>
                          <div className="text-base text-gray-400 font-semibold">
                              <p>90%</p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      </div>
    )
  };
  
  export default Cards;