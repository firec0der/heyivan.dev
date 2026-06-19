import { notFound } from 'next/navigation';

import { BackLink } from '@/components/BackLink';
import { Container } from '@/components/Container';
import { DetailTitle } from '@/components/DetailTitle';
import { MonoText } from '@/components/MonoText';
import { getArticleBySlug } from '@/lib/content/articles';
import { MdxBody } from '@/lib/content/mdx-body';
import { formatArticleDate } from '@/lib/format';
import { type Locale, localizePath } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';

export const ArticleView = async ({ lang, slug }: { lang: Locale; slug: string }) => {
  const t = getDictionary(lang);
  const article = await getArticleBySlug(slug, lang);
  if (!article) notFound();

  return (
    <Container width="article">
      <BackLink href={localizePath('/writing', lang)}>{t.home.allWriting}</BackLink>

      <header className="pb-xl">
        <DetailTitle>{article.title}</DetailTitle>
        <MonoText className="text-muted mt-xs block">
          <time dateTime={article.date}>{formatArticleDate(article.date)}</time>
          {' · '}
          {article.readingTimeMinutes} {t.content.minRead}
        </MonoText>
      </header>

      {article.fallback && (
        <p className="text-muted border-border mb-lg px-md py-sm rounded-md border text-[14px]">
          {t.content.notTranslated}
        </p>
      )}

      <MdxBody source={article.body} />
    </Container>
  );
};
