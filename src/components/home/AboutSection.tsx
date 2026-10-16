import { Download } from 'lucide-react';
import { profile } from '@/data/profile';
import { SafeImage } from '@/components/shared/SafeImage';
import { EducationTimeline } from './EducationTimeline';
export function AboutSection() { return <section className="about-section page-shell section" id="about"><div className="about-copy"><h1 className="display-serif">{profile.about.heading}</h1><h2 className="display-serif">{profile.about.subheading}</h2>{profile.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<a className="primary-button" href={profile.resumeUrl} target="_blank" rel="noopener noreferrer"><Download />Download resume</a></div><div className="about-side"><SafeImage src={profile.about.portrait.src} alt={profile.about.portrait.alt} label="About portrait" className="portrait" /><EducationTimeline /></div></section>; }
