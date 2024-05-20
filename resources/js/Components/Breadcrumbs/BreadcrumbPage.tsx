import { HomeIcon } from "@heroicons/react/20/solid";

interface BreadcrumbPageProps {
    firstPage: string;
    secondPage: string;
    threePage: string;
    urlFirstPage:any;
    urlSecondPage:any;
    urlThreePage:any;
  }
  const Breadcrumb = ({ firstPage, secondPage, threePage, urlFirstPage, urlSecondPage, urlThreePage }: BreadcrumbPageProps) => {
    return (
        <nav className="flex border-b border-gray-200 bg-white" aria-label="Breadcrumb">
            <ol role="list" className="mx-auto flex w-full max-w-screen-xl space-x-4 px-4 sm:px-6 lg:px-8">
            <li className="flex">
                <div className="flex items-center">
                <a href={urlFirstPage} className="text-gray-400 hover:text-red-600">
                    <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                    <span className="sr-only">Home</span>
                </a>
                </div>
            </li>
            {/* {pages.map((page) => ( */}
                <li className="flex">
                    <div className="flex items-center">
                        <svg
                        className="h-full w-6 flex-shrink-0 text-gray-200"
                        viewBox="0 0 24 44"
                        preserveAspectRatio="none"
                        fill="currentColor"
                        aria-hidden="true"
                        >
                        <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
                        </svg>
                        <a
                        href={urlSecondPage}
                        className="ml-4 text-sm font-medium text-gray-500 hover:text-red-600"
                        // aria-current={page.current ? 'page' : undefined}
                        >
                        {secondPage}
                        </a>
                    </div>
                    <div className="flex items-center">
                        <svg
                        className="h-full w-6 flex-shrink-0 text-gray-200"
                        viewBox="0 0 24 44"
                        preserveAspectRatio="none"
                        fill="currentColor"
                        aria-hidden="true"
                        >
                        <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
                        </svg>
                        <span
                        className="ml-4 text-sm font-medium text-gray-500 hover:text-red-600"
                        // aria-current={page.current ? 'page' : undefined}
                        >
                        {threePage}
                        </span>
                    </div>
                </li>
            {/* ))} */}
            </ol>
        </nav>
    );
  };
  
  export default Breadcrumb;
  