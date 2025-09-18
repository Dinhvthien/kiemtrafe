const Pagination = ({ page, setPage, totalPages }) => {
    return (
        <div className="flex justify-center space-x-2">
            <button
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
            >
                Previous
            </button>
            <span className="px-4 py-2">Page {page + 1} of {totalPages}</span>
            <button
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages - 1}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;