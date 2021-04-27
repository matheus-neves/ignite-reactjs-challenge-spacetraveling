import { GetStaticPaths, GetStaticProps } from 'next';
import { useMemo } from 'react';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { RichText } from 'prismic-dom';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import Prismic from '@prismicio/client';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../../components/Header';
import { getPrismicClient } from '../../services/prismic';

import styles from './post.module.scss';

interface Post {
  uid: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      };
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

  const readingTime = useMemo(() => {
    const numberOfWords = post.data.content.reduce((acc, content) => {
      const counterHeading = content.heading.split(/\s+/).length;
      const counterBody = RichText.asText(content.body).split(/\s+/).length;
      return acc + counterHeading + counterBody;
    }, 0);

    return Math.ceil(numberOfWords / 200);
  }, []);

  return (
    <>
      <Head>
        <title>{post.data.title} | spacetraveling</title>
      </Head>
      <Header />
      <img
        className={styles.banner}
        src={post.data.banner.url}
        alt="banner do post"
      />
      <article className={styles.container}>
        <header>
          <h1 className={styles.title}>{post.data.title}</h1>
          <div className={styles.boxInfo}>
            <time>
              <FiCalendar color="#BBBBBB" size="20px" />
              {format(new Date(post.first_publication_date), 'dd MMM yyyy', {
                locale: ptBR,
              })}
            </time>
            <span>
              <FiUser color="#BBBBBB" size="20px" /> {post.data.author}
            </span>
            <span>
              <FiClock color="#BBBBBB" size="20px" /> {`${readingTime} min`}
            </span>
          </div>
        </header>

        <div className={styles.content}>
          {post.data.content.map(content => (
            <section key={content.heading}>
              <h2>{content.heading}</h2>
              <div
                className="content"
                dangerouslySetInnerHTML={{
                  __html: RichText.asHtml(content.body),
                }}
              />
            </section>
          ))}
        </div>
      </article>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();

  const posts = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    { pageSize: 3 }
  );

  const paths = posts.results.map(result => {
    return {
      params: {
        slug: result.uid,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', params.slug as string, {});

  const post: Post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: response.data.banner,
      author: response.data.author,
      content: response.data.content,
    },
  };

  return {
    props: {
      post,
    },
    revalidate: 60 * 60 * 12, // 12 hours
  };
};
