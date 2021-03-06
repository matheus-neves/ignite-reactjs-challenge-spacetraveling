import { GetStaticProps } from 'next';
import Link from 'next/link';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { FiCalendar, FiUser } from 'react-icons/fi';
import Prismic from '@prismicio/client';
import { useState } from 'react';
import Head from 'next/head';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import PreviewButton from '../components/PreviewButton';

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
  preview: boolean;
}

export default function Home({
  postsPagination,
  preview,
}: HomeProps): JSX.Element {
  const { next_page, results } = postsPagination;

  const [nextPage, setNextPage] = useState(next_page);
  const [posts, setPosts] = useState(results);

  const handlePagination = async (): Promise<void> => {
    const tempPosts = [...posts];

    const response = await fetch(next_page);
    const data = await response.json();
    const formattedResults = data.results.map((result: Post) => ({
      ...result,
      first_publication_date: format(
        new Date(result.first_publication_date),
        'dd MMM yyyy',
        {
          locale: ptBR,
        }
      ),
    }));

    const newPosts = [...tempPosts, ...formattedResults];
    setNextPage(data.next_page);
    setPosts(newPosts);
  };

  return (
    <>
      <Head>
        <title>Home | spacetraveling</title>
      </Head>
      <main className={commonStyles.container}>
        <h1 className={styles.logo}>
          <img src="/images/logo.svg" alt="logo" />
        </h1>
        <ul className={styles.listContainer}>
          {posts?.map(post => (
            <li key={post.uid} className={styles.listContent}>
              <Link href={`post/${post.uid}`}>
                <a>
                  <strong>{post.data.title}</strong>
                  <p>{post.data.subtitle}</p>
                  <div>
                    <time>
                      <FiCalendar color="#BBBBBB" size="20px" />{' '}
                      {post.first_publication_date}
                    </time>
                    <span>
                      <FiUser color="#BBBBBB" size="20px" /> {post.data.author}
                    </span>
                  </div>
                </a>
              </Link>
            </li>
          ))}
        </ul>
        {nextPage && (
          <button
            type="button"
            className={styles.btnLoadMore}
            onClick={handlePagination}
          >
            Carregar mais posts
          </button>
        )}
        <aside className={styles.container}>
          {preview && <PreviewButton />}
        </aside>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({
  preview = false,
  previewData,
}) => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    Prismic.Predicates.at('document.type', 'posts'),
    {
      pageSize: 2,
      ref: previewData?.ref ?? null,
    }
  );

  const formattedResults = postsResponse.results.map(result => ({
    ...result,
    first_publication_date: format(
      new Date(result.first_publication_date),
      'dd MMM yyyy',
      {
        locale: ptBR,
      }
    ),
  }));

  postsResponse.results = formattedResults;

  return {
    props: {
      postsPagination: postsResponse,
      preview,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  };
};
