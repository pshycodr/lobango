import { useEffect, useState } from "react";

export function useScrollSpy(
  sections: string[],
  offset: number = 100
): string | null {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      let currentSection = "";
      const scrollPosition = window.scrollY + offset;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            currentSection = section;
            break;
          }
        }
      }

      if (currentSection && currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    const timer = setTimeout(() => {
      window.addEventListener("scroll", handleScroll);
      handleScroll();
    }, 100);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sections, activeSection, offset]);

  return activeSection;
}
