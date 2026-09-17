'use client';

import Link from 'next/link';
import { VscArrowRight, VscGithub, VscMail, VscCode } from 'react-icons/vsc';

import { profile } from '@/data/profile';
import styles from '@/styles/HomePage.module.css';

export default function HomePage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.icon}>
              <VscCode size={32} />
            </div>
          </div>

          <div className={styles.intro}>
            <p className={styles.greeting}>{profile.identity.greeting}</p>
            
            <h1 className={styles.name}>{profile.identity.name}</h1>
            
            <p className={styles.role}>{profile.identity.role}</p>
            
            <div className={styles.divider} />
            
            <p className={styles.description}>
              {profile.home.description.map((line) => (
                <span key={line.text} className={styles[line.style]}>
                  {line.text}
                  {line.breakAfter && <br />}
                </span>
              ))}
            </p>
          </div>

          <div className={styles.actions}>
            <Link href="/projects" className={styles.primaryAction}>
              <span>{profile.home.actions.projects}</span>
              <VscArrowRight size={18} />
            </Link>
            
            <Link href="/about" className={styles.secondaryAction}>
              <span>{profile.home.actions.about}</span>
            </Link>
          </div>

          <div className={styles.links}>
            <a 
              href={profile.links.github}
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.link}
            >
              <VscGithub size={16} />
              <span>{profile.home.actions.github}</span>
            </a>
            
            <span className={styles.linkSeparator}>/</span>
            
            <Link href="/contact" className={styles.link}>
              <VscMail size={16} />
              <span>{profile.home.actions.contact}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
