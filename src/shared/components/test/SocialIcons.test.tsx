import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react';
import { EyeIcon, EyeOffIcon, GitHubIcon, GoogleIcon, LinkedInIcon } from '../SocialIcons';

describe('SocialIcons', () => {
  it('renderiza iconos principales', () => {
    const { container } = render(
      <div>
        <GoogleIcon className="w-5 h-5" />
        <GitHubIcon className="w-5 h-5" />
        <LinkedInIcon className="w-5 h-5" />
        <EyeIcon className="w-5 h-5" />
        <EyeOffIcon className="w-5 h-5" />
      </div>,
    );
    expect(container.querySelectorAll('svg').length).toBe(5);
  });
});
