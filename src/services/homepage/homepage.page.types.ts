export interface HomepageDocument {
    page: Page;
}

export interface Page {
    id:       string;
    slug:     string;
    type:     string;
    status:   string;
    locale:   string;
    seo:      Seo;
    theme:    Theme;
    branding: Branding;
    header:   Header;
    footer:   Footer;
    sections: Sections;
}

export interface Branding {
    name:    string;
    tagline: string;
    logo:    BrandingLogo;
}

export interface BrandingLogo {
    default: DefaultClass;
    onDark:  DefaultClass;
}

export interface DefaultClass {
    src:    string;
    alt:    string;
    width?: number;
    height?: number;
}

export interface Footer {
    backgroundColor: string;
    logo:            DefaultClass;
    columns:         Column[];
}

export interface Column {
    title:  string;
    links?: Login[];
    items?: Login[];
}

export interface Login {
    label: string;
    href:  null | string;
}

export interface Header {
    navigation: Login[];
    auth:       Auth;
    mobileMenu: MobileMenu;
}

export interface Auth {
    login:  Login;
    signUp: Login;
    logout: Logout;
}

export interface Logout {
    label: string;
}

export interface MobileMenu {
    openLabel:         string;
    closeLabel:        string;
    overlayCloseLabel: string;
}

export interface Sections {
    hero:               Hero;
    planPerfectTrip:    PlanPerfectTrip;
    ourServices:        OurServices;
    popularDestination: PopularDestination;
    exploreTheWorld:    ExploreTheWorld;
    tourismGallery:     TourismGallery;
    bookATour:          BookATour;
    meetOurTeam:        MeetOurTeam;
    popularTravelBlogs: PopularTravelBlogs;
    testimonials:       MeetOurTeam;
}

export interface BookATour {
    id:              string;
    backgroundImage: string;
    eyebrow:         string;
    title:           string;
    paragraphs:      string[];
    promoHighlight:  string;
    cta:             Login;
    form:            Form;
}

export interface Form {
    title:           string;
    subtitle:        string;
    submitLabel:     string;
    submittingLabel: string;
    successToast:    string;
    errorToast:      string;
    validationToast: string;
    placeholders:    Placeholders;
}

export interface Placeholders {
    fullName:           string;
    email:              string;
    phone:              string;
    destination:        string;
    destinationLoading: string;
    category:           string;
    message:            string;
}

export interface ExploreTheWorld {
    id:           string;
    eyebrow:      string;
    title:        string;
    paragraph:    string;
    emptyMessage: string;
}

export interface Hero {
    id:              string;
    backgroundImage: string;
    title:           string;
    paragraph:       string;
    searchFilters:   SearchFilters;
}

export interface SearchFilters {
    fromPlaceholder:    string;
    toPlaceholder:      string;
    datePlaceholder:    string;
    startDateLabel?:    string;
    endDateLabel?:      string;
    searchButtonLabel:  string;
    searchingButtonLabel?: string;
    loadingCities:           string;
    searchCitiesPlaceholder: string;
    noMatchingCities:        string;
    noCities:                string;
    pickDepartureFirst: string;
    clearDate:          string;
    doneDate:           string;
}

export interface MeetOurTeam {
    id:       string;
    eyebrow:  string;
    title:    string;
    members?: Member[];
    items?:   MeetOurTeamItem[];
}

export interface MeetOurTeamItem {
    name:     string;
    location: string;
    quote:    string;
    avatar:   string;
}

export interface Member {
    name:  string;
    role:  string;
    image: string;
}

export interface OurServices {
    id:              string;
    eyebrow:         string;
    title:           string;
    backgroundColor: string;
    cta:             Login;
    items:           OurServicesItem[];
}

export interface OurServicesItem {
    title:        string;
    description:  string;
    iconSrc:      string;
    iconAlt:      string;
    iconPosition: IconPosition;
}

export enum IconPosition {
    End = "end",
    Start = "start",
}

export interface PlanPerfectTrip {
    id:        string;
    eyebrow:   string;
    title:     string;
    paragraph: string;
    image:     PlanPerfectTripImage;
    stats:     Stat[];
}

export interface PlanPerfectTripImage {
    src: string;
    alt: string;
}

export interface Stat {
    value: string;
    label: string;
}

export interface PopularDestination {
    id:              string;
    eyebrow:         string;
    title:           string;
    filters:         string[];
    topDestinations: TopDestinations;
    cards:           Card[];
}

export interface Card {
    id:     string;
    name:   string;
    region: string;
    image:  string;
}

export interface TopDestinations {
    subtitle:           string;
    title:              string;
    seeAllLabel:        string;
    seeAllHref:         string;
    avatars:            string[];
    moreTravelersLabel: string;
    emptyMessage:       string;
}

export interface PopularTravelBlogs {
    id:             string;
    eyebrow:        string;
    title:          string;
    paragraph:      string;
    postedByPrefix: string;
    readMoreLabel:  string;
    posts:          Post[];
}

export interface Post {
    title:    string;
    author:   string;
    date:     string;
    likes:    number;
    comments: number;
    excerpt:  string;
    image:    string;
    href:     string;
}

export interface TourismGallery {
    id:        string;
    eyebrow:   string;
    title:     string;
    paragraph: string;
    filters:   string[];
    images:    ImageElement[];
}

export interface ImageElement {
    src:      string;
    alt:      string;
    category: string;
}

export interface Seo {
    siteName:      string;
    title:         string;
    titleTemplate: string;
    description:   string;
    keywords:      string[];
    canonicalUrl:  string;
    ogImage:       string;
    ogImageAlt:    string;
    locale:        string;
    robots:        Robots;
    themeColor:    string;
    twitterCard:   string;
}

export interface Robots {
    index:  boolean;
    follow: boolean;
}

export interface Theme {
    buttons: ThemeButtons;
}

export interface ThemeButtons {
    primary: HeroSearch;
}

export interface HeroSearch {
    background:      string;
    backgroundHover: string;
    text:            string;
    border?:         string;
}
