import type { Config } from "@measured/puck";
import {
  HeroPublisher, type HeroPublisherProps,
  HeroPublisherTwo, type HeroPublisherTwoProps,
  HeroFitness, type HeroFitnessProps,
  HeroDental, type HeroDentalProps,
  HeroWedding, type HeroWeddingProps,
  HeroAgency, type HeroAgencyProps,
  HeroYoga, type HeroYogaProps,
  HeroAutoService, type HeroAutoServiceProps,
  HeroSecurity, type HeroSecurityProps,
  HeroMedical, type HeroMedicalProps,
  HeroRealEstate, type HeroRealEstateProps,
  Stats, type StatsProps,
  IconGrid, type IconGridProps,
  Gallery, type GalleryProps,
  Accordion, type AccordionProps,
  Testimonials, type TestimonialsProps,
  CTA, type CTAProps,
  FlexBlock, type FlexBlockProps,
  Container, type ContainerProps,
  PricingSimple as Pricing, type PricingSimpleProps as PricingProps,
  PricingModern, type PricingModernProps,
  PricingBox, type PricingBoxProps,
  PricingGradient, type PricingGradientProps,
  PricingImage, type PricingImageProps,

  BlogList, type BlogListProps,
  AboutCompany, type AboutCompanyProps,
  ProductList, type ProductListProps,
  LogoMarquee, type LogoMarqueeProps,
  ContactForm, type ContactFormProps,
  Portfolio, type PortfolioProps
} from "./components/puck";

type Props = {
  HeadingBlock: { title: string; font?: string; paddingTop?: number; paddingBottom?: number };
  HeroPublisher: HeroPublisherProps;
  HeroPublisherTwo: HeroPublisherTwoProps;
  HeroFitness: HeroFitnessProps;
  HeroDental: HeroDentalProps;
  HeroWedding: HeroWeddingProps;
  HeroAgency: HeroAgencyProps;
  HeroYoga: HeroYogaProps;
  HeroAutoService: HeroAutoServiceProps;
  HeroSecurity: HeroSecurityProps;
  HeroMedical: HeroMedicalProps;
  HeroRealEstate: HeroRealEstateProps;
  Stats: StatsProps;
  IconGrid: IconGridProps;
  Pricing: PricingProps;
  PricingModern: PricingModernProps;
  PricingBox: PricingBoxProps;
  PricingGradient: PricingGradientProps;
  PricingImage: PricingImageProps;
  BlogList: BlogListProps;
  Gallery: GalleryProps;
  Accordion: AccordionProps;
  Testimonials: TestimonialsProps;
  LogoMarquee: LogoMarqueeProps;
  CTA: CTAProps;
  FlexBlock: FlexBlockProps;
  Container: ContainerProps;
  AboutCompany: AboutCompanyProps;
  ProductList: ProductListProps;
  ContactForm: ContactFormProps;
  Portfolio: PortfolioProps;
};

export const config: Config<Props> = {
  root: {
    render: ({ children }) => (
      <div>
        {children}
      </div>
    )
  },
  categories: {
    "🎬 Hero Sections": {
      components: [
        "HeroPublisher",
        "HeroPublisherTwo",
        "HeroFitness",
        "HeroDental",
        "HeroWedding",
        "HeroAgency",
        "HeroYoga",
        "HeroAutoService",
        "HeroSecurity",
        "HeroMedical",
        "HeroRealEstate",
      ],
    },
    "📝 Content": {
      components: ["Stats", "Testimonials", "LogoMarquee", "Accordion", "IconGrid", "BlogList", "AboutCompany", "Portfolio", "ContactForm"],
    },
    "🎯 Marketing": {
      components: ["CTA", "Pricing", "PricingModern", "PricingBox", "PricingGradient", "PricingImage", "Gallery", "ProductList"],
    },
    "📐 Layout": {
      components: ["Container"],
    },
    "⚙️ Basic": {
      components: ["FlexBlock", "HeadingBlock"],
    },
  },
  components: {
    // ... Existing HeadingBlock ...
    HeadingBlock: {
      fields: {
        title: { type: "text" },
        font: {
          type: "select",
          label: "Font",
          options: [
            { label: "Inherit", value: "inherit" },
            { label: "Inter", value: "Inter" },
            { label: "Lato", value: "Lato" },
            { label: "Montserrat", value: "Montserrat" },
            { label: "Playfair Display", value: "Playfair Display" },
            { label: "Roboto", value: "Roboto" },
          ]
        },
        paddingTop: { type: "number", label: "Padding Top" },
        paddingBottom: { type: "number", label: "Padding Bottom" },
      },
      defaultProps: {
        title: "Heading",
        font: "inherit",
        paddingTop: 64,
        paddingBottom: 64,
      },
      render: ({ title, font, paddingTop, paddingBottom }) => (
        <div style={{ padding: 64, paddingTop, paddingBottom }}>
          <h1 style={{ fontFamily: font !== 'inherit' ? `"${font}", sans-serif` : 'inherit' }}>{title}</h1>
        </div>
      ),
    },
    HeroPublisher,
    HeroPublisherTwo,
    HeroFitness,
    HeroDental,
    HeroWedding,
    HeroAgency,
    HeroYoga,
    HeroAutoService,
    HeroSecurity,
    HeroMedical,
    HeroRealEstate,
    Stats,
    IconGrid,
    Pricing,
    PricingModern,
    PricingBox,
    PricingGradient,
    PricingImage,
    BlogList,
    Gallery,
    Accordion,
    Testimonials,
    LogoMarquee,
    CTA,
    FlexBlock,
    Container,
    AboutCompany,
    ProductList,
    ContactForm,
    Portfolio,
  },
};

export default config;
