'use client';

import { VscGithub, VscMail } from 'react-icons/vsc';
import Image from 'next/image';
import Link from 'next/link';

import { profile } from '@/data/profile';
import styles from '@/styles/AboutPage.module.css';

const AboutPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            {profile.identity.avatar && (
              <Image
                src={profile.identity.avatar}
                alt={profile.identity.name}
                width={80}
                height={80}
                className={styles.avatar}
                priority
              />
            )}
            <div className={styles.headerText}>
              <h1 className={styles.name}>{profile.identity.name}</h1>
              <p className={styles.role}>{profile.identity.role}</p>
              <div className={styles.location}>
                <span className={styles.dot} />
                {profile.identity.location}
              </div>
            </div>
          </div>
          
          <div className={styles.headerActions}>
            <a 
              href={profile.links.github}
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.iconButton}
            >
              <VscGithub size={20} />
            </a>
            <Link href="/contact" className={styles.iconButton}>
              <VscMail size={20} />
            </Link>
          </div>
        </header>

        <div className={styles.content}>
          {/* Bio Section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>01</span>
              <h2 className={styles.sectionTitle}>{profile.about.sectionTitles.about}</h2>
            </div>
            
            <div className={styles.sectionBody}>
              {profile.about.bio.map((paragraph) => (
                <p className={styles.paragraph} key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>
          </section>

          {/* Experience Section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>02</span>
              <h2 className={styles.sectionTitle}>{profile.about.sectionTitles.experience}</h2>
            </div>
            
            <div className={styles.sectionBody}>
              {profile.about.experience.map((experience) => (
                <div className={styles.experienceCard} key={`${experience.period}-${experience.role}`}>
                  <h3 className={styles.expRole}>{experience.role}</h3>
                  <div className={styles.expMeta}>
                    {experience.company ? (
                      <span className={styles.expCompany}>{experience.company}</span>
                    ) : null}
                    <span className={styles.expPeriod}>{experience.period}</span>
                  </div>
                  <ul className={styles.expList}>
                    {experience.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Skills Section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>03</span>
              <h2 className={styles.sectionTitle}>{profile.about.sectionTitles.skills}</h2>
            </div>
            
            <div className={styles.sectionBody}>
              <div className={styles.skillsGrid}>
                {profile.about.skills.map((category) => (
                  <div className={styles.skillCategory} key={category.title}>
                    <h4 className={styles.skillTitle}>{category.title}</h4>
                    <div className={styles.skillTags}>
                      {category.items.map((skill) => <span className={styles.skillTag} key={skill}>{skill}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Writing Section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>04</span>
              <h2 className={styles.sectionTitle}>{profile.about.sectionTitles.writing}</h2>
            </div>
            
            <div className={styles.sectionBody}>
              <p className={styles.paragraph}>{profile.about.writingIntro}</p>

              <ul className={styles.achievementList}>
                {profile.about.achievements.map((achievement) => (
                  <li className={styles.achievementItem} key={achievement}>
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Beyond Code Section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>05</span>
              <h2 className={styles.sectionTitle}>{profile.about.sectionTitles.beyondCode}</h2>
            </div>
            
            <div className={styles.sectionBody}>
              <p className={styles.paragraph}>{profile.about.beyondCode}</p>
            </div>
          </section>
        </div>

        <footer className={styles.footer}>
          <Link href="/projects" className={styles.footerLink}>
            View my projects →
          </Link>
        </footer>
      </div>
    </div>
  );
};

export default AboutPage;
