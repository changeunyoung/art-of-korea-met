// Block type system — every editable unit of content is one of these.

export type TextAlign = "left" | "center" | "right";

export interface HeroBlock {
  id: string;
  type: "hero";
  image: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  tagline: string;
  scrollLabel: string;
}

export interface IntroBlock {
  id: string;
  type: "intro";
  label: string;
  leadParagraph: string;
  bodyParagraphs: string[];
}

export interface ResearchQuestionBlock {
  id: string;
  type: "research-question";
  eyebrow: string;
  title: string;
  body: string;
}

export interface MethodCardData {
  index: string;
  title: string;
  description: string;
  href: string;
}

export interface MethodsBlock {
  id: string;
  type: "methods";
  eyebrow: string;
  title: string;
  description: string;
  cards: MethodCardData[];
}

export interface PageHeadingBlock {
  id: string;
  type: "page-heading";
  eyebrow: string;
  title: string;
  description: string;
}

export interface MethodSectionBlock {
  id: string;
  type: "method-section";
  number: string;
  title: string;
  paragraphs: string[];
}

export interface HeadingBlock {
  id: string;
  type: "heading";
  text: string;
  level: "h2" | "h3";
  align: TextAlign;
}

export interface BodyBlock {
  id: string;
  type: "body";
  text: string;
  align: TextAlign;
}

export interface ImageBlock {
  id: string;
  type: "image";
  src: string;
  alt: string;
  caption?: string;
}

export interface ImageGridBlock {
  id: string;
  type: "image-grid";
  images: { src: string; alt: string; caption?: string }[];
}

export interface CardBlock {
  id: string;
  type: "card";
  title: string;
  body: string;
  href?: string;
}

export interface CTABlock {
  id: string;
  type: "cta";
  text: string;
  href: string;
  align: TextAlign;
}

export interface DividerBlock {
  id: string;
  type: "divider";
}

export interface SpacerBlock {
  id: string;
  type: "spacer";
  size: "sm" | "md" | "lg";
}

export type Block =
  | HeroBlock
  | IntroBlock
  | ResearchQuestionBlock
  | MethodsBlock
  | PageHeadingBlock
  | MethodSectionBlock
  | HeadingBlock
  | BodyBlock
  | ImageBlock
  | ImageGridBlock
  | CardBlock
  | CTABlock
  | DividerBlock
  | SpacerBlock;

export type BlockType = Block["type"];

export interface PageContent {
  page: string;
  blocks: Block[];
}
