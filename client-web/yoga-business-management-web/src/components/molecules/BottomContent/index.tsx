import React from "react";
import { Pagination } from "@nextui-org/pagination";

interface BottomContentProps {
    totalItems: number;
    currentPage: number;
    pages: number;
    onRowsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onPreviousPage: () => void;
    onNextPage: () => void;
    setCurrentPage: (page: number) => void;
}

const BottomContent: React.FC<BottomContentProps> = ({
                                                         totalItems,
                                                         currentPage,
                                                         pages,
                                                         onRowsPerPageChange,
                                                         onPreviousPage,
                                                         onNextPage,
                                                         setCurrentPage,
                                                     }) => {
    return (
        <div className="pr-2 pl-4 px-2 flex justify-between items-center my-20">
            <span className="w-[30%] text-small text-default-400">
                {"Total : " + totalItems}
            </span>
            <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={currentPage}
                total={pages}
                onChange={setCurrentPage}
            />
            <div className="hidden sm:flex w-[30%] justify-end gap-2">
                <div className="flex justify-between items-center">
                    <label className="flex items-center text-default-400 text-small">
                        Rows per page:
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onRowsPerPageChange}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default BottomContent;
