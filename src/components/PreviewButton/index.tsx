import Link from 'next/link';
import commonStyles from './preview-button.module.scss';

const PreviewButton = (): JSX.Element => {
  return (
    <Link href="/api/exit-preview">
      <a className={commonStyles.previewButton}>Sair do modo Preview</a>
    </Link>
  );
};

export default PreviewButton;
