import { Blockquote } from './Blockquote';
import { FootnoteRef, FootnoteSection } from './Footnote';
import { H2 } from './H2';
import { H3 } from './H3';
import { H4 } from './H4';
import { Hr } from './Hr';
import { A, Code, Del, Em, Kbd, Strong } from './Inline';
import { Li, Ol, Ul } from './Lists';
import { Figcaption, Figure, Img } from './Media';
import { P } from './P';
import { Pre } from './Pre';
import { Table, Td, Th, Thead, Tr } from './Table';

export {
  A,
  Blockquote,
  Code,
  Del,
  Em,
  Figcaption,
  Figure,
  FootnoteRef,
  FootnoteSection,
  H2,
  H3,
  H4,
  Hr,
  Img,
  Kbd,
  Li,
  Ol,
  P,
  Pre,
  Strong,
  Table,
  Td,
  Th,
  Thead,
  Tr,
  Ul
};

export const Prose = {
  P,
  H2,
  H3,
  H4,
  A,
  Strong,
  Em,
  Del,
  Kbd,
  Code,
  Ul,
  Ol,
  Li,
  Blockquote,
  Hr,
  Img,
  Figure,
  Figcaption,
  Pre,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  FootnoteRef,
  FootnoteSection
} as const;
