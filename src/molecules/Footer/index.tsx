'use client';

import { Info } from 'lucide-react';
import styled from 'styled-components';

const GITHUB_URL = 'https://github.com/RamonGebben/HyvesFoto.nl';

const Wrapper = styled.footer`
  max-width: 48rem;
  margin: 0 auto;
  padding: 0 ${props => props.theme.space.md} ${props => props.theme.space.xxl};
`;

const Disclaimer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${props => props.theme.space.sm};
  padding: ${props => props.theme.space.lg};
  background: ${props => props.theme.color.surface};
  border: 2px solid ${props => props.theme.color.borderStrong};
  border-radius: ${props => props.theme.radius.lg};
  box-shadow: ${props => props.theme.shadow.sm};
`;

const Icon = styled(Info)`
  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;
  color: ${props => props.theme.color.action};
`;

const Text = styled.p`
  font-size: ${props => props.theme.fontSize.md};
  font-weight: ${props => props.theme.fontWeight.medium};
  color: ${props => props.theme.color.text};

  strong {
    font-weight: ${props => props.theme.fontWeight.bold};
  }
`;

const GithubLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.space.sm};
  margin-top: ${props => props.theme.space.lg};
  color: ${props => props.theme.color.textMuted};
  font-size: ${props => props.theme.fontSize.sm};
  text-decoration: none;

  &:hover,
  &:focus-visible {
    color: ${props => props.theme.color.text};
    text-decoration: underline;
  }
`;

const GithubIcon = styled.svg`
  width: 1.125rem;
  height: 1.125rem;
  fill: currentColor;
`;

/**
 * Legally and ethically necessary: this app rides on Hyves' name and visual
 * style but is an unaffiliated fan project, so every page must say so
 * plainly, in Dutch, near the content it describes.
 */
export const Footer = () => (
  <Wrapper>
    <Disclaimer>
      <Icon aria-hidden="true" />
      <Text>
        <strong>
          Let op: HyvesFoto.nl is niet verbonden aan, onderschreven door of
          namens Hyves.
        </strong>{' '}
        Dit is een onafhankelijk open source initiatief om een gat in de
        gebruikerservaring van Hyves op te vullen. Er worden geen foto’s
        opgeslagen, er worden geen accounts aangemaakt en er draait geen
        advertenties op deze site.
      </Text>
    </Disclaimer>
    <GithubLink href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
      <GithubIcon viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.16 1.18a10.9 10.9 0 0 1 5.75 0c2.2-1.49 3.16-1.18 3.16-1.18.62 1.59.23 2.76.11 3.05.74.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14 0 1.54-.01 2.79-.01 3.17 0 .31.21.68.8.56A10.98 10.98 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
      </GithubIcon>
      Bekijk de broncode op GitHub
    </GithubLink>
  </Wrapper>
);
