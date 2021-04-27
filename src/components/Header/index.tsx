import Link from 'next/link';
import commonStyles from '../../styles/common.module.scss';
import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <header className={commonStyles.container}>
      <Link href="/">
        <a>
          <img className={styles.logo} src="/images/logo.svg" alt="logo" />{' '}
        </a>
      </Link>
    </header>
  );
}
