import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/getting-started">
            Get Started in 5 Minutes 🚀
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} - ${siteConfig.tagline}`}
      description="Node SOPS is a robust, easy-to-use secrets management solution for Node.js projects, inspired by Mozilla SOPS.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        
        <div className="container margin-top--xl margin-bottom--xl">
          <div className="row">
            <div className="col col--8 col--offset-2">
              <div className="text--center margin-bottom--lg">
                <Heading as="h2">Why Node SOPS?</Heading>
                <p>
                  Managing sensitive data securely is crucial for every project. Node SOPS brings the power 
                  and simplicity of Mozilla SOPS to the Node.js ecosystem, with a clean API and modern tooling 
                  designed specifically for JavaScript and TypeScript developers.
                </p>
              </div>
              
              <div className="card margin-bottom--lg" style={{padding: '2rem'}}>
                <div className="card__header">
                  <Heading as="h3">Quick Install</Heading>
                </div>
                <div className="card__body">
                  <pre><code className="language-bash">npm install node-sops</code></pre>
                  <p className="margin-top--md">Or with Yarn:</p>
                  <pre><code className="language-bash">yarn add node-sops</code></pre>
                </div>
                <div className="card__footer">
                  <Link
                    className="button button--primary button--block"
                    to="/getting-started">
                    See the full installation guide
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
