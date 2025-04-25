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
    Svg: require('@site/static/img/feature-encryption.svg').default,
    description: (
      <>
        Protect your sensitive data with AES-256-CBC encryption,
        built on Node.js's native crypto module for maximum security.
      </>
    ),
  },
  {
    title: 'Command-Line Interface',
    Svg: require('@site/static/img/feature-cli.svg').default,
    description: (
      <>
        Simple CLI interface makes it easy to encrypt and decrypt 
        configuration files directly from your terminal.
      </>
    ),
  },
  {
    title: 'Programmatic API',
    Svg: require('@site/static/img/feature-api.svg').default,
    description: (
      <>
        Clean JavaScript/TypeScript API for seamless integration with 
        your applications. Full TypeScript definitions included.
      </>
    ),
  },
  {
    title: 'File Format Flexibility',
    Svg: require('@site/static/img/feature-format.svg').default,
    description: (
      <>
        Works seamlessly with YAML and JSON files. Store your configuration
        in the format that works best for your team and project.
      </>
    ),
  },
  {
    title: 'Key Management',
    Svg: require('@site/static/img/feature-keys.svg').default,
    description: (
      <>
        Flexible key management options support your specific security 
        requirements with secure key rotation capabilities.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4 margin-bottom--lg')}>
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
