import type { Metadata } from 'next';

import { Avatar } from '@/components/Avatar';
import { Container } from '@/components/Container';
import { PageTitle } from '@/components/PageTitle';
import { Prose } from '@/components/prose';
import { getSiteData } from '@/lib/content/site';

export const metadata: Metadata = { title: 'About' };

const AboutPage = async () => {
  const { social } = await getSiteData();

  return (
    <Container>
      <header className="pt-lg">
        <PageTitle>About</PageTitle>
        <div className="mt-lg">
          <Avatar src="/images/avatar.png" alt="" size={120} />
        </div>
      </header>

      <div className="mt-xl">
        <Prose.P>
          I&apos;m a software engineer with a decade of backend and distributed systems experience.
          I write about the engineering work I find interesting and the mistakes I learn from along
          the way.
        </Prose.P>
        <Prose.P>
          I currently live somewhere on the internet. Before that, I lived somewhere else. The
          constants have been long-form writing, a serious tea habit, and trying to leave the
          codebase better than I found it.
        </Prose.P>

        <Prose.H2>Now</Prose.H2>
        <Prose.P>
          Building the infrastructure team at my current company, writing more, and slowly chipping
          away at a side project that has refused to ship for two years.
        </Prose.P>

        <Prose.H2>Elsewhere</Prose.H2>
        <Prose.P>
          You can find me on{' '}
          <Prose.A href={social.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </Prose.A>
          ,{' '}
          <Prose.A href={social.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </Prose.A>
          , or by <Prose.A href={`mailto:${social.email}`}>email</Prose.A>.
        </Prose.P>
      </div>
    </Container>
  );
};

export default AboutPage;
