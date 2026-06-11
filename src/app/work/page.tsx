import type { Metadata } from 'next';

import { Container } from '@/components/Container';
import { EducationRow } from '@/components/EducationRow';
import { LinkArrow } from '@/components/LinkArrow';
import { PageTitle } from '@/components/PageTitle';
import { RoleCard } from '@/components/RoleCard';
import { SectionLabel } from '@/components/SectionLabel';
import { Subtitle } from '@/components/Subtitle';
import { getWorkData } from '@/lib/content/work';

export const metadata: Metadata = { title: 'Work' };

const WorkPage = async () => {
  const work = await getWorkData();

  return (
    <Container>
      <header className="pt-lg pb-xl">
        <PageTitle>Work</PageTitle>
        <Subtitle className="mt-3xs">A decade of engineering work, most recent first.</Subtitle>
        <div className="mt-lg">
          <LinkArrow href={work.cv_pdf} external>
            Download CV (PDF)
          </LinkArrow>
        </div>
      </header>

      <section>
        {work.roles.map((role, index) => (
          <RoleCard key={`${role.company}-${index}`} role={role} defaultOpen={index === 0} />
        ))}
      </section>

      <section className="mt-3xl">
        <SectionLabel>Education</SectionLabel>
        <ul className="mt-sm list-none p-0">
          {work.education.map((edu, index) => (
            <EducationRow key={`${edu.institution}-${index}`} {...edu} />
          ))}
        </ul>
      </section>
    </Container>
  );
};

export default WorkPage;
