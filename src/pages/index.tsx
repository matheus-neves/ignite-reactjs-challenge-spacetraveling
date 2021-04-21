import { GetStaticProps } from 'next';

import { FiCalendar, FiUser } from 'react-icons/fi';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home(): JSX.Element {
  return (
    <main className={styles.container}>
      <h1 className={styles.logo}>
        <img src="/images/logo.svg" alt="logo" />
      </h1>
      <ul className={styles.listContainer}>
        <li className={styles.listContent}>
          <a href="#">
            <strong>Como utilizar Hooks</strong>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <div>
              <time>
                <FiCalendar color="#BBBBBB" size="20px" /> 15 Mar 2021
              </time>
              <span>
                <FiUser color="#BBBBBB" size="20px" /> Joseph Oliveira
              </span>
            </div>
          </a>
        </li>
        <li className={styles.listContent}>
          <a href="#">
            <strong>Como utilizar Hooks</strong>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <div>
              <time>
                <FiCalendar color="#BBBBBB" size="20px" /> 15 Mar 2021
              </time>
              <span>
                <FiUser color="#BBBBBB" size="20px" /> Joseph Oliveira
              </span>
            </div>
          </a>
        </li>
      </ul>

      <button type="button" className={styles.btnLoadMore}>
        Carregar mais posts
      </button>
    </main>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
