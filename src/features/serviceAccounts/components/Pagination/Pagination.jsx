import React from 'react';
import styles from './Pagination.module.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className={styles.paginationContainer}>
            <button 
                className={styles.btn}
                onClick={handlePrevious}
                disabled={currentPage === 1}
                title="Предыдущая страница"
            >
                ←
            </button>

            <div className={styles.pageInfo}>
                {currentPage}/{totalPages}
            </div>

            <button 
                className={styles.btn}
                onClick={handleNext}
                disabled={currentPage === totalPages}
                title="Следующая страница"
            >
                →
            </button>
        </div>
    );
};

export default Pagination;

