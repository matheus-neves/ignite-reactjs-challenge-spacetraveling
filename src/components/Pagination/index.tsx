import Link from 'next/link';
import styles from './pagination.module.scss';

export interface PageProps {
  uid: string;
  title: string;
}

export interface PaginationProps {
  prevPage: PageProps;
  nextPage: PageProps;
}

const Pagination = ({ prevPage, nextPage }: PaginationProps): JSX.Element => {
  return (
    <div className={styles.container}>
      <div>
        {prevPage && (
          <>
            <strong>{prevPage.title}</strong>
            <Link href={prevPage.uid}>
              <a>Post anterior</a>
            </Link>
          </>
        )}
      </div>

      <div>
        {nextPage && (
          <>
            <strong>{nextPage.title}</strong>
            <Link href={nextPage.uid}>
              <a>Próximo post</a>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Pagination;
