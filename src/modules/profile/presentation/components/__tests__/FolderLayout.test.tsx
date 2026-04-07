import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import FolderLayout from '../FolderLayout';

describe('FolderLayout', () => {
  it('renderiza su contenido hijo', () => {
    render(
      <FolderLayout>
        <p>contenido</p>
      </FolderLayout>,
    );
    expect(screen.getByText('contenido')).toBeInTheDocument();
  });
});
