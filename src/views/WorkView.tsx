import { Container } from '@/components/Container';
import { EducationRow } from '@/components/EducationRow';
import { LinkArrow } from '@/components/LinkArrow';
import { PageTitle } from '@/components/PageTitle';
import { RoleCard } from '@/components/RoleCard';
import { SectionLabel } from '@/components/SectionLabel';
import { Subtitle } from '@/components/Subtitle';
import { getWorkData } from '@/lib/content/work';
import type { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';

export const WorkView = async ({ lang }: { lang: Locale }) => {
  const t = getDictionary(lang);
  const work = await getWorkData(lang);

  return (
    <Container>
      <header className="pt-lg pb-xl">
        <PageTitle>{t.work.title}</PageTitle>
        <Subtitle className="mt-3xs">{t.work.subtitle}</Subtitle>
        <div className="mt-lg">
          <LinkArrow href={work.cv_pdf} external>
            {t.work.downloadCv}
          </LinkArrow>
        </div>
      </header>

      <section>
        {work.roles.map((role, index) => (
          <RoleCard key={`${role.company}-${index}`} role={role} defaultOpen={index === 0} />
        ))}
      </section>

      <section className="mt-3xl">
        <SectionLabel>{t.work.education}</SectionLabel>
        <ul className="mt-sm list-none p-0">
          {work.education.map((edu, index) => (
            <EducationRow key={`${edu.institution}-${index}`} {...edu} />
          ))}
        </ul>
      </section>
    </Container>
  );
};
