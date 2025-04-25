import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Military-Grade Encryption',
    Svg: require('@site/static/img/undraw_security.svg').default,
    description: (
      <>
        Protect your sensitive data with AES-256-CBC encryption,
        built on Node.js's native crypto module for maximum security.
      </>
    ),
  },
  {
    title: 'Developer-Friendly',
    Svg: require('@site/static/img/undraw_programming.svg').default,
    description: (
      <>
        Simple CLI and clean programmatic API make it easy to integrate
        secure secrets management into your workflow. Full TypeScript
        support included.
      </>
    ),
  },
  {
    title: 'Format Flexible',
    Svg: require('@site/static/img/undraw_file_sync.svg').default,
    description: (
      <>
        Works seamlessly with YAML and JSON files. Store your configuration
        in the format that works best for your team and project needs.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
