export interface ServiceItem {
  id: string;
  title: string;
  image: string;
  link: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  description?: string;
  icon: string;
}

export interface HeroSlide {
  id: string;
  image: string;
  subtitle: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  hours: string;
}

export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface ReservationFormData {
  name: string;
  phone: string;
  persons: string;
  date: string;
  time: string;
  message: string;
}
